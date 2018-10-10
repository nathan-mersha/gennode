/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              field.js
 * @description         Default field config
 * @kind                Config
 * @copyright           September 2018 Gen Node
 */

module.exports = {
    // Any mongoose or mongosastic fields are valid here.
    type                : "String",
    queryUsing          : true, // If true query using this value will be allowed in pagination call.
    publicVisibility    : true, // If false this value will only be visible in private endpoint
    verifyOnCreate      : false, // If true field will be verified on create
    editableOnUpdate    : true, // Defines if this value is editable
    visibleOnPagination : true, // If true element will be visible on pagination call.
    es_indexed          : true  // If true element will be indexed in elastic search,
};