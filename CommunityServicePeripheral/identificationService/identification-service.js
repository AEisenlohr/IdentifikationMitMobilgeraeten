var util = require('util');
var bleno = require('bleno');

var IdentityRequestCharacteristic = require('./identity-request-characteristic');
var UsernameCharacteristic = require('./username-characteristic');
var PasswordCharacteristic = require('./password-characteristic');

/*
 * Implements the bluetooth low energy service containing all 
 * characteristics needed for receiving and processing the credentials
 */
function IdentificationService(identification) {
    bleno.PrimaryService.call(this, {
        uuid: '13333333333333333333333333333337',
        characteristics: [
            new IdentityRequestCharacteristic(identification),
            new UsernameCharacteristic(identification),
            new PasswordCharacteristic(identification)
        ]
    });
}

util.inherits(IdentificationService, bleno.PrimaryService);

module.exports = IdentificationService;
