/* ___________________________________________________________________________

    Module: MessageManager.js   Version: 0.1
    Author: Guillermo Peña (guillermo.pena.cardano@gmail.com)
    Last update: 17/12/2012
    
        MessageManager manage text in differents languages. Texts/messages are
    stored in a MongoDb collection, so we need a db conextion and collection
    name to build object. 
        You can use it with 2 ways: consulting db with each request or loading
    to array every message at the beggining and looking into it.
   ___________________________________________________________________________*/

var MessageManager = function(db, collection, mode) {
    
    // __ Properties ___________________________________________________________
    
    var _db = db;                   // Database access
    var _collection = collection;   // Collection name where texts are stored
    var _messages = [];             // List with all messages (only LIST mode)
    var _askAlwaysToDb = false;
    //  If you dont want to make queries with each request, it'll load all
    //  messages at the beggining, and then, look into.
    
    
    // __ Getters and Setter ___________________________________________________
    
    // Load every messages from DB to array '_messages'
    var loadMessages = function() {
            
        // ONLY FOR TESTING
        _messages = [{'id':73, 'language':'en', 'message':'Hello $$!'},
                     {'id':73, 'language':'sp', 'message':'Hola $$!'},
                     {'id':74, 'language':'en', 'message':'Bye $$!'},
                     {'id':74, 'language':'sp', 'message':'Adios $$!'}];
    }
    
    this.getAskAlwaysToDb = function() {
        return _askAlwaysToDb;
    }
    
    this.setAskAlwaysToDb = function(askAlwaysToDb) {
        if (mode !== true) {
            _askAlwaysToDb = false;
            loadMessages();
        }
    }
    
    
    // __ Initializing _________________________________________________________
    
    this.setAskAlwaysToDb(mode);
     
    
    // __ Private Methods ______________________________________________________
    
    // Customize message replacing '$$' for parameters in order
    var customizeMessage = function(message, parameters) {
        var messageParts = message.split("$$"),
            j = 0,
            customizedMessage = "";
        while (j < messageParts.length - 1 && j < parameters.length) {
            customizedMessage = customizedMessage + messageParts[j] + parameters[j];
            j++;
        }
        
        return customizedMessage;
    }
    
    // __ Public Methods _______________________________________________________
    
    // Recover a message by id and language, customizing with parameters
    this.getMessage = function(id, language, parameters) {
        
        var message = "[Warning] Message dont found for this language",
            found = false,
            i = 0;
        while (found === false && i < _messages.length) {
            var m = _messages[i];
            if (m.id === id && m.language === language) {
                if (parameters !== undefined && parameters.length > 0) {
                    message = customizeMessage(m.message, parameters);
                } else {
                    message = m.message;
                }
                found = true;
            }
            i++;
        }
        
        return message;
    }
    
    // Recover a message from db by id and language, customizing with parameters
    this.getMessageFromDb = function(id, language) {
        
    }    
    
}



// ______________________________ T E S T S ____________________________________

var mm = new MessageManager(null, "Errors", false );
var empty;
console.log(mm.getMessage(73, 'sp', ['Guiller', 'Pepe']));
console.log(mm.getMessage(73, 'en', ['Guiller']));
console.log(mm.getMessage(74, 'sp', empty));
console.log(mm.getMessage(74, 'en', []));
console.log(mm.getMessage(74, 'spp', ['Guiller', 'Pepe']));
console.log(mm.getMessage(null, 'en', null));
console.log(mm.getMessage(empty, 'en', ['Guiller']));
console.log(mm.getMessage(73, empty, ['Guiller']));