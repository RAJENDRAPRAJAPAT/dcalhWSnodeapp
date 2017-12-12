"use strict";

var app ={}

var documentClient = require("documentdb").DocumentClient;
var config = require("./config");
var url = require('url');

var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });

var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.infomodelCollection.id}`;
var collectionQuery='${config.infomodelCollection.query}';

app.infoModel =null;
app.collectionName= 'infomodel';

/**
 * Get the database by ID, or create if it doesn't exist.
 * @param {string} database - The database to get or create
 */
app.getDatabase=function() {
    console.log(`Getting database:\n${config.database.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDatabase(databaseUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDatabase(config.database, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
}

app.getCollectionUrl=function(collectionName)
{
	     console.log(`Calling  getCollectionUrl:\n${collectionName}\n`);
		 if(collectionName=='timeseries')
		 {
			 collectionUrl = `${databaseUrl}/colls/${config.timeseriesCollection.id}`;
			 collectionQuery=`${config.timeseriesCollection.query}`;
			 
			 console.log(`Collection through index:\n${config.timeseriesCollection.id}`);
			 console.log(`Querying Query:\n${collectionQuery}\n`);
		 }
		 
		 else if(collectionName=='infomodel')
		 {
				collectionUrl = `${databaseUrl}/colls/${config.infomodelCollection.id}`;	
			    collectionQuery=`${config.infomodelCollection.query}`;	
				
			    console.log(`Querying collection through index:\n${config.infomodelCollection.id}\n`);				
				console.log(`Querying Query:\n${collectionQuery}\n`);				
		 }
}

/**
 * Get the collection by ID, or create if it doesn't exist.
 */
app.getCollection=function() {
     console.log(`Getting collection:\n${collectionUrl}\n`);

    return new Promise((resolve, reject) => {
        client.readCollection(collectionUrl, (err, result) => {		
            if (err) {
					console.log(err.code);
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createCollection(databaseUrl, config.infomodelCollection.id, { offerThroughput: 400 }, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
				 
                resolve(result);
            }
        });
    });
	
	
}

/**
 * Get the document by ID, or create if it doesn't exist.
 * @param {function} callback - The callback function on completion
 */
 /*
function getFamilyDocument(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.readDocument(documentUrl, (err, result) => {
            if (err) {
                if (err.code == HttpStatusCodes.NOTFOUND) {
                    client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
                } else {
                    reject(err);
                }
            } else {
                resolve(result);
            }
        });
    });
};*/


app.getFamilyDocument =function (document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Getting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
      
		 client.createDocument(collectionUrl, document, (err, created) => {
                        if (err) reject(err)
                        else resolve(created);
                    });
	  
    });
}
 
 

/**
 * Query the collection using SQL
 */
app.queryCollection=function() {
	
	     console.log('Calling queryCollection Method \n');
	    // app.getCollectionUrl();
    

    return new Promise((resolve, reject) => {
        client.queryDocuments(
            collectionUrl,
             collectionQuery,
			  { enableCrossPartitionQuery: true }
        ).toArray((err, results) => {
            if (err) reject(err)
            else {
               /* for (var queryResult of results) {
                    let resultString = JSON.stringify(queryResult);
                    console.log(`\tQuery returned ${resultString}`);
                }*/
                
				app.infoModel=results;
                resolve(results);
            }
        });
    });
};

/**
 * Replace the document by ID.
 */
app.replaceFamilyDocument=function(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Replacing document:\n${document.id}\n`);
    document.children[0].grade = 6;

    return new Promise((resolve, reject) => {
        client.replaceDocument(documentUrl, document, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};

/**
 * Delete the document by ID.
 */
app.deleteFamilyDocument=function(document) {
    let documentUrl = `${collectionUrl}/docs/${document.id}`;
    console.log(`Deleting document:\n${document.id}\n`);

    return new Promise((resolve, reject) => {
        client.deleteDocument(documentUrl, (err, result) => {
            if (err) reject(err);
            else {
                resolve(result);
            }
        });
    });
};



/**
 * Cleanup the database and collection on completion
 */
app.cleanup=function() {
    console.log(`Cleaning up by deleting database ${config.database.id}`);

    return new Promise((resolve, reject) => {
        client.deleteDatabase(databaseUrl, (err) => {
            if (err) reject(err)
            else resolve(null);
        });
    });
}

/**
 * Exit the app with a prompt
 * @param {message} message - The message to display
 */
app.exit= function(message) {
    console.log(message);
    console.log('Press any key to exit');
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}

module.exports = app;

/*
function GetInfoModel()
{
app.getDatabase()
    .then(() => app.getCollection())  
    .then(() =>  app.queryCollection())    
	.then(() => { console.log(infoModel[0]);})
    .then(() => { app.exit(`Completed successfully`); })
	
	
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
	
	return infoModel;
} 

GetInfoModel();
*/ 

/*getDatabase()
    .then(() => getCollection())
  //  .then(() => getFamilyDocument(config.documents.Andersen))
    //.then(() => getFamilyDocument(config.documents.Wakefield))
    .then(() =>  queryCollection())
    //.then(() => replaceFamilyDocument(config.documents.Andersen))
    //.then(() => queryCollection())
    //.then(() => deleteFamilyDocument(config.documents.Andersen))
    //.then(() => cleanup())
    .then(() => { exit(`Completed successfully`); }) 
	
    .catch((error) => { exit(`Completed with error ${JSON.stringify(error)}`) });
	
	*/
	
