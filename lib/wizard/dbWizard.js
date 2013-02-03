var dbWizard = function() {

	/*___ Constants ____________________________________ */

	var APP_NAME = "Validation Wizard";
	var APP_VERSION = "1.0";
	var DBTYPE = "Mongo";

	// Default values
	var DEFAULT_IP = "localhost";
	var DEFAULT_PORT = 3333;
	var DEFAULT_COLLECTION = "validations";
	var FINAL_STEP = 6;		// <----------------------------- INCREASE IT IF YOU ADD NEW STEPS!!

	// Messages
	var color = require('./color.js');
	var HEADER_0 = color.bold + APP_NAME + " v" + APP_VERSION + color.reset + color.gray + " - Green Box Software (www.greenboxsoftware.com)" + color.reset;
	var HEADER_1 = color.gray + "To manage validations in your " + DBTYPE + " db I need connections data" + "\n" + color.reset;

	var DBINFO_0 = "\t" + "- " + color.bold + "Server Ip: " + color.reset;
	var DBINFO_1 = "\t" + "- " + color.bold + "Server Port: " + color.reset;
	var DBINFO_2 = "\t" + "- " + color.bold + "User Name: " + color.reset;
	var DBINFO_3 = "\t" + "- " + color.bold + "Password: " + color.reset;
	var DBINFO_4 = "\t" + "- " + color.bold + "Database: " + color.reset;
	var DBINFO_5 = "\t" + "- " + color.bold + "Validations collection: " + color.reset;

	var QUESTION_0 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Server Ip" + color.reset + " [default:" + DEFAULT_IP + "]: ";
	var QUESTION_1 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Server Port" + color.reset + " [default:" + DEFAULT_PORT + "]: ";
	var QUESTION_2 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " User" + color.reset + ": ";
	var QUESTION_3 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Password" + color.reset + ": ";
	var QUESTION_4 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Database Name" + color.reset + ": ";
	var QUESTION_5 = color.gray + "\t" + "> Insert your " + DBTYPE + color.blueBold + " Collection Name" + color.reset + " where you want to save your validations [default:" + DEFAULT_COLLECTION + "]: ";

	
	/*___ Properties ___________________________________ */

	var currentStep = 0;
	var db = { "server"	   : DEFAULT_IP
			 , "port"       : DEFAULT_PORT
			 , "user"       : null
			 , "password"   : null
			 , "dbname"     : "gbTest"
			 , "collection" : DEFAULT_COLLECTION
			 };

	var tool  = require('./tools.js');
	var wizard = require('readline').createInterface({
		input: process.stdin,
		output: process.stdout
	});


	/*___ Private Methods ______________________________ */

	var showHeader = function() {

		console.log(color.clear + color.reset + HEADER_0);
		console.log(HEADER_1 + color.gray + "\n" + color.reset);
		if (currentStep > 0) console.log(DBINFO_0 + db.server);
		if (currentStep > 1) console.log(DBINFO_1 + db.port);
		if (currentStep > 2) console.log(DBINFO_2 + db.user);
		if (currentStep > 3) console.log(DBINFO_3 + db.password);
		if (currentStep > 4) console.log(DBINFO_4 + db.dbname);
		if (currentStep > 5) console.log(DBINFO_5 + db.collection + "\n");
	}


	/*___ Wizard Steps ____________________________________ */

	// Step Zero : see publics methods

	// Step One : Saving Mongo server port
	var setServerPort = function() {

		wizard.question(QUESTION_1, function(answer) {

			if (answer !== "" ) {
				if (tool.validatePort(answer) === true) {
	  				db.port = answer.replace(" ","");
	  				currentStep++;
	  			} else {
	  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": Wrong port format");
	  				tool.sleep(1);
	  			}
  			} else {
	  			currentStep++;
	  		}
  			wizard.emit('line');	
		});
	}

	// Step Two : Saving User name
	var setUsername = function() {

		wizard.question(QUESTION_2, function(answer) {
  			db.user = answer;
  			currentStep++;
  			wizard.emit('line');	
		});
	}

	// Step Three : Saving Password
	var setPassword = function() {
		
		wizard.question(QUESTION_3, function(answer) {
  			db.password = answer;
  			currentStep++;
  			wizard.emit('line');	
		});
	}

	// Step Four : Saving DB name
	var setDbName = function() {

		wizard.question(QUESTION_4, function(answer) {
			if (answer !== "") {
  				db.dbname = answer.replace(" ","");
  				currentStep++;
  			} else {
  				currentStep++; // TODO: ONLY FOR TESTS. REMOVE THIS LINE
  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": DB name can no be null");
  				tool.sleep(1);
  			}
  			wizard.emit('line');	
		});
	}

	// Step Five : Saving validation collection
	var setCollection = function() {

		wizard.question(QUESTION_5, function(answer) {
			db.collection = "validations";
			if (answer !== "") {
  				db.collection = answer;
  			}
  			currentStep++;
  			wizard.emit('line');
		});
	}

	/*___ Public Methods _______________________________ */

	// Step Zero : Saving Mongo server Ip
	var setServerIp = function() {

		showHeader();
		wizard.question(QUESTION_0, function(answer) {

			if (answer !== "" ) {
				if (tool.validateIp(answer) === true) {
	  				db.server = answer.replace(" ","");
	  				currentStep++;
	  			} else {
	  				console.log("\t" + color.redBold + "Error" + color.reset + color.gray + ": Wrong ip format");
	  				tool.sleep(1);
	  			}
	  		} else {
	  			currentStep++;
	  		}
  			wizard.emit('line');
		});
	}

	var steps = function() {

		showHeader();
		var Steps = [ setServerIp 		// Saving Mongo server Ip
					, setServerPort		// Saving Mongo server port
					, setUsername		// Saving User name
					, setPassword		// Saving Password
					, setDbName			// Saving DB name
					, setCollection		// Saving validation collection
					];

		if (currentStep === FINAL_STEP) {
			wizard.close();
		} else {
			Steps[currentStep]();
		}
	}

	var toString = function() {
		return "Database Info:\n\n" +
				DBINFO_0 + db.server + "\n" +
				DBINFO_1 + db.port + "\n" +
				DBINFO_2 + db.user + "\n" +
				DBINFO_3 + db.password + "\n" +
				DBINFO_4 + db.dbname + "\n" +
				DBINFO_5 + db.collection + "\n";
	}

	/*___ Exporting ____________________________________ */

	return { "init"     	  : setServerIp
		   , "steps"    	  : steps
		   , "wizard"   	  : wizard 
		   , "db"       	  : db
		   , "toString" : toString
		   };

}

module.exports = dbWizard;


var dbw = new dbWizard();
dbw.wizard.on('line', dbw.steps);
dbw.wizard.on('close', function() {
	var clear = '\u001B[2J\u001B[0;0f';
	console.log(clear + dbw.toString());
});

var dbresult = dbw.init();
