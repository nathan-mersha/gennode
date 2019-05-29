# Gen Node

#### Author
Nathan Mersha

### Installation

Gen node is available on npm, type:

`$ sudo npm i -g gennode`

and install it globally, now you can use it from the command line.

### Philosopy
Following the trendy naming paradigm of __* aa *__ , here comes another one __Server as a configuration__.
So what is **SAAC** about, well a very simple **CRUD** server has a set of properties that can be described in a simple configuration file.
This properties could be one of the ones described below. This information is almost always found in the
documentation accompanying the server. However there is an obvious limitation for documentations as such,
and with good reasoning. That is one can read the in's and out's of the server, but one can't recreate it directly
from the documentation (say if one wishes to spin up a new server with minor modifications to the first.)
The main purpose of this module is to aid the developer to spin up a new **REST CRUD** project in less than a minute with all the durgeroies completed.

**What are the durgeroies I speak of?**

I have worked on many microservice oriented projects, and each project begins with a setup of a proxy, authentication
service and user service. After am done with that I'll have to begin with **Server A**. Now **Server A** has a specified
models, running ports etc. And identify which fields in the models are required upon creation, which can be used to query,
which can be updatable. And after am done with that, do the dal, then the **CRUD** controllers and route. Then hook to proxy.
If am using https between my services add the root certificate to my requester module, Define error codes, some constants
(running mode, user levels etc...) Then setup my docker config, then pipeline code, then test the godamn thing, with nice reports.
After am done with that write documentation.

This is durgery i speak of, and i have not even began the real work yet
(the functionality that is unique to **Server A**) This setup takes me a good half day.This used to be fun on my early days
of NodeJS (since it's part of the learning process), but now it's one of those things i trully hate doing. So if all project setups
could be done with some smart global replacement by using templates, why not?

### Naming
There are over half a million packages on npm, so the naming was more challenging than i care to admit. GenNode is short for
Generate NodeJS.

### Prerequisite and Note
1. An installation of mongodb on the running machine is required for the tests to pass, and for the server to start. Make sure the mongod
server is up and running. Guide on how to install and run MongoDB can be found [here](https://docs.mongodb.com/manual/administration/install-community/ "Installation MongoDB").
2. Make sure to have a version of NodeJS above or equal to Version 4. Get NodeJs [here](https://nodejs.org/en/download/ "Installation NodeJS")
3. The reverse proxy value in environment will be used inside a docker container, so avoid using values like 'http://localhost' or 'http://127.0.0.1, since this would effectively
point to the container itself.
4. Server and model names will be changed to their corresponding cammel case format according to [this](https://www.npmjs.com/package/camelcase) module.

### CLI

>RUN `$ gennode --help` for a list of available commands.

> **initialize (init)**
>
> `$ gennode init`
>
> Creates a new genNode configuration file with interactive prompt.
>
> **sample (s)**
>
> `$ gennode s`
>
> Generates a sample genNode configuration file for a hero academy.

> **generate (gen)**
>
> `$ gennode gen -i <configFilePath> -o <outputPath>`
>
> Initializes a new server by the provided gennode config file.
>
> **options**
>
> *--input, -i* (Required) : Input to the gennode config file path, sample for a config file can be found below or simply run `$ gennode init`
>
> *--output, -o* (Required)    :  Output path where the server files will be generated in.


### Configuration
*The gennode configuration file is a simple javascript file exporting an object. Default name **gennode.config.js***

### Note
> On some debian platforms there seems to be a problem while installing dependencies, generating apidoc and running test. So after you generated all the files run the following
> commands inside the root folder of the generated code in order.

> `$ npm install`

> `$ npm run apidoc`

> `$ npm run test`

> On some platforms --exit flag may not work, so consider remove if the script fails

> This will insure all of the files are generated.

#### Main
> Main configuration field options.

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|serviceName            |Name of the service|Sample gen node server|String|
|serviceDescription     |A small description of what your service does|This service is generated by gennode...|String|
|author                 |Service author|Gen Node|String|
|copyright              |Copyright|Copyright : `Current Date`|String|
|runningMode            |Service running mode|test_mode|String|
|licence                |Service Licence|MIT|String|
|version                |Version|0.0.1|String|
|repoURL                |Repository url|http://github.com|String|
|baseURL                |Version|/service|String|
|runServer              |Runns server after file generation is completed.|false|Boolean|
|models                 |List of models|[]|Array|
|dependantServices      |Dependant services|[Default values here](#dependantService)|Object|
|environment            |Envrionment variables|[Default values here](#environment)|Object|
|authentication         |Header authentication type|[Default values here](#authentication)|Object|
|includeApiReqLib       |Api request library|true|Boolean|
|certificatePath        |Path to root and client certificate|[Default path here](#certificate)|Object|
|mongodb                |Includes mongodb docker file in server configuration|true|Boolean|
|nginx                  |Generates a nginx proxy configuration file|true|Boolean|
|test                   |Tests the generated api, creates test and coverage report using [Mocha](https://www.npmjs.com/package/mocha "Mocha"), [Chai](https://www.npmjs.com/package/chai "Chai") and [Mochawesome](https://www.npmjs.com/package/mochawesome "Mochawesome")|true|Boolean|
|docker                 |Tests docker files for the server.|true|Boolean|
|jenkins                |Generates CI pipeline for the server.|true|Boolean|
|postman                |Generates postman collection file|true|Boolean|
|elkLogger              |Inserts elk stack logger using the bunyan lib|false|Boolean|
|enableProxy            |Generate [Nginx](https://www.nginx.com/ "Nginx") configuraiton file|true|Boolean|
|readMe                 |Generates readme file for the server.|true|Boolean|
|documentation          |Generates documentation powered by [ApiDoc](https://www.npmjs.com/package/apidoc "ApiDoc")|true|Boolean|
|commit                 |Commits the generated file.|true|Boolean|

##### <a name="dependantService">Dependant Services</a>
> Dependant service

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|endPoints              |List of endpoint to ping before initializing the service|[]|Array [String\]|
|abortIfFail            |If true server wont start if ping response code is 4** or 5** |false|Boolean|

##### <a name="authentication">Authentication</a>
> Authentication options

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|type                   |Authentication type|Bearer|String|
|headerKey              |Authentication header key|Authentication|String|

##### <a name="certificate">Certificate</a>
> Certificates path

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|root                   |Path to root certificate|null|String|
|client                 |Path to client certificate|null|String|
|clientKey              |Path to client key|null|String|

##### <a name="environment">Environment</a>
> Envrionment variables passed

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|DEBUG                  |Console output [view](https://www.npmjs.com/package/debug "Debug") for valid values|*|String|
|PORT                   |Server running port|3300|Number|
|MODE                   |Server running mode|test_mode|String|
|MONGODB_URL            |Mongodb running url|mongodb://localhost:27017/service|String|
|REVERSE_PROXY          |Reverse proxy address|http://localhost|String|
|COLLECTION_RETURN_SIZE |Collection return size|24|Number|
|ELEMENT_IN_PAGE        |Elements in pagination return default value|12|Number|
|ELASTIC_SEARCH_URL     |Elastic search endpint|http://localhost:9200|String|
|LOG_STASH_PORT         |Log stash port|5000|Number|

**Note** You can add other environment variables here too.

#### <a name="model">Model</a>
> Model configuraion field options.

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|options            |options|[Options field](#optionsField)|Object|
|fields             |default fields|` firstModified       : {type : Date}, lastModified        : {type : Date} `|Object|

> Model <a name="optionsField"> options </a> (Valid option for model options key)

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|enableRoute     |If true the model will have a *CRUD* endpoint.|options|Boolean|

#### <a name="field">Field</a>
> Model field configuration options.

| Option | Description |Default|Type |
|:------------:|:-----------:|:-----------:|:-----------:|
|type               |Field type, any [Mongoose type](https://mongoosejs.com/docs/schematypes.html) is valid|"String"|String|
|queryUsing         |If true, will be able to query using this key in get requests|true|Boolean|
|publicVisibility   |If true, field will be visible on public call, will be hidden otherwise.|true|Boolean|
|verifyOnCreate     |If true, field will be verified on create.|false|Boolean|
|editableOnUpdate   |If true, field will be editable on update call.|true|Boolean|
|visibleOnPagination|If true, field will be visible in pagination calls.|true|Boolean|
|es_indexed         |If true, field will be indexed in elasticsearch|true|Boolean|


#### Naming Conflict
Model names are converted to camel case, view [this](https://www.npmjs.com/package/camelcase) module for how the conversion happends. This could
create conflict when at runtime when the naming is clearly not similar at configuration. (_example __sample-name__ and __sample_name__ will both be converted to __sampleName__
at runtime) So avoid using similar names as such.

#### Sample Configuration
> Sample gennode configuration file
> Postman documentation for my hero academy can be found [here](https://documenter.getpostman.com/view/1796265/RWgtTHPT)

``

    /**
     * @author              Gen Node
     * @name                Gen Node
     * @module              gennode.config.js
     * @description         Default gennode configuration file
     * @kind                Config
     * @copyright           2018 Gen Node
     */

    module.exports = {

        serviceName : 'Hero Academia',
        serviceDescription : "Teacher and student hero registry for Hero Academia",
        author : 'Young Midoria',
        copyright : `Copyright : 2018`,
        runningMode : 'test_mode',
        licence : 'MIT',
        version : '0.0.1',
        repoURL : "http://github.com",
        baseURL : '/heroAcademia',
        runServer : false,
        models : [
            {
                options : {
                    name : 'Teacher'
                },
                fields  : {
                    name : {type : "Number" , es_indexed : true},
                    age : {type : "Number", es_indexed : true},
                    gender : {type : "String"},
                    followers : {type : "Array"},
                    superPower : {type : "String" , es_indexed : false},
                    costume : {type : "String"},
                    powerGrade : {type : "String"},
                    tournament : {type : "ObjectId", ref: "Tournament"},
                    history : {type : "ObjectId", ref: "History"},   angerLevel : {type : "Number"},
                    optimismLevel : {type : "Number"}
                }
            },

            {
                options : {
                    name : 'Student'
                },
                fields  : {
                    name : {type : "Number" , es_indexed : true},
                    age : {type : "Number", es_indexed : true},
                    gender : {type : "String"},
                    powerClass : {type : "String"},
                    superPower : {type : "String" , es_indexed : false},
                    costume : {type : "String"},
                    powerGrade : {type : "String"},
                    tournament : {type : "ObjectId", ref: "Tournament"},
                    history : {type : "ObjectId", ref: "History"},
                    wins : {type : "Number"},
                    loss : {type : "Number"},
                    draw : {type : "Number"}
                }
            },

            {
                options : {
                    name : 'Tournament'
                },
                fields  : {
                    name : {type : "Number" , es_indexed : true},
                    wins : {type : "Number"},
                    loss : {type : "Number"},
                    draw : {type : "Number"}
                }
            },

            {
                options : {
                    name : 'History'
                },
                fields  : {
                    angerLevel : {type : "Number"},
                    optimismLevel : {type : "Number"},
                    enemyDefeat : {type : "Number"},
                    archNemesis : {type : "String"},
                    battleGroundDefeat : {type : "Number"},
                    enemyCapture : {type : "Number"},
                    alive : {type : "Boolean"}
                }
            }

        ],

        dependantServices       : { // todo dependant services goes here
            endPoints               : [
                'http://hero_league.com',
                'http://villain_league.com'
            ],
            abortIfFail             : false
        },

        environment             : {
            DEBUG : "*",
            PORT : 3300,
            MODE : "test_mode",
            MONGODB_URL : "mongodb://localhost:27017/heroAcademia",
            REVERSE_PROXY : "http://localhost",
            COLLECTION_RETURN_SIZE : "24",
            ELEMENT_IN_PAGE : "12",
            ELASTIC_SEARCH_URL : "http://localhost:9200"

        },

        // Defines authentication header key and type for api requests
        authentication          : {
            type : 'Bearer',
            headerKey : 'Authentication'
        },

        includeApiReqLib        : true, // If true will include library for requesting outside api call
        certificate             : {
            root : null,
            client : null,
            clientKey : null
        }, // Some path to a certificate if request will be made using https.

        // Defines related containers
        elasticSearch : true,
        mongodb : true,
        nginx : true,

        minify : false,

        test : true,
        docker : true,
        jenkins : true,
        elkLogger : true,
        enableProxy : true,
        readMe : true,
        documentation : true,
        commit : true,
        commitMessage : 'Initial commit, generated by gennode.'
    };
``
### Generated files
> Gennode generated files and directories.

| Name | Description |
|:------------:|:-----------:|
|apidocs            |Generated api documentation|
|config             |Generated server configuration file|
|controller         |Route controller files|
|coverage           |Test coverage report|
|dal                |Data access layer for models|
|lib                |Libraries|
|lib-constant       |Error codes and other service related constants.|
|lib-helper         |Api requester and controller helper modules|
|lib-helper-api     |Api requester libraries, if certificate is provided it will be copied in the cert directory.|
|lib-helper-others  |Controller helper module|
|lib-middlewares    |Initializer middleware|
|model              |Generated models|
|node_modules       |Node modules|
|report             |Test report|
|test               |Test suite files (dummy data and url generator module is also located here)|
|.dockerignore      |Docker ignore file|
|.env               |Environment file|
|.gitignore         |Git ignore file|
|app.js             |Application start file|
|docker-compose.yml |Docker compose file|
|Dockerfile         |Docker file|
|package.json       |Package file|

### Upcoming features

* Multilevel schema support
* Authentication service
* User management service
* Separate test suites
* Minify
* Elasticsearch container
* Https request response support.

### Contributing
**If you have anything in mind, that you think is would be awesome to include in the generated server files, feel free to create an issue [here](https://github.com/nathan-mersha/gennode/issues), or fork the project.**
