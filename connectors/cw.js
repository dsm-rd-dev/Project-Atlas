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
                else resolve(-1);
            }).catch(err => {
                reject(err);
            });
        });
    },

    getCompanies: function (page=1, pageSize=25, order="name asc", search="") {
        return new Promise(function(resolve, reject) {
            cw.CompanyAPI.Companies.getCompanies({"page": page, "orderBy": order, "pageSize": pageSize, "conditions": `identifier contains "${search}"`}).then(comps => {
                cw.CompanyAPI.Companies.getCompaniesCount({"conditions": `identifier contains "${search}"`}).then(compCount => {
                    resolve({pages: Math.ceil(compCount.count/pageSize), list: comps});
                }).catch(err => {
                    reject(err);
                })
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

    getCompanyTickets: function(id, page=1, pageSize=25, search="") {
        return new Promise(function(resolve, reject) {
            const conditions = `company/id = ${id} and closedFlag = false`;
            cw.ServiceDeskAPI.Tickets.getTickets({
                "page": page,
                "orderBy": "dateEntered desc",
                "pageSize": pageSize,
                "conditions": conditions,
            }).then(tickets => {
                cw.ServiceDeskAPI.Tickets.getTicketsCount({"conditions": conditions}).then(compCount => {
                    console.log(compCount);
                    console.log(compCount.count/pageSize);
                    resolve({pages: Math.ceil(compCount.count/pageSize), list: tickets});
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            });
        });
    },

    updateTicketStatusById: function(id, status){
        return new Promise(function(resolve, reject) {
            cw.ServiceDeskAPI.Tickets.updateTicketStatusByName(id, status).then(ticket => {
                resolve(ticket);
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
                reject(error);
            });
        });
    },

    createSupportTicket: function (summary, companyName, board) {
        return new Promise(function (resolve, reject) {
            module.exports.getCompanyID(companyName).then(id => {
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
                    reject(error);
                })
            });
        });
    }
}