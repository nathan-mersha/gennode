/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              inner.js
 * @description         Inner templates for test files
 * @kind                Templates
 * @copyright           September 2018 Gen Node
 */

let
    util  = require('util'),
    async = require('async'),
    dummyJSON = require('dummy-json'),
    xtend = require('xtend'),
    mongoose = require('mongoose');

const customMock = {
    objectId : new mongoose.Types.ObjectId,
    buffer  : new mongoose.Types.Buffer,
    dates : new Date()
};

let dummyDataTemplateGenerator = function(obj) {
    let template = '{\ ';
    let keys = Object.keys(obj);
    keys.forEach(function (key) {
        let elem = obj[key];
        let keyLC = key.toLowerCase(); // Compare apple to apples

        if(! util.isNullOrUndefined(elem)) {
            if(elem.type === "String" && (!possibleNumberValue() && !possibleDateValue())) {
                if(keyLC.indexOf('name') !== -1) { // Key value may be some sort of name.
                    template = template.concat(`"${key}" : "{{firstName}}" ,\ `);
                }else if(keyLC.indexOf('company') !== -1 || keyLC.indexOf('work') !== -1) { // Key value may be some sort of company name
                    template = template.concat(`"${key}" : "{{company}}" ,\ `);
                }else if(keyLC.indexOf('email') !== -1) { // Key value may be some sort of email
                    template = template.concat(`"${key}" : "{{email}}" ,\ `);
                }else if(keyLC.indexOf('address') !== -1) { // Key value may be some sort of address
                    template = template.concat(`"${key}" : "{{int 1 100}} {{street}}" ,\ `);
                }else if(keyLC.indexOf('street') !== -1) { // Key value may be some sort of street
                    template = template.concat(`"${key}" : "{{street}}" ,\ `);
                }else if(keyLC.indexOf('city') !== -1) { // Key value may be some sort of city
                    template = template.concat(`"${key}" : "{{city}}" ,\ `);
                }else if(keyLC.indexOf('domain') !== -1) { // Key value may be some sort of domain
                    template = template.concat(`"${key}" : "{{domain}}" ,\ `);
                }else if(keyLC.indexOf('tld') !== -1) { // Key value may be some sort of tld
                    template = template.concat(`"${key}" : "{{tld}}" ,\ `);
                }else if(keyLC.indexOf('countryCode') !== -1) { // Key value may be some sort of countryCode
                    template = template.concat(`"${key}" : "{{countryCode}}" ,\ `);
                }else if(keyLC.indexOf('country') !== -1) { // Key value may be some sort of country
                    template = template.concat(`"${key}" : "{{country}}" ,\ `);
                }else if(keyLC.indexOf('phone') !== -1) { // Key value may be some sort of phone
                    template = template.concat(`"${key}" : "{{phone}}" ,\ `);
                }else if(keyLC.indexOf('color') !== -1) { // Key value may be some sort of color
                    template = template.concat(`"${key}" : "{{color}}" ,\ `);
                }else if(keyLC.indexOf('hex') !== -1) { // Key value may be some sort of hex
                    template = template.concat(`"${key}" : "{{hexColor}}" ,\ `);
                }else if(keyLC.indexOf('guid') !== -1) { // Key value may be some sort of guid
                    template = template.concat(`"${key}" : "{{guid}}" ,\ `);
                }else if(keyLC.indexOf('ipv4') !== -1) { // Key value may be some sort of ipv4 address
                    template = template.concat(`"${key}" : "{{ipv4}}" ,\ `);
                }else if(keyLC.indexOf('ipv6') !== -1) { // Key value may be some sort of ipv6 address
                    template = template.concat(`"${key}" : "{{ipv6}}" ,\ `);
                }else if(keyLC.indexOf('ip') !== -1) { // Key value may be some sort of ip
                    template = template.concat(`"${key}" : "{{ipv6}}" ,\ `);
                }else if(keyLC.indexOf('note') !== -1 || keyLC.indexOf('description') !== -1 || keyLC.indexOf('text') !== -1 || keyLC.indexOf('paragraph') !== -1) { // Key value may be some sort of note
                    template = template.concat(`"${key}" : "{{lorem 10}}" ,\ `);
                }else{ // Key value is something else assign a random string expression temp.
                    template = template.concat(`"${key}" : "{{lorem 5}}" ,\ `);
                }
            }else if(elem.type === "Number") {
                if(! possibleNumberValue()) {
                    template = template.concat(`"${key}" : "{{int 10 99999}}" ,\ `);
                }
            }else if(elem.type === "Boolean" || elem.type === "Bool") {
                template = template.concat(`"${key}" : {{boolean}} ,\ `);
            }else if(elem.type === "Array") {
                template = template.concat(`"${key}" : [\ {{#repeat 4}} "{{lorem 1}}" {{/repeat}} ]\ ,\ `);
            }else if(elem.type === "Buffer") {
                template = template.concat(`"${key}" : "{{buffer}}" ,\ `);
            }else if(elem.type === "Date") {
                if (! possibleDateValue()) {
                    template = template.concat(`"${key}" : "{{dates}}" ,\ `);
                }
            }else if(elem.type === "ObjectId" || elem.type === "Oid") { // Mongoose object id
                template = template.concat(`"${key}" : "{{objectId}}" ,\ `);
            }else if(elem.type === "Mixed") {
                template = template.concat(`"${key}" : "{{lorem 5}}" ,\ `);
            }else if(elem.type === "Map") {
                template = template.concat(`"${key}" : "{{map}}" ,\ `);
            }
        }


        function possibleNumberValue() {
            if(keyLC.indexOf('zipcode') !== -1) { // Key value may be some sort of zip code
                template = template.concat(`"${key}" : "{{zipcode}}" ,\ `);
                return true;
            }else if(keyLC.indexOf('latitude') !== -1) { // Key value may be some sort of latitude
                template = template.concat(`"${key}" : "{{lat}}" ,\ `);
                return true;
            }else if(keyLC.indexOf('longitude') !== -1) { // Key value may be some sort of longitude
                template = template.concat(`"${key}" : "{{long}}" ,\ `);
                return true;
            }else if(keyLC.indexOf('postcode') !== -1) { // Key value may be some sort of postCode
                template = template.concat(`"${key}" : "{{postcode}}" ,\ `);
                return true;
            }else if(keyLC.indexOf('age') !== -1) { // Key value may be some sort of postCode
                template = template.concat(`"${key}" : "{{int 16 99}}" ,\ `);
                return true;
            }
            return false;
        }

        function possibleDateValue() {
            if(keyLC.indexOf('dob') !== -1 || keyLC.indexOf('birth') !== -1) { // Key value may be some sort of date of birth value
                template = template.concat(`"${key}" : "{{date "1990" "2017"}}" ,\ `);
                return true;
            }else if(keyLC.indexOf('time') !== -1) { // Key value may be some sort of time
                template = template.concat(`"${key}" : "{{time "00:00" "23:00" }}" ,\ `);
                return true;
            }
            return false;
        }
    });

    template = template.trim();
    template = template.slice(0, template.length -1);
    template = template.concat(`}`);
    return template;
};

module.exports = {
    test : {
        dummyDataTemplateGenerator : dummyDataTemplateGenerator,
        dummyData   : (modelName, successData, validUpdateData)=> {
            return `
                /**
                 * @name            - ${modelName}
                 * @description     - Dummy data for ${modelName}
                 */
                ${modelName} : {
                    create  : {
                        success         : JSON.parse(dummyJSON.parse(' ${successData} ', {mockdata : customMock})),
                        validationError : { invalidKey : 'invalidValue' }
                    },
                    get    : {
                        success         : null,
                        wrongIdFormat   : 'wrongIdFormat'
                    },
                    update  : {  
                        success         : JSON.parse(dummyJSON.parse(' ${validUpdateData} ', {mockdata : customMock})),
                        invalidData     : { invalidKey : 'invalidValue'},
                    },
                    delete  : {
                        success         : null,
                        dataNotFound    : null
                    }
                },  
            `;
        },
        urlGenerator: (modelName)=> {
            return `
            ${modelName} : {
                create          : ()=> ${"`${"}${modelName}Route${"}`"},
                findByIdPublic  : (id)=> ${"`${"}${modelName}Route${"}"}/?_id=${"${id}"}${"`"},
                findByIdPrivate : (id)=> ${"`${"}${modelName}Route${"}"}/?_id=${"${id}"}&private=true${"`"},
                findPaginated   : (query)=> ${"`${"}${modelName}Route${"}"}/?${"${query}"}${"`"},
                update          : (query)=> ${"`${"}${modelName}Route${"}"}/?${"${query}"}${"`"},
                remove          : (query)=> ${"`${"}${modelName}Route${"}"}/?${"${query}"}${"`"}
            },
            `;
        },
        testFile    : (modelName)=> {
            return `
        describe("${modelName}",function () {
        
            /**
             * @name            - is__modelName__Public
             * @param body      - Body to evaluate
             * @param private   - If true then body will be evaluate it's private fields as well
             * @description     - Validates if the provided data is __modelName__ public data
             */
             function is${modelName}(body, private = false) {
                 if(private) {
// Begin body expected evaluation here for model : ${modelName} (private)
// End body expected evaluation here for model : ${modelName} (private)
                 }else{
// Begin body expected evaluation here for model : ${modelName} (public)
// End body expected evaluation here for model : ${modelName} (public)
                 }
        
                expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
                expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
            }
            
            describe("Create" ,function () {
                
                this.timeout(10000);
                it("Should successfully create ${modelName}" ,function (done) {
                    sendRequest(url.${modelName}.create(),'post',dummyData.${modelName}.create.success,201,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        is${modelName}(body, true);
                        dummyData.${modelName}.get.success = body;
                        done();
                    });
                });
               
            });
        
            describe("Find" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve ${modelName} data (public)" ,function (done) {
                    sendRequest(url.${modelName}.findByIdPublic(dummyData.${modelName}.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.${modelName}.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should successfully retrieve ${modelName} data (private)" ,function (done) {
                    sendRequest(url.${modelName}.findByIdPrivate(dummyData.${modelName}.get.success._id),'get',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        expect(body._id).to.equal(dummyData.${modelName}.get.success._id);
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to retrieve ${modelName} data ( Id wrong format )" ,function (done) {
                    sendRequest(url.${modelName}.findByIdPublic(dummyData.${modelName}.get.wrongIdFormat),'get',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.QUERY_ERROR.errorCode); 
                        done();
                    });
                });
            });
        
            describe("Find paginated" ,function () {
            
                this.timeout(10000);
                it("Should successfully retrieve ${modelName} paginated data" ,function (done) {
                    let validQuery = '__validQuery__';
                    sendRequest(url.${modelName}.findPaginated(validQuery),'get',null,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isPaginatedResponse(body); 
                        done();
                    });
                });
            });
        
            describe("Update" ,function () {
            
                this.timeout(10000);
                it("Should successfully update ${modelName} data" ,function (done) {
                    
                    let query = ${"`_id=${"}dummyData.${modelName}.get.success._id${"}`"};
                    sendRequest(url.${modelName}.update(query),'put',dummyData.${modelName}.update.success,200,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isUpdateResponse(body); 
                        expect(body.nModified).to.be.at.least(1); 
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail to update ${modelName} data (Query not found)" ,function (done) {

                    let query = '';
                    validators.sendRequest(url.${modelName}.update(query),'put',dummyData.${modelName}.update.success,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        validators.isErrorResponse(body);
                        done();
                    });
                });
        
                this.timeout(10000);
                it("Should fail to update ${modelName} data (Invalid update data)",function (done) {
                    let query = ${"`_id=${"}dummyData.${modelName}.get.success._id${"}`"};
                    sendRequest(url.${modelName}.update(query),'put',dummyData.${modelName}.update.invalidData,400,function (err,res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isErrorResponse(body);
                        expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                        done();
                    });
                });
            });
        
            describe("Remove" ,function () {
            
                this.timeout(10000);
                it("Should successfully remove ${modelName} data" ,function (done) {
                    let query = ${"`_id=${"}dummyData.${modelName}.get.success._id${"}`"};
                    sendRequest(url.${modelName}.remove(query),'del',null,200,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        isRemoveResponse(body); 
                        expect(body.n).to.be.at.least(1); 
                        done();
                    });
                });
                
                this.timeout(10000);
                it("Should fail remove ${modelName} data (Query not found)" ,function (done) {
                    let query = '';
                    sendRequest(url.${modelName}.remove(query),'del',null,400,function (err, res) {
                        let body = res.body;
                        expect(err).to.be.null;
                        validators.isErrorResponse(body);
                        done();
                });
            });
            });
        });
    `
        },

        /**
         * @name                - Expect eval test
         * @description         - Constructs evaluation test using expect statements
         * @param model         - Model to evaluate
         * @param callback      - Callback function (error, evalConstruct)
         */
        expectEvalTest  : (model, callback) => {
            console.log(`Creating evaluation statements for model : ${model.options.name}`);

            let
                modelFields = model.fields,
                modelKeys = Object.keys(modelFields),
                evalConstruct = {
                    publicEval  : [],
                    privateEval : []
                };

            async.waterfall([
                evalFieldExistence,
                evalFieldType
            ], function () {
                callback(null, evalConstruct);
            });

            /**
             * @name                - Eval field existence
             * @description         - Create evaluation statements for field existence
             * @param cb            - Callback function (error)
             */
            function evalFieldExistence(cb) {
                console.log(`Constructing field existence evaluation statements for model : ${model.options.name}`);

                let publicEvalStatement = `expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified'`;
                let privateEvalStatement = `expect(body).to.be.an('object').that.has.all.keys('__v', '_id', 'firstModified', 'lastModified'`;

                modelKeys.forEach(function (modelKey) {
                    let field = modelFields[modelKey];
                    if(field.publicVisibility) { // Privately visible
                        publicEvalStatement = publicEvalStatement.concat(`, '${modelKey}'`);
                    }
                    privateEvalStatement = privateEvalStatement.concat(`, '${modelKey}'`);

                });
                evalConstruct.publicEval.push(publicEvalStatement = publicEvalStatement.concat(`);`));
                evalConstruct.privateEval.push(privateEvalStatement = privateEvalStatement.concat(`);`));
                cb(null);
            }

            /**
             * @name                - Eval field type
             * @description         - Create evaluation statements for field type
             * @param cb            - Callback function (error)
             */
            function evalFieldType(cb) {
                console.log(`Constructing field type evaluation statements for model : ${model.options.name}`);

                //  Note :  Not validating if type if of Mixed.
                let types = {
                    "public"  : {"String": [], "Number": [], "Boolean": [], "Bool": [], "Array": [], "Buffer": [], "Date": [], "ObjectId" : [], "Oid" : [], "Map" : [], "Mixed" : []},
                    "private" : {"String": [], "Number": [], "Boolean": [], "Bool": [], "Array": [], "Buffer": [], "Date": [], "ObjectId" : [], "Oid" : [], "Map" : [], "Mixed" : []}
                };

                modelKeys.forEach(function (modelKey) {
                    let field = modelFields[modelKey];
                    let fieldType = field.type;
                    if(field.publicVisibility) {
                        types.public[fieldType].push(`body.${modelKey}`);
                    }
                    types.private[fieldType].push(`body.${modelKey}`);
                });

                let typeKeys = Object.keys(types.public);
                typeKeys.forEach(function (typeKey) {
                    if(types.public[typeKey].length !== 0) {
                        if(typeKey === "ObjectId" || typeKey === "Oid") {
                            evalConstruct.publicEval.push(`expect(new objectId(${types.public[typeKey]})).to.be.an.instanceof(objectId);`);
                        }else if(typeKey === "Date") {
                            evalConstruct.publicEval.push(`expect(new Date(${types.public[typeKey]})).to.be.an.instanceof(Date);`);
                        }else if(typeKey !== "Mixed"){
                            evalConstruct.publicEval.push(`expect(${types.public[typeKey]}).to.be.a('${typeKey}');`);
                        }
                    }
                    if(types.private[typeKey].length !== 0) {
                        if(typeKey === "ObjectId" || typeKey === "Oid") {
                            evalConstruct.privateEval.push(`expect(new objectId(${types.private[typeKey]})).to.be.an.instanceof(objectId);`);
                        }else if(typeKey === "Date") {
                            evalConstruct.privateEval.push(`expect(new Date(${types.private[typeKey]})).to.be.an.instanceof(Date);`);
                        }else if(typeKey !== "Mixed"){
                            evalConstruct.privateEval.push(`expect(${types.private[typeKey]}).to.be.a('${typeKey}');`);
                        }
                    }
                });
                cb(null);
            }
        }
    },
    documentation : {
        dummyData : (model, callback) => {
            console.log('Generating documentation data.');

            let modelFields = model.fields;

            let documentationValues = {
                postBodyDescriptor      : [],
                postBodyExample         : [],
                postSuccessDescriptor   : [],
                postSuccessSample       : [],

                getValidQuery           : [],
                getPaginationResponse   : [],

                putBodyExample          : [],
                putValidQueries         : [],

                deleteValidQueries      : []
            };

            let dataObject  = {
                postBodySample      : null,
                postReturnSample    : null,
                updateBodySample    : null
            };

            async.waterfall([
                generatePostBodyExample,
                generatePostBodyDescriptor,
                generatePostSuccessSample,
                generatePostSuccessDescriptor,
                generateGetPaginationResponse,
                generatePutBodyExample,
                generatePutDeleteQueries
            ],function () {
                console.log(`Generating documentation data for ${model.options.name} completed.`);
                callback(null, documentationValues);
            });

            /**
             * @name            - Generate post body example
             * @description     - Generates post body example
             * @param cb        - Callback function (error)
             */
            function generatePostBodyExample(cb) {
                console.log(`Generating post body example for ${model.options.name}`);
                let generatedPostData = JSON.parse(dummyJSON.parse(dummyDataTemplateGenerator(model.fields), {mockdata : customMock}));
                dataObject.postBodySample = generatedPostData;
                documentationValues.postBodyExample.push(JSON.stringify(generatedPostData, null, 4));
                cb(null);
            }

            /**
             * @name            - Generate post body descriptor
             * @description     - Generates post body descriptor
             * @param cb        - Callback function (error)
             */
            function generatePostBodyDescriptor(cb) {
                let modelKeys = Object.keys(modelFields);
                modelKeys.forEach(function (modelKey) {
                    documentationValues.postBodyDescriptor.push(`* @apiParam    (Body)  {${ modelFields[modelKey].type } }    ${modelKey}     - ${modelKey}`);
                });
                cb(null);
            }

            /**
             * @name            - Generate post success sample
             * @description     - Generates post success sample
             * @param cb        - Callback function (error)
             */
            function generatePostSuccessSample(cb) {
                console.log(`Generating post success sample for model ${model.options.name}`);

                let createdTemplate  = dummyDataTemplateGenerator(model.fields);
                let additionalVals = ',"__v" : "{{int 10 99}}" }';
                createdTemplate = createdTemplate.substring(0, createdTemplate.length - 1);
                createdTemplate = createdTemplate.concat(additionalVals);
                let constructedData = JSON.parse(dummyJSON.parse(createdTemplate, {mockdata : customMock}));
                constructedData.firstModified = new Date();
                constructedData.lastModified = new Date();
                constructedData._id = new mongoose.Types.ObjectId;
                constructedData = xtend(constructedData, dataObject.postBodySample);
                documentationValues.postSuccessSample.push(JSON.stringify(constructedData, null, 4));
                dataObject.postReturnSample = constructedData;
                cb(null);
            }

            /**
             * @name            - Generate post success descriptor
             * @description     - Generates post success descriptor
             * @param cb        - Callback function (error)
             */
            function generatePostSuccessDescriptor(cb) {
                console.log(`Generating post success descriptor for : ${model.options.name}`);

                let postSuccessKey = Object.keys(modelFields);
                postSuccessKey.forEach(function (modelKey) {
                    documentationValues.postSuccessDescriptor.push(`* @apiSuccess      {${modelFields[modelKey].type}}    ${modelKey}     - ${modelKey}`);
                });
                documentationValues.postSuccessDescriptor.push(`* @apiSuccess     {String}    __v           - Version`);
                documentationValues.postSuccessDescriptor.push(`* @apiSuccess     {String}    _id           - Id`);
                documentationValues.postSuccessDescriptor.push(`* @apiSuccess     {String}    firstModified - First modified`);
                documentationValues.postSuccessDescriptor.push(`* @apiSuccess     {String}    lastModified  - Last modified`);
                cb(null);
            }

            /**
             * @name            - Generate get pagination response
             * @description     - Generates get pagination response
             * @param cb        - Callback function (error)
             */
            function generateGetPaginationResponse(cb) {
                console.log(`Generating get pagination response for : ${model.options.name}`);

                generatePaginatedDocuments(3, function (err, values) {
                    values.forEach(function (value, index) {
                        let docPushValue = JSON.stringify(value, null, 4);
                        if(index !== values.length - 1){docPushValue = docPushValue.concat(',');}
                        documentationValues.getPaginationResponse.push(docPushValue);
                    });
                    cb(null);
                });
            }

            /**
             * @name            - Generate put body example
             * @description     - Generates put body example
             * @param cb        - Callback function (error)
             */
            function generatePutBodyExample(cb) {
                console.log(`Generating put body example for ${model.options.name}`);

                let updateSample = JSON.parse(dummyJSON.parse(dummyDataTemplateGenerator(model.fields), {mockdata : customMock}));
                documentationValues.putBodyExample.push(JSON.stringify(updateSample, null, 4));
                cb(null);
            }

            /**
             * @name            - Generate put delete queries
             * @description     - Generates put delete queries
             * @param cb        - Callback function (error)
             */
            function generatePutDeleteQueries(cb) {
                console.log(`Generating put and delete queries for ${model.options.name}`);

                let fieldKeys = Object.keys(modelFields);
                fieldKeys.forEach(function (fieldKey) {
                    documentationValues.getValidQuery.push(`* @apiParam (Query)   {${modelFields[fieldKey].type}} [ ${fieldKey} = ${modelFields[fieldKey].default} ]  - ${modelFields[fieldKey].type}`);
                    documentationValues.putValidQueries.push(`* @apiParam (Query)   {${modelFields[fieldKey].type}} [ ${fieldKey} = ${modelFields[fieldKey].default} ]  - ${modelFields[fieldKey].type}`);
                    documentationValues.deleteValidQueries.push(`* @apiParam (Query)   {${modelFields[fieldKey].type}} [ ${fieldKey} = ${modelFields[fieldKey].default} ]  - ${modelFields[fieldKey].type}`);
                });
                cb(null);
            }

            /**
             * @name            - Generate paginated documents
             * @description     - Generates paginated documents
             * @param amount    - Amount of data to generate
             * @param callback  - Callback function (error)
             */
            function generatePaginatedDocuments(amount, callback) {
                console.log(`Generate paginated documents for : ${model.options.name}`);

                let paginatedValues = [];

                for(let i = 0; i < amount; i++) {
                    let createdTemplate  = dummyDataTemplateGenerator(model.fields);
                    let additionalVals = ',"__v" : "{{int 10 99}}" }';
                    createdTemplate = createdTemplate.substring(0, createdTemplate.length - 1);
                    createdTemplate = createdTemplate.concat(additionalVals);
                    let constructedData = JSON.parse(dummyJSON.parse(createdTemplate, {mockdata : customMock}));
                    constructedData.firstModified = new Date();
                    constructedData.lastModified = new Date();
                    constructedData._id = new mongoose.Types.ObjectId;
                    paginatedValues.push(constructedData);
                }

                paginatedValues.forEach(function (paginatedValue) {
                    let paginatedValueKeys = Object.keys(paginatedValue);
                    paginatedValueKeys.forEach(function (paginatedValueKey) {
                        if(! util.isNullOrUndefined(modelFields[paginatedValueKey])) {
                            if(!modelFields[paginatedValueKey].publicVisibility || !modelFields[paginatedValueKey].visibleOnPagination) {
                                delete paginatedValue[paginatedValueKey];
                            }
                        }
                    })
                });

                callback(null, paginatedValues);
            }
        }
    },
    postMan : function (modelName, createDataSample, updateDataSample, proxy, port, baseURL, host, createResponseSample, getResponseSample, putResponseSample, deleteResponseSample) {
        return `
        {
			"name": "${modelName}",
			"description": "${modelName} CRUD collection",
			"item": [
				{
      "name": "Create ${modelName}",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "name": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": ${createDataSample}
        },
        "url": {
          "raw": "http://${proxy}:${port}/${baseURL}/${modelName}",
          "protocol": "http",
          "host": [
            "${host}"
          ],
          "port": "${port}",
          "path": [
            "${baseURL}",
            "${modelName}"
          ]
        },
        "description": "Create ${modelName}"
      },
      "response": []
    },
    {
      "name": "Get ${modelName}",
      "request": {
        "method": "GET",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": ""
        },
        "url": {
          "raw": "http://${proxy}:${port}/${baseURL}/${modelName}",
          "protocol": "http",
          "host": [
            "${host}"
          ],
          "port": "${port}",
          "path": [
            "${baseURL}",
            "${modelName}"
          ]
        },
        "description": "Get ${modelName}"
      },
      "response": []
    },
    {
      "name": "Delete ${modelName}",
      "request": {
        "method": "DELETE",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": ""
        },
        "url": {
          "raw": "http://${proxy}:${port}/${baseURL}/${modelName}?_id=5bc206d3048c9e1527797073",
          "protocol": "http",
          "host": [
            "${host}"
          ],
          "port": "${port}",
          "path": [
            "${baseURL}",
            "${modelName}"
          ],
          "query": [
            {
              "key": "_id",
              "value": "5bc206d3048c9e1527797073"
            }
          ]
        },
        "description": "Delete ${modelName}"
      },
      "response": []
    },
    {
      "name": "Update ${modelName}",
      "request": {
        "method": "PUT",
        "header": [
          {
            "key": "Content-Type",
            "name": "Content-Type",
            "value": "application/json",
            "type": "text"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": ${updateDataSample}
        },
        "url": {
          "raw": "http://${proxy}:${port}/${baseURL}/${modelName}?_id=5bc20776048c9e1527797077",
          "protocol": "http",
          "host": [
            "${host}"
          ],
          "port": "${port}",
          "path": [
            "${baseURL}",
            "${modelName}"
          ],
          "query": [
            {
              "key": "_id",
              "value": "5bc20776048c9e1527797077"
            }
          ]
        },
        "description": "Update ${modelName}"
      },
      "response": []
    }]
}`
    }
}
;

