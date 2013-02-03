/* ___________________________________________________________________________

    Module: Validation.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 24/12/2012
    
        Validation manage and check a data validation for a Mongo register, it
    means, a Mongo document.
   ___________________________________________________________________________*/

function Validation(db, collection, properties, name, parameters, enabled) {

	// __ Properties ___________________________________________________________

    var _db = db;                   // DB conection (only for some validations)
	var _collection = collection;   // Collection where apply validations
	var _properties = properties;   // Properties to validate
	var _name = name;               // Name of validation
    var _parameters = parameters;   // Extra parameter for each validation
    var _enabled = true;            // Enabled flag
    
    if (enabled === false) _enabled = enabled;
    var _lastCheck = true;


	// __ Getters/Setters ______________________________________________________

    var getDb = function() {
        return _db;
	};
    
	var getCollection = function() {
		return _collection;
	};

	var getProperties = function() {
		return _properties;
	};

	var getName = function() {
        return _name;
	};
    
    var getParameters = function() {
        return _parameters;
	};

	var getEnabled = function() {
		return _enabled;
	};

	var setEnable = function() {
		_enabled = true;
	};

	var setDisable = function() {
		_enabled = false;
	};
    
    var getLastCheck = function() {
        return _lastCheck;
	};
    
    var setLastCheck = function(lastCheck) {
        _lastCheck = lastCheck;
    };

    var getValidator = function(name) {
        
        var validator;
        try {
            validator = require("./validations/" + name + ".js");
        } catch (ex) {
            var error = new Error("Unknown validation type '" + name + "'");
            error.code = "VALIDATION_FILE_NOT_FOUND";
            throw error;
        }
        
        return validator;
    };


    // __ Private Methods ______________________________________________________
    
    // Updating last check
    var updateLastCheck = function(currentCheck) {
 
        // Updating last check...
        var lastCheck = getLastCheck();
        if (lastCheck === null || lastCheck === undefined || !currentCheck) { 
            setLastCheck(currentCheck);
        }
    };
    
	// __ Public Methods _______________________________________________________

	// Checking register with validation
	var check = function(register) {
        
        var error,
            name = getName(),
            validator = getValidator(name),
            type;
        
        try {
            type = validator.getType(); }
        catch (error) {
            var ex = new Error("[Validation][ERROR] Validation js file has not correct format [" + name + "]" +
                               "\n" + error.message);
            ex.code = "VALIDATOR_FILE_WRONG_FORMAT";
            throw ex;
        }
        
        // Validating arguments
        if (type !== "logical" && 
            (getCollection() === null || getCollection() === undefined)) { 
            setLastCheck(false); 
            error = new Error("[Validation][ERROR] No collection where to apply validation [" + name + "]");
            error.code = "WRONG_ARGS";
            throw error;
        }
        
        if (type === "value" && 
            (getProperties() === null || getProperties() === undefined)) {
            setLastCheck(false); 
            error = new Error("[Validation][ERROR] No enough properties to validate [" + name + "]");
            error.code = "WRONG_ARGS";
            throw error;
		}
        
		if (getEnabled() === false) { 
            console.log("[Validation][WARNING] validation not enabled [" + name + "]");
			setLastCheck(true); 
            return true;
		}

        
        var data;
            
        // Building arguments for logical validation
        if (type === "logical") {

            // Building data for logical validations
            data = { "db": getDb()
                   , "validations" : getParameters().validations
                   , "register" : register
                   };
                   
            // Loading validation js file and check validation
            updateLastCheck(validator.check(data));
            
        } 
        
        var currentCheck,
            copyOfRegister,
            property,
            keys,
            i;
        
        // Building arguments for dbQuery validation
        if (type === "dbQuery") {
            
            // Extracting values of properties of register
            i = 0;
            var filters = {};
            while (i < getProperties().length) {
                
                copyOfRegister = register;     // Clonning register
                property = getProperties()[i]; // All properties
                keys = property.split('.');    // Converting key to array
                keys.forEach(                               
                    function(k) {
                        copyOfRegister = copyOfRegister[k];
                    }
                );
                
                // Adding new filter
                filters[property] = copyOfRegister;
                
                i++;
            }
            
            // Building data for logical validations
            data = { "db": getDb()
                   , "collection" : getCollection()
                   , "filters" : filters
                   };
                   
            // Loading validation js file and check validation
            updateLastCheck(validator.check(data));
            
        }
        
        // Building arguments for value validation
        if (type === "value") {
            
            // Checking each property. If anyone doesn't pass constraint, error.
            i = 0;
            while (i < getProperties().length) {
                
                copyOfRegister = register;              // Clonning register
                keys = getProperties()[i].split('.');   // Converting key to array
                keys.forEach(                               
                    function(k) {
                        copyOfRegister = copyOfRegister[k];
                    }
                );
                
                // Building data for NON logical validations
                data = { "db": getDb()
                       , "collection" : getCollection()
                       , "properties" : getProperties()
                       , "value" : copyOfRegister
                       , "parameters" : getParameters()
                       , "checks" : []
                       };
                     
                // Loading validation js file and check validation
                currentCheck = validator.check(data);
                updateLastCheck(currentCheck);
        
                console.log("["+ name + "] Property: " + getProperties()[i] + " - Value: " + copyOfRegister + " - Current Check: " + currentCheck);
                i++;
            }
        }
        
		return getLastCheck();
	};


	// ___ Returning ___________________________________________________________

	return { "getCollection" : getCollection
           , "getProperties" : getProperties
           , "getName" : getName
           , "getEnabled" : getEnabled
           , "setEnabled" : setEnable
           , "setDisabled" : setDisable
           , "check" : check
           , "getLastCheck" : getLastCheck
           };
}


module.exports = Validation;
