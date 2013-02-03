/* ___________________________________________________________________________

    Module: Exists.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 24/12/2012
    
        Validation to check if register exists in collection.
   ___________________________________________________________________________*/
   
   
function Exists() {
    
    // __ Getters ______________________________________________________________
    
    // Name of validation
    var getName = function() {
        return "exists";
    };
    
    // Type of validation [ 'value' | 'logical' | 'query' ]
    var getType = function() {
        return "dbQuery";
    };
    
    
    // __ Main Method __________________________________________________________
    
    var check = function(data) {   
        
        console.log("Collection: " + data.collection);
        console.log("Filters... ");
        Object.keys(data.filters).forEach(
            function(key) {
                console.log(key + ": " + data.filters[key]);
            }
        );
        
        var db = data.db,
            collection = data.collection,
            filters = data.filters;
        db.open(
            function(err, db) {      
                collection.find(filters, 
                    function(err, cursor) {
                        console.log("Returned #1 documents");  
                        return true;
                    }
                );
            }
        );
        
        return false;
    };
     
     
    // __ Returning ... ________________________________________________________
    
    return { "getType" : getType
           , "getName" : getName
           , "check"   : check };
}

var validator = new Exists();
module.exports = validator;