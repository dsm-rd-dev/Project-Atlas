const ConnectWiseRest = require('connectwise-rest');
const config = require('../config/erhandle.js');

const cw = new ConnectWiseRest({
    companyId: 'dsm',
    companyUrl: 'connect.dsm.net',
    publicKey: process.env.cwApiusr,
    privateKey: process.env.cwApipwd,
    //clientId: '250',
    entryPoint: 'v4_6_release', // optional, defaults to 'v4_6_release'
    timeout: 20000,             // optional, request connection timeout in ms, defaults to 20000
    retry: false,               // optional, defaults to false
    retryOptions: {             // optional, override retry behavior, defaults as shown
      retries: 4,               // maximum number of retries
      minTimeout: 50,           // number of ms to wait between retries
      maxTimeout: 20000,        // maximum number of ms between retries
      randomize: true,          // randomize timeouts
    },
    debug: true,               // optional, enable debug logging
    logger: (level, text, meta) => { } // optional, pass in logging function
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

    module.exports = {
        getNotes: function(ticket){
            cw.ServiceDeskAPI.ServiceNotes.getServiceNotes(ticket)
        .then((Tickets) => {
            //config.errNotice(Tickets)
            //console.log(JSON.stringify(Tickets, null, 4))
            console.log(Tickets.statusCode)
        })
        .catch((error) =>{
            console.log(JSON.stringify(error, null, 4))
        })
    },

        getComps: function(company){
            cw.CompanyAPI.Companies.getCompanies()
            .then((comps) => {
                //console.log(comps[1]['id'])
                for(var key in comps) {
                    
                    console.log("Company ID: " + comps[key]['id'] + " and Company Name: " + comps[key]['name'])
                }    
            
            
                

            })
            .catch((error) =>{
                console.log(JSON.stringify(error, null, 4))
            })
        }
    }