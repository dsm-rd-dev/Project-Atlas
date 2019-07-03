// Account Info
var accessId = process.env.accessID;
var accessKey = process.env.accessKey;
var company = 'dsm'

// Request Details
var httpVerb = "GET";
var epoch = (new Date).getTime();
var resourcePath = "/device/unmonitoreddevices";

// Construct signature 
var requestVars = httpVerb + epoch + resourcePath;
var crypto = require("crypto");
var hex = crypto.createHmac("sha256", accessKey).update(requestVars).digest("hex");
var signature = new Buffer(hex).toString('base64');
  
// Construct auth header
var auth = "LMv1 " + accessId + ":" + signature + ":" + epoch;
// Configure request options 
var request = require('request');
var options = 
    {
      "method" : httpVerb,
			"uri" : "https://" + company + ".logicmonitor.com/santaba/rest" + resourcePath,
			"headers": {
			    'ContentType' : 'application/json',
			    'Authorization': auth
			  },
			"qs": {
				   'fields': 'id,dns,detected',
				   'size': '1000'
				   //'filter': 'name~ip'
				  }	
    };

// Make request
request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		   // Print out the response body
		   var output = JSON
		   console.log(output['data']['items'])
		 }
     }); 
   


    /* module.exports = {
      makeReq: function(){
			request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		   // Print out the response body
		   console.log(body)
		 }
     }) 
	 }
	} */