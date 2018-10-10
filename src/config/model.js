/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              model.js
 * @description         Default model config file
 * @kind                Config
 * @copyright           September 2018  Gen Node
 */

let field = require('./field');

module.exports = {
    options             : {
        enableRoute         : true,
    },
    fields              : {
        firstModified       : {type : Date, field},
        lastModified        : {type : Date, field}
    },
    authorization       : {
        create  : null,
        get    : null,
        update  : null,
        delete  : null
    }
};

