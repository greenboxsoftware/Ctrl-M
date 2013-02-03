/* ___________________________________________________________________________

    Module: IsNull.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 24/12/2012
    
        Validation to check if value is null.
        If value is null, result is true
        If value is undefined, result is false
        If value is a defined not-null simple value, result is false
        If value is array, we must check each value of array
   ___________________________________________________________________________*/
   
   
function IsNull() {
    
    // __ Getters ______________________________________________________________
    
    var getName = function() {
        return "isNull";
    };
    
    var getType = function() {
        return "value";
    };
    
    
    // __ Main Methods _________________________________________________________
    
    var validateCondition = function(value) {
        return (value === null);
    };
    
    var check = function(data) {  
        
        var result = true; 
          
        // If value to check is array, we'll check each element of array
        if (Array.isArray(data.value)) {
            var checksArray = [];
            data.value.forEach(
                function(element) {
                    var copyOfData = data;
                    copyOfData.value = element;
                    var elementResult = check(copyOfData); 
                    if (!elementResult) result = elementResult;
                }
            );
            data.checks.concat(checksArray);
                        
        // If value is a simple value. We'll check it
        } else {
            var condition = validateCondition(data.value);
            if (!condition) result = false;
        }
  
        return result;
    };
     
     
    // __ Returning ... ________________________________________________________
    
    return { "getType" : getType
           , "getName" : getName
           , "check"   : check };
}

var validator = new IsNull();
module.exports = validator;