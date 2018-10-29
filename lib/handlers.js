const _data = require('./data');
const helpers = require('./helpers');

// Define the handlers
let handlers = {};

handlers.users = function(data, callback) {
  let acceptableMethods = ['post', 'get', 'put', 'delete'];
  data.method = data.method.toLowerCase();
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method.toLowerCase()](data, callback);
  } else {
    callback(405);
  }
};

// Containers for the users submethods
handlers._users = {};

// Users ~ POST
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._users.post = (data, callback) => {
  // Check that all required fields are filled out
  let firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  let lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  let phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  let password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 10 ? data.payload.password.trim() : false;
  let tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? data.payload.tosAgreement : false;
  console.log(firstName, lastName, phone, password, tosAgreement);
  if (firstName && lastName && phone && password && tosAgreement) {
    _data.read('users', phone, (err, data) => {
      if (err) {
        // Hash the password
        let hashedPassword = helpers.hash(password);
        // Create the user userObject

        if (hashedPassword) {
          let userObject = {
            'firstName': firstName,
            'lastName': lastName,
            'phone': phone,
            'hashedPassword': hashedPassword,
            'tosAgreement': tosAgreement
          };


          _data.create('users', phone, userObject, (err) => {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, {
                'Error': 'Could not create the new user'
              });
            }
          });
        } else {
          callback(500, {
            'Error': 'Could not hash the user\'s password'
          });
        }


      } else {
        callback(400, {
          'Error': 'A user with that phone number already exists'
        })
      }
    });
  } else {
    callback(400, {
      'Error': 'Missing required fields'
    });
  }


}

// Users ~ GET
handlers._users.get = (data, callback) => {

}
// Users ~ PUT
handlers._users.put = (data, callback) => {

}
// Users ~ DELETE
handlers._users.delete = (data, callback) => {

}


// Ping handler
handlers.ping = (data, callback) => {
  callback(200);
};

handlers.notFound = (data, callback) => {
  callback(404);
};

// Export the module
module.exports = handlers;
