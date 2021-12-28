const util = require('util');
const bleno = require('bleno');
const identification = require('./identification');

function PasswordCharacteristic(identification) {
    bleno.Characteristic.call(this, {
        uuid: '13333333333333333333333333330003',
        properties: ['notify', 'write'],
        descriptors: [
            new bleno.Descriptor({
                uuid: '2901',
                value: 'Receives Password'
            })
        ]
    });

    this.identification = identification;
}

util.inherits(PasswordCharacteristic, bleno.Characteristic);

PasswordCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else {
        let password = data.toString();
        this.identification.Password = password.substring(1);
        this.identification.checkIdentity();
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = PasswordCharacteristic;