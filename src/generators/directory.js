/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              directory.js
 * @description         Directory generator module
 * @kind                Generator
 * @copyright           September 2018 Gen Node
 */

let
    shelljs     = require('shelljs'),
    async       = require('async');

/**
 * @name                        - Generate directory
 * @description                 - Generates directories inside parent directory by the provided directoryNames.
 * @param parentDirectory       - Where to create the directories.
 * @param directoryNames        - Directory names.
 */
exports.generateDirectory = function generateDirectory(parentDirectory, directoryNames) {
    console.log("Generate directory init.");

    async.waterfall([
        moveToParentDirectory,
        generateDirectories
    ],function () {
        console.log("Completed generating directories.");
    });

    /**
     * @name                - Move to parent directory
     * @description         - Moves to the parent directory of where the directories will be created.
     * @param callback      - Callback function (error)
     */
    function moveToParentDirectory(callback) {
        console.log("Moving to parent directory");
        shelljs.cd(parentDirectory);
        callback(null);
    }

    /**
     * @name                - Generate directories
     * @description         - Generates directories
     * @param callback      - Callback function (error)
     */
    function generateDirectories(callback) {
        console.log("Generate directories init.");
        shelljs.mkdir(directoryNames);
        callback(null);
    }
};

