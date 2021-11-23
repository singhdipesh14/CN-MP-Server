const ayb = require("all-your-base")

class SubnetInfo {
	constructor(ip, subnetBits, octets) {
		this.ip = ip
		this.subnetBits = subnetBits
		this.octets = octets
	}

	invert(x) {
		var e = ayb.decToBin(x).split("")
		for (var i = 0, l = 8; i < l; i++) {
			e[i] = e[i] == "1" ? "0" : "1"
		}
		return ayb.binToDec(e.join(""))
	}

	_size() {
		return Math.pow(2, 32 - this.subnetBits)
	}

	_netmask() {
		var i = 0
		var subNetOctets = []
		var subNetOctet = []

		for (i = 0; i < 32; i++) {
			subNetOctet.push(i < this.subnetBits ? 1 : 0)

			if (subNetOctet.length === 8) {
				subNetOctets.push(ayb.binToDec(subNetOctet.join("")))
				subNetOctet = []
			}
		}

		return subNetOctets.join(".")
	}

	_networkAddress() {
		var networkAddress = []

		var subNetMask = this._netmask().split(".")

		for (var i = 0; i < 4; i++) {
			networkAddress.push(this.octets[i] & subNetMask[i])
		}

		return networkAddress.join(".")
	}

	_broadcastAddress() {
		var i = 0
		var broadcastAddress = []

		var subNetMask = this._netmask().split(".")

		for (var i = 0; i < 4; i++) {
			broadcastAddress.push(this.octets[i] | this.invert(subNetMask[i]))
		}

		return broadcastAddress.join(".")
	}

	_calculateStartAddress() {
		var startAddr = this._networkAddress().split(".")

		startAddr[3] = parseInt(startAddr[3]) + 1

		return startAddr.join(".")
	}

	_calculateEndAddress() {
		// var subNetMask = this._netmask().split('.');
		// console.log(subNetMask)

		// var ipRange = 256 - subNetMask[3];

		// var usableRange = ipRange - 3;
		//one is used for the gateway, second is for the
		//network IP and the third is for broadcast IP

		var endAddr = this._broadcastAddress().split(".")

		endAddr[3] = parseInt(endAddr[3]) - 1

		return endAddr.join(".")
	}

	_range() {
		var numberOfHosts = this._numberOfHosts()
		if (numberOfHosts > 2)
			return this._calculateStartAddress() + "-" + this._calculateEndAddress()
		else return "NA"
	}

	_wildcardMask() {
		var subNetMask = this._netmask().split(".")

		var wildCardMask = []

		wildCardMask[0] = 255 - subNetMask[0]
		wildCardMask[1] = 255 - subNetMask[1]
		wildCardMask[2] = 255 - subNetMask[2]
		wildCardMask[3] = 255 - subNetMask[3]

		return wildCardMask.join(".")
	}

	_numberOfHosts() {
		var maxHosts = Math.pow(2, 32 - this.subnetBits) - 2
		//Subtracting 2 because the all-ones and all-zeros host numbers
		//are reserved. The all-zeros host number is the network number; the
		//all-ones host number is the broadcast address.

		return maxHosts
	}

	_ipClass() {
		var ipClass

		var id = this.octets[0]
		if (id >= 0 && id < 127) ipClass = "Class A"
		else if (id >= 128 && id < 192) ipClass = "Class B"
		else if (id >= 192 && id < 224) ipClass = "Class C"
		else if (id >= 224 && id < 240) ipClass = "Class D"
		else if (id >= 240) ipClass = "Class E"

		return ipClass
	}

	_ipType() {
		if (
			(this.subnetBits === 8 && this.octets[0] == 10) ||
			(this.subnetBits === 16 &&
				((this.octets[0] == 169 && this.octets[1] == 254) ||
					(this.octets[0] == 192 && this.octets[1] == 168))) ||
			(this.subnetBits === 12 &&
				this.octets[0] == 17 &&
				this.octets[1] <= 31 &&
				this.octets[1] >= 16)
		) {
			return "Private"
		}
		return "Public"
	}

	_int2ip(ipInt) {
		return (
			(ipInt >>> 24) +
			"." +
			((ipInt >> 16) & 255) +
			"." +
			((ipInt >> 8) & 255) +
			"." +
			(ipInt & 255)
		)
	}

	_availableBlocks() {
		let blocks = []
		let addr = 0
		let hosts = this._numberOfHosts() + 2
		let flag = this.subnetBits >= 16
		let counter = 0
		while (addr <= 4294967295) {
			if (this._int2ip(addr) === this._networkAddress()) {
				addr += hosts
				continue
			}
			counter++
			blocks.push(`${this._int2ip(addr)}-${this._int2ip(addr + hosts - 1)}`)
			addr += hosts
			if (flag && counter >= 3) break
		}
		return blocks
	}

	info() {
		return {
			ip: this.ip,
			subnetmask: this._netmask(),
			usableAddressRange: this._range(),
			netAddress: this._networkAddress(),
			broadcastAddress: this._broadcastAddress(),
			totalHosts: this._numberOfHosts() + 2,
			numberOfUsableHosts: this._numberOfHosts(),
			wildCardMask: this._wildcardMask(),
			ipClass: this._ipClass(),
			ipType: this._ipType(),
			blocks: this._availableBlocks(),
		}
	}
}

module.exports = SubnetInfo
