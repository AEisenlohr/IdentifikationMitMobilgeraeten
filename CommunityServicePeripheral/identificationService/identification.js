const util = require('util');
const events = require('events');
const axios = require('axios');

/*
 * Defines default values of the identity-request-characteristic
 * to differentiate between Login- and Register Request
 */
const IDRequest = {
    NONE: 0,
    LOGIN: 1,
    REGISTER: 2
};

/*
 * Creates an object to save and use the date received from the characteristics
 */
function Identification() {
    events.EventEmitter.call(this);
    this.Username = '';
    this.Password = '';
    this.IDReq = IDRequest.NONE
}

util.inherits(Identification, events.EventEmitter);

/*
 * Implements the method used to validate the credentials 
 * by sending the recieved data to the identity provider
 * using axios
 */
Identification.prototype.checkIdentity = function() {
    console.log('checking Identity...');
    let username = this.Username
    let password = this.Password
    //Sends a login-request to the identityProvider
    if (this.IDReq === IDRequest.LOGIN) {
        axios.post('http://localhost:3000/users/login', {
            name: username,
            password: password
        }).then(res => {
            if (res.data === 'Success') {
                console.log('Identification successful')
            }
            else {
                console.log('Identification failed')
            }
        }).catch(error => {
            console.error(error)
        })
    }
    //Sends a register-request to the identityProvider
    else if (this.IDReq === IDRequest.REGISTER) {
        axios.post('http://localhost:3000/users', {
            name: username,
            password: password
        }).then(res => {
            if (res.data === 'User created') {
                console.log('Registration successful')
            }
            else {
                console.log('Registration failed')
            }
        }).catch(error => {
            console.error(error)
        })
    }
    else {
        console.log('No Request')
    }
};

module.exports.Identification = Identification;
module.exports.IDRequest = IDRequest;