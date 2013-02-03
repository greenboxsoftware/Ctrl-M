var tools = function() {

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

		var PORT_MIN = 0;
		var PORT_MAX = 65535;

		var parts = port.split(".");
		if (parts.length !== 1) return false;

		if (isNaN(port) || port === "" || port < PORT_MIN || port > PORT_MAX) 
			return false

		return true;
	}

	// Cloning objets
	var clone = function(obj) {

	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; i++) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var attr in obj) {
	            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	// Publishing...
	return { "sleep" : sleep
		   , "validateIp" : validateIp
		   , "validatePort" : validatePort
		   , "clone" : clone
		   };
}

var tools = new tools();

module.exports = tools;