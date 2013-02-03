/* ___________________________________________________________________________

    Module: Not.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 24/12/2012
    
        Validation to check inverse of another validation.
   ___________________________________________________________________________*/
   
   
function Not() {
    
    // __ Getters ______________________________________________________________
    
    var getName = function() {
        return "not";
    };
    
    var getType = function() {
        return "logical";
    };
    
    
    // __ Main Method __________________________________________________________
    
    var check = function(data) {  
        
        var result = true,
            error; 
        
        // Validating arguments
        if (data.validations === undefined || data.validations === null) {
            error = new Error("[Not][ERROR] Validation not found");
            error.code = "ARG_NOT_FOUND";
            throw error;
        }
        if (data.validations.length > 1 ) {
            error = new Error("[Not][ERROR] Too many validations");
            error.code = "WRONG_ARGS";
            throw error;
        }
        
        // Loading validation js file
        var Validation = require("../validation.js");
        var validator = new Validation( data.db, 
                                        data.validations[0].collection, 
                                        data.validations[0].properties, 
                                        data.validations[0].type, 
                                        data.validations[0].parameters, 
                                        data.validations[0].enabled);

        var currentCheck = validator.check(data.register);
        if (data.validations[0].enabled === true) {
            result = !currentCheck; // Reversing boolean
        } else {
            result = true;
        }
  
        return result;
    };
     
     
    // __ Returning ... ________________________________________________________
    
    return { "getType" : getType
           , "getName" : getName
           , "check"   : check };
}

var validator = new Not();
module.exports = validator;