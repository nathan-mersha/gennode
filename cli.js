#!/usr/bin/env node

/**
 * @author              Nathan M. Degineh - N8
 * @name                Gen Node
 * @module              cli.js
 * @description         Command line interface
 * @kind                Interface
 * @copyright           September 2018 Gen Node
 */

let
    program = require('commander'),
    inquirer  = require('inquirer'),
    defaultValues = require('./src/config'),
    genNode = require('./main');

const prefixMessage = ">";
    

let questions = [
    {
        type : 'input',
        prefix : '\n\nWelcome to GenNode. \n\nThis will walk you through creating a genNode.config.js configuration file. For more help type [ gennode --help ]\n' +
        'If you leave a field empty, it will be assigned a default value. \nAfter you are done generating the file, print [ gennode gen -i genNode.config.js -o . ] and a server file will be \ngenerated' +
        ' inside the current directory according to your configuration.\nNote : A dummy model will be provided in the configuration.\n>',
        default : defaultValues.serviceName,
        name : 'serviceName',
        message : `Name`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.serviceDescription,
        name : 'serviceDescription',
        message : `Description`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.author,
        name : 'author',
        message : `Author`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.copyright,
        name : 'copyright',
        message : `Copyright`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.repoURL,
        name : 'repoURL',
        message : `RepoURL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.licence,
        name : 'licence',
        message : `Licence`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.version,
        name : 'version',
        message : `Version`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.baseURL,
        name : 'baseURL',
        message : `BaseURL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.DEBUG,
        name : 'debug',
        message : `Debug`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.PORT,
        name : 'port',
        message : `Port`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.MODE,
        name : 'mode',
        message : `Mode`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.MONGODB_URL,
        name : 'mongodbURL',
        message : `Mongodb URL`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.REVERSE_PROXY,
        name : 'reverseProxy',
        message : `Reverse Proxy`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.COLLECTION_RETURN_SIZE,
        name : 'collectionReturnSize',
        message : `Collection default size`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.ELEMENT_IN_PAGE,
        name : 'elementInPage',
        message : `Element in page`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.environment.ELASTIC_SEARCH_URL,
        name : 'elasticSearchURL',
        message : `Elastic search url`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.includeApiReqLib,
        name : 'includeApiReqLib',
        message : `Include api request lib`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.mongodb,
        name : 'mongodb',
        message : `MongoDB container`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.nginx,
        name : 'nginx',
        message : `Nginx container`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.docker,
        name : 'docker',
        message : `Generate Docker files`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.jenkins,
        name : 'jenkins',
        message : `Generate Jenkins file`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.enableProxy,
        name : 'enableProxy',
        message : `Enable proxy`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.test,
        name : 'test',
        message : `Generate Test`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.documentation,
        name : 'documentation',
        message : `Generate Documentation`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.readMe,
        name : 'readMe',
        message : `Generate ReadMe`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.commit,
        name : 'commit',
        message : `Commit files`
    },

    {
        type : 'input',
        prefix : prefixMessage,
        default : defaultValues.runServer,
        name : 'runServer',
        message : `Run server`
    },
];

program
    .version('0.0.1')
    .description('Simple Nodejs server generator module.');

program
    .command('initialize')
    .alias('init')
    .description("Generates genNode configuration file, with interactive prompt.")
    .action(function () {
        inquirer.prompt(questions).then(answers =>
            genNode.generateConfig(answers)
        );
    });

program
    .command('sample')
    .alias('s')
    .description("Generates a sample genNode configuration file for a hero academy")
    .action(function () {
        genNode.generateSampleConfig();
    });


program
    .command('generate -i <configFilePath> -o <outputPath> ')
    .alias('gen')
    .option('-i, --input', 'Path to the gen node configuration file.')
    .option('-o, --output', 'Path to where the server files will be generated.')
    .description("Path to gen node configuration file.")
    .action(function (configFilePath, outputPath) {
        genNode.genNode(configFilePath, outputPath);
    });



program.parse(process.argv);
