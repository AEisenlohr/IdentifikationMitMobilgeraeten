const util = require('util');
const events = require('events');
const axios = require('axios');

const IDRequest = {
    NONE: 0,
    LOGIN: 1,
    REGISTER: 2
};

function Identification() {
    events.EventEmitter.call(this);
    this.Username = '';
    this.Password = '';
    this.IDReq = IDRequest.NONE
}

util.inherits(Identification, events.EventEmitter);

Identification.prototype.checkIdentity = function() {
    console.log('checking Identity...');
    let username = this.Username
    let password = this.Password
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