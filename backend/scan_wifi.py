import json
import sys
import socket

try:
    from scapy.all import ARP, Ether, srp, conf  # type: ignore
except Exception as e:  # pragma: no cover - environment dependency
    print(
        json.dumps(
            {
                "success": False,
                "error": f"Scapy import failed: {e}",
                "devices": [],
            }
        )
    )
    sys.exit(0)


def get_default_ip() -> str:
    try:
        # Default route interface
        return conf.route.route("0.0.0.0")[1]
    except Exception:
        return ""


def guess_subnet(ip: str) -> str:
    if not ip or "." not in ip:
        return "192.168.0.0/24"
    parts = ip.split(".")
    if len(parts) != 4:
        return "192.168.0.0/24"
    return f"{parts[0]}.{parts[1]}.{parts[2]}.0/24"


def resolve_hostname(ip: str) -> str | None:
    try:
        host, _, _ = socket.gethostbyaddr(ip)
        return host if host != ip else None
    except Exception:
        return None


def scan(subnet: str, attempts: int = 3, timeout: int = 4) -> list[dict]:
    devices_by_mac: dict[str, dict] = {}

    arp = ARP(pdst=subnet)
    ether = Ether(dst="ff:ff:ff:ff:ff:ff")

    for _ in range(attempts):
        answered = srp(ether / arp, timeout=timeout, verbose=False)[0]

        for _, received in answered:
            ip = received.psrc
            mac = received.hwsrc.upper()
            hostname = resolve_hostname(ip)
            devices_by_mac[mac] = {
                "ip_address": ip,
                "mac_address": mac,
                "hostname": hostname,
            }

    return list(devices_by_mac.values())


def main() -> None:
    server_ip = get_default_ip()
    subnet = sys.argv[1] if len(sys.argv) > 1 else guess_subnet(server_ip)

    try:
        devices = scan(subnet)
        print(
            json.dumps(
                {
                    "success": True,
                    "server_ip": server_ip,
                    "subnet": subnet,
                    "devices": devices,
                }
            )
        )
    except Exception as e:  # pragma: no cover - environment dependent errors
        print(
            json.dumps(
                {
                    "success": False,
                    "error": str(e),
                    "server_ip": server_ip,
                    "subnet": subnet,
                    "devices": [],
                }
            )
        )


if __name__ == "__main__":
    main()
