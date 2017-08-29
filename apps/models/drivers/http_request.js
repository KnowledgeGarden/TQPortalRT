var request = require('request');

/**
 * HttpClient created by wenzowski on 3/8/2016 based on code by park.
 * @see https://github.com/request/request
 */
module.exports = HttpClient;

/**
 * REQUIRED -- set in environment.js
 * @param host
 * @param port
 *
 * OPTIONAL
 * @param protocol
 */
function HttpClient(host, port, protocol) {
  if (!host) throw 'host is required';
  if (!port) throw 'port is required';

  this.host = host;
  this.port = parseInt(port);
  this.protocol = protocol || 'http';

  if (this.port === NaN) {
    this.port = (this.protocol === 'https' ? 443 : 80)
  }
  this.baseURL = this.protocol + '://' + this.host + ':' + this.port;

  //console.log('HttpClient', this.baseURL);
};

/**
 *
 * @param path e.g. /tm/
 * @param queryJSON
 * @param callback signature (err, rslt)
 */
HttpClient.prototype.get = function (path, queryJSON, callback) {
  //console.log('GET', prettyPrint(queryJSON));
  request.get({
    url: this.baseURL + path + encodeJSON(queryJSON),
    json: true
  }, function hra(err, response, body) {
    if (err) console.log('ERR', err);
    //console.log('HTTP-GET', prettyPrint(body));
    return callback(err, body);
  });
};

/**
 * @param path e.g. /tm/
 * @param queryJSON
 * @param callback
 */
HttpClient.prototype.post = function (path, queryJSON, callback) {
  //console.log('POST', prettyPrint(queryJSON));
  request.post({
    url: this.baseURL + path + encodeJSON(queryJSON),
    json: true
  }, function hra(err, response, body) {
    if (err) console.log('ERR', err);
    //console.log('HTTP-POST', prettyPrint(body));
    return callback(err, body);
  });
};

/////////////////////////////////////
// Structure of authentication
// {
//   "host": "localhost",
//   "port": "8080",
//   "path": "/auth/{\"verb\":\"Auth\",\"uIP\":\"\",\"uName\":\"SystemUser\",\"sToken\":\"\"}",
//   "headers": {
//     "Authorization": "Basic YnJ5YW5Aam9lLm9yZzpicnlhbg=="
//   }
// }
/////////////////////////////////////

///////////////////////////////////
// Structure of authentication response body
// {
//   "rMsg": "ok",
//   "rToken": "8623f637-4275-46de-b8bb-c35127797e60",
//   "cargo": {
//     "uGeoloc": "|",
//     "uEmail": "sam@slow.com",
//     "uHomepage": "",
//     "uName": "sam",
//     "uFullName": "Sam Slow",
//     "uRole": "rur",
//     "uAvatar": ""
//   }
// }
///////////////////////////////////

/**
* @param query
* @param email
* @param password
* @param callback
*/
HttpClient.prototype.authenticate = function (query, email, password, callback) {
  console.log('AUTH: ', email, prettyPrint(query));
  request({
    url: this.protocol + '://' + encodeURIComponent(email) + ':' + encodeURIComponent(password) + '@' + this.host + ':' + this.port + '/auth/' + encodeJSON(query),
    json: true
  }, function hra(err, response, body) {
    if (err) console.log('ERR', err);
    console.log('HEADERS', prettyPrint(response.headers));
    console.log('HttpRequestAuth', prettyPrint(body));
    return callback(err, body);
  });
}

function encodeJSON(query) {
  return encodeURIComponent(JSON.stringify(query));
}

function prettyPrint(json) {
  return JSON.stringify(json, null, 2);
}
