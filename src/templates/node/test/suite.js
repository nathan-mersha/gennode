/**
 * @author              __author__
 * @name                __serviceName__
 * @description         Test suite for route __modelName__
 * @kind                Index
 * @copyright           __copyright__
 */

let
    validators  = require('../validators'),
    url         = require('../url_generator').__modelName__,
    mongoose    = require('mongoose'),
    objectId    = mongoose.Types.ObjectId,
    constants   = require('../../lib/constant'),
    errorCodes  = constants.errorCodes,
    dummyData   = require('../dummy_data').__modelName__;

module.exports = function () {
    describe("__modelName__",function () {

        /**
         * @name            - is__modelName__Public
         * @param body      - Body to evaluate
         * @param private   - If true then body will be evaluate it's private fields as well
         * @description     - Validates if the provided data is __modelName__ public data
         */
        function is__modelName__(body, private = false) {
            if(private) {
            // Begin body expected evaluation here for model : __modelName__ (private)
            // End body expected evaluation here for model : __modelName__ (private)
            }else{
            // Begin body expected evaluation here for model : __modelName__ (public)
            // End body expected evaluation here for model : __modelName__ (public)
            }

            expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
            expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
        }

        describe("Create" ,function () {

            this.timeout(10000);
            it("Should successfully create __modelName__" ,function (done) {
                validators.sendRequest(url.__modelName__.create(),'post',dummyData.create.success,201,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    is__modelName__(body, true);
                    validators.areObjectsEqualTypeIgnored(body, dummyData.create.success);
                    dummyData.get.success = body;
                    done();
                });
            });

            this.timeout(10000);
            it("Should fail to create __modelName__ ( Validation Error )" ,function (done) {
                validators.sendRequest(url.__modelName__.create(),'post',dummyData.create.validationError,400,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isErrorResponse(body);
                    expect(body.errorCode).to.equal(errorCodes.SEC.VALIDATION_ERROR.errorCode);
                    done();
                });
            });
        });

        describe("Find" ,function () {

            this.timeout(10000);
            it("Should successfully retrieve __modelName__ data (public)" ,function (done) {
                validators.sendRequest(url.__modelName__.findByIdPublic(dummyData.get.success._id),'get',null,200,function (err, res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    expect(body._id).to.equal(dummyData.get.success._id);
                    done();
                });
            });

            this.timeout(10000);
            it("Should successfully retrieve __modelName__ data (private)" ,function (done) {
                validators.sendRequest(url.__modelName__.findByIdPrivate(dummyData.get.success._id),'get',null,200,function (err, res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    expect(body._id).to.equal(dummyData.get.success._id);
                    done();
                });
            });

            this.timeout(10000);
            it("Should fail to retrieve __modelName__ data ( Id wrong format )" ,function (done) {
                validators.sendRequest(url.__modelName__.findByIdPublic(dummyData.get.wrongIdFormat),'get',null,400,function (err, res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isErrorResponse(body);
                    expect(body.errorCode).to.equal(errorCodes.SEC.QUERY_ERROR.errorCode);
                    done();
                });
            });
        });

        describe("Find paginated" ,function () {

            this.timeout(10000);
            it("Should successfully retrieve __modelName__ paginated data" ,function (done) {
                let validQuery = '__validQuery__';
                validators.sendRequest(url.__modelName__.findPaginated(validQuery),'get',null,200,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isPaginatedResponse(body);
                    done();
                });
            });
        });

        describe("Count" ,function () {

            this.timeout(5000);
            it("Should successfully count __modelName__ data" ,function (done) {
                let validQuery = '__validQuery__';
                validators.sendRequest(url.__modelName__.count(validQuery),'get',null,200,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isCountResponse(body);
                    done();
                });
            });
        });

        describe("Update" ,function () {

            this.timeout(10000);
            it("Should successfully update __modelName__ data" ,function (done) {

                let query = `_id=${dummyData.get.success._id}`;
                validators.sendRequest(url.__modelName__.update(query),'put',dummyData.update.success,200,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isUpdateResponse(body);
                    expect(body.nModified).to.be.at.least(1);
                    done();
                });
            });

            this.timeout(10000);
            it("Should fail to update __modelName__ data (Query not found)" ,function (done) {

                let query = ``;
                validators.sendRequest(url.__modelName__.update(query),'put',dummyData.update.success,400,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isErrorResponse(body);
                    done();
                });
            });

            this.timeout(10000);
            it("Should fail to update __modelName__ data (Invalid update data)",function (done) {
                let query = `_id=${dummyData.get.success._id}`;
                validators.sendRequest(url.__modelName__.update(query),'put',dummyData.update.invalidData,400,function (err,res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isErrorResponse(body);
                    expect(body.errorCode).to.equal(errorCodes.SEC.IMPROPER_DATA.errorCode);
                    done();
                });
            });
        });

        describe("Remove" ,function () {

            this.timeout(10000);
            it("Should successfully remove __modelName__ data" ,function (done) {
                let query = `_id=${dummyData.get.success._id}`;
                validators.sendRequest(url.__modelName__.remove(query),'del',null,200,function (err, res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isRemoveResponse(body);
                    expect(body.n).to.be.at.least(1);
                    done();
                });
            });

            this.timeout(10000);
            it("Should fail remove __modelName__ data (Query not found)" ,function (done) {
                let query = ``;
                validators.sendRequest(url.__modelName__.remove(query),'del',null,400,function (err, res) {
                    let body = res.body;
                    expect(err).to.be.null;
                    validators.isErrorResponse(body);
                    done();
                });
            });
        });

    });
    
};
