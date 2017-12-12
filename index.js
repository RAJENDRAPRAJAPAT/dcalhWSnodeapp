"use strict";

var http = require('http');
var url =require('url');
var querystring =require('querystring');
var app=require('./app');
var Hierarchy=require('./Hierarchy');

 

var server = http.createServer(function(request, response) {

    response.writeHead(200, {"Content-Type" : "application/json"}); 
	var urlpath= url.parse(request.url).pathname.trim().substring(1);
	if(urlpath=='')
		urlpath='infomodel';
	console.log(urlpath);
	var data='' 	
	app.infoModel=null;
	Hierarchy.finalArray=[];
	app.getDatabase()	
	.then(() => app.getCollectionUrl(urlpath))  
    .then(() => app.getCollection())  
    .then(() => app.queryCollection())    
	.then(() => { 	
		
		console.log(app.infoModel[0]);
	if(urlpath=='timeseries')
	{	
        data=   app.infoModel;
	}		 
	else if(urlpath=='infomodel')
	{	 
	  Hierarchy.getArrayFromJson(app.infoModel[0]);
	  data=Hierarchy.finalArray;
	}
	 
	
	 response.write(JSON.stringify(data));
     response.end();	
	
	})
    .then(() => { app.exit(`Completed successfully`); })
    .catch((error) => { app.exit(`Completed with error ${JSON.stringify(error)}`) });
	
});

var port = process.env.PORT || 1337;
server.listen(port);

console.log("Server running at http://localhost:%d", port);
