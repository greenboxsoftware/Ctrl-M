var Validation = require("../lib/validation.js");

// __________________________  T  E  S  T  S  __________________________________

var r = {"name":"Guiller", 
         "age":35,
         "null":null,
         "nullMatrix":[[null, null], [null, null]],
         "cuasiNullMatrix":[[null, 1], [null, null]],
         "undefined":undefined,
         "undefinedMatrix":[[undefined, undefined], [undefined, undefined]],
         "cuasiUndefinedMatrix":[[undefined, null], [undefined, undefined]],
         "matrix":[[1,2],[3,4]],
         "matrixWithUndefined":[[1,undefined],[3,4]],
         "others": {
                    "car":{ "brand": "citroen", 
                            "model": "c2",
                            "color":"red"
                          },
                    "year":2005
                    },
         "sex":"male"                          
        };
  
var validator = function(v,r, expected) {
    v.check(r);
    var result = "OK";
    if (expected !== v.getLastCheck()) result = "FAILED!!";
    console.log("Expected: " + expected + " - RESULT: " + v.getLastCheck() + " ............... " + result);
};

process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err);
});

/*
// _________ Testing arguments validation ____________________________________________

console.log("_________________________________________________________________________________________");
console.log("Test 00: Checking not enabled validation. Expected: true");
var v00 = new Validation(null, "validations", ["age", "matrix"], "isNumber", null, false);
try { validator(v00, r, true); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 01: Checking validation without collection where apply validations. Expected: false");
var v01 = new Validation(null, null, ["age", "matrix"], "isNumber");
try { validator(v01, r, false); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 02: Checking validation with empty properties to validate. Expected: false");
var v02 = new Validation(null, "validations", null, "isNumber", null, false);
try { validator(v02, r, false); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 03: Checking validation with wrong validation name. Expected: error");
var v03 = new Validation(null, "validations", ["age", "matrix"], "blabla");
var expected = "error";
try { validator(v03, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

// _________ Testing ISNUMBER validation ____________________________________________

console.log("_________________________________________________________________________________________");
console.log("Test 10: Checking isNumber of age and matrix. Expected: true");
var v10 = new Validation(null, "validations", ["age", "matrix"], "isNumber");
try { validator(v10,r,true); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 11: Checking isNumber of name, matrix and Age. Expected: false");
var v11 = new Validation(null, "validations", ["name", "matrix", "age"], "isNumber");
try { validator(v11,r,false); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 12: Checking isNumber of age and others.car.model. Expected: false");
var v12 = new Validation(null, "validations", ["age", "others.car.model"], "isNumber");
try { validator(v12,r,false); }
catch (error) { console.log(error.message); }


// _________ Testing ISDEFINED validation ____________________________________________

console.log("_________________________________________________________________________________________");
console.log("Test 20: Checking isDefined of null and matrix. Expected: true");
var v20 = new Validation(null, "validations", ["null", "matrix"], "isDefined");
try { validator(v20,r,true); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 21: Checking isDefined of null, matrixWithUndefined and Age. Expected: false");
var v21 = new Validation(null, "validations", ["null", "matrixWithUndefined", "age"], "isDefined");
try { validator(v21,r,false); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 22: Checking isDefined of no exist parameter. Expected: false");
var v22 = new Validation(null, "validations", ["noexistparameter"], "isDefined");
try { validator(v22,r,false); }
catch (error) { console.log(error.message); }


// _________ Testing ISNULL validation ____________________________________________

console.log("_________________________________________________________________________________________");
console.log("Test 30: Checking isNull of null and nullMatrix. Expected: true");
var v30 = new Validation(null, "validations", ["null", "nullMatrix"], "isNull");
try { validator(v30,r,true); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 31: Checking isNull of null, cuasiNullMatrix and nullMatrix. Expected: false");
var v31 = new Validation(null, "validations", ["null", "cuasiNullMatrix", "nullMatrix"], "isNull");
try { validator(v31,r,false); }
catch (error) { console.log(error.message); }

console.log("_________________________________________________________________________________________");
console.log("Test 32: Checking isNull of null, nullMatrix and undefined. Expected: false");
var v32 = new Validation(null, "validations", ["null", "nullMatrix", "undefined"], "isNull");
try { validator(v32,r,false); }
catch (error) { console.log(error.message); }


// _________ Testing NOT validation ____________________________________________

console.log("______________________________________________________________________");
console.log("Test 40: Checking Not(undefined) of nullMatrix and age. Expected: error");
var parameters = { "validations": undefined };
var v40 = new Validation(null, null, null, "not", parameters);
var expected = "error";
try { validator(v40, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 41: Checking Not(isNull) of nullMatrix and age. Expected: true");
var validations = [{ "collection": "validations"
                  , "properties": ["age", "null"]
                  , "type": "isNull"
                  , "parameters": null
                  , "enabled" : true
                 }];
var parameters = { "validations": validations };
var v41 = new Validation(null, null, null, "not", parameters);
var expected = true;
try { validator(v41, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 42: Checking Not(isNumber) of matrix and age. Expected: false");
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNumber"
                  , "parameters": null
                  , "enabled" : true
                 }];
var parameters = { "validations": validations };
var v42 = new Validation(null, null, null, "not", parameters);
var expected = false;
try { validator(v42, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 43: Checking Not(isNull and isNumber) of nullMatrix and age. Expected: error");
var parameters = { "validations": ["isNull", "isNumber"] };
var v43 = new Validation(null, null, null, "not", parameters);
var expected = "error";
try { validator(v43, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}
*/




/*

// _________ Testing AND validation ____________________________________________

console.log("______________________________________________________________________");
console.log("Test 50: Checking And(undefined) of nullMatrix and age. Expected: error");
var parameters = { "validations": undefined };
var v50 = new Validation(null, null, null, "and", parameters);
var expected = "error";
try { validator(v50, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 51: Checking And(isNull) of nullMatrix and age. Expected: error");
var validations = [{ "collection": "validations"
                  , "properties": ["age", "null"]
                  , "type": "isNull"
                  , "parameters": null
                  , "enabled" : true
                 }];
var parameters = { "validations": validations };
var v51 = new Validation(null, null, null, "and", parameters);
var expected = "error";
try { validator(v51, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 52: Checking And(isNumber and isDefined) of matrix and age. Expected: true");
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNumber"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ,{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isDefined"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ];
var parameters = { "validations": validations };
var v52 = new Validation(null, null, null, "and", parameters);
var expected = true;
try { validator(v52, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}


console.log("______________________________________________________________________");
console.log("Test 53: Checking And(isNumber and isNull) of matrix and age. Expected: false");
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNull"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ,{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNumber"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ];
var parameters = { "validations": validations };
var v53 = new Validation(null, null, null, "and", parameters);
var expected = false;
try { validator(v53, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}


// _________ Testing OR validation _____________________________________________

console.log("______________________________________________________________________");
console.log("Test 60: Checking Or(undefined) of nullMatrix and age. Expected: error");
var parameters = { "validations": undefined };
var v60 = new Validation(null, null, null, "or", parameters);
var expected = "error";
try { validator(v60, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 61: Checking Or(isNull) of nullMatrix and age. Expected: error");
var validations = [{ "collection": "validations"
                  , "properties": ["age", "null"]
                  , "type": "isNull"
                  , "parameters": null
                  , "enabled" : true
                 }];
var parameters = { "validations": validations };
var v61 = new Validation(null, null, null, "or", parameters);
var expected = "error";
try { validator(v61, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

console.log("______________________________________________________________________");
console.log("Test 62: Checking Or(isNumber and isDefined) of matrix and age. Expected: true");
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNumber"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ,{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isDefined"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ];
var parameters = { "validations": validations };
var v62 = new Validation(null, null, null, "or", parameters);
var expected = true;
try { validator(v62, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}


console.log("______________________________________________________________________");
console.log("Test 63: Checking Or(isNumber and isNull) of matrix and age. Expected: false");
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "isNull"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ,{ "collection": "validations"
                  , "properties": ["matrix", "name"]
                  , "type": "isNumber"
                  , "parameters": null
                  , "enabled" : true
                 }
                 ];
var parameters = { "validations": validations };
var v63 = new Validation(null, null, null, "or", parameters);
var expected = false;
try { validator(v63, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}



// _________ Testing Logical validation combinations ___________________________

console.log("______________________________________________________________________");
console.log("Test 70: Checking Not(Or(isNumber and isNull)) of matrix and age. Expected: true");
var subvalidations = [{ "collection": "validations"
                      , "properties": ["matrix", "age"]
                      , "type": "isNull"
                      , "parameters": null
                      , "enabled" : true
                     }
                     ,{ "collection": "validations"
                      , "properties": ["matrix", "name"]
                      , "type": "isNumber"
                      , "parameters": null
                      , "enabled" : true
                     }
                     ];
var validations = [{ "collection": "validations"
                  , "properties": ["matrix", "age"]
                  , "type": "or"
                  , "enabled" : true
                  , "parameters": { "validations": subvalidations }
                 }];
var parameters = { "validations": validations };
var v70 = new Validation(null, null, null, "not", parameters);
var expected = true;
try { validator(v70, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}

*/


// _________ Testing DB validations ____________________________________________

console.log("______________________________________________________________________");
console.log("Test 80: Checking 'Exists'. Expected: true");
var v80 = new Validation("dbpopo", "clients", ["age", "name"], "exists");
var expected = true;
try { validator(v80, r, expected); }
catch (error) { 
    console.log(error.message);
    if (expected === "error") {
        console.log("Expected: Error - RESULT: Error ............... OK");
    } else {
        console.log("Expected: " + expected + " - RESULT: Error ............... FAIL");
    }
}