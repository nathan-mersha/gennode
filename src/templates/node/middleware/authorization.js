/**
 * @author              Nathan M. Degineh - N8
 * @name                SCS service.
 * @module              authorization.js
 * @description         Authorization middle ware for SCS service.
 * @kind                Controller
 * @copyright           December 2017 Hisab
 */

let
    xtend                   = require('xtend'),
    unless                  = require('express-unless'),
    authenticationAccess    = require('../service_access/authentication_access'), // todo change path
    async                   = require('async'),
    debug                   = require('debug')('authorization'), // todo change debug name
    config                  = require('../config'), // todo change path
    errorCodes              = require('../constant/error_codes'),   // todo change path
    constants               = require('../constant/constants'); // todo change path

/**
 * @name                    - Option Setter
 * @description             - Sets option and passes to the returned middleware.
 * @param   option          - Provided option
 * @returns {middleware}    - Middleware function that is generated base on the authorization option set above.
 */
module.exports = function optionSetter(option) {

    /**
     * @description         - Defines default option
     * @type {{superAdmin: boolean, adminLV2: boolean, adminLV3: boolean, authorizedServices: boolean, authenticationService: boolean, loggedInUser: boolean, any: boolean}}
     */
    let defaultOption = {
        superAdmin            : true,
        adminLV2              : true,
        adminLV3              : true,
        authorizedServices    : false,
        authenticationService : false,
        loggedInUser          : false,
        any                   : false,
    };

    /**
     * @name        - Authorization Middleware
     * @description - Authorization middleware that handles all authentication and authorization services.
     * @param req   - Request Object to process
     * @param res   - Response Object to respond
     * @param next  - Next, passes to the next middleware.
     */
    let auth_middleware = function middleware(req,res,next) {

              /*
               Begin execution
               */

        async.waterfall([
            mergeOptions,
            checkMinimumLevel,
            checkHeaderAuthenticationExistence,
            checkAuthenticationType,
            extractAndCheckToken,
            checkAuthenticationServiceToken,
            retrieveTokenData,
            checkTokenRevoked,
            checkTokenExpired,
            compareIssuedToAuthOption,
        ],function () {
            debug("Authorization completed");
        });

        /**
         * @name                        - Merge option
         * @description                 - Merges default option with the given option (giving precedence to the given option)
         * @param callback              - Callback function (error)
         */
        function mergeOptions                       (callback)                      {
            debug("Merge options init...");

            defaultOption = xtend(defaultOption,option);
            defaultOption.superAdmin = true; // making sure that super ADMIN_LV2 has all access
            callback(null);
        }

        /**
         * @name                        - Check minimum level
         * @description                 - Checks minimum level of access, if so it passes on to the next middle ware
         * @param callback              - Callback function (error)
         */
        function checkMinimumLevel                  (callback)                      {
            debug("Checking minimum level init...");

            if(defaultOption.any === true){ // any one can access this routes.
                next();
            }else {
                callback(null);
            }
        }

        /**
         * @name                        - Check header authentication existence
         * @description                 - Checks the existence of authentication value on the header of the request
         * @param callback              - Callback function (error,authenticationValue)
         */
        function checkHeaderAuthenticationExistence (callback)                      {
            debug("Checking header authentication existence init...");

            let auth = req.get('Authentication');
            if(!auth){ // no authentication data
                debug("Authentication is not set");

                res.status(400);
                res.json(errorCodes.AUT.AUTHENTICATION_NOT_SET);
            }else{
                debug("Authentication type is set");
                callback(null,auth);
            }
        }

        /**
         * @name                        - Check authentication type
         * @description                 - Checks the type of the authentication
         * @param authenticationValue   - Authentication value ("Bearer authenticationValue")- if set correctly
         * @param callback              - Callback function (error,authenticationArray)
         */
        function checkAuthenticationType            (authenticationValue,callback)  {
            debug("Check authentication type init...");

            let authenticationArray = authenticationValue.split(/\s+/), // separate at spaces.
                authenticationType  = authenticationArray[0];

            if(authenticationArray.length !== 2){               // Authentication data may contain less or extraneous data.
                debug("Authentication does not contain proper amount of data");

                res.status(400);
                res.json(errorCodes.AUT.AUTHENTICATION_DATA_NOT_PROPER_LENGTH);
            }else if(authenticationType === 'Bearer'){          // Authentication type is correct
                debug("Authentication type is correct");

                callback(null,authenticationArray);
            }else{                                              // Authentication type is not correct.
                debug("Authentication type not correct");

                res.status(400);
                res.json(errorCodes.AUT.AUTHENTICATION_TYPE_NOT_ACCORD);
            }
        }

        /**
         * @name                        - Extract and Check token
         * @description                 - Extracts and check the authentication value, which is the token.
         * @param authenticationArray   - The Authentication array extracted from the previous function
         * @param callback              - Callback function (error, authenticationValue)
         */
        function extractAndCheckToken               (authenticationArray,callback)  {
            debug("Extract and check token init...");

            let tokenValue = authenticationArray[1];
            if(!tokenValue){ // Token value is empty
                debug("Empty token value");

                res.status(400);
                res.json(errorCodes.AUT.AUTHENTICATION_VALUE_NOT_SET);
            }else{
                debug("Token value exists");
                callback(null,tokenValue);
            }
        }

        /**
         * @name                        - Check authentication service token
         * @description                 - If the routes is allowed to be accessed by authentication services, it checks with that token
         * @param tokenValue            - The provided token value
         * @param callback              - Callback function (error,tokenValue)
         */
        function checkAuthenticationServiceToken    (tokenValue,callback)           {
            debug("Check authentication service token init...");

            if(defaultOption.authenticationService){ // Authentication service_access option is set to true
                debug("Checking for authentication access");

                let authenticationAccessToken = config.AUTHENTICATION_ACCESS_TOKEN;
                if(authenticationAccessToken === tokenValue){
                    debug("Authentication value is authentication access token proceeding...");
                    next();
                }else{ // Authentication service is allowed to access, but token does not match, proceeding to the next test
                    debug("Authentication service is allowed to access");
                    debug("Provided token does not match authentication token");
                    debug("Proceeding, to the next...");

                    callback(null,tokenValue);
                }
            }else{
                debug("Authentication service is not allowed to access this routes.");
                callback(null,tokenValue);
            }

        }

        /**
         * @name                        - Retrieve token data
         * @description                 - Retrieves token data from authentication service.
         * @param tokenValue            - Token value to be used as a query.
         * @param callback              - Callback function (error,body) // response body from authentication service.
         */
        function retrieveTokenData                  (tokenValue, callback)          {
            debug("Retrieving token data from the authentication service");

            authenticationAccess.getToken(null,null,tokenValue,false,function (error,response,body) {

                if(!error && response.statusCode === 200){  // every thing is ok
                    debug("Successfully retrieved token data");

                    callback(null,body); // body is the token data
                }else if(response.statusCode === 400){  // Token data does not exist
                    debug("Token data does not exist");

                    let errMsg      = errorCodes.AUT.UNAUTHORIZED_ACCESS;
                    errMsg.detail   = "Token data does not exist.";

                    res.status(401);
                    res.json(errMsg);
                }else if(response.statusCode === 500){ // Some error at authentication service.
                    debug(`Server side error : Error while accessing authentication service : ${body}`);

                    res.status(500);
                    res.json(errorCodes.AUT.AUTHENTICATION_SERVICE_ACCESS_FAIL);
                }else if(error){ // error while accessing authentication service.
                    debug(`Error while accessing authentication service : ${error}`);

                    let errMsg = errorCodes.AUT.AUTHENTICATION_SERVICE_ACCESS_FAIL;
                    errMsg.detail = error.toString();

                    res.status(500);
                    res.json(errMsg);
                }else{ // some error happened.
                    debug("Some other error while retrieving token from authentication service");

                    res.status(500);
                    res.json(errorCodes.SEC.SERVER_SIDE_ERROR);
                }
            });
        }

        /**
         * @name                        - Check token revoked
         * @description                 - Checks if token is revoked or not
         * @param tokenData             - Retrieved token data
         * @param callback              - Callback function (error,tokenData)
         */
        function checkTokenRevoked                  (tokenData,callback)            {
            debug("Checking token revoked, init...");

            if(tokenData.revoked){ // token is revoked
                debug("Token is revoked");

                res.status(401);
                res.json(errorCodes.AUT.TOKEN_REVOKED);
            }else{ // token is not revoked
                debug("Token is not revoked");
                callback(null,tokenData);
            }
        }

        /**
         * @name                        - Check token expired
         * @description                 - Check if the token has expired or not.
         * @param tokenData             - Token data to be evaluated
         * @param callback              - Callback function (error,tokenData)
         */
        function checkTokenExpired                  (tokenData,callback)            {
            debug("Check token expiration, init...");

            let today               = new Date().getTime(),
                tokenExpirationDate = tokenData.expirationDate;

            if(today > tokenExpirationDate){  // token has expired
                debug("Token has expired");

                res.status(401);
                res.json(errorCodes.AUT.TOKEN_EXPIRED);
            }else{  // token has not expired
                debug("Token has not expired");
                callback(null,tokenData);
            }
        }

        /**
         * @name                        - Compare issued to auth option
         * @description                 - Checks whether the issuedTo is allowed to access routes in default options.
         * @param tokenData             - The token data
         * @param callback              - Callback function (error)
         */
        function compareIssuedToAuthOption          (tokenData,callback)            {
            debug("Compare issued to auth option init...");

            let tokenIssuedTo = tokenData.issuedTo;

            if(defaultOption[tokenIssuedTo.toString()]){ // checking if the owner of this token is allowed to access this routes in default option
                debug("Token is authorized to access routes.");
                debug("Proceeding to the next middleware...");

                next(); // Owner of token allowed to access this routes, proceeding to the next middleware.
            }else{                                                               //      ^
                debug("Owner of token is not allowed to access this routes");    //     ^ ^
                                                                                 //    ^ ^ ^
                res.status(401);                                                 //   -------
                res.json(errorCodes.AUT.UNAUTHORIZED_ACCESS);                    //  (. o o .)
                                                                                 //   .......
                callback(null);                                                  //    ..O..     You shall not pass !
            }                                                                    //     ...
        }                                                                        //      .
    };

    /**
     *  Attaching unless middle ware for any one to access.
     */
    auth_middleware.unless = unless;
    return auth_middleware;
};