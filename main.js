/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              index.js
 * @description         Starting point for generating node server files.
 * @kind                Generator
 * @copyright           September 2018 Gen Node
 */

let
    directory       = require('./src/generators/directory'),
    mergedConfigEx  = require('./src/mergedConfig'),
    lib             = require('./src/lib/index'),

    // Default values for configuration
    defaultField    = require('./src/config/field'),
    defaultModel    = require('./src/config/model'),
    defaultConfig   = require('./src/config/index'),

    nodeGenConfig   = null,
    outputPath      = null,
    mergedConfig    = {},

    constants       = require('./src/config/constants'),
    createDir       = constants.directories,

    replaceValues   = require('./src/generators/replacers'),
    innerTemplate   = require('./src/templates/inner'),
    camelCase       = require('camelcase'),
    fs              = require('fs'),
    util            = require('util'),
    async           = require('async'),
    shelljs         = require('shelljs'),
    path            = require('path'),
    xtend           = require('xtend');

const
    log  = ">> ",
    iLog = ">>>>";

/**
 * @name                - Config index
 * @description         - Begins generating execution.
 */
module.exports = {

    /**
     * @name                    - Gen node
     * @description             - Generates gen node file
     * @param configFilePath    - Path to config file
     * @param outPutPath        - Out put path
     */
    genNode                 : function (configFilePath, outPutPath){

        async.waterfall([
            locateConfigFile,
            mergeConfigFile,
            validateConfigFile,
            verifyServerDirExistence,
            refactorConfigFile,
            generateDirectories,
            copyCertificate,
            generatePackageJSON,
            generateGit,
            generateEnvironmentFile,
            generateErrorCodes,
            generateConfig,
            generateMiddleware,
            generateConstants,
            generateHelperLibrariesIndex,
            generateHelperLibraries,
            generateControllerHelper,
            generateLibIndex,
            generateApp,
            generateModels,
            generateDals,
            generateControllers,
            generateRouteIndex,
            generateRoutes,
            generateDockerFiles,
            installPackages,
            generateAuthService,
            generateUserService,
            generateTestFiles,
            generateTestReportAndCoverage,
            generateDocumentation,
            cleanUpComments,
            generateJenkinsFile,
            generateNginxConfigFile,
            generatePostManCollectionFile,
            generateReadMeFile,
            checkOverAllIntegrity,
            commitFiles,
            runServer
        ],function () {
            console.log('Completed generating server files.');
            console.log(`\n\n\n
        --------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------
        -------------            Thanks for using GenNode, an open source NodeJs server generator.             -------------
        -------------------      Consider contributing : https://github.com/nathan-mersha/gennode      ---------------------
        --------------------------------------------------------------------------------------------------------------------
        --------------------------------------------------------------------------------------------------------------------
        \n\n\n
        `);
        });

        /**
         * @name                    - Locate config file
         * @description             - Locates users config file.
         * @param callback          - Callback function (error)
         */
        function locateConfigFile               (callback) {
            console.log(`${log} 1. Locate config file init.`);
            nodeGenConfig = require(path.resolve(configFilePath));
            outputPath = path.resolve(outPutPath);
            callback(null);
        }

        /**
         * @name                    - Merge config files
         * @description             - Merges the default config file with the one the user's config file.
         * @param callback          - Callback function (error)
         */
        function mergeConfigFile                (callback) {
            console.log(`${log} 2. Merge config file init.`);

            mergeConfigFiles(nodeGenConfig, callback);
        }

        /**
         * @name                    - Validate config file
         * @description             - Validates the merged config file
         * @param callback          - Callback function (error)
         */
        function validateConfigFile             (callback) {
            console.log(`${log} 3. Validating config file.`);


            async.waterfall([
                validateNameOnModel,
                refactorModelName,
                refactorServiceName,
                validateModelNameSimilarity,
                validatePort,
                validateRouteEnable,
                validateFieldTypes
            ],function () {
                callback(null);
            });

            /**
             * @name            - Validate name on model
             * @description     - Validates name on model
             * @param cb        - Callback function (error)
             */
            function validateNameOnModel(cb) {
                console.log(`${iLog} Validate name on model.`);
                let error = false;
                mergedConfig.models.forEach(function (model, index) {
                    if(util.isNullOrUndefined(model.options.name)) {
                        console.error(`Model of index : ${index} must have a name.`);
                        error = true;
                    }
                    if(! error && index === mergedConfig.models.length - 1) {cb(null);}
                });
            }

            /**
             * @name            - Refactor mode name
             * @description     - Refactors model name to camel case.
             * @param cb        - Callback function (error)
             */
            function refactorModelName(cb) {
                console.log(`${iLog} Refactoring model name`);

                mergedConfig.models.forEach(function (model) {
                    model.options.name = camelCase(model.options.name);
                });
                cb(null);
            }

            /**
             * @name            - Refactor service name
             * @description     - Refactor service name to camel case
             * @param cb        - Callback function (error)
             */
            function refactorServiceName(cb) {
                console.log(`${iLog} Refactoring service name init.`);

                mergedConfig.serviceName = camelCase(mergedConfig.serviceName);
                cb(null);
            }

            /**
             * @name            - Validate model name similarity
             * @description     - Validates model name similarity
             * @param cb        - Callback function (error)
             */
            function validateModelNameSimilarity(cb) {
                console.log(`${iLog} Validate model name similarity.`);

                let modelNames = [];
                let error = false;
                mergedConfig.models.forEach(function (model, index) {
                    let modelName = model.options.name;
                    if(modelNames.indexOf(modelName) !== -1) {
                        console.error(`Model name of index ${index} and ${modelNames.indexOf(modelName)} has the same name.`);
                        error = true;
                    }
                    modelNames.push(model.options.name);
                    if(!error && index === mergedConfig.models.length - 1){cb(null);}
                });
            }

            /**
             * @name            - Validate port
             * @description     - Validates port
             * @param cb        - Callback function (error)
             */
            function validatePort(cb) {
                console.log(`${iLog} Validating port.`);

                if(isNaN(mergedConfig.environment.PORT)) {
                    console.error(`Port value : ${mergedConfig.environment.PORT} is not a number.`)
                }else{
                    cb(null);
                }
            }

            /**
             * @name            - Validate route enable
             * @description     - Validates routes enable
             * @param cb        - Callback function (error)
             */
            function validateRouteEnable(cb) {
                console.log(`${iLog} Validating if at least one mode has enabled route on.`);

                let routeEnabled = false;
                mergedConfig.models.forEach(function (model) {
                    if(model.options.enableRoute) {
                        routeEnabled = true;
                    }
                });
                if(routeEnabled) {
                    cb(null);
                }else{
                    console.error(`At least one route should be enabled on model options.`);
                }
            }

            /**
             * @name            - Validate field types
             * @description     - Validates field types
             * @param cb        - Callback function (error)
             */
            function validateFieldTypes(cb) {
                console.log(`${iLog} Validate field types init.`);

                let validTypes = ["String", "Number", "Boolean", "Bool", "Array", "Buffer", "Date", "ObjectId", "Oid", "Map", "Mixed"];
                let error = false;
                mergedConfig.models.forEach(function (model) {
                    if(model.options.enableRoute) {
                        let fieldsKey = Object.keys(model.fields);
                        fieldsKey.forEach(function (fieldKey) {
                            if(validTypes.indexOf(model.fields[fieldKey].type) === -1) {
                                error = true;
                                console.error(`Field type ${fieldKey} on ${model.options.name} must be of type : ${validTypes}`);
                            }
                        })
                    }
                });
                if(!error){cb(null);}
            }

        }

        /**
         * @name                    - Refactor config file
         * @description             - Refactors config file
         * @param callback          - Callback function (error)
         */
        function refactorConfigFile             (callback) {
            console.log(`${log} 4. Refactor config file init.`);

            async.waterfall([
                refactorBaseURL,
                refactorFieldType
            ],function () {
                callback(null);
            });

            /**
             * @name            - Refactor base url
             * @description     - Refactors base url
             * @param cb        - Callback function (error)
             */
            function refactorBaseURL(cb) {
                console.log(`${iLog} Refactor base url.`);

                if(!mergedConfig.baseURL.startsWith('/')) {
                    mergedConfig.baseURL = '/'.concat(mergedConfig.baseURL);
                }
                cb(null);

            }

            /**
             * @name            - Refactor field type
             * @description     - Refactors field type
             * @param cb        - Callback function (error)
             */
            function refactorFieldType(cb) {
                console.log(`${iLog} Refactor field type`);

                mergedConfig.models.forEach(function (model) {
                    let fieldsKey = Object.keys(model.fields);
                    fieldsKey.forEach(function (fieldKey) {
                        model.fields[fieldKey].type = String(model.fields[fieldKey].type);
                    });
                });
                cb(null);
            }
        }

        /**
         * @name                    - Validate server dir existence
         * @description             - Checks if server directory already exists,
         * if so removes everything except node_modules (if it exists) (with not to do other wise option.)
         * @param callback          - Callback function (error)
         */
        function verifyServerDirExistence       (callback) {
            console.log(`${log} 5. Verify server dir existence.`);

            // todo if the server directory already exists, remove all files except node_modules if passed param to do so in the cli.
            callback(null);
        }

        /**
         * @name                    - Generate directories
         * @description             - Generates required directories in the parent file
         * @param callback          - Callback function (error)
         */
        function generateDirectories            (callback) {
            console.log(`${log} 6. Generate directories init.`);

            shelljs.mkdir(path.resolve(outputPath, nodeGenConfig.serviceName));
            shelljs.cd(path.resolve(outputPath, nodeGenConfig.serviceName));
            shelljs.mkdir(createDir);

            callback(null);
        }

        /**
         * @name                    - Copy certificate
         * @description             - Copy certificate for https requests if provided.
         * @param callback
         */
        function copyCertificate                (callback) {
            console.log(`${log} 7. Copying certificate init.`);

            if(! util.isNullOrUndefined(mergedConfig.certificate.root) || ! util.isNullOrUndefined(mergedConfig.certificate.clientKey) || ! util.isNullOrUndefined(mergedConfig.certificate.client)) {
                console.log(`${iLog} Copying certificate from : ${path.resolve('../', mergedConfig.certificate)}`);
                shelljs.cp('-R', path.resolve('../', mergedConfig.certificate), path.resolve('./lib/helper/api/cert/.'));
                callback(null);
            }else{
                console.log(`${iLog} No certificate found, skipping ...`);
                callback(null);
            }
        }

        /**
         * @name                    - Generate package json
         * @description             - Generates the npm package file.
         * @param callback          - Callback function (error)
         */
        function generatePackageJSON            (callback) {
            console.log(`${log} 8. Generate package json init.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/package/package'), replaceValues.packageJSON(), 'package.json', '.', callback);
        }

        /**
         * @name                    - Generate git
         * @description             - Generates git file, with remote repo if provided.
         * @param callback          - Callback function (error)
         */
        function generateGit                    (callback) {
            console.log(`${log} 9. Generate git init.`);

            shelljs.exec('git init');
            setTimeout(function () {
                lib.generator(path.resolve(__dirname, './src/templates/git/gitIgnore'), replaceValues.packageJSON(), '.gitignore', '.', callback);
            },2000);
        }

        /**
         * @name                    - Generate environment file
         * @description             - Generates environment file
         * @param callback          - Callback function (error)
         */
        function generateEnvironmentFile        (callback) {
            console.log(`${log} 10. Generate environment file.`);

            lib.generator(path.resolve(__dirname, './src/templates/env/environment'), replaceValues.environment(), '.env', '.', callback);
        }

        /**
         * @name                    - Generate error codes
         * @description             - Generates error codes constants
         * @param callback          - Callback function (error)
         */
        function generateErrorCodes             (callback) {
            console.log(`${log} 11. Generating error code constants.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/constant/errorCodes'), replaceValues.errorCodes(), 'errorCodes.js', './lib/constant', callback);
        }

        /**
         * @name                    - Generate config
         * @description             - Generates config file
         * @param callback          - Callback function (error)
         */
        function generateConfig                 (callback) {
            console.log(`${log} 12. Generate config init.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/config/config'), replaceValues.config(), 'index.js', './config', callback);
        }

        /**
         * @name                    - Generate middleware
         * @description             - Generates required middleware
         * @param callback          - Callback function (error)
         */
        function generateMiddleware             (callback) {
            console.log(`${log} 13. Generating middle wares.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/lib/initializer'), replaceValues.initializer(), 'initializer.js', './lib/middleware', callback);
        }

        /**
         * @name                    - Generate middleware
         * @description             - Generates required middleware
         * @param callback          - Callback function (error)
         */
        function generateConstants              (callback) {
            console.log(`${log} 14. Generating constants.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/constant/constant'), replaceValues.constant(), 'constant.js', './lib/constant', callback);
        }

        /**
         * @name                    - Generate helper libraries index
         * @description             - Generates helper libraries index file
         * @param callback          - Callback function (error)
         */
        function generateHelperLibrariesIndex   (callback) {
            console.log(`${log} 15. Generating helper libraries.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/lib/helperLibraryIndex'), replaceValues.constant(), 'index.js', './lib/helper', callback);
        }

        /**
         * @name                    - Generate helper libraries
         * @description             - Generates helper libraries
         * @param callback          - Callback function (error)
         */
        function generateHelperLibraries        (callback) {
            console.log(`${log} 16. Generating helper libraries.`);

            if(mergedConfig.includeApiReqLib) {
                lib.generator(path.resolve(__dirname, './src/templates/node/lib/helperAPI'), replaceValues.helperAPI(), 'index.js', './lib/helper/api', callback);
            }else{
                callback(null);
            }
        }

        /**
         * @name                    - Generate controller helper
         * @description             - Generates any controller helper modules
         * @param callback          - Callback function (error)
         */
        function generateControllerHelper       (callback) {
            console.log(`${log} 17. Generating controller helper library.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/controller/controllerHelper'), replaceValues.controllerHelper(), 'controllerHelper.js', './lib/helper/others', callback);
        }

        /**
         * @name                    - Generate lib index
         * @description             - Generates index file
         * @param callback          - Callback function (error)
         */
        function generateLibIndex               (callback) {
            console.log(`${log} 18. Generating index file for libraries.`);

            lib.generator(path.resolve(__dirname, './src/templates/node/constant/constantsIndex'), replaceValues.constantIndex(), 'index.js', './lib/constant', callback);
        }

        /**
         * @name                    - Generate app
         * @description             - Generates the starting point of the server app.js
         * @param callback          - Callback function (error)
         */
        function generateApp                    (callback) {
            console.log('');
            console.log(`${log} 19. Generate app init.`);

            async.waterfall([
                replacePlaceHolders,
                replaceDependantServices
            ], function () {
                callback(null);
            });

            /**
             * @name                - Replace comments
             * @description         - Replaces header comments of app file.
             * @param cb            - Callback function (error)
             */
            function replacePlaceHolders(cb)            {
                console.log(`${iLog} Replacing comments init.`);

                lib.generator(path.resolve(__dirname, './src/templates/node/app'), replaceValues.app(), 'app.js', '.', cb);
            }

            /**
             * @name                - Replace dependant services
             * @description         - Replaces dependant services values by mark
             * @param cb            - Callback function (error)
             */
            function replaceDependantServices(cb)       {
                console.log(`${iLog} Replace dependant services init.`);

                let
                    templatePath        = './app.js',
                    fileName            = 'app.js',
                    parentPath          = '.',
                    replacementValues   = function () {
                        let
                            dependantServices   = mergedConfig.dependantServices.endPoints,
                            parsedValues        = [];
                        dependantServices.forEach(function (dependantService) {parsedValues.push(`"${dependantService}",`);});
                        return parsedValues;
                    },
                    mark                = "// End dependant service list",
                    tab                 = 2;

                replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb);
            }

        }

        /**
         * @name                    - Generate models
         * @description             - Generates model file by the provided models array
         * @param callback          - Callback function (error)
         */
        function generateModels                 (callback) {
            console.log(`${log} 20. Generate models init.`);

            let models  = mergedConfig.models,
                modelGenerator = [];

            models.forEach(function (model) {
                modelGenerator.push(function (cb) {
                    generateModelFile(model,cb);
                });
            });

            async.waterfall(modelGenerator, function () {
                callback(null);
            });

            /**
             * @name                - Generate model
             * @description         - Generates a single model file by the provided params
             * @param model         - Defines the model config to generate model file for.
             * @param cb            - Callback function (error)
             */
            function generateModelFile(model, cb) {
                console.log("Generating model files.");

                async.waterfall([
                    replacePlaceHolders,
                    createSchema,
                    cleanUpType
                ],function () {
                    cb(null);
                });

                /**
                 * @name                - Replace place holders
                 * @description         - Replaces place holder value from
                 * @param cb1           - Callback function (error)
                 */
                function replacePlaceHolders    (cb1)       {
                    console.log(`${iLog} Replacing place holders for model : ${model.options.name}`);
                    lib.generator(path.resolve(__dirname, './src/templates/node/model/model'), replaceValues.model(model.options.name, generateElementsForPagination()), `${model.options.name}.js`, './model', cb1);
                }

                /**
                 * @name                - Create schema
                 * @description         - Creates schema for the model
                 * @param cb1           - Callback function (error)
                 */
                function createSchema           (cb1)       {
                    console.log(`${iLog} Creating schema for model : ${model.options.name}`);

                    let
                        templatePath        = `./model/${model.options.name}.js`,
                        fileName            = `${model.options.name}.js`,
                        parentPath          = './model',
                        replacementValues   = function () {
                            let
                                modelKeys   = Object.keys(model.fields),
                                parsedValues = [];
                            modelKeys.forEach(function (modelKey) {
                                let schemaValues = model.fields[modelKey];
                                parsedValues.push(`${modelKey} : ${JSON.stringify(cleanSchema(schemaValues))},`);
                            });
                            return parsedValues;
                        },
                        mark                = "// Schema definition begins here",
                        tab                 = 2;

                    replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, false, cb1);

                    /**
                     * @name                    - Clean schema
                     * @description             - Clean's schema of un needed fields
                     * @param schemaValues      - Uncleaned schema values
                     */
                    function cleanSchema(schemaValues) {
                        let copySchema = Object.assign({}, schemaValues);

                        let attributesToRemove = [
                            "visibleOnPagination",
                            "publicVisibility",
                            "verifyOnCreate",
                            "editableOnUpdate",
                            "queryUsing"
                        ];
                        attributesToRemove.forEach(function (attributeToRemove) {
                            copySchema[attributeToRemove] = undefined;
                        });
                        return copySchema;
                    }
                }

                function cleanUpType(cb1) {
                    console.log(`${iLog} Clean up type declaration : ${model.options.name}`);
                    lib.generator(path.resolve(__dirname, `./model/${model.options.name}`), replaceValues.modelCleanUp(), `${model.options.name}.js`, './model', cb1);
                }

                /**
                 * @name                - Generate elements for pagination
                 * @description         - Generates elements for pagination view for the current model on iteration
                 * @return {string}     - Return elements view on pagination
                 */
                function generateElementsForPagination()    {
                    let
                        visibleElements = "",
                        fieldsKey = Object.keys(model.fields);
                    fieldsKey.forEach(function (fieldKey) {
                        if(model.fields[fieldKey].visibleOnPagination && model.fields[fieldKey].publicVisibility) {
                            visibleElements = visibleElements.concat(`${fieldKey} `);
                        }
                    });
                    visibleElements = visibleElements.concat("firstModified lastModified"); // Default values to be visible on pagination call.
                    return visibleElements;
                }

            }

        }

        /**
         * @name                    - Generate dals
         * @description             - Generates dal files for each provided models.
         * @param callback          - Callback function (error)
         */
        function generateDals                   (callback) {
            console.log(`${log} 21. Generate dals init.`);

            let
                models  = mergedConfig.models,
                dalGenerator = [];

            function genDal(model,cb) {
                let modelName = model.options.name,
                    privateFields = function () {
                        let
                            hideFields = "",
                            fieldsKey  = Object.keys(model.fields);
                        fieldsKey.forEach(function (fieldKey) {
                            if(! model.fields[fieldKey].publicVisibility) {
                                hideFields = hideFields.concat(`-${fieldKey} `)
                            }
                        });
                        return hideFields;
                    };
                lib.generator(path.resolve(__dirname, './src/templates/node/dal/dal'), replaceValues.dal(modelName, privateFields), `${modelName}.js`, './dal', cb);
            }

            models.forEach(function (model) {
                dalGenerator.push(function (cb) {
                    genDal(model, cb);
                })
            });

            async.waterfall(dalGenerator, function () {
                callback(null);
            });
        }

        /**
         * @name                    - Generate controllers
         * @description             - Generates controllers for the routes.
         * @param callback          - Callback function (error)
         */
        function generateControllers            (callback) {
            console.log(`${log} 22. Generate controllers init.`);

            let
                models  = mergedConfig.models,
                controllerGenerators = [];

            models.forEach(function (model) {
                controllerGenerators.push(function (cb) {
                    generateControllerFile(model, cb);
                });
            });

            /**
             * @name                - Generate controller file
             * @description         - Generates a single controller file by the provided params
             * @param model         - Defines the model config to generate controller file for.
             * @param cb            - Callback function (error)
             */
            function generateControllerFile(model, cb) {
                async.waterfall([
                    validateIfModelRequiresController,
                    createController
                ],function () {
                    cb(null);
                });

                /**
                 * @name            - Validate If model requires controller
                 * @description     - Validates if model requires controller based on configuration
                 * @param cb2       - Callback function (error)
                 */
                function validateIfModelRequiresController(cb2) {
                    console.log(`${iLog} Validating if model requires controller.`);

                    if(model.options.enableRoute) {cb2(null);}
                    else{
                        cb(null);
                    }
                }

                /**
                 * @name            - Create controller
                 * @description     - Creates controller file for model
                 * @param cb2       - Callback function (error)
                 */
                function createController(cb2)                  {
                    console.log(`${iLog} Generating controller file for : ${model.options.name}`);

                    let controllerReplacements = {

                        getRequiredFieldsOnCreate   : function () {
                            let requiredFields  = "",
                                fields          = model.fields,
                                fieldKeys       = Object.keys(fields);
                            fieldKeys.forEach(function (fieldKey) {
                                if(fields[fieldKey].verifyOnCreate) {requiredFields = requiredFields.concat(`"${fieldKey}",`);}
                            });
                            return requiredFields.slice(0, requiredFields.length - 1);
                        },
                        getValidQuery               : function () {
                            let validQuery      = "",
                                fields          = model.fields,
                                fieldKeys       = Object.keys(fields);
                            fieldKeys.forEach(function (fieldKey) {
                                if(fields[fieldKey].queryUsing) {validQuery = validQuery.concat(`"${fieldKey}",`);}
                            });
                            return validQuery.slice(0, validQuery.length - 1);
                        },
                        getValidUpdateData          : function () {
                            let validUpdateData = "",
                                fields          = model.fields,
                                fieldKeys       = Object.keys(fields);
                            fieldKeys.forEach(function (fieldKey) {
                                if(fields[fieldKey].editableOnUpdate) {validUpdateData = validUpdateData.concat(`"${fieldKey}",`);}
                            });
                            return validUpdateData.slice(0, validUpdateData.length - 1);
                        }
                    };

                    // Generating controller file
                    lib.generator(
                        path.resolve(
                            __dirname, './src/templates/node/controller/controller'),
                            replaceValues.controller(model.options.name, controllerReplacements.getRequiredFieldsOnCreate(), controllerReplacements.getValidQuery(), controllerReplacements.getValidUpdateData()),
                            `${model.options.name}.js`,
                            './controller',
                            cb2);
                }
            }

            async.waterfall(controllerGenerators, function () {
                callback(null);
            });

        }

        /**
         * @name                    - Generate route index
         * @description             - Generates route index
         * @param callback          - Callback function (error)
         */
        function generateRouteIndex             (callback) {
            console.log(`${log} 23. Generate route.js index init.`);

            async.waterfall([
                replacePlaceHolders,
                replaceRouteVarDeclaration,
                replaceRoutingDefinition
            ], function () {
                callback(null);
            });

            /**
             * @name                - Replace comments
             * @description         - Replaces header comments of route.js index
             * @param cb            - Callback function (error)
             */
            function replacePlaceHolders(cb)        {
                console.log(`${iLog} Replacing comments init.`);
                lib.generator(path.resolve(__dirname, './src/templates/node/route/routeIndex'), replaceValues.routerIndex(), 'index.js', './routes', cb);
            }

            /**
             * @name                - Replace route.js var declaration
             * @description         - Replaces route.js declaration values by mark
             * @param cb            - Callback function (error)
             */
            function replaceRouteVarDeclaration(cb) {
                console.log(`${iLog} Replace dependant services init.`);

                let
                    templatePath        = './routes/index.js',
                    fileName            = 'index.js',
                    parentPath          = './routes',
                    replacementValues   = function () {
                        let
                            models  = mergedConfig.models,
                            parsedValues        = [];

                        models.forEach(function (model) {
                            if(model.options.enableRoute){
                                parsedValues.push(`${model.options.name} = require('./${model.options.name}'),`);
                            }
                        });
                        parsedValues[parsedValues.length-1] = parsedValues[parsedValues.length-1].replace(',', ";");
                        return parsedValues;
                    },
                    mark                = "// End route var declaration here",
                    tab                 = 2;
                replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb);
            }

            /**
             * @name                - Replace routing definition
             * @description         - Replace routing definition of route.js index file
             * @param cb            - Callback function (error)
             */
            function replaceRoutingDefinition(cb)   {
                console.log(`${iLog} Replace routing definition init.`);

                let
                    templatePath        = './routes/index.js',
                    fileName            = 'index.js',
                    parentPath          = './routes',
                    replacementValues   = function () {
                        let
                            models  = mergedConfig.models,
                            parsedValues        = [];

                        models.forEach(function (model) {
                            if(model.options.enableRoute){
                                parsedValues.push(`app.use('${mergedConfig.baseURL}/${model.options.name}', ${model.options.name});`);
                            }
                        });
                        return parsedValues;
                    },
                    mark                = "// End Routing definition here",
                    tab                 = 2;
                replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb);
            }
        }

        /**
         * @name                    - Generate routes
         * @description             - Generates routes for the controllers, also set up authentication mw if provided.
         * @param callback          - Callback function (error)
         */
        function generateRoutes                 (callback) {
            console.log(`${log} 24. Generate routes init.`);

            let models  = mergedConfig.models,
                routeGenerator = [];

            models.forEach(function (model) {
                if(model.options.enableRoute) {
                    routeGenerator.push(function (cb) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/route/route'), replaceValues.route(model.options.name), `${model.options.name}.js`, './routes', cb);
                    });
                }
            });

            async.waterfall(routeGenerator, function () {
                callback(null);
            });
        }

        /**
         * @name                    - Generate docker files
         * @description             - Generates dockerfile and docker compose file.
         * @param callback          - Callback function (error)
         */
        function generateDockerFiles            (callback) {
            console.log(`${log} 25. Generate docker files init.`);

            if(mergedConfig.docker) {
                async.waterfall([
                    generateDockerFile,
                    generateDockerComposeFile,
                    generateDockerIgnoreFile
                ],function () {
                    callback(null);
                });

                /**
                 * @name                - Generate docker file
                 * @description         - Generates docker file
                 * @param cb            - Callback function (error)
                 */
                function generateDockerFile(cb) {
                    console.log(`${iLog} Generate docker file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/dockerfile'), replaceValues.dockerFile(), 'Dockerfile', '.', cb);
                }

                /**
                 * @name                - Generate docker compose file
                 * @description         - Generates docker compose file
                 * @param cb            - Callback function (error)
                 */
                function generateDockerComposeFile(cb) {
                    console.log(`${iLog} Generate docker compose file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/dockerCompose'), replaceValues.dockerCompose(), 'docker-compose.yml', '.', cb);
                }

                /**
                 * @name                - Generate docker ignore file
                 * @description         - Generates docker ignore file
                 * @param cb            - Callback function (error)
                 */
                function generateDockerIgnoreFile(cb) {
                    console.log(`${iLog} Generate docker ignore file.`);
                    lib.generator(path.resolve(__dirname, './src/templates/docker/dockerIgnore'), replaceValues.dockerIgnore(), '.dockerignore', '.', cb);
                }
            }else{
                callback(null);
            }

        }

        /**
         * @name                    - Install packages
         * @description             - Install npm packages
         * @param callback          - Callback function (error)
         */
        function installPackages                (callback) {
            console.log(`${log} 26. Install packages init.`);
            shelljs.exec('npm install');
            callback(null);
        }

        /**
         * @name                    - Generate authentication service
         * @description             - If enabled by the config generates configuration service
         * @param callback          - Callback function (error)
         */
        function generateAuthService            (callback) {
            console.log(`${log} 27. Generating authentication service init.`);
            console.log('Skipping...');
            callback(null);
        }

        /**
         * @name                    - Generate user service
         * @description             - If enabled by the config generates user service
         * @param callback          - Callback function (error)
         */
        function generateUserService            (callback) {
            console.log(`${log} 28. Generating user service init.`);
            console.log('Skipping...');
            callback(null);
        }

        /**
         * @name                    - Generate test files
         * @description             - Generates test files for each route.js.
         * @param callback          - Callback function (error)
         */
        function generateTestFiles              (callback) {
            console.log(`${log} 29. Generate test files init.`);

            if(mergedConfig.test) {
                async.waterfall([
                    generateFiles, // Generate the test, dummy data and url generator files by replacing global place holders
                    insertUrlGenerator,
                    insertDummyData,
                    insertTest,
                    insertEvalStatements
                ],function () {
                    callback(null);
                });

                /**
                 * @name            - Generate files
                 * @description     - Generates test files
                 * @param cb        - Callback function (error)
                 */
                function generateFiles      (cb) {
                    console.log(`${iLog} Generating dummy data, url generator and test file data.`);

                    async.waterfall([
                        generateBasicUrlGenerator,
                        generateBasicTestFile,
                        generateBasicDummyData,

                        // todo for separate test suite generation.
                        // generateSuiteFiles,
                        // generateSuiteIndex,
                        // generateValidator
                    ],function () {
                        cb(null);
                    });

                    /**
                     * @name            - Generate basic url generator
                     * @description     - Generates basic url generator file with basic replace values
                     * @param cb2       - Callback function (error)
                     */
                    function generateBasicUrlGenerator(cb2) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/test/url_generator_outer.js'), replaceValues.urlGeneratorOuter(), 'url_generator.js', './test', cb2);
                    }

                    /**
                     * @name            - Generate basic test file
                     * @description     - Generates basic test file with basic replace values
                     * @param cb2       - Callback function (error)
                     */
                    function generateBasicTestFile(cb2) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/test/test_outer.js'), replaceValues.testOuter(), 'test.js', './test', cb2);
                    }

                    /**
                     * @name            - Generate basic dummy data
                     * @description     - Generates basic dummy data file with basic replace values
                     * @param cb2       - Callback function (error)
                     */
                    function generateBasicDummyData(cb2) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/test/dummy_data_outer.js'), replaceValues.dummyDataOuter(), 'dummy_data.js', './test', cb2);
                    }

                    /**
                     * @name            - Generate suite files
                     * @description     - Generates suite file for models.
                     * @param cb2       - Callback function (error)
                     */
                    function generateSuiteFiles(cb2) {
                        let models = mergedConfig.models,
                            suiteGenerators = [];

                        models.forEach(function (model) {
                            if(model.options.enableRoute){
                                suiteGenerators.push(function (cb3) {
                                    lib.generator(path.resolve(__dirname, './src/templates/node/test/suite.js'), replaceValues.testSuite(model.options.name), `${model.options.name}.js`, './test/suite', cb3);
                                });
                            }
                        });
                        async.waterfall(suiteGenerators,cb2);
                    }

                    /**
                     * @name                - Generate suite index
                     * @description         - Generates suite index file
                     * @param cb2           - Callback function (error)
                     */
                    function generateSuiteIndex(cb2) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/test/suiteIndex'), replaceValues.suiteIndex(), `index.js`, './test/suite', cb2);
                    }

                    /**
                     * @name                - Generate validator
                     * @description         - Generaetes validator files.
                     * @param cb2           - Callback function (error)
                     */
                    function generateValidator(cb2) {
                        lib.generator(path.resolve(__dirname, './src/templates/node/test/validator.js'), replaceValues.validators(), `validator.js`, './test', cb2);
                    }
                }

                /**
                 * @name            - Insert url generator
                 * @description     - Inserts url generator data
                 * @param cb        - Callback function (error)
                 */
                function insertUrlGenerator (cb) {
                    console.log(`${iLog} Insert url generator files.`);

                    async.waterfall([
                        insertRoutesVar,
                        insertRoutesDefinition
                    ],function () {
                        cb(null);
                    });

                    function insertRoutesVar(cb2) {
                        let
                            templatePath        = './test/url_generator.js',
                            fileName            = 'url_generator.js',
                            parentPath          = './test',
                            replacementValues   = function () {
                                let
                                    models  = mergedConfig.models,
                                    parsedValues        = [];

                                models.forEach(function (model) {
                                    if(model.options.enableRoute){
                                        parsedValues.push("const " + `${model.options.name}Route =` + " `${baseURL}/" + model.options.name + "`" + ";");
                                    }
                                });
                                return parsedValues;
                            },
                            mark                = "// End inserting routes url here",
                            tab                 = 0;
                        replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb2);
                    }

                    function insertRoutesDefinition(cb2) {
                        let
                            templatePath        = './test/url_generator.js',
                            fileName            = 'url_generator.js',
                            parentPath          = './test',
                            replacementValues   = function () {
                                let
                                    models  = mergedConfig.models,
                                    parsedValues        = [];

                                models.forEach(function (model) {
                                    if(model.options.enableRoute){
                                        parsedValues.push(innerTemplate.test.urlGenerator(model.options.name));
                                    }
                                });
                                return parsedValues;
                            },
                            mark                = "// End inserting rest end points for routes here",
                            tab                 = 0;
                        replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb2);
                    }
                }

                /**
                 * @name            - Insert dummy data
                 * @description     - Inserts dummy data of models
                 * @param cb       - Callback function (error)
                 */
                function insertDummyData    (cb) {
                    console.log(`${iLog} Inserting dummy data.`);

                    let
                        templatePath        = './test/dummy_data.js',
                        fileName            = 'dummy_data.js',
                        parentPath          = './test',
                        replacementValues   = function () {
                            let
                                models  = mergedConfig.models,
                                parsedValues        = [];

                            models.forEach(function (model) {
                                if(model.options.enableRoute){
                                    let validUpdateData = function () {
                                        let updateData = Object.assign({}, model.fields);
                                        let modelKeys = Object.keys(updateData);
                                        modelKeys.forEach(function (modelKey) {
                                            if(! updateData[modelKey].editableOnUpdate) {updateData[modelKey] = undefined;}
                                        });
                                        return updateData;
                                    };
                                    let
                                        createData  = innerTemplate.test.dummyDataTemplateGenerator(model.fields),
                                        updateData  = innerTemplate.test.dummyDataTemplateGenerator(validUpdateData());
                                    parsedValues.push(innerTemplate.test.dummyData(model.options.name,createData, updateData));
                                }
                            });
                            return parsedValues;
                        },
                        mark                = "// Dummy data for service test ends here",
                        tab                 = 0;
                    replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb);
                }

                /**
                 * @name            - Insert test
                 * @description     - Inserts test data
                 * @param cb        - Callback function (error)
                 */
                function insertTest         (cb) {
                    console.log(`${iLog} Insert test file.`);

                    let
                        templatePath        = './test/test.js',
                        fileName            = 'test.js',
                        parentPath          = './test',
                        replacementValues   = function () {
                            let
                                models  = mergedConfig.models,
                                parsedValues = [];

                            models.forEach(function (model) {
                                if(model.options.enableRoute){
                                    parsedValues.push(innerTemplate.test.testFile(model.options.name));
                                }
                            });
                            return parsedValues;
                        },
                        mark                = "// End inserting test validation here",
                        tab                 = 0;
                    replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues(), mark, tab, true, cb);
                }

                /**
                 * @name            - Insert eval statements
                 * @description     - Inserts conditional evaluation statements.
                 * @param cb        - Callback function (error)
                 */
                function insertEvalStatements(cb) {
                    console.log(`${iLog} Inserting public and private evaluation statements.`);

                    let models = mergedConfig.models;
                    let evalStatementGenerator = [];

                    models.forEach(function (model) {
                        if(model.options.enableRoute){
                            evalStatementGenerator.push(function (cb4) {
                                async.waterfall([
                                    replacePublicEval,
                                    replacePrivateEval
                                ],function () {
                                    cb4(null);
                                });

                                /**
                                 * @name                - Replace public eval
                                 * @description         - Replaces public eval.
                                 * @param cb2           - Callback function (error)
                                 */
                                function replacePublicEval(cb2) {
                                    innerTemplate.test.expectEvalTest(model,function (err, evalConstruct) {
                                        let
                                            templatePath        = './test/test.js',
                                            fileName            = 'test.js',
                                            parentPath          = './test',
                                            replacementValues   = evalConstruct.publicEval,
                                            mark                = `// End body expected evaluation here for model : ${model.options.name} (public)`,
                                            tab                 = 0;
                                        replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb2);
                                    });
                                }

                                /**
                                 * @name            - Replace private eval
                                 * @description     - Replaces private eval
                                 * @param cb2
                                 */
                                function replacePrivateEval(cb2) {
                                    innerTemplate.test.expectEvalTest(model,function (err, evalConstruct) {
                                        let
                                            templatePath        = './test/test.js',
                                            fileName            = 'test.js',
                                            parentPath          = './test',
                                            replacementValues   = evalConstruct.privateEval,
                                            mark                = `// End body expected evaluation here for model : ${model.options.name} (private)`,
                                            tab                 = 0;
                                        replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb2);
                                    });
                                }
                            })
                        }
                    });

                    async.waterfall(evalStatementGenerator, cb);
                }
            }else{
                console.log('Skipping...');
                callback(null);
            }
        }

        /**
         * @name                    - Generate test report and coverage
         * @description             - Generates test reports and coverages.
         * @param callback          - Callback function (error)
         */
        function generateTestReportAndCoverage  (callback) {
            console.log(`${log} 30. Generate test report and coverage init.`);

            if(mergedConfig.test){
                shelljs.exec('npm run test');
                callback(null);
            }else{callback(null);}
        }

        /**
         * @name                    - Generate documentation
         * @description             - Generates documentation file for the routes
         * @param callback          - Callback function (error)
         */
        function generateDocumentation          (callback) {
            console.log(`${log} 31. Generate documentation init.`);

            if(mergedConfig.documentation) {
                async.waterfall([
                    generatesApiDocConfig,
                    insertApiDocValues,
                    generateDoc
                ],function () {
                    callback(null);
                });

                /**
                 * @name                - Generate apidoc config
                 * @description         - Generates apidoc configuration
                 * @param cb            - Callback function (error)
                 */
                function generatesApiDocConfig(cb) {
                    console.log(`${iLog} Generating api doc config.`);

                    lib.generator(path.resolve(__dirname, './src/templates/documentation/apidoc'), replaceValues.apidoc(), `apidoc.json`, '.', cb);
                }

                /**
                 * @name                - Insert apidoc values
                 * @description         - Insert apidoc values
                 * @param cb            - Callback function (error)
                 */
                function insertApiDocValues(cb) {
                    console.log(`${iLog} Insert api doc value`);

                    let filteredModels = nodeGenConfig.models.filter(model => model.options.enableRoute);
                    let index = 0;
                    filteredModels.forEach(function (model) {
                        innerTemplate.documentation.dummyData(model, function (err, dummyDocData) {
                            insertApiDocValue(dummyDocData, model, function () {
                                index++;
                                if(index === filteredModels.length) {cb(null);}
                            });
                        });
                    });

                    function insertApiDocValue(dummyDocData, model, cb2) {
                        async.waterfall([
                            // All post route values to replace
                            insertPostBodyDescriptor,
                            insertPostBodyExample,
                            insertPostSuccessDescriptor,
                            insertPostSuccessSample,
                            // All get route values to replace
                            insertGetValidQuery,
                            insertGetPaginationResponse,
                            // All put route values to replace
                            insertPutBodyExample,
                            insertPutValidQueries,
                            // All delete route values to replace
                            insertDeleteValidQueries,
                            // Cleaning up replacement marks.
                            cleanUpDocumentation
                        ], function () {
                            cb2(null);
                        });

                        /**
                         * @name                - Insert post body descriptor
                         * @description         - Inserts post body descriptor in documentation post route
                         * @param cb3           - Callback function (error)
                         */
                        function insertPostBodyDescriptor(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.postBodyDescriptor,
                                mark                = ` * End inserting success body descriptor here POST`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert post body example
                         * @description         - Inserts post body example in documentation post route
                         * @param cb3           - Callback function (error)
                         */
                        function insertPostBodyExample(cb3) {

                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.postBodyExample,
                                mark                = ` * End inserting sample body example here POST`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert post success descriptor
                         * @description         - Inserts post success descriptor in documentation post route.
                         * @param cb3           - Callback function (error)
                         */
                        function insertPostSuccessDescriptor(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.postSuccessDescriptor,
                                mark                = ` * End inserting success body descriptor here POST`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert post success sample
                         * @description         - Inserts post success sample in documentation in post route
                         * @param cb3           - Callback function (error)
                         */
                        function insertPostSuccessSample(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.postSuccessSample,
                                mark                = ` * End inserting success body here POST`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert get valid query
                         * @description         - Inserts get valid query in documentation in get route
                         * @param cb3           - Callback function (error)
                         */
                        function insertGetValidQuery(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.getValidQuery,
                                mark                = ` * End inserting other query values here GET`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert get pagination response
                         * @description         - Inserts get pagination response in documentation in get route
                         * @param cb3           - Callback function (error)
                         */
                        function insertGetPaginationResponse(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.getPaginationResponse,
                                mark                = `           End inserting body data here GET`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert put body example
                         * @description         - Inserts put body example in documentation in put route
                         * @param cb3           - Callback function (error)
                         */
                        function insertPutBodyExample(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.putBodyExample,
                                mark                = ` * End inserting sample body example here PUT`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert put valid queries
                         * @description         - Inserts put valid queries in documentation in put route
                         * @param cb3           - Callback function (error)
                         */
                        function insertPutValidQueries(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.putValidQueries,
                                mark                = ` * End inserting valid queries PUT`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Insert delete valid queries
                         * @description         - Inserts delete valid queries in documentation in delete route
                         * @param cb3           - Callback function (error)
                         */
                        function insertDeleteValidQueries(cb3) {
                            let
                                templatePath        = `./routes/${model.options.name}.js`,
                                fileName            = `${model.options.name}.js`,
                                parentPath          = './routes',
                                replacementValues   = dummyDocData.deleteValidQueries,
                                mark                = ` * End inserting valid queries DELETE`,
                                tab                 = 0;
                            replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab, true, cb3);
                        }

                        /**
                         * @name                - Clean up documentation
                         * @description         - Cleans up marks from documentation.
                         * @param cb3           - Callback function (error)
                         */
                        function cleanUpDocumentation(cb3) {
                            lib.generator(path.resolve(`./routes/${model.options.name}.js`), replaceValues.documentationCleanUp(), `${model.options.name}.js`, './routes', cb3);
                        }

                    }
                }

                /**
                 * @name                - Generate doc
                 * @description         - Generates documentation
                 * @param cb            - Callback function (error)
                 */
                function generateDoc(cb) {
                    console.log(`${iLog} Generating documentation using apidoc.`);

                    shelljs.exec('npm run apidoc');
                    cb(null);
                }
            }else{
                callback(null);
            }

        }

        /**
         * @name                    - Clean up comments
         * @description             - If the does not require comments this will clean up any un needed comments
         * @param callback          - Callback function (error)
         */
        function cleanUpComments                (callback) {
            console.log(`${log} 32. Cleaning comments init.`);

            async.waterfall([
                cleanHeader,
                cleanFunction,
                cleanProgress,
                cleanTODO
            ],function () {
                console.log('Skipping...');
                callback(null);
            });

            /**
             * @name                - Clean Header
             * @description         - Cleans all header messages
             * @param cb            - Callback function (error)
             */
            function cleanHeader(cb) {
                console.log(`${iLog} Cleaning header.`);

                cb(null);
            }

            /**
             * @name                - Clean functions
             * @description         - Cleans function comments
             * @param cb            - Callback function (error)
             */
            function cleanFunction(cb) {
                console.log(`${iLog} Clean functions.`);

                cb(null);
            }

            /**
             * @name                - Clean progress
             * @description         - Clean all progress messages.
             * @param cb
             */
            function cleanProgress(cb) {
                console.log("Clean progress message");
                console.log(`${iLog} `);

                cb(null);
            }

            /**
             * @name                - Clean To-do
             * @description         - Cleans to do messages
             * @param cb            - Callback function (error)
             */
            function cleanTODO(cb) {
                console.log(`${iLog} Clean todo messages.`);

                cb(null);
            }


        }

        /**
         * @name                    - Generate jenkins file
         * @description             - Generates pipe line jenkins file.
         * @param callback          - Callback function (error)
         */
        function generateJenkinsFile            (callback) {
            console.log(`${log} 33. Generate jenkins file init.`);

            if(mergedConfig.jenkins) {
                lib.generator(path.resolve(__dirname, './src/templates/jenkins/jenkins'), replaceValues.jenkinsFile(), 'Jenkinsfile', '.', callback);
            }else{
                callback(null);
            }
        }

        /**
         * @name                    - Generate nginx config file
         * @description             - If nginx file is requested, then creates nginx config file.
         * @param callback          - Callback function (error)
         */
        function generateNginxConfigFile        (callback) {
            console.log(`${log} 34. Generate nginx config file init.`);

            if(mergedConfig.nginx) {
                async.waterfall([
                    generateDirs,
                    generateDocker,
                    generateConfigFile,
                    generateJenkins,
                    insertCertificate
                ],function () {
                    callback(null);
                });
            }else{callback(null);}

            /**
             * @name            - Using cert
             * @description     - Returns true if the server is using certificate
             * @return {*}      - Boolean
             */
            function usingCert() {
                return !util.isNullOrUndefined(mergedConfig.certificate.client) && util.isNullOrUndefined(mergedConfig.certificate.clientKey);
            }

            /**
             * @name            - Generate dirs
             * @description     - Generates reverse proxy address
             * @param cb        - Callback function (error)
             */
            function generateDirs(cb) {
                console.log(`${iLog} Generating directories.`);

                shelljs.mkdir(['reverse_proxy']);
                if(usingCert()) {
                    shelljs.mkdir(['reverse_proxy/ssl']);
                }
                cb(null);
            }

            /**
             * @name            - Generate docker
             * @description     - Generates docker file and docker compose file for reverse proxy
             * @param cb        - Callback function (error)
             */
            function generateDocker(cb) {
                console.log(`${iLog} Generate docker files for nginx.`);

                lib.generator(path.resolve(__dirname, usingCert() ? './src/templates/nginx/docker/DockerfileS' : './src/templates/nginx/docker/Dockerfile'), replaceValues.dockerFileNginx(), 'Dockerfile', './reverse_proxy', function () {
                    lib.generator(path.resolve(__dirname, './src/templates/nginx/docker/docker-compose'), replaceValues.dockerComposeNginx(), 'docker-compose.yml', './reverse_proxy', cb);
                });
            }

            /**
             * @name            - Generates config file
             * @description     - Generates nginx config file
             * @param cb        - Callback function (error)
             */
            function generateConfigFile(cb) {
                console.log(`${iLog} Generating config file.`);

                async.waterfall([
                    generateInitConfigFile,
                    insertAuthenticationConfig,
                    insertUserConfig
                ],function () {
                    cb(null);
                });

                /**
                 * @name            - Generate init config file
                 * @description     - Generates config file
                 * @param cb2       - Callback function (error)
                 */
                function generateInitConfigFile(cb2) {
                    lib.generator(
                        path.resolve(__dirname, usingCert() ? './src/templates/nginx/nginxConfigS' : './src/templates/nginx/nginxConfig'),
                        replaceValues.nginxConfig(usingCert()),
                        'nginx.conf',
                        './reverse_proxy',
                        cb2);
                }

                /**
                 * @name            - Insert authentication config
                 * @description     - Inserts authentication config inside nginx config if enabled
                 * @param cb2       - Callback function (error)
                 */
                function insertAuthenticationConfig(cb2) {
                    // todo insert authentication config
                    cb2(null);
                }

                /**
                 * @name            - Insert user config
                 * @description     - Inserts user config inside nginx config if enabled
                 * @param cb2       - Callback function
                 */
                function insertUserConfig(cb2) {
                    // todo insert user config
                    cb2(null);
                }
            }

            /**
             * @name            - Generate jenkins
             * @description     - Generates jenkins file for the reverse proxy
             * @param cb        - Callback function (error)
             */
            function generateJenkins(cb) {
                console.log(`${iLog} Generating jenkins file for the reverse proxy.`);

                lib.generator(path.resolve(__dirname, './src/templates/nginx/jenkins'), replaceValues.jenkinsNginx(), 'Jenkinsfile', './reverse_proxy', cb);
            }

            /**
             * @name            - Insert certificate
             * @description     - Copy certificate to ssl dir
             * @param cb        - Callback function (error)
             */
            function insertCertificate(cb) {
                console.log(`${iLog} Copying certificate`);

                if(usingCert()) {
                    // todo insert certificate here
                    cb(null);
                }else{cb(null);}
            }
        }

        /**
         * @name                    - Generate postman collection file
         * @description             - Generates a postman collection file.
         * @param callback          - Callback function (error)
         */
        function generatePostManCollectionFile  (callback) {
            console.log(`${log} 35. Generate post man collection file init.`);
            console.log('Skipping...');
            callback(null);
        }

        /**
         * @name                    - Generate get me file
         * @description             - Generates very simple get me file.
         * @param callback          - Callback function (error)
         */
        function generateReadMeFile             (callback) {
            console.log(`${log} 36. Generate get me file init.`);

            if(mergedConfig.readMe) {
                lib.generator(path.resolve(__dirname, './src/templates/documentation/readMe'), replaceValues.readMe(), 'README.md', '.', callback);
            }else{
                callback(null);
            }
        }

        /**
         * @name                    - Check over all integrity
         * @description             - Checks the over all integrity of the generated files, and if something is wrong will run generator again
         * @param callback          - Callback function (error)
         */
        function checkOverAllIntegrity          (callback) {
            console.log(`${log} 37. Check over all generated files integrity`);
            console.log('Skipping...');
            // todo if there is something wrong roll back. or begin generator again.
            callback(null);
        }

        /**
         * @name                    - Commit Files
         * @description             - Commit's generated files
         * @param callback          - Callback function (error)
         */
        function commitFiles                    (callback) {
            console.log(`${log} 38. Commit and push init.`);

            if(mergedConfig.commit) {
                shelljs.exec('git add .');
                shelljs.exec(`git commit --message="Initial commit by gennode"`);
                callback(null);
            }else{
                console.log('Skipping...');
                callback(null);
            }
        }

        /**
         * @name                    - Run server
         * @description             - If requested to run server after completion, then server will begin running.
         * @param callback          - Callback function (error)
         */
        function runServer                      (callback) {
            console.log(`${log} 39. Running server init.`);

            if(mergedConfig.runServer) {
                shelljs.exec('npm run run');
            }else{
                console.log('Skipping...');
            }
            callback(null);
        }

    },

    /**
     * @name                    - Generate sample config
     * @description             - Generates sample my hero academia gennode config file
     */
    generateSampleConfig    : function () {
        console.log(`${log} Generating sample Hero Academia GenNode configuration file.`);
        lib.generator(path.resolve(__dirname, './src/templates/gennode/heroacademia.config.js'), replaceValues.heroAcademia(), 'heroacademia.config.js', '.', function () {
            console.log(`${log} Done generating my hero academia gennode configuration file.`);
        });
    },

    /**
     * @name                    - Generate config
     * @description             - Generates gennode configuration file from the user's prompted answer
     * @param answers           - User answers
     */
    generateConfig          : function (answers) {
        async.waterfall([
            createEnvironmentObject,
            removeEnvironmentObjectFromAnswers,
            insertDummyModelData,
            mergeDefaultConfigAndAnswer,
            generateConfigurationFile
        ],function () {
        });

        /**
         * @name            - Create environmentObject
         * @description     - Creates nestable environment object
         * @param callback  - Callback function (error)
         */
        function createEnvironmentObject(callback) {
            let environment = Object.assign({}, {
                DEBUG : answers.debug,
                PORT : answers.port,
                MODE : answers.mode,
                MONGODB_URL : answers.mongodbURL,
                REVERSE_PROXY : answers.reverseProxy,
                COLLECTION_RETURN_SIZE : answers.collectionReturnSize,
                ELEMENT_IN_PAGE : answers.elementInPage,
                ELASTIC_SEARCH_URL : answers.elasticSearchURL
            });

            callback(null, environment);
        }

        /**
         * @name                - Remove environment object from answers
         * @description         - Removes environment object from answers and replaces with a nestable value
         * @param environment   - Constructed environment variables
         * @param callback      - Callback function (error)
         */
        function removeEnvironmentObjectFromAnswers(environment, callback) {
            delete answers.debug;
            delete answers.port;
            delete answers.mode;
            delete answers.mongodbURL;
            delete answers.reverseProxy;
            delete answers.collectionReturnSize;
            delete answers.elementInPage;
            delete answers.elasticSearchURL;

            answers.environment = environment;
            callback(null);
        }

        /**
         * @name            - Insert dummy model data
         * @description     - Inserts dummy model data
         * @param callback  - Callback function (error)
         */
        function insertDummyModelData(callback) {
            let sampleDummyModel = [];
            sampleDummyModel.push(
                {
                    options : {
                        name : 'sampleModel',
                        enableRoute : true,
                    },
                    fields  : {
                        name : {type : "String"},
                        age : {type : "Number"},
                        email : {type : "String"}
                    }
                }
            );
            answers.models = sampleDummyModel;
            callback(null);
        }

        /**
         * @name            - Merge default config and answer
         * @description     - Merges the default config with the provided answer
         * @param callback  - Callback function (error)
         */
        function mergeDefaultConfigAndAnswer(callback) {
            mergeConfigFiles(answers, callback);
        }

        /**
         * @name            - Generate configuration file
         * @description     - Generates configuration file according to the merged default config and user's answer
         * @param callback  - Callback function (error)
         */
        function generateConfigurationFile(callback) {
            lib.generator(path.resolve(__dirname, './src/templates/gennode/gennode'), replaceValues.genNodeConfig(answers.author, answers.serviceName, JSON.stringify(mergedConfig, null,  4)), 'gennode.config.js', '.', callback);
        }
    }
};

/**
 * @name                            - File name
 * @description                     - Replaces multiple values using marks
 * @param templatePath              - Template path
 * @param fileName                  - File path to replace values of
 * @param parentPath                - Where to look the file
 * @param replacementValues         - Replacement values
 * @param mark                      - Mark to replace the values with
 * @param tab                       - Defines how many tabs to insert before the replacement values. ( Aesthetic purpose )
 * @param markBelow                 - If true replacement strings will be put above mark
 * @param callback                  - Callback function (error)
 */
function replaceMultipleValuesByMark(templatePath, fileName, parentPath, replacementValues, mark, tab=2, markBelow, callback) {
    if(replacementValues.length > 0) {
        if(!markBelow){replacementValues = replacementValues.reverse()}
        let nextIndex = 1;
        (function replaceValuesByMark(index) {
            lib.generator(path.resolve(templatePath), replaceValues.multipleSeqRep(mark, replacementValues[index], tab, markBelow), fileName, parentPath, function () {
                if(nextIndex === replacementValues.length) {callback(null);} // Done replacing
                if(replacementValues.length > nextIndex){replaceValuesByMark(nextIndex++);}
            });
        })(0);
    }else{callback(null);}
}

/**
 * @name                        - Merge config files
 * @description                 - Merges the config file with a default one
 * @param inputConfigModel
 * @param callback
 */
function mergeConfigFiles(inputConfigModel, callback) {
    async.waterfall([
        mergeModel,
        mergeFields,
        mergeConfig
    ],function () {
        callback(null);
    });

    /**
     * @name                - Merge model
     * @description         - Merge model with the default values
     * @param cb            - Callback function (error)
     */
    function mergeModel(cb) {

        if(inputConfigModel.models.length === 0) {
            console.error('Configuration must contain at least one model');
        }else{
            inputConfigModel.models.forEach(function (modelValues, index) {
                inputConfigModel.models[index].options = xtend(defaultModel.options, modelValues.options);
                if (index + 1 === inputConfigModel.models.length) {
                    cb(null);
                }
            });
        }
    }

    /**
     * @name                - Merge fields
     * @description         - Merge fields with the default values
     * @param cb            - Callback function (error)
     */
    function mergeFields(cb) {
        inputConfigModel.models.forEach(function (modelValues, indexModel) {
            Object.keys(modelValues.fields).forEach(function (keys) {
                inputConfigModel.models[indexModel].fields[keys] = xtend(defaultField, inputConfigModel.models[indexModel].fields[keys]);
            });
            if (indexModel === inputConfigModel.models.length - 1) {cb(null);}
        });

    }

    /**
     * @name                - Merge config
     * @description         - Merge config with the default values.
     * @param cb            - Callback function (error)
     */
    function mergeConfig(cb) {
        inputConfigModel = xtend(defaultConfig, inputConfigModel);
        mergedConfig = inputConfigModel;
        mergedConfigEx.mergedConfig = inputConfigModel;
        mergedConfig.dependantServices = xtend(defaultConfig.dependantServices, inputConfigModel.dependantServices);
        mergedConfig.environment = xtend(defaultConfig.environment, inputConfigModel.environment);
        mergedConfig.authentication = xtend(defaultConfig.authentication, inputConfigModel.authentication);
        mergedConfig.requireAuthentication = xtend(defaultConfig.requireAuthentication, inputConfigModel.requireAuthentication);
        mergedConfig.comments = xtend(defaultConfig.comments, inputConfigModel.comments);
        mergedConfig.generate = xtend(defaultConfig.generate, inputConfigModel.generate);
        cb(null);
    }

}
