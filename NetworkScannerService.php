<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class NetworkScannerService
{
    /**
     * Jalankan arp -a dan parse hasilnya
     * Contoh output Linux: ? (192.168.1.1) at aa:bb:cc:dd:ee:ff [ether] on eth0
     * Contoh output Windows: 192.168.1.1   aa-bb-cc-dd-ee-ff   dynamic
     */
    public function runArpScan(): array
    {
        $os = PHP_OS_FAMILY; // 'Linux', 'Windows', 'Darwin'
        $devices = [];

        try {
            if ($os === 'Windows') {
                // Windows Server: pakai cmd /c untuk pastikan bisa dieksekusi
                // arp -a output Windows: IP, MAC, Type (dynamic/static)
                $output = shell_exec('cmd /c arp -a');

                // Fallback: coba exec() kalau shell_exec diblokir
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

    /**
     * Parse output arp -a di Linux/Mac
     * Format: hostname (IP) at MAC [ether] on interface
     */
    private function parseArpLinux(string $output): array
    {
        $devices = [];
        $lines = explode("\n", trim($output));

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Regex untuk ambil IP dan MAC
            $ipMatch   = [];
            $macMatch  = [];
            $hostMatch = [];

            preg_match('/\((\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\)/', $line, $ipMatch);
            preg_match('/at\s+([0-9a-fA-F]{1,2}(?::[0-9a-fA-F]{1,2}){5})/', $line, $macMatch);
            preg_match('/^([^\s(]+)\s+\(/', $line, $hostMatch);

            if (empty($ipMatch[1])) continue;
            if (!empty($macMatch[1]) && $macMatch[1] === '<incomplete>') continue;

            $ip       = $ipMatch[1];
            $mac      = $macMatch[1] ?? null;
            $hostname = ($hostMatch[1] !== '?') ? $hostMatch[1] : null;

            // Coba resolve hostname kalau belum ada
            if (!$hostname && $ip) {
                $hostname = $this->resolveHostname($ip);
            }

            $devices[] = [
                'ip_address' => $ip,
                'mac_address' => $mac ? strtoupper($mac) : null,
                'hostname'    => $hostname,
            ];
        }

        return $devices;
    }

    /**
     * Parse output arp -a di Windows Server
     *
     * Format umum Windows:
     *   Interface: 192.168.1.100 --- 0x5
     *     Internet Address      Physical Address      Type
     *     192.168.1.1           aa-bb-cc-dd-ee-ff     dynamic
     *     192.168.1.255         ff-ff-ff-ff-ff-ff     static
     */
    private function parseArpWindows(string $output): array
    {
        $devices = [];
        $lines = explode("\n", $output);

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;

            // Match: IP  MAC  Type
            if (!preg_match(
                '/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s+([\da-fA-F]{2}(?:-[\da-fA-F]{2}){5})\s+(\w+)/i',
                $line,
                $matches
            )) continue;

            $ip   = $matches[1];
            $mac  = strtoupper(str_replace('-', ':', $matches[2]));
            $type = strtolower($matches[3]);

            // Skip: broadcast (.255), multicast (224.x.x.x+), ff:ff:ff:ff:ff:ff
            if (str_ends_with($ip, '.255')) continue;
            if ($mac === 'FF:FF:FF:FF:FF:FF') continue;
            if ((int) explode('.', $ip)[0] >= 224) continue; // multicast range

            $devices[] = [
                'ip_address'  => $ip,
                'mac_address' => $mac,
                'hostname'    => $this->resolveHostname($ip),
            ];
        }

        return $devices;
    }

    /**
     * Resolve hostname dari IP via DNS reverse lookup
     */
    public function resolveHostname(string $ip): ?string
    {
        try {
            $hostname = gethostbyaddr($ip);
            // gethostbyaddr() return IP itu sendiri kalau gagal
            return ($hostname !== $ip) ? $hostname : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Lookup vendor dari MAC address menggunakan maclookup.app (gratis)
     * Hanya ambil 6 karakter pertama (OUI) agar efficient
     */
    public function lookupVendor(string $mac): ?string
    {
        try {
            $oui = substr(str_replace(':', '', $mac), 0, 6);

            $response = Http::timeout(3)
                ->get("https://api.maclookup.app/v2/macs/{$oui}/company/name");

            if ($response->successful()) {
                $vendor = trim($response->body());
                // Kalau return "NA" atau kosong, anggap tidak ditemukan
                return (!empty($vendor) && $vendor !== 'NA') ? $vendor : null;
            }
        } catch (\Exception $e) {
            Log::warning("Vendor lookup gagal untuk MAC {$mac}: " . $e->getMessage());
        }

        return null;
    }

    /**
     * Ambil IP server saat ini
     */
    public function getServerIp(): string
    {
        return gethostbyname(gethostname()) ?: '0.0.0.0';
    }

    /**
     * Cek apakah IP adalah gateway (biasanya .1)
     */
    public function isGateway(string $ip): bool
    {
        return str_ends_with($ip, '.1');
    }
}
