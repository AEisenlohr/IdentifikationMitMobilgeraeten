var util = require('util');
var bleno = require('bleno');
var identification = require('./identification');

/*
 * Implements a characteristic to recieve the username
 */
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

/*
 * Writes the data on request to the identification object
 */
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