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


/*
cw.ServiceDeskAPI.ServiceNotes.getServiceNotes(357242)
    .then((Tickets) => {
        //config.errNotice(Tickets.summary)
        console.log(JSON.stringify(Tickets, null, 4))
    })
    .catch((error) =>{
        console.log(JSON.stringify(error, null, 4))
    });
*/

//Define API Call Functions Here

module.exports = {
    getNotes: function (ticket) {
        cw.ServiceDeskAPI.ServiceNotes.getServiceNotes(ticket)
            .then((Tickets) => {
                //config.errNotice(Tickets)
                //console.log(JSON.stringify(Tickets, null, 4))
                console.log(Tickets.statusCode)
            })
            .catch((error) => {
                console.log(JSON.stringify(error, null, 4))
            })
    },

    getComps: function (company) {
        console.log("Getting Companies");
        cw.CompanyAPI.Companies.getCompanies()
            .then((comps) => {
                //console.log(comps[1]['id'])
                for (var key in comps) {

                    console.log("Company ID: " + comps[key]['id'] + " and Company Name: " + comps[key]['name'])
                }
            })
            .catch((error) => {
                console.log(JSON.stringify(error, null, 4))
            })
    },

    getTicketById: function (id) {
        return new Promise(function (resolve, reject) {
            console.log("Getting ticket id: " + id);
            cw.ServiceDeskAPI.Tickets.getTicketById(id).then((result) => {
                config.errSuccess("Ticket " + id + " fetched");
                resolve(result);
            }).catch((error) => {
                config.errWarn(error);
                reject(error);
            });
        });
    },

    createTicket: function (summary, companyId){
        var ticket = {
            "board": {
                "id": 6
            },
            "company": {
                "id": companyId
            },
            "summary": summary
        };

        return new Promise(function (resolve, reject) {
            console.log("Creating ticket for companyID: " + companyId);
            cw.ServiceDeskAPI.Tickets.createTicket(ticket).then(ticket => {
                config.errSuccess("Ticket " + ticket.id + "created");
                resolve(ticket);
            }).catch(error => {
                config.errWarn(error);
                reject(error);
            })
        });
    }
}