var util = require('util');
var bleno = require('bleno');

var identification = require('./identificationService/identification');
var IdentificationService = require('./identificationService/identification-service');

var name = 'CommunityMirror';
var identificationService = new IdentificationService(new identification.Identification());

bleno.on('stateChange', function(state) {
    if (state === 'poweredOn') {
        bleno.startAdvertising(name, [identificationService.uuid], function(err) {
            if (err) {
                console.log(err);
            }
        });
    }
    else {
        bleno.stopAdvertising();
    }
});

bleno.on('advertisingStart', function(err) {
    if (!err) {
        console.log('advertising...');
        bleno.setServices([
            identificationService
        ]);
    }
});

bleno.on('accept', (clientAddress) =>{
    console.log('Accept ' + clientAddress)
})

bleno.on('disconnect', (clientAddress) => {
    console.log('Disconnect' + clientAddress)
})
