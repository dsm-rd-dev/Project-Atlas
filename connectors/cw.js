const ConnectWiseRest = require('connectwise-rest');
const config = require('../config/erhandle.js');

const cw = new ConnectWiseRest({
    companyId: 'dsm',
    companyUrl: 'connect.dsm.net',
    publicKey: process.env.cwApiusr,
    privateKey: process.env.cwApipwd,
    //clientId: '250',
    entryPoint: 'v4_6_release', // optional, defaults to 'v4_6_release'
    timeout: 20000, // optional, request connection timeout in ms, defaults to 20000
    retry: false, // optional, defaults to false
    retryOptions: { // optional, override retry behavior, defaults as shown
        retries: 4, // maximum number of retries
        minTimeout: 50, // number of ms to wait between retries
        maxTimeout: 20000, // maximum number of ms between retries
        randomize: true, // randomize timeouts
    },
    debug: true, // optional, enable debug logging
    logger: (level, text, meta) => {} // optional, pass in logging function
});



//Define API Call Functions Here
module.exports = {

    getCompanyID: function(identifier) {
        return new Promise((resolve, reject) => {
            if (identifier == 'System') resolve(250);
            console.log(identifier);
            cw.CompanyAPI.Companies.getCompanies({
                "conditions": 'identifier = "' + identifier + '"'
            }).then(comp => {
                if(comp.length > 0) resolve(comp[0].id);
                else resolve(250);
            }).catch(err => {
                console.log(err);
                resolve(250);
            });
        });
    },

    getCompanies: function () {
        return new Promise(function(resolve, reject) {
            cw.CompanyAPI.Companies.getCompanies().then(comps => {
                resolve(comps);
            }).catch(err => {
                reject(err);
            });
        })
    },

    getCompanyById: function (id) {
        return new Promise(function(resolve, reject) {
            cw.CompanyAPI.Companies.getCompanyById(id).then(comp => {
                resolve(comp);
            }).catch(err => {
                reject(err);
            });
        });
    },

    getCompanyTickets: function(id, page) {
        return new Promise(function(resolve, reject) {
            cw.ServiceDeskAPI.Tickets.getTickets({
                "conditions": 'company/id = ' + id,
                "page": page,
                "orderBy": "dateEntered desc"
            }).then(tickets => {
                resolve(tickets);
            }).catch(err => {
                reject(err);
            });
        });
    },

    getTicketById: function (id) {
        return new Promise(function (resolve, reject) {
            cw.ServiceDeskAPI.Tickets.getTicketById(id).then((result) => {
                resolve(result);
            }).catch((error) => {
                config.errWarn(error);
                reject(error);
            });
        });
    },

    createSupportTicket: function (summary, companyName, board) {
        return new Promise(function (resolve, reject) {
            getCompanyID(companyName).then(id => {
                var ticket = {
                    "board": {
                        "id": board
                    },
                    "company": {
                        "id": id
                    },
                    "summary": summary
                };
                cw.ServiceDeskAPI.Tickets.createTicket(ticket).then(ticket => {
                    resolve(ticket);
                }).catch(error => {
                    config.errWarn(error);
                    reject(error);
                })
            });
        });
    }
}