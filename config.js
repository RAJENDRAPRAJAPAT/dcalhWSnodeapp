var config = {}

config.endpoint = "https://dcalhcosmosaccount.documents.azure.com:443/";
config.primaryKey = "iDynTJuF3xO8yJfgMWh2GCBLg8Nb2dnhczVwwK6bSFe0KzP3m56vt6YKWQd6afbPjbc84lAdjlZI5LaaAlfdFg==";

config.database = {
    "id": "dcalhDocumentDB"
};

config.infomodelCollection = {
    "id": "dcalhDocCollection",
	"query" :'SELECT r.id,r.structureType,r.structureName,r.name,r.children FROM root r where r.name="Location Stucture" '
};

config.timeseriesCollection = {
    "id": "DcalhTimeSeriesCollection",
	"query" : 'SELECT  c.Objectid,c.Temperature,c.Power,c.MinTemperature,c.MaxTemperature ,c.MinPower,c.MaxPower,c.Time FROM c'
};

 
module.exports = config;