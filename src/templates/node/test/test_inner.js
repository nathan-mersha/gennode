describe("__modelName__",function () {

     /**
     * @name            - is__modelName__Public
     * @param body      - Body to evaluate
     * @param private   - If true then body will be evaluate it's private fields as well
     * @description     - Validates if the provided data is __modelName__ public data
     */
     function is__modelName__(body, private = false) {
         if(private) {
             expect(body).to.be.an('object').that.has.all.keys('__v', '_id', __allPrivateVisibleElements__); // also include public elements
             // Begin body expected evaluation here (private)
             // End body expected evaluation here (private)
         }else{
             expect(body).to.be.an('object').that.has.all.keys('__v', '_id', __allPublicVisibleElements__);
             // Begin body expected evaluation here (public)
             // End body expected evaluation here (public)
         }

        expect(new Date(body.lastModified),new Date(body.firstModified)).to.be.an.instanceOf(Date);
        expect(new objectId(body._id)).to.be.an.instanceOf(objectId);
        // Begin body expected evaluation here (public & private)
        // End body expected evaluation here (public $ private)
    }

    describe("Create - here 1" ,function () {
        it("Should successfully create __modelName__" ,function (done) {
            done();
            sendRequest(url.__modelName__.create(),'post',dummyData.__modelName__.create.success,201,null,function (err,res) {
            });
        });
        it("Should fail to create __modelName__ ( Validation Error )" ,function (done) {
            done();
            sendRequest(url.__modelName__.create(),'post',dummyData.__modelName__.create.validationError,400,null,function (err,res) {
            });
        });
    });

    describe("Find" ,function () {
        it("Should successfully retrieve __modelName__ data (public)" ,function (done) {
            done();
            sendRequest(url.__modelName__.findByIdPublic(dummyData.__modelName__.get.success),'get',null,200,null,function (err, res) {
            });
        });
        it("Should successfully retrieve __modelName__ data (private)" ,function (done) {
            done();
            sendRequest(url.__modelName__.findByIdPrivate(dummyData.__modelName__.get.success),'get',null,200,null,function (err, res) {
            });
        });
        it("Should fail to retrieve __modelName__ data ( Id wrong format )" ,function (done) {
            done();
            sendRequest(url.__modelName__.findByIdPublic(dummyData.__modelName__.get.wrongIdFormat),'get',null,400,null,function (err, res) {
            });
        });
    });

    describe("Find paginated" ,function () {
        it("Should successfully retrieve __modelName__ paginated data" ,function (done) {
            let validQuery = '__validQuery__';
            done();
            sendRequest(url.__modelName__.findPaginated(validQuery),'get',null,200,null,function (err,res) {
            });
        });
    });

    describe("Count" ,function () {

        this.timeout(5000);
        it("Should successfully count __modelName__ data" ,function (done) {
            let validQuery = '__validQuery__';
            done();
            sendRequest(url.__modelName__.count(validQuery),'get',null,200,function (err,res) {
            });
        });
    });

    describe("Update" ,function () {
        it("Should successfully update __modelName__ data" ,function (done) {
            let query = `_id=${dummyData.__modelName__.get.success._id}`;
            done();
            sendRequest(url.__modelName__.update(query),'put',dummyData.__modelName__.update.success,200,null,function (err,res) {
            });
        });

        it("Should fail to update __modelName__ data (Invalid update data)",function (done) {
            let query = `_id=${dummyData.__modelName__.get.success._id}`;
            done();
            sendRequest(url.__modelName__.update(query),'put',dummyData.__modelName__.update.invalidData,400,null,function (err,res) {
            });
        });
    });

    describe("Remove" ,function () {
        it("Should successfully remove __modelName__ data" ,function (done) {
            let query = `_id=${dummyData.__modelName__.get.success._id}`;
            done();
            sendRequest(url.__modelName__.remove(query),'del',null,200,null,function (err, res) {
            });
        });
    });
});

