/**
 * @author              __author__
 * @name                __serviceName__
 * @description         Test validator for service __serviceName__
 * @kind                Index
 * @copyright           __copyright__
 */

let
    request     = require('supertest'),
    mongoose    = require('mongoose'),
    objectId    = mongoose.Types.ObjectId,
    expect      = require('chai').expect,

    app         = require('../app'),
    constants   = require('../lib/constant'),
    url         = require('./url_generator'),
    errorCodes  = constants.errorCodes,
    dummyData   = require('./dummy_data');

/**
 * @name                - Send request
 * @description         - Abstracts test requests.
 * @param urlPath       - Url path
 * @param method        - Method
 * @param body          - Body if any
 * @param expectCode    - Code to expect
 * @param callback      - Callback function (error,response)
 */

exports.sendRequest = function sendRequest(urlPath,method,body,expectCode,callback) {
    request(app)[method](urlPath)
        .send(body)
        .expect(expectCode)
        .end(callback);
};

/**
 * @name                - Is error response
 * @description         - Checks if body is an error response.
 * @param body          - Body to check.
 */
exports.isErrorResponse = function isErrorResponse(body){
    expect(body).to.be.an('object').that.includes.all.keys('errorCode','errorName','errorMessage','hint');
    expect(body.errorCode,body.errorName,body.errorMessage,body.hint).to.be.a('string');
};

/**
 * @name                - Is paginated response
 * @description         - Checks if body is paginated response
 * @param body          - Body to check.
 */
exports.isPaginatedResponse = function isPaginatedResponse(body){
    expect(body).to.be.an('object').that.has.all.keys('docs','total','limit','page','pages');
    expect(body.docs).to.be.an('array');
    expect(body.total,body.limit,body.page,body.pages).to.be.a('number');
};

/**
 * @name                - Are objects equal type ignored
 * @description         - Compares if the first object has all keys of the second, type ignored.
 * @param object1       - First object
 * @param object2       - Second object
 */
exports.areObjectsEqualTypeIgnored = function areObjectsEqualTypeIgnored(object1, object2) {
    function castValTo(obj) {
        let objKeys = Object.keys(obj);
        objKeys.forEach(function (key) {
            obj[key] = obj[key].toString();
        });
        return obj;
    }
    expect(castValTo(object1)).to.include(castValTo(object2))
};

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
exports.isUpdateResponse = function isUpdateResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'nModified', 'ok');
};

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
exports.isRemoveResponse = function isRemoveResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'ok');
};