// Colors and fonts
var Color = function() {

	var RESET 	   = '\u001b[0m';
	var BOLD 	   = '\u001b[1m';
	var RED   	   = '\u001b[31m';
	var REDBOLD    = '\u001b[31m\u001b[1m';
	var YELLOW 	   = '\u001b[33m';
	var YELLOWBOLD = '\u001b[33m\u001b[1m';
	var BLUE  	   = '\u001b[34m';
	var BLUEBOLD   = '\u001b[34m\u001b[1m';
	var GRAY 	   = '\u001b[37m';
	var GRAYBOLD   = '\u001b[37m\u001b[1m';
	var CLEAR 	   = '\u001B[2J\u001B[0;0f';

	return { "reset" 	  : RESET
		   , "bold" 	  : BOLD
		   , "red" 		  : RED
		   , "redBold" 	  : REDBOLD 
		   , "yellow" 	  : YELLOW
		   , "yellowBold" : YELLOWBOLD
		   , "blue"		  : BLUE
		   , "blueBold"	  : BLUEBOLD
		   , "gray" 	  : GRAY
		   , "grayBold"	  : GRAYBOLD
		   , "clear" 	  : CLEAR
		   };
}

var color = new Color();
module.exports = color;