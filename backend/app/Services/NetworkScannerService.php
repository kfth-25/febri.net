<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NetworkScannerService
{
    public function runArpScan(): array
    {
        $os = PHP_OS_FAMILY;
        $devices = [];

        try {
            if ($os === 'Windows') {
                $output = shell_exec('cmd /c arp -a');

                if (empty($output)) {
                    exec('arp -a', $lines);
                    $output = implode("\n", $lines);
                }

                $devices = $this->parseArpWindows($output ?? '');
            } else {
                $output = shell_exec('arp -a 2>/dev/null');
                $devices = $this->parseArpLinux($output ?? '');
            }
        } catch (\Exception $e) {
            Log::error('ARP scan failed: ' . $e->getMessage());
        }

        return $devices;
    }

    private function parseArpLinux(string $output): array
    {
        $devices = [];
        $lines = explode("\n", trim($output));

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            $ipMatch = [];
            $macMatch = [];
            $hostMatch = [];

            preg_match('/\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)/', $line, $ipMatch);
            preg_match('/at\s+([0-9a-fA-F]{1,2}(?::[0-9a-fA-F]{1,2}){5})/', $line, $macMatch);
            preg_match('/^([^\s(]+)\s+\(/', $line, $hostMatch);

            if (empty($ipMatch[1])) {
                continue;
            }
            if (!empty($macMatch[1]) && $macMatch[1] === '<incomplete>') {
                continue;
            }

            $ip = $ipMatch[1];
            $mac = $macMatch[1] ?? null;
            $hostname = ($hostMatch[1] !== '?') ? $hostMatch[1] : null;

            if (!$hostname && $ip) {
                $hostname = $this->resolveHostname($ip);
            }

            $devices[] = [
                'ip_address' => $ip,
                'mac_address' => $mac ? strtoupper($mac) : null,
                'hostname' => $hostname,
            ];
        }

        return $devices;
    }

    private function parseArpWindows(string $output): array
    {
        $devices = [];
        $lines = explode("\n", $output);

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            if (!preg_match(
                '/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+([\da-fA-F]{2}(?:-[\da-fA-F]{2}){5})\s+(\w+)/i',
                $line,
                $matches
            )) {
                continue;
            }

            $ip = $matches[1];
            $mac = strtoupper(str_replace('-', ':', $matches[2]));

            if (str_ends_with($ip, '.255')) {
                continue;
            }
            if ($mac === 'FF:FF:FF:FF:FF:FF') {
                continue;
            }
            if ((int) explode('.', $ip)[0] >= 224) {
                continue;
            }

            $devices[] = [
                'ip_address' => $ip,
                'mac_address' => $mac,
                'hostname' => $this->resolveHostname($ip),
            ];
        }

        return $devices;
    }

    public function resolveHostname(string $ip): ?string
    {
        try {
            $hostname = gethostbyaddr($ip);
            return $hostname !== $ip ? $hostname : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function lookupVendor(string $mac): ?string
    {
        try {
            $oui = substr(str_replace(':', '', $mac), 0, 6);

            /** @var Response $response */
            $response = Http::timeout(3)
                ->get("https://api.maclookup.app/v2/macs/{$oui}/company/name");

            if ($response->successful()) {
                $vendor = trim($response->body());
                return !empty($vendor) && $vendor !== 'NA' ? $vendor : null;
            }
        } catch (\Exception $e) {
            Log::warning("Vendor lookup gagal untuk MAC {$mac}: " . $e->getMessage());
        }

        return null;
    }

    public function getServerIp(): string
    {
        return gethostbyname(gethostname()) ?: '0.0.0.0';
    }

    public function isGateway(string $ip): bool
    {
        return str_ends_with($ip, '.1');
    }
}
