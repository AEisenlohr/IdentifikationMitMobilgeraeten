var util = require('util');
var bleno = require('bleno');
var identification = require('./identification');

function UsernameCharacteristic(identification) {
    bleno.Characteristic.call(this, {
        uuid: '13333333333333333333333333330002',
        properties: ['notify', 'write'],
        descriptors: [
            new bleno.Descriptor({
                uuid: '2901',
                value: 'Receives Username'
            })
        ]
    });

    this.identification = identification;
}

util.inherits(UsernameCharacteristic, bleno.Characteristic);

UsernameCharacteristic.prototype.onWriteRequest = function(data, offset, withoutResponse, callback) {
    if (offset) {
        callback(this.RESULT_ATTR_NOT_LONG);
    }
    else {
        var username = data.toString();
        this.identification.Username = username.substring(1);
        callback(this.RESULT_SUCCESS);
    }
};

module.exports = UsernameCharacteristic;