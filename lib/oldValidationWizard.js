var validationWizard = function() {

	/*___ Constants ____________________________________ */

	var DBTYPE = "Mongo";

	var RESET 	   = '\u001b[0m';
	var BOLD 	   = '\u001b[1m';
	var UNDERLINE  = '\u001b[4m';
	var UNDERBOLD  = '\u001b[1m\u001b[4m';
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
	var PORT_MIN = 0;
	var PORT_MAX = 65535;
	var MAIN_OPTIONS_MAX = 5;
	var VAL_TYPES_MAX = 8;
	var LAST_STEP = 14;

	var HEADER_0 = BOLD + "Validation Wizard v1.0 " + RESET + GRAY + "- Green Box Software (www.greenboxsoftware.com)" + RESET;
	var HEADER_1 = GRAY + "To manage validations in your Mongo db I need connections data" + "\n" + RESET;
	var HEADER_2 = GRAY + "Your validation is finished. " + RESET;
	var HEADER_3 = GRAY + "Thanks for use Validation Wizard. Bye!" + "\n" + RESET;
	var HEADER_4 = GRAY + "Your " + BOLD + "new validation" + RESET + " is cooking... " + RESET;

	var DBINFO_0 = "\t" + "- " + BOLD + "Server Ip: " + RESET;
	var DBINFO_1 = "\t" + "- " + BOLD + "Server Port: " + RESET;
	var DBINFO_2 = "\t" + "- " + BOLD + "User Name: " + RESET;
	var DBINFO_3 = "\t" + "- " + BOLD + "Password: " + RESET;
	var DBINFO_4 = "\t" + "- " + BOLD + "Database: " + RESET;
	var DBINFO_5 = "\t" + "- " + BOLD + "Validations collection: " + RESET;

	var VALTYPES  = [ "and", "or", "not", "isDefined","isNull","isNumber","exists"];

	var VALINFO_0 = "\t" + "- " + BOLD + "Type: " + RESET;
	var VALINFO_1 = "\t" + "- " + BOLD + "Collection: " + RESET;
	var VALINFO_2 = "\t" + "- " + BOLD + "Properties: " + RESET;

	var QUESTION_0 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Server Ip" + RESET + " [default:" + DEFAULT_IP + "]: ";
	var QUESTION_1 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Server Port" + RESET + " [default:" + DEFAULT_PORT + "]: ";
	var QUESTION_2 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " User" + RESET + ": ";
	var QUESTION_3 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Password" + RESET + ": ";
	var QUESTION_4 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Database Name" + RESET + ": ";
	var QUESTION_5 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Collection Name" + RESET + " where you want to save your validations [default:" + DEFAULT_COLLECTION + "]: ";
	var QUESTION_6 = GRAY + "\t" + "> Select a option: " + RESET;
	var QUESTION_7 = GRAY + "\t" + "> Select a validation type: " + RESET;
	var QUESTION_8 = GRAY + "\t" + "> Do you want add any validation else? [y/n] " + RESET;
	var QUESTION_9 = GRAY + "\t" + "> Your validation is " + BOLD + " finished" + RESET + ". Do you want to save it? [y|n] ";
	var QUESTION_10 = GRAY + "\t" + "> Insert your " + DBTYPE + BLUEBOLD + " Collection Name" + RESET + " where you want to apply your new validation: ";
	var QUESTION_11 = GRAY + "\t" + "> Insert yours " + DBTYPE + BLUEBOLD + " Property Names" + RESET + ", separated by commas, to validate: ";

	var OPTIONS_0 = "\t"   + RESET + GRAY + "What do you want to make?" + "\n\n" + RESET +
					"\t\t" + BOLD + "[1]" + RESET + GRAY + "- Add a new Validation" + "\n" + RESET +
					"\t\t" + BOLD + "[2]" + RESET + GRAY + "- List all Validations" + "\n" + RESET +
					"\t\t" + BOLD + "[3]" + RESET + GRAY + "- Remove a validation" + "\n" + RESET +
					"\t\t" + BOLD + "[4]" + RESET + GRAY + "- Exit" + "\n" + RESET;

	var OPTIONS_1 = "\t"   + RESET + GRAY + "What kind of validation do you prefer?" + "\n\n" + RESET +
					"\t\t" + BOLD + "[1]" + RESET + " - " + YELLOWBOLD + " AND" + RESET + ": Logic validation. You can check several validations at the same time" + "\n" +
					"\t\t" + BOLD + "[2]" + RESET + " - " + YELLOWBOLD + " OR"  + RESET + ": Logic validation. You can check if at least one of several validations is true" + "\n" +
					"\t\t" + BOLD + "[3]" + RESET + " - " + YELLOWBOLD + " NOT" + RESET + ": Logic validation. The inverse of validation result" + "\n" +
					"\t\t" + BOLD + "[4]" + RESET + " - " + YELLOWBOLD + " ISDEFINED" + RESET + ": Check if single element or each element of array is defined" + "\n" +
					"\t\t" + BOLD + "[5]" + RESET + " - " + YELLOWBOLD + " ISNULL"    + RESET + ": Check if single element or each element of array is null" + "\n" +
					"\t\t" + BOLD + "[6]" + RESET + " - " + YELLOWBOLD + " ISNUMBER"  + RESET + ": Check if single element or each element of array is numeric" + "\n" +
					"\t\t" + BOLD + "[7]" + RESET + " - " + YELLOWBOLD + " EXISTS" 	+ RESET + ": Db validation. Check if a register exists in a concrete collection" + "\n";

	/*___ Properties ___________________________________ */

	var currentStep = 0;
	var screenText;
	var dbConnection;

	var validation = { "db":{ "server"	   : DEFAULT_IP
							, "port"       : DEFAULT_PORT
							, "user"       : null
							, "password"   : null
							, "dbname"     : "gbTest"
							, "collection" : DEFAULT_COLLECTION
							, "completed"  : false
							}
					 , "type"        : null 
					 , "description" : ""
					 , "collection"  : null
					 , "properties"  : []
					 , "isLogical"   : false
					 , "completed"   :false
					 };
	var valReseted = validation;

	var wizard = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});

	/*___ Private Methods ______________________________ */

	// 'Sleep' emulator
	var sleep = function(seconds) {
		var now = new Date().getTime();
		var milliseconds = seconds * 1000;
		while (new Date().getTime() < now + milliseconds) {}
	}

	// Validating Ip format
	var validateIp = function(ip) {

		var octects = ip.split(".");
		if (octects.length !== 4) return false;

		var i = 0,
			valid = true;
		while (valid && i < octects.length)	{
			var octect = octects[i];
			if (isNaN(octect) || octect < 0 || octect > 255) {
				valid = false;
			}
			i++;
		}

		return valid;
	}

	// Validating port
	var validatePort = function(port) {

		var parts = port.split(".");
		if (parts.length !== 1) return false;

		if (isNaN(port) || port === "" || port < PORT_MIN || port > PORT_MAX) 
			return false

		return true;
	}

	var showHeader = function() {

		console.log(CLEAR + RESET + HEADER_0);
		if (validation.db.completed === false) {
			console.log(HEADER_1 + GRAY + "\n" + RESET);
			if (currentStep > 0) console.log(DBINFO_0 + validation.db.server);
			if (currentStep > 1) console.log(DBINFO_1 + validation.db.port);
			if (currentStep > 2) console.log(DBINFO_2 + validation.db.user);
			if (currentStep > 3) console.log(DBINFO_3 + validation.db.password);
			if (currentStep > 4) console.log(DBINFO_4 + validation.db.dbname);
			if (currentStep > 5) console.log(DBINFO_5 + validation.db.collection + "\n");
		} 

		if (validation.db.completed === true && validation.completed === false) {
			console.log(HEADER_4 + validation.description + "\n\n");
			if (currentStep > 10) console.log(VALINFO_0 + validation.type);
			if (currentStep > 11) console.log(VALINFO_1 + validation.collection);	
			if (currentStep > 12) console.log(VALINFO_2 + validation.properties);
		}
	}

	/*___ Wizard Steps ____________________________________ */

	// Saving Mongo server Ip
	var stepZero = function() {

		showHeader();
		wizard.question(QUESTION_0, function(answer) {

			if (answer !== "" ) {
				if (validateIp(answer) === true) {
	  				validation.db.server = answer.replace(" ","");
	  				currentStep++;
	  			} else {
	  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": Wrong ip format");
	  				sleep(1);
	  			}
	  		} else {
	  			currentStep++;
	  		}
  			wizard.emit('line');
		});
	}

	// Saving Mongo server port
	var stepOne = function() {

		wizard.question(QUESTION_1, function(answer) {

			if (answer !== "" ) {
				if (validatePort(answer) === true) {
	  				validation.db.port = answer.replace(" ","");
	  				currentStep++;
	  			} else {
	  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": Wrong port format");
	  				sleep(1);
	  			}
  			} else {
	  			currentStep++;
	  		}
  			wizard.emit('line');	
		});
	}

	// Saving User name
	var stepTwo = function() {

		wizard.question(QUESTION_2, function(answer) {
  			validation.db.user = answer;
  			currentStep++;
  			wizard.emit('line');	
		});
	}

	// Saving Password
	var stepThree = function() {
		
		wizard.question(QUESTION_3, function(answer) {
  			validation.db.password = answer;
  			currentStep++;
  			wizard.emit('line');	
		});
	}

	// Saving DB name
	var stepFour = function() {

		wizard.question(QUESTION_4, function(answer) {
			if (answer !== "") {
  				validation.db.dbname = answer.replace(" ","");
  				currentStep++;
  			} else {
  				currentStep++; // TODO: ONLY FOR TESTS. REMOVE THIS LINE
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": DB name can no be null");
  				sleep(1);
  			}
  			wizard.emit('line');	
		});
	}

	// Saving validation collection
	var stepFive = function() {

		wizard.question(QUESTION_5, function(answer) {
			validation.db.collection = "validations";
			if (answer !== "") {
  				validation.db.collection = answer;
  			}
  			currentStep++;
  			wizard.emit('line');

		});
	}

	// Step to Select main option
	var stepSix = function() {

		console.log(OPTIONS_0);
		wizard.question(QUESTION_6, function(answer) {
			if (isNaN(answer) === false && answer > 0 && answer < MAIN_OPTIONS_MAX) {
				currentStep = parseInt(answer) + 6;
				validation.db.completed = true;
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": Invalid option");
  				sleep(1);
  			}
  			wizard.emit('line');

		});
	}

	// Step to Add a new validation: Selecting validation Type
	var stepSeven = function() {

		console.log(OPTIONS_1);
		wizard.question(QUESTION_7, function(answer) {

			if (isNaN(answer) === false && answer > 0 && answer < VAL_TYPES_MAX) {
				validation.type = VALTYPES[parseInt(answer) - 1];
				validation.description = validation.description + validation.type + "(";
				if (answer > 3) { 
					validation.isLogical = false;
					currentStep = 11;
				} else { 
					validation.isLogical = true;
					console.log ("This option is in development. Try another one...");
					sleep(1);
				}
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": Invalid option");
  				sleep(1);
  			}
  			wizard.emit('line');

		});
	}

	// Step to Get every validations
	var stepEight = function() {

		console.log("Getting each Validation");
	}

	// Step to Remove a validation
	var stepNine = function() {

		console.log("Removing validation");
	}

	// Exit
	var stepTen = function() {
		console.log(CLEAR + HEADER_3);
		wizard.emit('close');
	}

	// Inserting collection name where apply validation
	var stepEleven = function() {
		wizard.question(QUESTION_10, function(answer) {
			if (answer !== "") {
  				validation.collection = answer.replace(" ","");
  				currentStep++;
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": You need a collection where apply your validation");
  				sleep(1);
  			}
  			wizard.emit('line');	
		});
	}

	// Inserting properties to validate
	var stepTwelve = function() {

		wizard.question(QUESTION_11, function(answer) {
	
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
  				sleep(1);
  			} else {
  				if (repeats === true) {
					console.log("\t" + YELLOWBOLD + "Warning" + RESET + GRAY + ": Repeated elements has been removed");
						sleep(1);
				}
				validation.description = validation.description + validation.properties + ")";
  				currentStep++;
  			}
  			wizard.emit('line');	
		});
	}

	// Proceeding with new validation insertion
	var stepThirteen = function() {
		wizard.question(QUESTION_9, function(answer) {
			if (answer === "y" || answer === "n") {
				if (answer === "y") {
					console.log("\t" + GRAY + "Saving validation... " + BOLD + "TODO" + RESET);
  					sleep(2);
				}
  				validation = valReseted;
  				currentStep = 6;
  			} else {
  				console.log("\t" + REDBOLD + "Error" + RESET + GRAY + ": I dont understand you. Can you repeat, please?");
  				sleep(1);
  			}
  			wizard.emit('line');
		});
	}




	/*___ Public Methods _______________________________ */

	var start = function() {

		showHeader();
		var Steps = [ stepZero 		// Saving Mongo server Ip
					, stepOne		// Saving Mongo server port
					, stepTwo		// Saving User name
					, stepThree		// Saving Password
					, stepFour		// Saving DB name
					, stepFive		// Saving validation collection
					, stepSix		// Selecting main option
					, stepSeven		// Selecting validation Type
					, stepEight		// Gettting every validations
					, stepNine		// Remove a validation
					, stepTen		// Exit
					, stepEleven	// Inserting collection name where apply validation
					, stepTwelve	// Inserting properties to validate
					, stepThirteen
					];

		if (currentStep === LAST_STEP) {
			Steps[10]();
		} else {
			Steps[currentStep]();
		}
	}

	/*___ Exporting ____________________________________ */

	return { "start"    : start
		   , "stepZero" : stepZero
		   , "wizard"   : wizard 
		   };
}

var RESET 	   = '\u001b[0m';
var BOLD 	   = '\u001b[1m';
var UNDERLINE  = '\u001b[4m';
var UNDERBOLD  = '\u001b[1m\u001b[4m';
var RED   	   = '\u001b[31m';
var REDBOLD    = '\u001b[31m\u001b[1m';
var YELLOW 	   = '\u001b[33m';
var YELLOWBOLD = '\u001b[33m\u001b[1m';
var BLUE  	   = '\u001b[34m';
var BLUEBOLD   = '\u001b[34m\u001b[1m';
var GRAY 	   = '\u001b[37m';
var CLEAR 	   = '\u001B[2J\u001B[0;0f';

var vw = new validationWizard();
vw.wizard.on('line', vw.start);
vw.wizard.on('close', function() {
	process.exit(0);
});
vw.stepZero();