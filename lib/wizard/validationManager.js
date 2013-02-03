var validationManager = function() {

	/*___ Constants ____________________________________ */

	var APP_NAME = "Validation Manager";
	var APP_VERSION = "1.0";
	var DBTYPE = "Mongo";

	// Dafault values
	var DEFAULT_IP = "localhost";
	var DEFAULT_PORT = 3333;
	var DEFAULT_COLLECTION = "validations";

	// Groups of validation types
	var GROUPS   = [ "logical", "query", "valueWithoutParams", "valueWithParams" ];
	var LOGICAL  = [ "and", "or", "not" ];
	var QUERY    = [ "exists" ];
	var VALUE_WITHOUT_PARAMS = [ "isDefined", "isNull", "isNumber" ];
	var VALUE_WITH_PARAMS    = [];

	// Messages
	var color = require("./color.js");
	var HEADER_0 = color.bold + APP_NAME + " v" + APP_VERSION + color.reset + color.gray + " - Green Box Software (www.greenboxsoftware.com)" + color.reset;
	var HEADER_1 = color.gray + "Your new validation is " + color.bold + "cooking" + color.reset + "...   ";
	var HEADER_2 = color.gray + "Your validation is " + color.bold + "finished" + color.reset;
	var HEADER_3 = color.gray + "Thanks for use " + color.bold + APP_NAME + color.reset + ". Bye!" + "\n" + color.reset;
	var HEADER_4 = color.gray + "Your validation: " + color.reset;

	var QUESTION_1 = color.gray + "\t" + "> Do you want add any validation else? [y/n] " + color.reset;
	var QUESTION_2 = color.gray + "\t" + "> Your validation is " + color.bold + "finished" + color.reset + ". Do you want to save it? [y|n] ";
	var QUESTION_3 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Collection Name" + color.reset + " where you want to apply your new validation: ";


	/*___ Properties ___________________________________ */

	var tool = require('./tools.js');
	var validation = { "type"        : null 
					 , "description" : ""
					 , "collection"  : null
					 , "properties"  : []
					 , "validations" : []
					 , "parameters"  : {}
					 };
	var resetedValidation = tool.clone(validation);
	var depthLevel  = 0;
	var currentStep = 'createValidation';
	var completed   = false;


	/*___ Private Methods ______________________________ */

	var getWizard = function() {

		var wizard = require('readline').createInterface({
					input: process.stdin,
					output: process.stdout
				});
		wizard.on('line', steps);

		return wizard;
	}

	var closeWizard = function(wizard) {

		wizard.removeListener('line', steps);
		wizard.close();
	}

	// Displaying Header
	var showHeader = function() {

		console.log(color.clear + color.reset + HEADER_0);
		console.log(HEADER_1 + validation.description + "\n\n");
	}

	// Getting group of type of validation
	var getGroup = function(type) {

		if (type === undefined || type === null) type = validation.type;

		var group = "unknown";
		if (LOGICAL.indexOf(type) !== -1)			   group = "logical";	
		if (VALUE_WITHOUT_PARAMS.indexOf(type) !== -1) group = "valueWithoutParams";
		if (VALUE_WITH_PARAMS.indexOf(type) !== -1)	   group = "valueWithParams";
		if (QUERY.indexOf(type) !== -1) 			   group = "query";

		return group;
	}

	// Getting validation status [complete|uncomplete|extensible]
	var getStatus = function(v) {

		// Default value (for non-logic validations)
		var status = 'complete';
		var lastChar = '';		

		var group = getGroup(v.type);
		if (group === "logical") {
			var len = parseInt(v.validations.length);
			if (len === 0) {
				status = 'uncomplete';
				lastChar = '';
			} else {
				var subVal = getStatus(v.validations[len-1]);
				status     = subVal.status;
				lastChar   = subVal.lastChar;
				if (v.type === 'and' || v.type === 'or') {
					if (status === 'complete') {
						if (len < 2) {
							status   = 'uncomplete';
							lastChar = ',';
						} else {
							status   = 'extensible';
							lastChar = '';
						}
					}
				}
			}
		}
		validation.description += lastChar;

		// Setting next step
		var nextStep = "createValidation";
		if (status === 'complete') {
			completed = true;
			lastChar  = ']';
			nextStep  = "confirm";
		}
		if (status === 'extensible') nextStep = "askForMore";

		// Returning status object...
		return { "status"   : status
			   , "lastChar" : lastChar
			   , "nextStep" : nextStep 
			   }; 
	}

	// Assign validation to validation object in a correct depth level
	var assign = function(v) {

		if (depthLevel === 0) validation = tool.clone(v);

		if (depthLevel > 0){
		 	var copyOfValidation = validation;
		 	var i = 0;
		 	while (i < depthLevel) {
		 		var last = copyOfValidation.validations.length - 1;
		 		if (last > 0) {
			 		copyOfValidation = copyOfValidation.validations[last];
			 	}
		 		i++;
		 	}
		 	copyOfValidation.validations = copyOfValidation.validations.concat(v);
		}

		if (getGroup(v.type) === 'logical') { 
			depthLevel++;
		}
		validate(validation);
	}

	// Validate validation
	var validate = function(v) {

			if (v === undefined) v = validation;
			var valStatus = getStatus(v);
			currentStep = valStatus.nextStep;
			steps();
	}

	// Reseting object
	var reset = function() {
		validation = resetedValidation;
		depthLevel  = 0;
		currentStep = 'createValidation';
	}

	/*___ Wizard Steps ____________________________________ */

	// Step Zero: Create a new validation
	var createValidation = function() {

		var validationWizard = require('./validationWizard.js');
		var vw = new validationWizard(validation.description, depthLevel);
		vw.wizard.on('line', vw.steps);
		vw.wizard.on('close', function(){ 
						if (vw.level === depthLevel) {
							validation.description += vw.validation.description;
							assign(vw.validation);
						}
					  });
		vw.init();
	}

	// Step Two: Ask for more subvalidations
	var askForMore = function() {

		wizard = getWizard();
		wizard.question(QUESTION_1, function(answer) {
			if (answer === 'y' || answer === 'n') {
				if (answer === 'y') {
					if (completed === false) {			// 'y' ... After confirm validation. New validation!
						reset();
					} else {							// 'y' ... Creating new subvalidtion
						validation.description += ',';
					}
					currentStep = "createValidation";
					steps();
				} else {	
					if (completed === false) {			// 'n' ... After confirm validation. Bye!
						console.log(color.clear + "Bye");
					} else {							// 'n' ... Closing logical validation
						console.log(color.clear + "Bye2");
						validation.description += ']';
						currentStep = "confirm";
						steps();	
					}
				}	
  			} else {
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": I dont understand you. Can you repeat, please?");
  				tool.sleep(1);
  			}
  			wizard.close();
		});
	}

	// Final Step : Confirmation
	var confirm = function() {

		wizard = getWizard();
		wizard.question(QUESTION_2, function(answer) {
			if (answer === 'y' || answer === 'n') {
				if (answer === 'y') {
					console.log("\t" + color.gray + "Saving validation... " + color.bold + "TODO" + color.reset);
  					tool.sleep(1);
  					currentStep = "askForMore";
				} else {
	  				reset();
	  			}
	  			steps();
  			} else {
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": I dont understand you. Can you repeat, please?");
  				tool.sleep(1);
  			}
  			wizard.close();
		});
	}
	
	// Manages steps of wizard
	var steps = function() {

		console.log(color.clear + color.reset + HEADER_0);
		if (currentStep !== 'confirm') {
			console.log(HEADER_1 + validation.description + "\n");
		} else {
			console.log("\n\t" + HEADER_4 + validation.description + "\n");
		}

		console.log("Current Step: " + currentStep); tool.sleep(2);
		var Steps = { 'createValidation'  : createValidation 	// Step Zero:  Selecting validation Type
					, 'askForMore' 		  : askForMore			// Step Two:   Asking for more validations
					, 'confirm'			  : confirm				// Final Step: Confirmation
					};

		Steps[currentStep]();	// Executing current step
	}

	/*___ Exporting ____________________________________ */

	return { "init"       : createValidation
		   , "toString"   : toString
		   };
}

module.exports = validationManager;

var vm = new validationManager();
vm.init();