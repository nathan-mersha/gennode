/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              index.js
 * @description         Replaces template by predefined place holders.
 * @kind                Template Editor
 * @copyright           September 2018 Gen Node
 */

let
    async           = require('async'),
    shelljs         = require('shelljs'),
    path            = require('path'),
    replaceInFile   = require('replace-in-file'),
    fs              = require('fs');

/**
 * @name                - Replacer
 * @description         - Replaces the provided new file by the predefined place holders from the selected
 * @param template      - Template to use
 * @param replaceValues - Defines which values to replace with what.
 * @param fileName      - The new file name to generate
 * @param savePath      - Where to save the new file
 * @param callback      - Callback function (error)
 */
exports.generator    = function replacer(template, replaceValues, fileName, savePath, callback) {

    async.waterfall([
        copyFile,
        renameFile,
        replacePlaceHolders
    ],function () {
        callback(null);
    });

    /**
     * @name                - Copy file
     * @description         - Copy the template file to the destination folder
     * @param cb            - Callback function (error)
     */
    function copyFile(cb) {
        //todo this is where all the wrong shit is happening
        shelljs.cp('-R', template, savePath);
        cb(null);
    }

    /**
     * @name                - Rename file
     * @description         - Renames the copied file to the assigned name.
     * @param cb            - Callback function (error)
     */
    function renameFile(cb) {

        let generatedFile = `${savePath}/${fileName}`;
        fs.rename(`${savePath}/${path.basename(template)}`,generatedFile ,function () {
            cb(null, generatedFile);
        });
    }

    /**
     * @name                    - Replace place holders
     * @description             - Replace place holders
     * @param generatedFilePath - Generated file path
     * @param cb                - Callback function (error)
     */
    function replacePlaceHolders(generatedFilePath, cb) {

        if(replaceValues !== null) {
            replaceValues.files = generatedFilePath;
            replaceInFile(replaceValues)
                .then(changes => {
                    cb(null);
                });
        }else{
            cb(null);
        }

    }

};

