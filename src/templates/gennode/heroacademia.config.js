/**
 * @author              Midoria
 * @name                Hero Academia
 * @module              heroacademia.config.js
 * @description         Hero academia gennode configuration file.
 * @kind                Config
 * @copyright           __copyright__
 */

module.exports = {

    serviceName : 'Hero Academia',
    serviceDescription : "Teacher and student hero registry for Hero Academia",
    author : 'Young Midoria',
    copyright : `Copyright : 2018`,
    licence : 'MIT',
    version : '0.0.1',
    repoURL : "http://github.com",
    baseURL : '/heroAcademia',
    runServer : false,
    models : [
        {
            options : {
                name : 'Teacher'
            },
            fields  : {
                name : {type : "String" , es_indexed : true},
                age : {type : "Number", es_indexed : true},
                gender : {type : "String"},
                followers : {type : "Array"},
                superPower : {type : "String" , es_indexed : false},
                costume : {type : "String"},
                powerGrade : {type : "String"},
                tournament : {type : "ObjectId", ref: "Tournament"},
                history : {type : "ObjectId", ref: "History"},   angerLevel : {type : "Number"},
                optimismLevel : {type : "Number"}
            }
        },

        {
            options : {
                name : 'Student'
            },
            fields  : {
                name : {type : "String" , es_indexed : true},
                age : {type : "Number", es_indexed : true},
                gender : {type : "String"},
                powerClass : {type : "String"},
                superPower : {type : "String" , es_indexed : false},
                costume : {type : "String"},
                powerGrade : {type : "String"},
                tournament : {type : "ObjectId", ref: "Tournament"},
                history : {type : "ObjectId", ref: "History"},
                wins : {type : "Number"},
                loss : {type : "Number"},
                draw : {type : "Number"}
            }
        },

        {
            options : {
                name : 'Tournament'
            },
            fields  : {
                name : {type : "String" , es_indexed : true},
                wins : {type : "Number"},
                loss : {type : "Number"},
                draw : {type : "Number"}
            }
        },

        {
            options : {
                name : 'History'
            },
            fields  : {
                angerLevel : {type : "Number"},
                optimismLevel : {type : "Number"},
                enemyDefeat : {type : "Number"},
                archNemesis : {type : "String"},
                battleGroundDefeat : {type : "Number"},
                enemyCapture : {type : "Number"},
                alive : {type : "Boolean"}
            }
        }

    ],

    dependantServices       : { // todo dependant services goes here
        endPoints               : [
            'http://hero_league.com',
            'http://villain_league.com'
        ],
        abortIfFail             : false
    },

    environment             : {
        DEBUG : "*",
        PORT : 3300,
        MODE : "test_mode",
        MONGODB_URL : "mongodb://localhost:27017/heroAcademia",
        REVERSE_PROXY : "http://localhost",
        COLLECTION_RETURN_SIZE : "24",
        ELEMENT_IN_PAGE : "12",
        ELASTIC_SEARCH_URL : "http://localhost:9200"
        
    },

    // Defines authentication header key and type for api requests
    authentication          : {
        type : 'Bearer',
        headerKey : 'Authentication'
    },

    includeApiReqLib        : true, // If true will include library for requesting outside api call
    certificate             : {
        root : null,
        client : null,
        clientKey : null
    }, // Some path to a certificate if request will be made using https.

    // Defines related containers
    mongodb : true,
    nginx : true,

    test : true,
    docker : true,
    jenkins : true,
    enableProxy : true,
    readMe : true,
    documentation : true,
    commit : true
};

