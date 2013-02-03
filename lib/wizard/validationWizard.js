var validationWizard = function(parentDescription, level) {

	/*___ Constants ____________________________________ */

	var APP_NAME = "Validation Manager";
	var APP_VERSION = "1.0";
	var DBTYPE = "Mongo";

	// Validation types and groups
	var TYPES = { "and" : "Logic validation. You can check several validations at the same time"
				, "or"  : "Logic validation. You can check if at least one of several validations is true"
				, "not" : "Logic validation. The inverse of validation result"
				, "exists"    : "Db validation. Check if a register exists in a concrete collection"
				, "isDefined" : "Check if single element or each element of array is defined"
				, "isNull"    : "Check if single element or each element of array is null"
				, "isNumber"  : "Check if single element or each element of array is numeric"
			    };
	var GROUPS   = [ "logical", "query", "valueWithoutParams", "valueWithParams" ];
	var LOGICAL  = [ "and", "or", "not" ];
	var QUERY    = [ "exists" ];
	var VALUE_WITHOUT_PARAMS = [ "isDefined", "isNull", "isNumber" ];
	var VALUE_WITH_PARAMS    = [];

	// Messages
	var color = require("./color.js");
	var HEADER_0 = color.bold + APP_NAME + " v" + APP_VERSION + color.reset + color.gray + " - Green Box Software (www.greenboxsoftware.com)" + color.reset;
	var HEADER_1 = color.gray + "Your new validation is " + color.bold + "cooking" + color.reset + "...   ";
	var HEADER_2 = color.gray + "What kind of validation do you prefer? \n" + color.reset;

	var VALINFO_0 = "\t" + "- " + color.bold + "Type: " + color.reset;
	var VALINFO_1 = "\t" + "- " + color.bold + "Collection: " + color.reset;
	var VALINFO_2 = "\t" + "- " + color.bold + "Properties: " + color.reset;

	var QUESTION_0 = color.gray + "\t" + "> Select a validation type: " + color.reset;
	var QUESTION_1 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Collection Name" + color.reset + " where you want to apply your new validation: ";
	var QUESTION_2 = color.gray + "\t" + "> Insert " + DBTYPE + color.blueBold + " Collection Name" + color.reset + " where you want to look for your register: ";
	var QUESTION_3 = color.gray + "\t" + "> Insert yours " + DBTYPE + color.blueBold + " Property Names" + color.reset + ", separated by commas, to validate: ";
	var QUESTION_4 = color.gray + "\t" + "> Insert " + DBTYPE + color.blueBold + " Primary Keys " + color.reset + "names , separated by commas, by look for: ";


	/*___ Properties ___________________________________ */

	var level = level;
	var validation = { "type"        : null 
					 , "description" : ""
					 , "collection"  : null
					 , "properties"  : []
					 , "validations" : []
					 , "parameters"  : {}
					 };
	var currentStep = 'setValidationType';
	var tool   = require('./tools.js');
	var wizard = require('readline').createInterface({
					input: process.stdin,
					output: process.stdout
				});



	/*___ Private Methods ______________________________ */

	// Getting group of type of validation
	var getGroup = function() {

		var group = "unknown";
		if (LOGICAL.indexOf(validation.type) !== -1)			  group = "logical";	
		if (VALUE_WITHOUT_PARAMS.indexOf(validation.type) !== -1) group = "valueWithoutParams";
		if (VALUE_WITH_PARAMS.indexOf(validation.type) !== -1) 	  group = "valueWithParams";
		if (QUERY.indexOf(validation.type) !== -1) 				  group = "query";

		return group;
	}


	/*___ Wizard Steps ____________________________________ */

	// Step Zero: see public methods

	// Step One: Inserting collection name where apply validation
	var setCollection = function() {

		// Showing validation type
		console.log(VALINFO_0 + validation.type);

		// Choosing question to ask, by group
		var group = getGroup();
		var question = QUESTION_1;
		if (group === "query") question = QUESTION_2;

		// Asking question
		wizard.question(question, function(answer) {
			if (answer !== "") {
  				validation.collection = answer.replace(" ","");
  				validation.description += color.bold + validation.collection + color.reset + "(";
  				currentStep = "setProperties";
  			} else {
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": You need a collection where apply your validation");
  				tool.sleep(1);
  			}
  			wizard.emit('line');	
		});
	}

	// Step Two: Inserting properties to validate
	var setProperties = function() {

		// Displaying info
		console.log(VALINFO_0 + validation.type);		// Showing validation type
		console.log(VALINFO_1 + validation.collection);	// Showing collection

		// Choosing question to ask, by group
		var group = getGroup();
		var question = QUESTION_3;
		if (group === "query") question = QUESTION_4;

		// Asking question
		wizard.question(question, function(answer) {
	
			// Cleaning properties (removing repeats, blanks... etc)
			var repeats = false;
			answer.split(',').forEach(function(v) {
				v = v.trim();
				if (v !== null && v !== "") {
					if (validation.properties.indexOf(v) === -1) {
						validation.properties = validation.properties.concat(v);
					} else {
						repeats = true;
					}
				}
			});
  			
  			// Checking if any property has been added
  			if (validation.properties.length === 0) {
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": You need any property to validate");
  				tool.sleep(1);
  				wizard.emit('line');	
  			} else {
  				if (repeats === true) {
					console.log("\t" + color.yellowBold + "Warning" + color.reset + color.gray + ": Repeated elements has been removed");
						tool.sleep(1);
				}

				// Updating description
				validation.description += validation.properties + ')';
				if (group === "valueWithParams")	validation.description += ',';
				if (group === "valueWithoutParams") validation.description += ']';
				if (group === "query") 				validation.description += ']';
				wizard.removeListener('line',steps);
				wizard.close();
  			}
		});
	}


	/*___ Public Methods _______________________________ */

	// Step Zero: Selecting validation Type
	var setValidationType = function() {

		// Displaying header
		console.log(color.clear + color.reset + HEADER_0);
		console.log(HEADER_1 + parentDescription + validation.description + "\n\n");
		console.log("\t" + color.reset + color.gray + HEADER_2 + color.reset);

		// Showing validations types
		var i = 0;
		var typesArray = [];
		Object.keys(TYPES).forEach(
			function(key) {
				var valDesc = TYPES[key];
				typesArray = typesArray.concat(key);
				console.log("\t\t" + color.bold + "[" + i + "]" + color.reset + " - " + color.yellowBold + key.toUpperCase() + color.reset + ": " + valDesc);
				i++;
			}
		);
		var VAL_TYPES_MAX = i;

		// Asking for type selection
		wizard.question("\n" + QUESTION_0, function(answer) {

			answer = parseInt(answer.trim());
			if (answer >= 0 && answer < VAL_TYPES_MAX) {
				validation.type = typesArray[answer];
				validation.description += color.blueBold + validation.type.toUpperCase() + color.reset + "[";
				if ( getGroup() !== "logical" ) {
					currentStep = "setCollection";
					wizard.emit('line');
				} else {
					wizard.removeListener('line',steps);
					wizard.close();
				}

  			} else {
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": Invalid option");
  				tool.sleep(1);
  				wizard.emit('line');
  			}
		});
	}

	// Manages steps to run in every validation creation
	var steps = function() {
		
		console.log(color.clear + color.reset + HEADER_0);
		console.log(HEADER_1 + parentDescription + validation.description + "\n");

		var Steps = { 'setValidationType' : setValidationType 	// Selecting validation Type
					, 'setCollection' 	  : setCollection		// Inserting collection name where apply validation
					, 'setProperties' 	  : setProperties		// Inserting properties to validate
					};

		Steps[currentStep]();	// Executing current step
	}

	/*___ Exporting ____________________________________ */

	return { "init"       : setValidationType
		   , "validation" : validation
		   , "wizard"     : wizard
		   , "steps"	  : steps
		   , "level"	  : level
		   };
}

module.exports = validationWizard;

/*
var vw = new validationWizard("PRE[");
var closeCb = function() {
	console.log("Validation: " +  JSON.stringify(vw.validation));
};
vw.wizard.on('line', vw.steps);
vw.wizard.on('close', closeCb);

vw.init();
*/