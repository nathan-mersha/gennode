/**
 * @author              __author__
 * @name                __serviceName__
 * @description         Test for __serviceName__ service.
 * @kind                Test
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
function sendRequest(urlPath,method,body,expectCode,callback) {
    request(app)[method](urlPath)
        .send(body)
        .expect(expectCode)
        .end(callback);
}

/**
 * @name                - Is error response
 * @description         - Checks if body is an error response.
 * @param body          - Body to check.
 */
function isErrorResponse(body){
    expect(body).to.be.an('object').that.includes.all.keys('errorCode','errorName','errorMessage','hint');
    expect(body.errorCode,body.errorName,body.errorMessage,body.hint).to.be.a('string');
}

/**
 * @name                - Is error response
 * @description         - Checks if body is an error response.
 * @param body          - Body to check.
 */
function isCountResponse(body){
    expect(body).to.be.an('object').that.includes.all.keys('count');
    expect(body.count).to.be.a('number');
}

/**
 * @name                - Is error response
 * @description         - Checks if body is an error response.
 * @param body          - Body to check.
 */
function isAllResponse(body){
    expect(body).to.be.an('array');
}

/**
 * @name                - Is paginated response
 * @description         - Checks if body is paginated response
 * @param body          - Body to check.
 */
function isPaginatedResponse(body){
    expect(body).to.be.an('object').that.has.all.keys('docs','total','limit','page','pages');
    expect(body.docs).to.be.an('array');
    expect(body.total,body.limit,body.page,body.pages).to.be.a('number');
}

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
function isUpdateResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'nModified', 'ok');
}

/**
 * @name                - Is update response
 * @description         - Evaluates if body is update response
 * @param body          - Body to evaluate
 */
function isRemoveResponse(body) {
    expect(body).to.be.an('object').that.has.all.keys('n', 'ok');
}

// Begin inserting test validation here
// End inserting test validation here