/* ___________________________________________________________________________

    Module: Or.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 24/12/2012
    
        Logic validation to check if any validation from array is true.
   ___________________________________________________________________________*/
   
   
function Or() {
    
    // __ Getters ______________________________________________________________
    
    var getName = function() {
        return "or";
    };
    
    var getType = function() {
        return "logical";
    };
    
    
    // __ Main Method __________________________________________________________
    
    var check = function(data) {  
        
        var result = false,
            error; 
        
        // Validating arguments
        if (data.validations === undefined || data.validations === null) {
            error = new Error("[Or][ERROR] Validation not found");
            error.code = "ARG_NOT_FOUND";
            throw error;
        }
        if (data.validations.length < 2 ) {
            error = new Error("[Or][ERROR] Not enough validations");
            error.code = "WRONG_ARGS";
            throw error;
        }
        
        // Checkings validations
        var Validation = require("../validation.js");
        var i = 0;
        while (result === false && i < data.validations.length) {
        
            var validator = new Validation( data.db, 
                                            data.validations[i].collection, 
                                            data.validations[i].properties, 
                                            data.validations[i].type, 
                                            data.validations[i].parameters, 
                                            data.validations[i].enabled );

            var currentCheck = validator.check(data.register);
            if (data.validations[i].enabled === true) {
                result = currentCheck;
            }
            
            i++;
        }
  
        return result;
    };
     
     
    // __ Returning ... ________________________________________________________
    
    return { "getType" : getType
           , "getName" : getName
           , "check"   : check };
}

var validator = new Or();
module.exports = validator;