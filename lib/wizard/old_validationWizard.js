var validationWizard = function(description, parentWizard) {

	/*___ Constants ____________________________________ */

	var APP_NAME = "Validation Manager";
	var APP_VERSION = "1.0";
	var DBTYPE = "Mongo";

	var TYPES = { "and" : "Logic validation. You can check several validations at the same time"
				, "or"  : "Logic validation. You can check if at least one of several validations is true"
				, "not" : "Logic validation. The inverse of validation result"
				, "exists"    : "Db validation. Check if a register exists in a concrete collection"
				, "isDefined" : "Check if single element or each element of array is defined"
				, "isNull"    : "Check if single element or each element of array is null"
				, "isNumber"  : "Check if single element or each element of array is numeric"
			    };

	var GROUPS   = [ "logical", "query", "valueWithoutParms", "valueWithParms" ];
	var LOGICAL  = [ "and", "or", "not" ];
	var QUERY    = [ "exists" ];
	var VALUE_WITHOUT_PARMS = [ "isDefined", "isNull", "isNumber" ];
	var VALUE_WITH_PARMS    = [];

	var RESET 	   = '\u001b[0m';
	var BOLD 	   = '\u001b[1m';
	var RED   	   = '\u001b[31m';
	var REDBOLD    = '\u001b[31m\u001b[1m';
	var YELLOW 	   = '\u001b[33m';
	var YELLOWBOLD = '\u001b[33m\u001b[1m';
	var BLUE  	   = '\u001b[34m';
	var BLUEBOLD   = '\u001b[34m\u001b[1m';
	var GRAY 	   = '\u001b[37m';
	var CLEAR 	   = '\u001B[2J\u001B[0;0f';

	var DEFAULT_IP = "localhost";
	var DEFAULT_PORT = 3333;
	var DEFAULT_COLLECTION = "validations";
	var FINAL_STEP = 6;		// <----------------------------- INCREASE IT IF YOU ADD NEW STEPS!!

	var HEADER_0 = BOLD + APP_NAME + " v" + APP_VERSION + RESET + GRAY + " - Green Box Software (www.greenboxsoftware.com)" + RESET;
	var HEADER_1 = GRAY + "Your new validation is " + BOLD + "cooking" + RESET + "...   ";
	var HEADER_2 = GRAY + "Your validation is " + BOLD + "finished" + RESET;
	var HEADER_3 = GRAY + "Thanks for use " + BOLD + APP_NAME + RESET + ". Bye!" + "\n" + RESET;

	var VALINFO_0 = "\t" + "- " + BOLD + "Type: " + RESET;
	var VALINFO_1 = "\t" + "- " + BOLD + "Collection: " + RESET;
	var VALINFO_2 = "\t" + "- " + BOLD + "Properties: " + RESET;

	var QUESTION_0a = GRAY + "\t" + "> Select a validation type: " + RESET;
	var QUESTION_0b = GRAY + "\t" + "> Select a validation type for this subvalidation: " + RESET;
	var QUESTION_1  = GRAY + "\t" + "> Do you want add any validation else? [y/n] " + RESET;
	var QUESTION_2  = GRAY + "\t" + "> Your (sub)validation is " + BOLD + " finished" + RESET + ". Do you want to save it? [y|n] ";
	var QUESTION_3a = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Collection Name" + RESET + " where you want to apply your new validation: ";
	var QUESTION_3b = GRAY + "\t" + "> Insert " + DBTYPE + BLUEBOLD + " Collection Name" + RESET + " where you want to look for your register: ";
	var QUESTION_4a = GRAY + "\t" + "> Insert yours " + DBTYPE + BLUEBOLD + " Property Names" + RESET + ", separated by commas, to validate: ";
	var QUESTION_4b = GRAY + "\t" + "> Insert " + DBTYPE + BLUEBOLD + " Primary Keys " + RESET + "names , separated by commas, by look for: ";

	/*___ Properties ___________________________________ */

	var currentStep = 0;

	var validation = { "type"        : null 
					 , "description" : ""
					 , "collection"  : null
					 , "properties"  : []
					 , "parameters"  : { "validations" : [] }
					 };
	var group;
	var nSubVals   = 0;
	var minSubVals = 1;

	// Setting parent description
	var parentDescription = "";
	if (description !== null && description !== undefined) {
		parentDescription = description;
	}

	var utils  = require('./utils.js');
	var wizard = parentWizard;
	if (wizard === null || wizard === undefined) {
		wizard = require('readline').createInterface({
					input: process.stdin,
					output: process.stdout
				});
	}


	/*___ Private Methods ______________________________ */

	var showHeader = function() {

		console.log(CLEAR + RESET + HEADER_0);
		console.log(HEADER_1 + parentDescription + validation.description + "\n\n");
		if (currentStep > 0 && currentStep < 4) console.log(VALINFO_0 + validation.type);
		if (currentStep > 1 && currentStep < 4) console.log(VALINFO_1 + validation.collection);	
		if (currentStep > 2 && currentStep < 4) console.log(VALINFO_2 + validation.properties);
	}

	var closeDescription = function() {
		if (group === "valueWithoutParms" || group === "query") {
			validation.description += "]";
		}
		if (group === "valueWithParms") {
			validation.description += ", ";
		}
	}


	/*___ Wizard Steps ____________________________________ */

	// Step Zero: see public methods

	// Step One: Inserting collection name where apply validation
	var setCollection = function() {

		var question = QUESTION_3a;
		if (group === "query") question = QUESTION_3b;

		wizard.question(question, function(answer) {
			if (answer !== "") {
  				validation.collection = answer.replace(" ","");
  				validation.description = validation.description + BOLD + validation.collection + RESET + "(";
  				currentStep++;
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": You need a collection where apply your validation");
  				utils.sleep(1);
  			}
  			wizard.emit('line');	
		});
	}

	// Step Two: Inserting properties to validate
	var setProperties = function() {

		var question = QUESTION_4a;
		if (group === "query") question = QUESTION_4b;

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
  				
  			if (validation.properties.length === 0) {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": You need any property to validate");
  				utils.sleep(1);
  			} else {
  				if (repeats === true) {
					console.log("\t" + YELLOWBOLD + "Warning" + RESET + GRAY + ": Repeated elements has been removed");
						utils.sleep(1);
				}

				// Updating description
				validation.description += validation.properties + ")";
				closeDescription();
  				currentStep++;
  			}
  			wizard.emit('line');	
		});
	}

	// Final Step : Confirmation
	var confirm = function() {

		if (parentDescription === "") {
			wizard.question(QUESTION_2, function(answer) {
				if (answer === "y" || answer === "n") {
					if (answer === "y") {
						console.log("\t" + GRAY + "Saving validation... " + BOLD + "TODO" + RESET);
	  					utils.sleep(2);
	  					currentStep = FINAL_STEP;
					} else {
		  				validation = { "type"        : null 
									 , "description" : ""
									 , "collection"  : null
									 , "properties"  : []
									 , "parameters"  : { "validations" : [] }
									 };
		  				currentStep = 0;
		  			}
	  			} else {
	  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": I dont understand you. Can you repeat, please?");
	  				utils.sleep(1);
	  			}
	  			wizard.emit('line');
			});
		} else {
			currentStep = FINAL_STEP;
			wizard.emit('line');
		}
	}

	// Create subvalidations for logic validations 'and', 'or', 'not'...
	var createSubvalidation = function() {

		wizard.removeListener('line', steps); // Unbinding events

		var subDescription = parentDescription + validation.description
		var subWizard = wizard;
		var subVw = new validationWizard(subDescription, subWizard);
		subVw.wizard.on('line', subVw.steps);
		subVw.wizard.on('close', function() {

			// Assigning subvalidation and updating description
			validation.parameters.validations.concat(subVw.validation);
			validation.description += subVw.validation.description;

			nSubVals++;
			if (validation.type !== "not") {
				if (nSubVals >= minSubVals) {
					currentStep++;	// Ask for more subvalidations
				} else {
					validation.description += ',';
				}
			} else {
				validation.description += ']';
				currentStep = 3;	// Send to confirm
			}
			
			wizard.on('line', steps);	// Binding event
			wizard.emit('line');
		});
		subVw.init();
	}

	// Ask for more Validations
	var askForMore = function() {
		wizard.question(QUESTION_1, function(answer) {
			if (answer === "y" || answer === "n") {
				if (answer === 'y') {
					validation.description += ',';
					currentStep = 4;	// Send to more subvalidations
				} else {
					validation.description += ']';
					currentStep = 3;	// Send to confirm
				}	
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": I dont understand you. Can you repeat, please?");
  				utils.sleep(1);
  			}
  			wizard.emit('line');
		});
	}

	/*___ Public Methods _______________________________ */

	// Step Zero: Selecting validation Type
	var setValidationType = function() {

		// Showing validations types
		showHeader();
		console.log("\t" + RESET + GRAY + "What kind of validation do you prefer?" + "\n" + RESET);
		var i = 0;
		var typesArray = [];
		Object.keys(TYPES).forEach(
			function(key) {
				var valDesc = TYPES[key];
				typesArray = typesArray.concat(key);
				console.log("\t\t" + BOLD + "[" + i + "]" + RESET + " - " + YELLOWBOLD + key.toUpperCase() + RESET + ": " + valDesc);
				i++;
			}
		);
		var VAL_TYPES_MAX = i;

		// Asking for type selection
		var question = QUESTION_0a;
		if (parentDescription !== "") question = QUESTION_0b;

		wizard.question("\n" + question, function(answer) {

			if (isNaN(answer) === false && answer >= 0 && answer < VAL_TYPES_MAX) {
				validation.type = typesArray[answer];
				validation.description = validation.description + BLUEBOLD + validation.type.toUpperCase() + RESET + "[";

				if (LOGICAL.indexOf(validation.type) !== -1) { 
					group = "logical";
					currentStep = 4;	// Send to create subvalidation

					// Setting minimun number of subvalidations
					if (validation.type !== "not") minSubVals = 2;
				} 

				if (VALUE_WITHOUT_PARMS.indexOf(validation.type) !== -1) { 
					group = "valueWithoutParms";
					currentStep++;
				} 

				if (VALUE_WITH_PARMS.indexOf(validation.type) !== -1) { 
					group = "valueWithParms";
					currentStep++;
				} 

				if (QUERY.indexOf(validation.type) !== -1) {
					group = "query";
					currentStep++;
				}

  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": Invalid option");
  				utils.sleep(1);
  			}

  			wizard.emit('line');
		});
	}

	var steps = function() {

		showHeader();
		var Steps = [ setValidationType 	// Selecting validation Type
					, setCollection			// Inserting collection name where apply validation
					, setProperties			// Inserting properties to validate
					, confirm				// Confirmation
					, createSubvalidation	// Create subvalidations of logic validations
					, askForMore
					];

		if (currentStep === FINAL_STEP) {
			wizard.close();
		} else {
			Steps[currentStep]();
		}
	}

	var toString = function() {
		return "Validation description: " + parentDescription + validation.description;
	}

	/*___ Exporting ____________________________________ */

	return { "init"       : setValidationType
		   , "steps"      : steps
		   , "wizard"     : wizard 
		   , "validation" : validation
		   , "toString"   : toString
		   };
}

module.exports = validationWizard;

var CLEAR = '\u001B[2J\u001B[0;0f';
var vw = new validationWizard();
vw.wizard.on('line', vw.steps);

vw.init();



