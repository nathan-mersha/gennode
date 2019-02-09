/**
 * @author              Nathan M. Degineh - N8
 * @name                Node Gen
 * @module              replacer.js
 * @description         Generates replacer object for different file types.
 * @kind                Generator
 * @copyright           September 2018 Node Gen
 */

let
    mc = require('../mergedConfig'),
    snakeCase = require('snake-case'),
    path    = require('path');


/**
 * @name                            - PackageJSON
 * @description                     - Generates package json replacement values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.packageJSON         = function packageJSON(){

    return {
        from : [/__serviceName__/g, /__version__/g, /__author__/g, /__license__/g, /__repoURL__/g],
        to: [snakeCase(mc.mergedConfig.serviceName), mc.mergedConfig.version, mc.mergedConfig.author, mc.mergedConfig.licence, mc.mergedConfig.repoURL]
    };
};

/**
 * @name                            - PackageJSON
 * @description                     - Generates package json replacement values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.environment         = function environment(){

    return {
        from : [/__runningMode__/g, /__port__/g, /__mongodbURL__/g, /__elementInPage__/g, /__collectionReturnSize__/g, /__reverseProxy__/g, /__elasticSearch__/g],
        to: [
            mc.mergedConfig.environment.MODE,
            mc.mergedConfig.environment.PORT,
            mc.mergedConfig.environment.MONGODB_URL,
            mc.mergedConfig.environment.ELEMENT_IN_PAGE,
            mc.mergedConfig.environment.COLLECTION_RETURN_SIZE,
            mc.mergedConfig.environment.REVERSE_PROXY,
            mc.mergedConfig.environment.ELASTIC_SEARCH_URL]
    };
};

/**
 * @name                            - Error codes
 * @description                     - Generates errorCodes replacement values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.errorCodes          = function errorCodes(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__license__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.licence, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Config
 * @description                     - Generates config replacement values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.config              = function config(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Initializer
 * @description                     - Generates initializer middleware
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.initializer         = function initializer(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Lib index
 * @description                     - Generates lib index
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.constantIndex            = function libIndex(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Helper library index
 * @description                     - Generates helper lib index
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.helperLibIndex      = function libIndex(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Constant
 * @description                     - Generates constant file
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.constant            = function constant(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - App
 * @description                     - Generates app file
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.app                 = function app(){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g, /__abortIfFail__/g, /__baseURL__/g, /__host__/g, /__port__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright, mc.mergedConfig.dependantServices.abortIfFail.toString(), mc.mergedConfig.baseURL, mc.mergedConfig.environment.REVERSE_PROXY,mc.mergedConfig.environment.PORT]
    };
};

/**
 * @name                            - Multiple sequential replacement
 * @description                     - Replaces multiple sequential values by targeting a comment as a mark.
 * @param mark                      - Key mark to replace the values with
 * @param replaceTo                 - Replacement value
 * @param tabs                      - Tab values for aesthetic purpose.
 * @param markBelow                 - If true replacement strings will be put above mark
 * @return {{from: string, to: string}}
 */
exports.multipleSeqRep      = function multipleSeqRep(mark, replaceTo, tabs = 2, markBelow){
    let tab = "";
    [tabs].forEach(function () {tab = tab.concat(`    `);});
    return  {
        from    :  mark,
        to      :  markBelow ?  `${tab}${replaceTo}\n${mark}` : `${mark}\n${tab}${replaceTo}`
    };
};

/**
 * @name                            - Model
 * @description                     - Replaces model file with provided model name
 * @param modelName                 - Model name
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.model               = function model(modelName){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g, /__modelName__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright, modelName]
    };
};

/**
 * @name                            - Dal
 * @description                     - Replaces all dal place holders
 * @param modelName                 - Model name the dal accesses
 * @param privateFields             - Private fields to hide
 */
exports.dal                 = function (modelName, privateFields){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g, /__modelName__/g, /__privateFields__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright, modelName, privateFields]
    };
};

/**
 * @name                            - Helper api
 * @description                     - Replaces all helper api place holders by defined values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*,*,*]}}
 */
exports.helperAPI           = function (){

    let certificateName = mc.mergedConfig.certificate.root !== null && mc.mergedConfig.certificate.clientKey !== null && mc.mergedConfig.certificate.client !== null ? path.basename(mc.mergedConfig.certificate) : "";
    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g, /__certificateName__/g, /__authenticationKey__/g, /__authenticationType__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright, certificateName, mc.mergedConfig.authentication.headerKey, mc.mergedConfig.authentication.type]
    };
};

/**
 * @name                            - Controller helper
 * @description                     - Replaces all controller helper place holders by defined values
 * @return {{from: [RegExp,RegExp,RegExp], to: [*,*,*]}}
 */
exports.controllerHelper    = function (){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Controller
 * @description                     - Replaces all controller place holder by defined values.
 * @param modelName                 - Model name
 * @param requiredFieldsOnCreate    - Required fields to create the data
 * @param validQuery                - Valid query to look on pagination call
 * @param validUpdateData           - Valid update data
 * @param elementViewedInPagination - Element viewed in pagination
 * @return {{from: [RegExp,RegExp,RegExp], to: [*,*,*]}}
 */
exports.controller          = function (modelName, requiredFieldsOnCreate, validQuery, validUpdateData, elementViewedInPagination){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g, /__modelName__/g, /__requiredFieldsOnCreate__/g, /__validQuery__/g, /__validUpdateData__/g, /__elementsViewedInPagination__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright, modelName, requiredFieldsOnCreate, validQuery, validUpdateData, elementViewedInPagination]
    };
};

/**
 * @name                            - Router index
 * @description                     - Replaces all router index place holders by defined values
 * @return {{from: [RegExp,RegExp,RegExp], to: [*,*,*]}}
 */
exports.routerIndex         = function (){

    return {
        from : [/__serviceName__/g, /__author__/g, /__copyright__/g],
        to: [mc.mergedConfig.serviceName, mc.mergedConfig.author, mc.mergedConfig.copyright]
    };
};

/**
 * @name                            - Route
 * @description                     - Replaces all route place holders by defined values.
 * @param modelName                 - Model name
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.route               = function (modelName) {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
            /__modelName__/g,
            /__baseURL__/g,
            /__version__/g,
            /__limitValue__/g,
            /__port__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
            modelName,
            mc.mergedConfig.baseURL,
            mc.mergedConfig.version,
            mc.mergedConfig.environment.ELEMENT_IN_PAGE,
            mc.mergedConfig.environment.PORT
        ]
    };
};

/**
 * @name                            - Docker compose
 * @description                     - Replaces all docker compose place holders by defined values.
 * @return {{from: [RegExp,RegExp,RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*,*,*]}}
 */
exports.dockerCompose       = function () {

    return {
        from : [/__serviceName__/g, /__port__/g, /__runningMode__/g, /__reverseProxy__/g, /__collectionReturnSize__/g, /__elasticSearchUrl__/g],
        to: [snakeCase(mc.mergedConfig.serviceName), mc.mergedConfig.environment.PORT, mc.mergedConfig.environment.MODE,
            mc.mergedConfig.environment.REVERSE_PROXY, mc.mergedConfig.environment.COLLECTION_RETURN_SIZE, mc.mergedConfig.environment.ELASTIC_SEARCH_URL]
    };
};

/**
 * @name                            - Docker file
 * @description                     - Replaces all docker file place holders by defined values.
 * @return {{from: [RegExp,RegExp], to: [*,*]}}
 */
exports.dockerFile          = function () {

    return {
        from : [/__author__/g, /__port__/g],
        to: [mc.mergedConfig.author, mc.mergedConfig.environment.PORT]
    };
};

/**
 * @name                            - Docker ignore
 * @description                     - Replaces all docker ignore file place holders by defined values.
 * @return {{from: Array, to: Array}}
 */
exports.dockerIgnore        = function () {

    return {
        from : [],
        to: []
    };
};

/**
 * @name                            - Jenkins file
 * @description                     - Replaces all jenkins file place holders by defined values.
 * @return {{from: Array, to: Array}}
 */
exports.jenkinsFile        = function () {

    return {
        from : [],
        to: []
    };
};

exports.readMe              = function () {

    return {
        from : [
            /__serviceName__/g,
            /__serviceDescription__/g,
            /__author__/g,
            /__repoURL__/g,
            /__documentationEndPoint__/g,
            /__testReportEndPoint__/g,
            /__testCoverageEndPoint__/g,
            /__licence__/g,
            /__version__/g,
            /__copyright__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.serviceDescription,
            mc.mergedConfig.author,
            mc.mergedConfig.repoURL,
            `${mc.mergedConfig.environment.REVERSE_PROXY}${mc.mergedConfig.baseURL}/apidoc`,
            `${mc.mergedConfig.environment.REVERSE_PROXY}${mc.mergedConfig.baseURL}/test`,
            `${mc.mergedConfig.environment.REVERSE_PROXY}${mc.mergedConfig.baseURL}/coverage`,
            mc.mergedConfig.licence,
            mc.mergedConfig.version,
            mc.mergedConfig.copyright,
        ]
    };
};


/**
 * @name                            - Test
 * @description                     - Replaces all test file place holders by defined values
 * @param modelName                 - Model name
 * @param modelPublicFields         - All public fields of the model for validation, except __v and _id already included.
 * @param modelPrivateFields        - All public and private fields of the model for private validation
 * @returns {{from: RegExp[], to: *[]}}
 */
exports.test                = function (modelName, modelPublicFields, modelPrivateFields, ) {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
            /__modelName__/g,
            /__modelPublicFields__/g,
            /__modelPrivateFields__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
            modelName,
            modelPublicFields,
            modelPrivateFields
        ]
    };
};

/**
 * @name                            - Test data
 * @description                     - Test data outer holder generator
 */
exports.testOuter        = function () {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright
        ]
    };
};

/**
 * @name                            - Test data inner
 * @description                     - Inner dummy data generator for test
 * @return {{from: [RegExp,RegExp,RegExp], to: [*,*,*]}}
 */
exports.dummyDataOuter           = function () {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright
        ]
    };
};

/**
 * @name                            - Test suite
 * @description                     - Generates test suite replace
 * @param modelName                 - Model name
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.testSuite               = function (modelName) {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
            /__modelName__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
            modelName
        ]
    };
};

/**
 * @name                            - Suite index
 * @description                     - Generates suite index
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.suiteIndex               = function () {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
        ]
    };
};

/**
 * @name                            - Validators
 * @description                     - Generates validator functions
 * @return {{from: [RegExp,RegExp,RegExp,RegExp], to: [*,*,*,*]}}
 */
exports.validators               = function () {

    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
        ]
    };
};


/**
 * @name                            - Url generator
 * @description                     - Url generator module
 */
exports.urlGeneratorOuter        = function () {
    return {
        from : [
            /__serviceName__/g,
            /__author__/g,
            /__copyright__/g,
            /__baseURL__/g,
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.author,
            mc.mergedConfig.copyright,
            mc.mergedConfig.baseURL
        ]
    };
};

/**
 * @name                            - Api doc
 * @description                     - Url generator module
 */
exports.apidoc        = function () {
    return {
        from : [
            /__serviceName__/g,
            /__version__/g,
            /__serviceDescription__/g,
            /__serviceName__/g,
            /__proxyAddress__/g,
            /__port__/g
        ],
        to: [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.version,
            mc.mergedConfig.serviceDescription,
            mc.mergedConfig.serviceName,
            mc.mergedConfig.environment.REVERSE_PROXY,
            mc.mergedConfig.environment.PORT
        ]
    };
};

/**
 * @name                            - Documentation cleanup
 * @description                     - Documentation cleanup
 */
exports.documentationCleanUp        = function () {
    return {
        from : [
            /End inserting sample body example descriptor here POST/g,
            /End inserting sample body example here POST/g,
            /End inserting success body descriptor here POST/g,
            /End inserting success body here POST/g,
            /End inserting other query values here GET/g,
            /End inserting body data here GET/g,
            /End inserting sample body example here PUT/g,
            /End inserting valid queries PUT/g,
            /End inserting valid queries DELETE/g
        ],
        to: " "
    };
};

/**
 * @name                            - Docker compose nginx
 * @description                     - Generates docker compose file for nginx
 */
exports.dockerComposeNginx        = function () {
    return {
        from : [
            /__serviceName__/g
        ],
        to: [
            mc.mergedConfig.serviceName
        ]
    };
};

/**
 * @name                            - Docker file nginx
 * @description                     - Generates docker file for nginx
 */
exports.dockerFileNginx        = function () {
    return {
        from : [
            /__author__/g
        ],
        to: [
            mc.mergedConfig.author
        ]
    };
};

/**
 * @name                            - Jenkins nginx
 * @description                     - Generates jenkins file for nginx
 */
exports.jenkinsNginx        = function () {
    return {
        from : [
            /__serviceName__/g
        ],
        to: [
            mc.mergedConfig.serviceName
        ]
    };
};

/**
 * @name                            - Nginx config
 * @param https                     - If true will configure the proxy for https request as well by adding client certificate.
 * @description                     - Generates nginx config file
 */
exports.nginxConfig        = function (https = false) {
    if(https) {
        return {
            from : [
                /__serviceName__/g,
                /__clientCertName__/g,
                /__clientCertKeyName__/g,
                /__reverseProxy__/g,
                /__baseURL__/g,
                /__port__/g
            ],
            to: [
                mc.mergedConfig.serviceName,
                mc.mergedConfig.certificate.client,
                mc.mergedConfig.certificate.clientKey,
                mc.mergedConfig.environment.REVERSE_PROXY,
                mc.mergedConfig.baseURL,
                mc.mergedConfig.environment.PORT
            ]
        };
    }else{
        return {
            from : [
                /__serviceName__/g,
                /__reverseProxy__/g,
                /__baseURL__/g,
                /__port__/g
            ],
            to: [
                mc.mergedConfig.serviceName,
                mc.mergedConfig.environment.REVERSE_PROXY,
                mc.mergedConfig.baseURL,
                mc.mergedConfig.environment.PORT
            ]
        };
    }

};

/**
 * @name                            - Jenkins nginx
 * @param author                    - Author
 * @param serviceName               - Service name
 * @param configExport              - Configuration export
 * @description                     - Generates jenkins file for nginx
 */
exports.genNodeConfig        = function (author, serviceName, configExport) {
    return {
        from : [
            /__author__/g,
            /__serviceName__/g,
            /__configurationExport__/g
        ],
        to: [
            author,
            serviceName,
            configExport
        ]
    };
};

/**
 * @name                            - Hero academia
 * @description                     - Hero academia gennode config file replace
 * @return {{from: Array, to: Array}}
 */
exports.heroAcademia        = function () {
    return {
        from : [
            /__copyright__/g
        ],
        to : [
            new Date().getFullYear().toString()
        ]
    }
};

/**
 * @name                            - Model cleanup
 * @description                     - Cleans up type values
 * @return {{from: [RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp,RegExp], to: [string,string,string,string,string,string,string,string,string,string,string]}}
 */
exports.modelCleanUp        = function () {
    return {
        from : [
            /"String"/g,
            /"Number"/g,
            /"Boolean"/g,
            /"Bool"/g,
            /"Array"/g,
            /"Buffer"/g,
            /"Date"/g,
            /"ObjectId"/g,
            /"Oid"/g,
            /"Map"/g,
            /"Mixed"/g,
            /"type"/g,
            /"ref"/g,
            /"es_indexed"/g
        ],
        to : [
            "String",
            "Number",
            "Boolean",
            "Bool",
            "Array",
            "Buffer",
            "Date",
            "Schema.Types.ObjectId",
            "Schema.Types.ObjectId",
            "Map",
            "Mixed",
            "type",
            "ref",
            "es_indexed"
        ]
    }
};

/**
 * @name                - Post man collection
 * @description         - Replaces initial postman collection template file
 * @return {{from: [RegExp,RegExp], to: [*,*]}}
 */
exports.postManCollection    = function () {
    return {
        from : [
            /__serverName__/g,
            /__serverDescription__/g
        ],
        to : [
            mc.mergedConfig.serviceName,
            mc.mergedConfig.serviceDescription
        ]
    }
};

exports.postManCollectionCleanUp    = function () {
    return {
        from : [
            /End inserting request items here/g,
        ],
        to  : [""]
    }
};