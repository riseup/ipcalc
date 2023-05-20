// Validate the CIDR string param
function main() {
  const cidrRegex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/
  const [arg] = process.argv.slice(2)

  if (!arg || arg === '--help') {
    showUsage()
    process.exit(0)
  }

  if (!cidrRegex.test(arg)) {
    console.error('Error: CIDR string is invalid')
    process.exit(1)
  }

  calc(arg)
  process.exit(0)
}


// Show help message
const showUsage = () => console.log(`Usage: node ip-calc.js 192.168.1.1/24`);

// Calculate
function calc(input) {
  const [ipAddress, prefixLength] = input.split("/")
  const ip = ipAddress.split(".").map(Number)

  // Calculating the network mask
  const prefix = prefixLength >>> 0
  const networkMask = 0xffffffff << (32 - prefix)
  const netmask = [
    (networkMask >> 24) & 0xff,
    (networkMask >> 16) & 0xff,
    (networkMask >> 8) & 0xff,
    networkMask & 0xff,
  ]

  // Calculating the network address
  const network = [
    ip[0] & netmask[0],
    ip[1] & netmask[1],
    ip[2] & netmask[2],
    ip[3] & netmask[3],
  ]

  // Calculating the broadcast address
  const invertedMask = [
    ~netmask[0] & 0xff,
    ~netmask[1] & 0xff,
    ~netmask[2] & 0xff,
    ~netmask[3] & 0xff,
  ]
  const broadcast = [
    network[0] | invertedMask[0],
    network[1] | invertedMask[1],
    network[2] | invertedMask[2],
    network[3] | invertedMask[3],
  ]

  // Calculating the first and last IP addresses
  const firstIp = [...network]
  firstIp[3]++
  const lastIp = [...broadcast]
  lastIp[3]--


  // Set the ipv4 class
  let ipv4Class = ""
  const firstOctet = ip[0]
  if ((firstOctet & 0b10000000) === 0) ipv4Class = 'A'
  else if ((firstOctet & 0b01000000) === 0) ipv4Class = 'B'
  else if ((firstOctet & 0b00100000) === 0) ipv4Class = 'C'
  else if ((firstOctet & 0b00010000) === 0) ipv4Class = 'D'
  else ipv4Class = 'E'


  // Calculate the number of mask bits from a subnet mask
  let maskBits = 0
  for (let octet of netmask) {
    let bitCount = 0
    while (octet & 0x80) {
      bitCount++
      octet <<= 1
    }
    maskBits += bitCount
  }

  // Calculate the number of hosts and networks
  const numHosts = 2 ** (32 - maskBits) - 2
  const numNetworks = 2 ** maskBits

  // Convert the IP address to binary
  const ipToBinary = (ip) =>
    ip.map((part) => part.toString(2).padStart(8, "0")).join(".")

  // Show the calculated values

  let output = {
    ip: {
      ip: ip.join("."),
      ip_binary: ipToBinary(ip),
      network: {
        network: network.join("."),
        network_binary: ipToBinary(network),
        prefix,
        ipv4_class: ipv4Class,
        ip_range: {
          num_hosts: numHosts.toString(),
          num_networks: numNetworks.toString(),
          first_ip: {
            first_ip: firstIp.join("."),
            first_ip_binary: ipToBinary(firstIp),
          },
          last_ip: {
            last_ip: lastIp.join("."),
            last_ip_binary: ipToBinary(lastIp),
          },
        },
      },
      netmask: {
        netmask: netmask.join("."),
        netmask_binary: ipToBinary(netmask),
        inverted_mask: {
          inverted_mask: invertedMask.join("."),
          inverted_mask_binary: ipToBinary(invertedMask),
        },

      },
      broadcast: {
        broadcast: broadcast.join("."),
        broadcast_binary: ipToBinary(broadcast),
      },
    },
  }
  console.log(JSON.stringify(output, null, 2))
}

main()