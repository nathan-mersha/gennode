/**
 * @author              __author__
 * @name                __serviceName__
 * @description         Test for __serviceName__ __modelName__ service.
 * @kind                Test
 * @copyright           __copyright__
 */

let
    dummyJSON = require('dummy-json'),
    mongoose = require('mongoose');

const customMock = {
    objectId : new mongoose.Types.ObjectId,
    buffer   : new mongoose.Types.Buffer,
    dates : new Date()
};

/**
 * @name        Dummy data
 * @description     Dummy data for service __serviceName__
 * @type {{create: {success: null, validationError: null}, get: {success: null, wrongIdFormat: string}, update: {success: *, invalidData: {invalidKey: string}}, delete: {success: null, dataNotFound: null}}}
 */
module.exports = {
    // Dummy data for service test begins here
    // Dummy data for service test ends here
};