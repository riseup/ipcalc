# IPCalc - JS
A bitwise operations Javascript IP calculator


## Example
```bash 
node ipcalc.js 192.168.1.1/24
```

## Output
```json
{
  "ip": {
    "ip": "192.168.1.1",
    "ip_binary": "11000000.10101000.00000001.00000001",
    "network": {
      "network": "192.168.1.0",
      "network_binary": "11000000.10101000.00000001.00000000",
      "prefix": 24,
      "ipv4_class": "C",
      "ip_range": {
        "num_hosts": "254",
        "num_networks": "16777216",
        "first_ip": {
          "first_ip": "192.168.1.1",
          "first_ip_binary": "11000000.10101000.00000001.00000001"
        },
        "last_ip": {
          "last_ip": "192.168.1.254",
          "last_ip_binary": "11000000.10101000.00000001.11111110"
        }
      }
    },
    "netmask": {
      "netmask": "255.255.255.0",
      "netmask_binary": "11111111.11111111.11111111.00000000",
      "inverted_mask": {
        "inverted_mask": "0.0.0.255",
        "inverted_mask_binary": "00000000.00000000.00000000.11111111"
      }
    },
    "broadcast": {
      "broadcast": "192.168.1.255",
      "broadcast_binary": "11000000.10101000.00000001.11111111"
    }
  }
}
```