const ayb = require('all-your-base');

class SubnetInfo {
    constructor(ip, subnetBits, octets) {
        this.ip = ip;
        this.subnetBits = subnetBits;
        this.octets = octets;
    };

    invert(x) {
        var e = ayb.decToBin(x).split("");
        for (var i = 0, l = 8; i < l; i++) {
            e[i] = (e[i] == '1') ? '0' : '1';
        }
        return ayb.binToDec(e.join(''));
    }

    _size() {
        return Math.pow(2, 32 - this.subnetBits);
    };

    _netmask() {
        var i = 0;
        var subNetOctets = [];
        var subNetOctet = [];

        for (i = 0; i < 32; i++) {
            subNetOctet.push(i < this.subnetBits ? 1 : 0);

            if (subNetOctet.length === 8) {
                subNetOctets.push(ayb.binToDec(subNetOctet.join('')));
                subNetOctet = [];
            }
        }

        return subNetOctets.join('.');
    };

    _networkAddress() {
        var networkAddress = [];

        var subNetMask = this._netmask().split('.');

        for (var i = 0; i < 4; i++) {
            networkAddress.push(this.octets[i] & subNetMask[i])
        }

        return networkAddress.join('.');
    };

    _broadcastAddress() {
        var i = 0;
        var broadcastAddress = [];

        var subNetMask = this._netmask().split('.');

        for (var i = 0; i < 4; i++) {
            broadcastAddress.push(this.octets[i] | this.invert(subNetMask[i]))
        }

        return broadcastAddress.join('.');
    };

    _calculateStartAddress() {
        var startAddr = this._networkAddress().split('.');

        startAddr[3] = parseInt(startAddr[3]) + 1;

        return startAddr.join('.');
    }

    _calculateEndAddress() {
        // var subNetMask = this._netmask().split('.');
        // console.log(subNetMask)

        // var ipRange = 256 - subNetMask[3];

        // var usableRange = ipRange - 3;
        //one is used for the gateway, second is for the 
        //network IP and the third is for broadcast IP

        var endAddr = this._broadcastAddress().split('.');

        endAddr[3] = parseInt(endAddr[3]) - 1;

        return endAddr.join('.');
    }

    _wildcardMask() {
        var subNetMask = this._netmask().split('.');

        var wildCardMask = [];

        wildCardMask[0] = 255 - subNetMask[0];
        wildCardMask[1] = 255 - subNetMask[1];
        wildCardMask[2] = 255 - subNetMask[2];
        wildCardMask[3] = 255 - subNetMask[3];

        return wildCardMask.join(".");
    }

    _numberOfHosts() {
        var maxHosts = Math.pow(2, 32 - this.subnetBits) - 2
        //Subtracting 2 because the all-ones and all-zeros host numbers 
        //are reserved. The all-zeros host number is the network number; the 
        //all-ones host number is the broadcast address. 

        return maxHosts;
    }

    _ipClass() {
        var ipClass;

        var id = this.octets[0];
        if (id < 128)
            ipClass = 'Class A'
        else if (id >= 128 && id < 192)
            ipClass = 'Class B'
        else if (id >= 192 && id < 224)
            ipClass = 'Class C'
        else if (id >= 224 && id < 240)
            ipClass = 'Class D'
        else if (id >= 240)
            ipClass = 'Class E'

        return ipClass;
    }

    info() {
        return {
            ip: this.ip,
            subnetmask: this._netmask(),
            usableAddressRange: this._calculateStartAddress() + "-" + this._calculateEndAddress(),
            numberOfHosts: this._numberOfHosts(),
            netAddress: this._networkAddress(),
            broadcastAddress: this._broadcastAddress(),
            maxHosts: this._numberOfHosts(),
            wildCardMask: this._wildcardMask(),
            ipClass: this._ipClass(),
            // ipType:,
            //avaBlocks
        };
    };

};

module.exports = SubnetInfo;