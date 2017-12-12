var Hierarchy ={};


Hierarchy.finalArray=[];
var counter=0;
var level="Hierarchy";
var currentHierarchy={};
var levelUpToExclude=3;



function getLevel(count){
	var structure=["Location","Building","Floor","Section","Rack","Server"];
	if(count==0)
		return "MainStructure";
	return structure[count-1];
}

function mergeTwoJson(jsonData,currentHierarchy){
	var result = {};
	for(var key in jsonData) result[key] = jsonData[key];
	for(var key in currentHierarchy) result[key] = currentHierarchy[key];
	return result;
}

Hierarchy.getArrayFromJson =function(json){
	var jsonData = {};
	jsonData.objectid=json.objectid;
	jsonData.nodeName=json.nodename;
	//jsonData.Hierarchy=getLevel(counter);
	if(counter>levelUpToExclude)
		Hierarchy.finalArray.push(mergeTwoJson(jsonData,currentHierarchy));
	if(counter>0)
		currentHierarchy[getLevel(counter)]=json.nodename;
	//console.log("Awesome-->"+json.nodename);
	if(json.children!=undefined){	
		for(var i=0; i<json.children.length;i++){
			if(i==0)
				counter=counter+1;
			else
				delete currentHierarchy[getLevel(counter)];
			
			if(json.children[i]!=undefined)
				Hierarchy.getArrayFromJson(json.children[i]);				
		}
		delete currentHierarchy[getLevel(counter)];
		counter=counter-1;
	}
	 
}
//Hierarchy.getArrayFromJson(locationHierarchy);
//console.log(JSON.stringify(finalArray));



module.exports = Hierarchy;
