var util = require('util');
var bleno = require('bleno');
var identification = require('./identification');

function IdentityRequestCharacteristic(identification) {
    bleno.Characteristic.call(this, {
        uuid: '13333333333333333333333333330001',
        properties: ['notify', 'write'],
        descriptors: [
            new bleno.Descriptor({
                uuid: '2901',
                value: 'Receives Identity Request'
            })
        ]
    });

    this.identification = identification;
}

util.inherits(IdentityRequestCharacteristic, bleno.Characteristic);

IdentityRequestCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else {
        var identReq = data.readUInt8(0);
        switch (identReq) {
            case identification.IDRequest.NONE:
            case identification.IDRequest.LOGIN:
            case identification.IDRequest.REGISTER:
                this.identification.IDReq = identReq;
                callback(this.RESULT_SUCCESS);
                break;
            default:
                callback(this.RESULT_UNLIKELY_ERROR);
                break;
        }

        callback(this.RESULT_SUCCESS);
    }
};

module.exports = IdentityRequestCharacteristic;