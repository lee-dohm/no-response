module.exports =
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2087));
const path = __importStar(__nccwpck_require__(5622));
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        const delimiter = '_GitHubActionsFileCommandDelimeter_';
        const commandValue = `${name}<<${delimiter}${os.EOL}${convertedVal}${os.EOL}${delimiter}`;
        file_command_1.issueCommand('ENV', commandValue);
    }
    else {
        command_1.issueCommand('set-env', { name }, convertedVal);
    }
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.  The value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    command_1.issueCommand('set-output', { name }, value);
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 */
function error(message) {
    command_1.issue('error', message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds an warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 */
function warning(message) {
    command_1.issue('warning', message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    command_1.issueCommand('save-state', { name }, value);
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(5747));
const os = __importStar(__nccwpck_require__(2087));
const utils_1 = __nccwpck_require__(5278);
function issueCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueCommand = issueCommand;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 4087:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Context = void 0;
const fs_1 = __nccwpck_require__(5747);
const os_1 = __nccwpck_require__(2087);
class Context {
    /**
     * Hydrate the context from the environment
     */
    constructor() {
        this.payload = {};
        if (process.env.GITHUB_EVENT_PATH) {
            if (fs_1.existsSync(process.env.GITHUB_EVENT_PATH)) {
                this.payload = JSON.parse(fs_1.readFileSync(process.env.GITHUB_EVENT_PATH, { encoding: 'utf8' }));
            }
            else {
                const path = process.env.GITHUB_EVENT_PATH;
                process.stdout.write(`GITHUB_EVENT_PATH ${path} does not exist${os_1.EOL}`);
            }
        }
        this.eventName = process.env.GITHUB_EVENT_NAME;
        this.sha = process.env.GITHUB_SHA;
        this.ref = process.env.GITHUB_REF;
        this.workflow = process.env.GITHUB_WORKFLOW;
        this.action = process.env.GITHUB_ACTION;
        this.actor = process.env.GITHUB_ACTOR;
        this.job = process.env.GITHUB_JOB;
        this.runNumber = parseInt(process.env.GITHUB_RUN_NUMBER, 10);
        this.runId = parseInt(process.env.GITHUB_RUN_ID, 10);
    }
    get issue() {
        const payload = this.payload;
        return Object.assign(Object.assign({}, this.repo), { number: (payload.issue || payload.pull_request || payload).number });
    }
    get repo() {
        if (process.env.GITHUB_REPOSITORY) {
            const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
            return { owner, repo };
        }
        if (this.payload.repository) {
            return {
                owner: this.payload.repository.owner.login,
                repo: this.payload.repository.name
            };
        }
        throw new Error("context.repo requires a GITHUB_REPOSITORY environment variable like 'owner/repo'");
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map

/***/ }),

/***/ 5438:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokit = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const utils_1 = __nccwpck_require__(3030);
exports.context = new Context.Context();
/**
 * Returns a hydrated octokit ready to use for GitHub Actions
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokit(token, options) {
    return new utils_1.GitHub(utils_1.getOctokitOptions(token, options));
}
exports.getOctokit = getOctokit;
//# sourceMappingURL=github.js.map

/***/ }),

/***/ 7914:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getApiBaseUrl = exports.getProxyAgent = exports.getAuthString = void 0;
const httpClient = __importStar(__nccwpck_require__(9925));
function getAuthString(token, options) {
    if (!token && !options.auth) {
        throw new Error('Parameter token or opts.auth is required');
    }
    else if (token && options.auth) {
        throw new Error('Parameters token and opts.auth may not both be specified');
    }
    return typeof options.auth === 'string' ? options.auth : `token ${token}`;
}
exports.getAuthString = getAuthString;
function getProxyAgent(destinationUrl) {
    const hc = new httpClient.HttpClient();
    return hc.getAgent(destinationUrl);
}
exports.getProxyAgent = getProxyAgent;
function getApiBaseUrl() {
    return process.env['GITHUB_API_URL'] || 'https://api.github.com';
}
exports.getApiBaseUrl = getApiBaseUrl;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 3030:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getOctokitOptions = exports.GitHub = exports.context = void 0;
const Context = __importStar(__nccwpck_require__(4087));
const Utils = __importStar(__nccwpck_require__(7914));
// octokit + plugins
const core_1 = __nccwpck_require__(6762);
const plugin_rest_endpoint_methods_1 = __nccwpck_require__(3044);
const plugin_paginate_rest_1 = __nccwpck_require__(4193);
exports.context = new Context.Context();
const baseUrl = Utils.getApiBaseUrl();
const defaults = {
    baseUrl,
    request: {
        agent: Utils.getProxyAgent(baseUrl)
    }
};
exports.GitHub = core_1.Octokit.plugin(plugin_rest_endpoint_methods_1.restEndpointMethods, plugin_paginate_rest_1.paginateRest).defaults(defaults);
/**
 * Convience function to correctly format Octokit Options to pass into the constructor.
 *
 * @param     token    the repo PAT or GITHUB_TOKEN
 * @param     options  other options to set
 */
function getOctokitOptions(token, options) {
    const opts = Object.assign({}, options || {}); // Shallow clone - don't mutate the object provided by the caller
    // Auth
    const auth = Utils.getAuthString(token, opts);
    if (auth) {
        opts.auth = auth;
    }
    return opts;
}
exports.getOctokitOptions = getOctokitOptions;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9925:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const http = __nccwpck_require__(8605);
const https = __nccwpck_require__(7211);
const pm = __nccwpck_require__(6443);
let tunnel;
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    let proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return new Promise(async (resolve, reject) => {
            let output = Buffer.alloc(0);
            this.message.on('data', (chunk) => {
                output = Buffer.concat([output, chunk]);
            });
            this.message.on('end', () => {
                resolve(output.toString());
            });
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    let parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
    }
    get(requestUrl, additionalHeaders) {
        return this.request('GET', requestUrl, null, additionalHeaders || {});
    }
    del(requestUrl, additionalHeaders) {
        return this.request('DELETE', requestUrl, null, additionalHeaders || {});
    }
    post(requestUrl, data, additionalHeaders) {
        return this.request('POST', requestUrl, data, additionalHeaders || {});
    }
    patch(requestUrl, data, additionalHeaders) {
        return this.request('PATCH', requestUrl, data, additionalHeaders || {});
    }
    put(requestUrl, data, additionalHeaders) {
        return this.request('PUT', requestUrl, data, additionalHeaders || {});
    }
    head(requestUrl, additionalHeaders) {
        return this.request('HEAD', requestUrl, null, additionalHeaders || {});
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return this.request(verb, requestUrl, stream, additionalHeaders);
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    async getJson(requestUrl, additionalHeaders = {}) {
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        let res = await this.get(requestUrl, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async postJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.post(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async putJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.put(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    async patchJson(requestUrl, obj, additionalHeaders = {}) {
        let data = JSON.stringify(obj, null, 2);
        additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
        additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
        let res = await this.patch(requestUrl, data, additionalHeaders);
        return this._processResponse(res, this.requestOptions);
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    async request(verb, requestUrl, data, headers) {
        if (this._disposed) {
            throw new Error('Client has already been disposed.');
        }
        let parsedUrl = new URL(requestUrl);
        let info = this._prepareRequest(verb, parsedUrl, headers);
        // Only perform retries on reads since writes may not be idempotent.
        let maxTries = this._allowRetries && RetryableHttpVerbs.indexOf(verb) != -1
            ? this._maxRetries + 1
            : 1;
        let numTries = 0;
        let response;
        while (numTries < maxTries) {
            response = await this.requestRaw(info, data);
            // Check if it's an authentication challenge
            if (response &&
                response.message &&
                response.message.statusCode === HttpCodes.Unauthorized) {
                let authenticationHandler;
                for (let i = 0; i < this.handlers.length; i++) {
                    if (this.handlers[i].canHandleAuthentication(response)) {
                        authenticationHandler = this.handlers[i];
                        break;
                    }
                }
                if (authenticationHandler) {
                    return authenticationHandler.handleAuthentication(this, info, data);
                }
                else {
                    // We have received an unauthorized response but have no handlers to handle it.
                    // Let the response return to the caller.
                    return response;
                }
            }
            let redirectsRemaining = this._maxRedirects;
            while (HttpRedirectCodes.indexOf(response.message.statusCode) != -1 &&
                this._allowRedirects &&
                redirectsRemaining > 0) {
                const redirectUrl = response.message.headers['location'];
                if (!redirectUrl) {
                    // if there's no location to redirect to, we won't
                    break;
                }
                let parsedRedirectUrl = new URL(redirectUrl);
                if (parsedUrl.protocol == 'https:' &&
                    parsedUrl.protocol != parsedRedirectUrl.protocol &&
                    !this._allowRedirectDowngrade) {
                    throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                }
                // we need to finish reading the response before reassigning response
                // which will leak the open socket.
                await response.readBody();
                // strip authorization header if redirected to a different hostname
                if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                    for (let header in headers) {
                        // header names are case insensitive
                        if (header.toLowerCase() === 'authorization') {
                            delete headers[header];
                        }
                    }
                }
                // let's make the request with the new redirectUrl
                info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                response = await this.requestRaw(info, data);
                redirectsRemaining--;
            }
            if (HttpResponseRetryCodes.indexOf(response.message.statusCode) == -1) {
                // If not a retry code, return immediately instead of retrying
                return response;
            }
            numTries += 1;
            if (numTries < maxTries) {
                await response.readBody();
                await this._performExponentialBackoff(numTries);
            }
        }
        return response;
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return new Promise((resolve, reject) => {
            let callbackForResult = function (err, res) {
                if (err) {
                    reject(err);
                }
                resolve(res);
            };
            this.requestRawWithCallback(info, data, callbackForResult);
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        let socket;
        if (typeof data === 'string') {
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        let handleResult = (err, res) => {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        };
        let req = info.httpModule.request(info.options, (msg) => {
            let res = new HttpClientResponse(msg);
            handleResult(null, res);
        });
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error('Request timeout: ' + info.options.path), null);
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err, null);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        let parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            this.handlers.forEach(handler => {
                handler.prepareRequest(info.options);
            });
        }
        return info;
    }
    _mergeHeaders(headers) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        const lowercaseKeys = obj => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        let proxyUrl = pm.getProxyUrl(parsedUrl);
        let useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (!!agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (!!this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        if (useProxy) {
            // If using proxy, need tunnel
            if (!tunnel) {
                tunnel = __nccwpck_require__(4294);
            }
            const agentOptions = {
                maxSockets: maxSockets,
                keepAlive: this._keepAlive,
                proxy: {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`,
                    host: proxyUrl.hostname,
                    port: proxyUrl.port
                }
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets: maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
        const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
        return new Promise(resolve => setTimeout(() => resolve(), ms));
    }
    static dateTimeDeserializer(key, value) {
        if (typeof value === 'string') {
            let a = new Date(value);
            if (!isNaN(a.valueOf())) {
                return a;
            }
        }
        return value;
    }
    async _processResponse(res, options) {
        return new Promise(async (resolve, reject) => {
            const statusCode = res.message.statusCode;
            const response = {
                statusCode: statusCode,
                result: null,
                headers: {}
            };
            // not found leads to null obj returned
            if (statusCode == HttpCodes.NotFound) {
                resolve(response);
            }
            let obj;
            let contents;
            // get the result from the body
            try {
                contents = await res.readBody();
                if (contents && contents.length > 0) {
                    if (options && options.deserializeDates) {
                        obj = JSON.parse(contents, HttpClient.dateTimeDeserializer);
                    }
                    else {
                        obj = JSON.parse(contents);
                    }
                    response.result = obj;
                }
                response.headers = res.message.headers;
            }
            catch (err) {
                // Invalid resource (contents not json);  leaving result obj null
            }
            // note that 3xx redirects are handled by the http layer.
            if (statusCode > 299) {
                let msg;
                // if exception/error in body, attempt to get better error
                if (obj && obj.message) {
                    msg = obj.message;
                }
                else if (contents && contents.length > 0) {
                    // it may be the case that the exception is in the body message as string
                    msg = contents;
                }
                else {
                    msg = 'Failed request: (' + statusCode + ')';
                }
                let err = new HttpClientError(msg, statusCode);
                err.result = response.result;
                reject(err);
            }
            else {
                resolve(response);
            }
        });
    }
}
exports.HttpClient = HttpClient;


/***/ }),

/***/ 6443:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
function getProxyUrl(reqUrl) {
    let usingSsl = reqUrl.protocol === 'https:';
    let proxyUrl;
    if (checkBypass(reqUrl)) {
        return proxyUrl;
    }
    let proxyVar;
    if (usingSsl) {
        proxyVar = process.env['https_proxy'] || process.env['HTTPS_PROXY'];
    }
    else {
        proxyVar = process.env['http_proxy'] || process.env['HTTP_PROXY'];
    }
    if (proxyVar) {
        proxyUrl = new URL(proxyVar);
    }
    return proxyUrl;
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    let noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    let upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (let upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperReqHosts.some(x => x === upperNoProxyItem)) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;


/***/ }),

/***/ 334:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

async function auth(token) {
  const tokenType = token.split(/\./).length === 3 ? "app" : /^v\d+\./.test(token) ? "installation" : "oauth";
  return {
    type: "token",
    token: token,
    tokenType
  };
}

/**
 * Prefix token for usage in the Authorization header
 *
 * @param token OAuth token or JSON Web Token
 */
function withAuthorizationPrefix(token) {
  if (token.split(/\./).length === 3) {
    return `bearer ${token}`;
  }

  return `token ${token}`;
}

async function hook(token, request, route, parameters) {
  const endpoint = request.endpoint.merge(route, parameters);
  endpoint.headers.authorization = withAuthorizationPrefix(token);
  return request(endpoint);
}

const createTokenAuth = function createTokenAuth(token) {
  if (!token) {
    throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");
  }

  if (typeof token !== "string") {
    throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");
  }

  token = token.replace(/^(token|bearer) +/i, "");
  return Object.assign(auth.bind(null, token), {
    hook: hook.bind(null, token)
  });
};

exports.createTokenAuth = createTokenAuth;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6762:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var universalUserAgent = __nccwpck_require__(5030);
var beforeAfterHook = __nccwpck_require__(3682);
var request = __nccwpck_require__(6234);
var graphql = __nccwpck_require__(8467);
var authToken = __nccwpck_require__(334);

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};

  var target = _objectWithoutPropertiesLoose(source, excluded);

  var key, i;

  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }

  return target;
}

const VERSION = "3.2.4";

class Octokit {
  constructor(options = {}) {
    const hook = new beforeAfterHook.Collection();
    const requestDefaults = {
      baseUrl: request.request.endpoint.DEFAULTS.baseUrl,
      headers: {},
      request: Object.assign({}, options.request, {
        hook: hook.bind(null, "request")
      }),
      mediaType: {
        previews: [],
        format: ""
      }
    }; // prepend default user agent with `options.userAgent` if set

    requestDefaults.headers["user-agent"] = [options.userAgent, `octokit-core.js/${VERSION} ${universalUserAgent.getUserAgent()}`].filter(Boolean).join(" ");

    if (options.baseUrl) {
      requestDefaults.baseUrl = options.baseUrl;
    }

    if (options.previews) {
      requestDefaults.mediaType.previews = options.previews;
    }

    if (options.timeZone) {
      requestDefaults.headers["time-zone"] = options.timeZone;
    }

    this.request = request.request.defaults(requestDefaults);
    this.graphql = graphql.withCustomRequest(this.request).defaults(requestDefaults);
    this.log = Object.assign({
      debug: () => {},
      info: () => {},
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    }, options.log);
    this.hook = hook; // (1) If neither `options.authStrategy` nor `options.auth` are set, the `octokit` instance
    //     is unauthenticated. The `this.auth()` method is a no-op and no request hook is registered.
    // (2) If only `options.auth` is set, use the default token authentication strategy.
    // (3) If `options.authStrategy` is set then use it and pass in `options.auth`. Always pass own request as many strategies accept a custom request instance.
    // TODO: type `options.auth` based on `options.authStrategy`.

    if (!options.authStrategy) {
      if (!options.auth) {
        // (1)
        this.auth = async () => ({
          type: "unauthenticated"
        });
      } else {
        // (2)
        const auth = authToken.createTokenAuth(options.auth); // @ts-ignore  ¯\_(ツ)_/¯

        hook.wrap("request", auth.hook);
        this.auth = auth;
      }
    } else {
      const {
        authStrategy
      } = options,
            otherOptions = _objectWithoutProperties(options, ["authStrategy"]);

      const auth = authStrategy(Object.assign({
        request: this.request,
        log: this.log,
        // we pass the current octokit instance as well as its constructor options
        // to allow for authentication strategies that return a new octokit instance
        // that shares the same internal state as the current one. The original
        // requirement for this was the "event-octokit" authentication strategy
        // of https://github.com/probot/octokit-auth-probot.
        octokit: this,
        octokitOptions: otherOptions
      }, options.auth)); // @ts-ignore  ¯\_(ツ)_/¯

      hook.wrap("request", auth.hook);
      this.auth = auth;
    } // apply plugins
    // https://stackoverflow.com/a/16345172


    const classConstructor = this.constructor;
    classConstructor.plugins.forEach(plugin => {
      Object.assign(this, plugin(this, options));
    });
  }

  static defaults(defaults) {
    const OctokitWithDefaults = class extends this {
      constructor(...args) {
        const options = args[0] || {};

        if (typeof defaults === "function") {
          super(defaults(options));
          return;
        }

        super(Object.assign({}, defaults, options, options.userAgent && defaults.userAgent ? {
          userAgent: `${options.userAgent} ${defaults.userAgent}`
        } : null));
      }

    };
    return OctokitWithDefaults;
  }
  /**
   * Attach a plugin (or many) to your Octokit instance.
   *
   * @example
   * const API = Octokit.plugin(plugin1, plugin2, plugin3, ...)
   */


  static plugin(...newPlugins) {
    var _a;

    const currentPlugins = this.plugins;
    const NewOctokit = (_a = class extends this {}, _a.plugins = currentPlugins.concat(newPlugins.filter(plugin => !currentPlugins.includes(plugin))), _a);
    return NewOctokit;
  }

}
Octokit.VERSION = VERSION;
Octokit.plugins = [];

exports.Octokit = Octokit;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9440:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var isPlainObject = __nccwpck_require__(558);
var universalUserAgent = __nccwpck_require__(5030);

function lowercaseKeys(object) {
  if (!object) {
    return {};
  }

  return Object.keys(object).reduce((newObj, key) => {
    newObj[key.toLowerCase()] = object[key];
    return newObj;
  }, {});
}

function mergeDeep(defaults, options) {
  const result = Object.assign({}, defaults);
  Object.keys(options).forEach(key => {
    if (isPlainObject.isPlainObject(options[key])) {
      if (!(key in defaults)) Object.assign(result, {
        [key]: options[key]
      });else result[key] = mergeDeep(defaults[key], options[key]);
    } else {
      Object.assign(result, {
        [key]: options[key]
      });
    }
  });
  return result;
}

function removeUndefinedProperties(obj) {
  for (const key in obj) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }

  return obj;
}

function merge(defaults, route, options) {
  if (typeof route === "string") {
    let [method, url] = route.split(" ");
    options = Object.assign(url ? {
      method,
      url
    } : {
      url: method
    }, options);
  } else {
    options = Object.assign({}, route);
  } // lowercase header names before merging with defaults to avoid duplicates


  options.headers = lowercaseKeys(options.headers); // remove properties with undefined values before merging

  removeUndefinedProperties(options);
  removeUndefinedProperties(options.headers);
  const mergedOptions = mergeDeep(defaults || {}, options); // mediaType.previews arrays are merged, instead of overwritten

  if (defaults && defaults.mediaType.previews.length) {
    mergedOptions.mediaType.previews = defaults.mediaType.previews.filter(preview => !mergedOptions.mediaType.previews.includes(preview)).concat(mergedOptions.mediaType.previews);
  }

  mergedOptions.mediaType.previews = mergedOptions.mediaType.previews.map(preview => preview.replace(/-preview/, ""));
  return mergedOptions;
}

function addQueryParameters(url, parameters) {
  const separator = /\?/.test(url) ? "&" : "?";
  const names = Object.keys(parameters);

  if (names.length === 0) {
    return url;
  }

  return url + separator + names.map(name => {
    if (name === "q") {
      return "q=" + parameters.q.split("+").map(encodeURIComponent).join("+");
    }

    return `${name}=${encodeURIComponent(parameters[name])}`;
  }).join("&");
}

const urlVariableRegex = /\{[^}]+\}/g;

function removeNonChars(variableName) {
  return variableName.replace(/^\W+|\W+$/g, "").split(/,/);
}

function extractUrlVariableNames(url) {
  const matches = url.match(urlVariableRegex);

  if (!matches) {
    return [];
  }

  return matches.map(removeNonChars).reduce((a, b) => a.concat(b), []);
}

function omit(object, keysToOmit) {
  return Object.keys(object).filter(option => !keysToOmit.includes(option)).reduce((obj, key) => {
    obj[key] = object[key];
    return obj;
  }, {});
}

// Based on https://github.com/bramstein/url-template, licensed under BSD
// TODO: create separate package.
//
// Copyright (c) 2012-2014, Bram Stein
// All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//  1. Redistributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in the
//     documentation and/or other materials provided with the distribution.
//  3. The name of the author may not be used to endorse or promote products
//     derived from this software without specific prior written permission.
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR "AS IS" AND ANY EXPRESS OR IMPLIED
// WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO
// EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
// INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
// OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
// NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
// EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

/* istanbul ignore file */
function encodeReserved(str) {
  return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
    if (!/%[0-9A-Fa-f]/.test(part)) {
      part = encodeURI(part).replace(/%5B/g, "[").replace(/%5D/g, "]");
    }

    return part;
  }).join("");
}

function encodeUnreserved(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16).toUpperCase();
  });
}

function encodeValue(operator, value, key) {
  value = operator === "+" || operator === "#" ? encodeReserved(value) : encodeUnreserved(value);

  if (key) {
    return encodeUnreserved(key) + "=" + value;
  } else {
    return value;
  }
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
  return operator === ";" || operator === "&" || operator === "?";
}

function getValues(context, operator, key, modifier) {
  var value = context[key],
      result = [];

  if (isDefined(value) && value !== "") {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      value = value.toString();

      if (modifier && modifier !== "*") {
        value = value.substring(0, parseInt(modifier, 10));
      }

      result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
    } else {
      if (modifier === "*") {
        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : ""));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              result.push(encodeValue(operator, value[k], k));
            }
          });
        }
      } else {
        const tmp = [];

        if (Array.isArray(value)) {
          value.filter(isDefined).forEach(function (value) {
            tmp.push(encodeValue(operator, value));
          });
        } else {
          Object.keys(value).forEach(function (k) {
            if (isDefined(value[k])) {
              tmp.push(encodeUnreserved(k));
              tmp.push(encodeValue(operator, value[k].toString()));
            }
          });
        }

        if (isKeyOperator(operator)) {
          result.push(encodeUnreserved(key) + "=" + tmp.join(","));
        } else if (tmp.length !== 0) {
          result.push(tmp.join(","));
        }
      }
    }
  } else {
    if (operator === ";") {
      if (isDefined(value)) {
        result.push(encodeUnreserved(key));
      }
    } else if (value === "" && (operator === "&" || operator === "?")) {
      result.push(encodeUnreserved(key) + "=");
    } else if (value === "") {
      result.push("");
    }
  }

  return result;
}

function parseUrl(template) {
  return {
    expand: expand.bind(null, template)
  };
}

function expand(template, context) {
  var operators = ["+", "#", ".", "/", ";", "?", "&"];
  return template.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g, function (_, expression, literal) {
    if (expression) {
      let operator = "";
      const values = [];

      if (operators.indexOf(expression.charAt(0)) !== -1) {
        operator = expression.charAt(0);
        expression = expression.substr(1);
      }

      expression.split(/,/g).forEach(function (variable) {
        var tmp = /([^:\*]*)(?::(\d+)|(\*))?/.exec(variable);
        values.push(getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
      });

      if (operator && operator !== "+") {
        var separator = ",";

        if (operator === "?") {
          separator = "&";
        } else if (operator !== "#") {
          separator = operator;
        }

        return (values.length !== 0 ? operator : "") + values.join(separator);
      } else {
        return values.join(",");
      }
    } else {
      return encodeReserved(literal);
    }
  });
}

function parse(options) {
  // https://fetch.spec.whatwg.org/#methods
  let method = options.method.toUpperCase(); // replace :varname with {varname} to make it RFC 6570 compatible

  let url = (options.url || "/").replace(/:([a-z]\w+)/g, "{$1}");
  let headers = Object.assign({}, options.headers);
  let body;
  let parameters = omit(options, ["method", "baseUrl", "url", "headers", "request", "mediaType"]); // extract variable names from URL to calculate remaining variables later

  const urlVariableNames = extractUrlVariableNames(url);
  url = parseUrl(url).expand(parameters);

  if (!/^http/.test(url)) {
    url = options.baseUrl + url;
  }

  const omittedParameters = Object.keys(options).filter(option => urlVariableNames.includes(option)).concat("baseUrl");
  const remainingParameters = omit(parameters, omittedParameters);
  const isBinaryRequest = /application\/octet-stream/i.test(headers.accept);

  if (!isBinaryRequest) {
    if (options.mediaType.format) {
      // e.g. application/vnd.github.v3+json => application/vnd.github.v3.raw
      headers.accept = headers.accept.split(/,/).map(preview => preview.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/, `application/vnd$1$2.${options.mediaType.format}`)).join(",");
    }

    if (options.mediaType.previews.length) {
      const previewsFromAcceptHeader = headers.accept.match(/[\w-]+(?=-preview)/g) || [];
      headers.accept = previewsFromAcceptHeader.concat(options.mediaType.previews).map(preview => {
        const format = options.mediaType.format ? `.${options.mediaType.format}` : "+json";
        return `application/vnd.github.${preview}-preview${format}`;
      }).join(",");
    }
  } // for GET/HEAD requests, set URL query parameters from remaining parameters
  // for PATCH/POST/PUT/DELETE requests, set request body from remaining parameters


  if (["GET", "HEAD"].includes(method)) {
    url = addQueryParameters(url, remainingParameters);
  } else {
    if ("data" in remainingParameters) {
      body = remainingParameters.data;
    } else {
      if (Object.keys(remainingParameters).length) {
        body = remainingParameters;
      } else {
        headers["content-length"] = 0;
      }
    }
  } // default content-type for JSON if body is set


  if (!headers["content-type"] && typeof body !== "undefined") {
    headers["content-type"] = "application/json; charset=utf-8";
  } // GitHub expects 'content-length: 0' header for PUT/PATCH requests without body.
  // fetch does not allow to set `content-length` header, but we can set body to an empty string


  if (["PATCH", "PUT"].includes(method) && typeof body === "undefined") {
    body = "";
  } // Only return body/request keys if present


  return Object.assign({
    method,
    url,
    headers
  }, typeof body !== "undefined" ? {
    body
  } : null, options.request ? {
    request: options.request
  } : null);
}

function endpointWithDefaults(defaults, route, options) {
  return parse(merge(defaults, route, options));
}

function withDefaults(oldDefaults, newDefaults) {
  const DEFAULTS = merge(oldDefaults, newDefaults);
  const endpoint = endpointWithDefaults.bind(null, DEFAULTS);
  return Object.assign(endpoint, {
    DEFAULTS,
    defaults: withDefaults.bind(null, DEFAULTS),
    merge: merge.bind(null, DEFAULTS),
    parse
  });
}

const VERSION = "6.0.10";

const userAgent = `octokit-endpoint.js/${VERSION} ${universalUserAgent.getUserAgent()}`; // DEFAULTS has all properties set that EndpointOptions has, except url.
// So we use RequestParameters and add method as additional required property.

const DEFAULTS = {
  method: "GET",
  baseUrl: "https://api.github.com",
  headers: {
    accept: "application/vnd.github.v3+json",
    "user-agent": userAgent
  },
  mediaType: {
    format: "",
    previews: []
  }
};

const endpoint = withDefaults(null, DEFAULTS);

exports.endpoint = endpoint;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 558:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 8467:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var request = __nccwpck_require__(6234);
var universalUserAgent = __nccwpck_require__(5030);

const VERSION = "4.5.8";

class GraphqlError extends Error {
  constructor(request, response) {
    const message = response.data.errors[0].message;
    super(message);
    Object.assign(this, response.data);
    Object.assign(this, {
      headers: response.headers
    });
    this.name = "GraphqlError";
    this.request = request; // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

}

const NON_VARIABLE_OPTIONS = ["method", "baseUrl", "url", "headers", "request", "query", "mediaType"];
const GHES_V3_SUFFIX_REGEX = /\/api\/v3\/?$/;
function graphql(request, query, options) {
  if (typeof query === "string" && options && "query" in options) {
    return Promise.reject(new Error(`[@octokit/graphql] "query" cannot be used as variable name`));
  }

  const parsedOptions = typeof query === "string" ? Object.assign({
    query
  }, options) : query;
  const requestOptions = Object.keys(parsedOptions).reduce((result, key) => {
    if (NON_VARIABLE_OPTIONS.includes(key)) {
      result[key] = parsedOptions[key];
      return result;
    }

    if (!result.variables) {
      result.variables = {};
    }

    result.variables[key] = parsedOptions[key];
    return result;
  }, {}); // workaround for GitHub Enterprise baseUrl set with /api/v3 suffix
  // https://github.com/octokit/auth-app.js/issues/111#issuecomment-657610451

  const baseUrl = parsedOptions.baseUrl || request.endpoint.DEFAULTS.baseUrl;

  if (GHES_V3_SUFFIX_REGEX.test(baseUrl)) {
    requestOptions.url = baseUrl.replace(GHES_V3_SUFFIX_REGEX, "/api/graphql");
  }

  return request(requestOptions).then(response => {
    if (response.data.errors) {
      const headers = {};

      for (const key of Object.keys(response.headers)) {
        headers[key] = response.headers[key];
      }

      throw new GraphqlError(requestOptions, {
        headers,
        data: response.data
      });
    }

    return response.data.data;
  });
}

function withDefaults(request$1, newDefaults) {
  const newRequest = request$1.defaults(newDefaults);

  const newApi = (query, options) => {
    return graphql(newRequest, query, options);
  };

  return Object.assign(newApi, {
    defaults: withDefaults.bind(null, newRequest),
    endpoint: request.request.endpoint
  });
}

const graphql$1 = withDefaults(request.request, {
  headers: {
    "user-agent": `octokit-graphql.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  },
  method: "POST",
  url: "/graphql"
});
function withCustomRequest(customRequest) {
  return withDefaults(customRequest, {
    method: "POST",
    url: "/graphql"
  });
}

exports.graphql = graphql$1;
exports.withCustomRequest = withCustomRequest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 4193:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const VERSION = "2.7.1";

/**
 * Some “list” response that can be paginated have a different response structure
 *
 * They have a `total_count` key in the response (search also has `incomplete_results`,
 * /installation/repositories also has `repository_selection`), as well as a key with
 * the list of the items which name varies from endpoint to endpoint.
 *
 * Octokit normalizes these responses so that paginated results are always returned following
 * the same structure. One challenge is that if the list response has only one page, no Link
 * header is provided, so this header alone is not sufficient to check wether a response is
 * paginated or not.
 *
 * We check if a "total_count" key is present in the response data, but also make sure that
 * a "url" property is not, as the "Get the combined status for a specific ref" endpoint would
 * otherwise match: https://developer.github.com/v3/repos/statuses/#get-the-combined-status-for-a-specific-ref
 */
function normalizePaginatedListResponse(response) {
  const responseNeedsNormalization = "total_count" in response.data && !("url" in response.data);
  if (!responseNeedsNormalization) return response; // keep the additional properties intact as there is currently no other way
  // to retrieve the same information.

  const incompleteResults = response.data.incomplete_results;
  const repositorySelection = response.data.repository_selection;
  const totalCount = response.data.total_count;
  delete response.data.incomplete_results;
  delete response.data.repository_selection;
  delete response.data.total_count;
  const namespaceKey = Object.keys(response.data)[0];
  const data = response.data[namespaceKey];
  response.data = data;

  if (typeof incompleteResults !== "undefined") {
    response.data.incomplete_results = incompleteResults;
  }

  if (typeof repositorySelection !== "undefined") {
    response.data.repository_selection = repositorySelection;
  }

  response.data.total_count = totalCount;
  return response;
}

function iterator(octokit, route, parameters) {
  const options = typeof route === "function" ? route.endpoint(parameters) : octokit.request.endpoint(route, parameters);
  const requestMethod = typeof route === "function" ? route : octokit.request;
  const method = options.method;
  const headers = options.headers;
  let url = options.url;
  return {
    [Symbol.asyncIterator]: () => ({
      async next() {
        if (!url) return {
          done: true
        };
        const response = await requestMethod({
          method,
          url,
          headers
        });
        const normalizedResponse = normalizePaginatedListResponse(response); // `response.headers.link` format:
        // '<https://api.github.com/users/aseemk/followers?page=2>; rel="next", <https://api.github.com/users/aseemk/followers?page=2>; rel="last"'
        // sets `url` to undefined if "next" URL is not present or `link` header is not set

        url = ((normalizedResponse.headers.link || "").match(/<([^>]+)>;\s*rel="next"/) || [])[1];
        return {
          value: normalizedResponse
        };
      }

    })
  };
}

function paginate(octokit, route, parameters, mapFn) {
  if (typeof parameters === "function") {
    mapFn = parameters;
    parameters = undefined;
  }

  return gather(octokit, [], iterator(octokit, route, parameters)[Symbol.asyncIterator](), mapFn);
}

function gather(octokit, results, iterator, mapFn) {
  return iterator.next().then(result => {
    if (result.done) {
      return results;
    }

    let earlyExit = false;

    function done() {
      earlyExit = true;
    }

    results = results.concat(mapFn ? mapFn(result.value, done) : result.value.data);

    if (earlyExit) {
      return results;
    }

    return gather(octokit, results, iterator, mapFn);
  });
}

const composePaginateRest = Object.assign(paginate, {
  iterator
});

/**
 * @param octokit Octokit instance
 * @param options Options passed to Octokit constructor
 */

function paginateRest(octokit) {
  return {
    paginate: Object.assign(paginate.bind(null, octokit), {
      iterator: iterator.bind(null, octokit)
    })
  };
}
paginateRest.VERSION = VERSION;

exports.composePaginateRest = composePaginateRest;
exports.paginateRest = paginateRest;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 3044:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const Endpoints = {
  actions: {
    addSelectedRepoToOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    cancelWorkflowRun: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/cancel"],
    createOrUpdateOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}"],
    createOrUpdateRepoSecret: ["PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    createRegistrationTokenForOrg: ["POST /orgs/{org}/actions/runners/registration-token"],
    createRegistrationTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/registration-token"],
    createRemoveTokenForOrg: ["POST /orgs/{org}/actions/runners/remove-token"],
    createRemoveTokenForRepo: ["POST /repos/{owner}/{repo}/actions/runners/remove-token"],
    createWorkflowDispatch: ["POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches"],
    deleteArtifact: ["DELETE /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    deleteOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}"],
    deleteRepoSecret: ["DELETE /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    deleteSelfHostedRunnerFromOrg: ["DELETE /orgs/{org}/actions/runners/{runner_id}"],
    deleteSelfHostedRunnerFromRepo: ["DELETE /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    deleteWorkflowRun: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}"],
    deleteWorkflowRunLogs: ["DELETE /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    disableSelectedRepositoryGithubActionsOrganization: ["DELETE /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    disableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/disable"],
    downloadArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}/{archive_format}"],
    downloadJobLogsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs"],
    downloadWorkflowRunLogs: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/logs"],
    enableSelectedRepositoryGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories/{repository_id}"],
    enableWorkflow: ["PUT /repos/{owner}/{repo}/actions/workflows/{workflow_id}/enable"],
    getAllowedActionsOrganization: ["GET /orgs/{org}/actions/permissions/selected-actions"],
    getAllowedActionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    getArtifact: ["GET /repos/{owner}/{repo}/actions/artifacts/{artifact_id}"],
    getGithubActionsPermissionsOrganization: ["GET /orgs/{org}/actions/permissions"],
    getGithubActionsPermissionsRepository: ["GET /repos/{owner}/{repo}/actions/permissions"],
    getJobForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/jobs/{job_id}"],
    getOrgPublicKey: ["GET /orgs/{org}/actions/secrets/public-key"],
    getOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}"],
    getRepoPermissions: ["GET /repos/{owner}/{repo}/actions/permissions", {}, {
      renamed: ["actions", "getGithubActionsPermissionsRepository"]
    }],
    getRepoPublicKey: ["GET /repos/{owner}/{repo}/actions/secrets/public-key"],
    getRepoSecret: ["GET /repos/{owner}/{repo}/actions/secrets/{secret_name}"],
    getSelfHostedRunnerForOrg: ["GET /orgs/{org}/actions/runners/{runner_id}"],
    getSelfHostedRunnerForRepo: ["GET /repos/{owner}/{repo}/actions/runners/{runner_id}"],
    getWorkflow: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}"],
    getWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}"],
    getWorkflowRunUsage: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/timing"],
    getWorkflowUsage: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/timing"],
    listArtifactsForRepo: ["GET /repos/{owner}/{repo}/actions/artifacts"],
    listJobsForWorkflowRun: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/jobs"],
    listOrgSecrets: ["GET /orgs/{org}/actions/secrets"],
    listRepoSecrets: ["GET /repos/{owner}/{repo}/actions/secrets"],
    listRepoWorkflows: ["GET /repos/{owner}/{repo}/actions/workflows"],
    listRunnerApplicationsForOrg: ["GET /orgs/{org}/actions/runners/downloads"],
    listRunnerApplicationsForRepo: ["GET /repos/{owner}/{repo}/actions/runners/downloads"],
    listSelectedReposForOrgSecret: ["GET /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    listSelectedRepositoriesEnabledGithubActionsOrganization: ["GET /orgs/{org}/actions/permissions/repositories"],
    listSelfHostedRunnersForOrg: ["GET /orgs/{org}/actions/runners"],
    listSelfHostedRunnersForRepo: ["GET /repos/{owner}/{repo}/actions/runners"],
    listWorkflowRunArtifacts: ["GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts"],
    listWorkflowRuns: ["GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs"],
    listWorkflowRunsForRepo: ["GET /repos/{owner}/{repo}/actions/runs"],
    reRunWorkflow: ["POST /repos/{owner}/{repo}/actions/runs/{run_id}/rerun"],
    removeSelectedRepoFromOrgSecret: ["DELETE /orgs/{org}/actions/secrets/{secret_name}/repositories/{repository_id}"],
    setAllowedActionsOrganization: ["PUT /orgs/{org}/actions/permissions/selected-actions"],
    setAllowedActionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsOrganization: ["PUT /orgs/{org}/actions/permissions"],
    setGithubActionsPermissionsRepository: ["PUT /repos/{owner}/{repo}/actions/permissions"],
    setSelectedReposForOrgSecret: ["PUT /orgs/{org}/actions/secrets/{secret_name}/repositories"],
    setSelectedRepositoriesEnabledGithubActionsOrganization: ["PUT /orgs/{org}/actions/permissions/repositories"]
  },
  activity: {
    checkRepoIsStarredByAuthenticatedUser: ["GET /user/starred/{owner}/{repo}"],
    deleteRepoSubscription: ["DELETE /repos/{owner}/{repo}/subscription"],
    deleteThreadSubscription: ["DELETE /notifications/threads/{thread_id}/subscription"],
    getFeeds: ["GET /feeds"],
    getRepoSubscription: ["GET /repos/{owner}/{repo}/subscription"],
    getThread: ["GET /notifications/threads/{thread_id}"],
    getThreadSubscriptionForAuthenticatedUser: ["GET /notifications/threads/{thread_id}/subscription"],
    listEventsForAuthenticatedUser: ["GET /users/{username}/events"],
    listNotificationsForAuthenticatedUser: ["GET /notifications"],
    listOrgEventsForAuthenticatedUser: ["GET /users/{username}/events/orgs/{org}"],
    listPublicEvents: ["GET /events"],
    listPublicEventsForRepoNetwork: ["GET /networks/{owner}/{repo}/events"],
    listPublicEventsForUser: ["GET /users/{username}/events/public"],
    listPublicOrgEvents: ["GET /orgs/{org}/events"],
    listReceivedEventsForUser: ["GET /users/{username}/received_events"],
    listReceivedPublicEventsForUser: ["GET /users/{username}/received_events/public"],
    listRepoEvents: ["GET /repos/{owner}/{repo}/events"],
    listRepoNotificationsForAuthenticatedUser: ["GET /repos/{owner}/{repo}/notifications"],
    listReposStarredByAuthenticatedUser: ["GET /user/starred"],
    listReposStarredByUser: ["GET /users/{username}/starred"],
    listReposWatchedByUser: ["GET /users/{username}/subscriptions"],
    listStargazersForRepo: ["GET /repos/{owner}/{repo}/stargazers"],
    listWatchedReposForAuthenticatedUser: ["GET /user/subscriptions"],
    listWatchersForRepo: ["GET /repos/{owner}/{repo}/subscribers"],
    markNotificationsAsRead: ["PUT /notifications"],
    markRepoNotificationsAsRead: ["PUT /repos/{owner}/{repo}/notifications"],
    markThreadAsRead: ["PATCH /notifications/threads/{thread_id}"],
    setRepoSubscription: ["PUT /repos/{owner}/{repo}/subscription"],
    setThreadSubscription: ["PUT /notifications/threads/{thread_id}/subscription"],
    starRepoForAuthenticatedUser: ["PUT /user/starred/{owner}/{repo}"],
    unstarRepoForAuthenticatedUser: ["DELETE /user/starred/{owner}/{repo}"]
  },
  apps: {
    addRepoToInstallation: ["PUT /user/installations/{installation_id}/repositories/{repository_id}"],
    checkToken: ["POST /applications/{client_id}/token"],
    createContentAttachment: ["POST /content_references/{content_reference_id}/attachments", {
      mediaType: {
        previews: ["corsair"]
      }
    }],
    createFromManifest: ["POST /app-manifests/{code}/conversions"],
    createInstallationAccessToken: ["POST /app/installations/{installation_id}/access_tokens"],
    deleteAuthorization: ["DELETE /applications/{client_id}/grant"],
    deleteInstallation: ["DELETE /app/installations/{installation_id}"],
    deleteToken: ["DELETE /applications/{client_id}/token"],
    getAuthenticated: ["GET /app"],
    getBySlug: ["GET /apps/{app_slug}"],
    getInstallation: ["GET /app/installations/{installation_id}"],
    getOrgInstallation: ["GET /orgs/{org}/installation"],
    getRepoInstallation: ["GET /repos/{owner}/{repo}/installation"],
    getSubscriptionPlanForAccount: ["GET /marketplace_listing/accounts/{account_id}"],
    getSubscriptionPlanForAccountStubbed: ["GET /marketplace_listing/stubbed/accounts/{account_id}"],
    getUserInstallation: ["GET /users/{username}/installation"],
    getWebhookConfigForApp: ["GET /app/hook/config"],
    listAccountsForPlan: ["GET /marketplace_listing/plans/{plan_id}/accounts"],
    listAccountsForPlanStubbed: ["GET /marketplace_listing/stubbed/plans/{plan_id}/accounts"],
    listInstallationReposForAuthenticatedUser: ["GET /user/installations/{installation_id}/repositories"],
    listInstallations: ["GET /app/installations"],
    listInstallationsForAuthenticatedUser: ["GET /user/installations"],
    listPlans: ["GET /marketplace_listing/plans"],
    listPlansStubbed: ["GET /marketplace_listing/stubbed/plans"],
    listReposAccessibleToInstallation: ["GET /installation/repositories"],
    listSubscriptionsForAuthenticatedUser: ["GET /user/marketplace_purchases"],
    listSubscriptionsForAuthenticatedUserStubbed: ["GET /user/marketplace_purchases/stubbed"],
    removeRepoFromInstallation: ["DELETE /user/installations/{installation_id}/repositories/{repository_id}"],
    resetToken: ["PATCH /applications/{client_id}/token"],
    revokeInstallationAccessToken: ["DELETE /installation/token"],
    scopeToken: ["POST /applications/{client_id}/token/scoped"],
    suspendInstallation: ["PUT /app/installations/{installation_id}/suspended"],
    unsuspendInstallation: ["DELETE /app/installations/{installation_id}/suspended"],
    updateWebhookConfigForApp: ["PATCH /app/hook/config"]
  },
  billing: {
    getGithubActionsBillingOrg: ["GET /orgs/{org}/settings/billing/actions"],
    getGithubActionsBillingUser: ["GET /users/{username}/settings/billing/actions"],
    getGithubPackagesBillingOrg: ["GET /orgs/{org}/settings/billing/packages"],
    getGithubPackagesBillingUser: ["GET /users/{username}/settings/billing/packages"],
    getSharedStorageBillingOrg: ["GET /orgs/{org}/settings/billing/shared-storage"],
    getSharedStorageBillingUser: ["GET /users/{username}/settings/billing/shared-storage"]
  },
  checks: {
    create: ["POST /repos/{owner}/{repo}/check-runs"],
    createSuite: ["POST /repos/{owner}/{repo}/check-suites"],
    get: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}"],
    getSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}"],
    listAnnotations: ["GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations"],
    listForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-runs"],
    listForSuite: ["GET /repos/{owner}/{repo}/check-suites/{check_suite_id}/check-runs"],
    listSuitesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/check-suites"],
    rerequestSuite: ["POST /repos/{owner}/{repo}/check-suites/{check_suite_id}/rerequest"],
    setSuitesPreferences: ["PATCH /repos/{owner}/{repo}/check-suites/preferences"],
    update: ["PATCH /repos/{owner}/{repo}/check-runs/{check_run_id}"]
  },
  codeScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}", {}, {
      renamedParameters: {
        alert_id: "alert_number"
      }
    }],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/code-scanning/alerts"],
    listRecentAnalyses: ["GET /repos/{owner}/{repo}/code-scanning/analyses"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/code-scanning/alerts/{alert_number}"],
    uploadSarif: ["POST /repos/{owner}/{repo}/code-scanning/sarifs"]
  },
  codesOfConduct: {
    getAllCodesOfConduct: ["GET /codes_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getConductCode: ["GET /codes_of_conduct/{key}", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }],
    getForRepo: ["GET /repos/{owner}/{repo}/community/code_of_conduct", {
      mediaType: {
        previews: ["scarlet-witch"]
      }
    }]
  },
  emojis: {
    get: ["GET /emojis"]
  },
  enterpriseAdmin: {
    disableSelectedOrganizationGithubActionsEnterprise: ["DELETE /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    enableSelectedOrganizationGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations/{org_id}"],
    getAllowedActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/selected-actions"],
    getGithubActionsPermissionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions"],
    listSelectedOrganizationsEnabledGithubActionsEnterprise: ["GET /enterprises/{enterprise}/actions/permissions/organizations"],
    setAllowedActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/selected-actions"],
    setGithubActionsPermissionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions"],
    setSelectedOrganizationsEnabledGithubActionsEnterprise: ["PUT /enterprises/{enterprise}/actions/permissions/organizations"]
  },
  gists: {
    checkIsStarred: ["GET /gists/{gist_id}/star"],
    create: ["POST /gists"],
    createComment: ["POST /gists/{gist_id}/comments"],
    delete: ["DELETE /gists/{gist_id}"],
    deleteComment: ["DELETE /gists/{gist_id}/comments/{comment_id}"],
    fork: ["POST /gists/{gist_id}/forks"],
    get: ["GET /gists/{gist_id}"],
    getComment: ["GET /gists/{gist_id}/comments/{comment_id}"],
    getRevision: ["GET /gists/{gist_id}/{sha}"],
    list: ["GET /gists"],
    listComments: ["GET /gists/{gist_id}/comments"],
    listCommits: ["GET /gists/{gist_id}/commits"],
    listForUser: ["GET /users/{username}/gists"],
    listForks: ["GET /gists/{gist_id}/forks"],
    listPublic: ["GET /gists/public"],
    listStarred: ["GET /gists/starred"],
    star: ["PUT /gists/{gist_id}/star"],
    unstar: ["DELETE /gists/{gist_id}/star"],
    update: ["PATCH /gists/{gist_id}"],
    updateComment: ["PATCH /gists/{gist_id}/comments/{comment_id}"]
  },
  git: {
    createBlob: ["POST /repos/{owner}/{repo}/git/blobs"],
    createCommit: ["POST /repos/{owner}/{repo}/git/commits"],
    createRef: ["POST /repos/{owner}/{repo}/git/refs"],
    createTag: ["POST /repos/{owner}/{repo}/git/tags"],
    createTree: ["POST /repos/{owner}/{repo}/git/trees"],
    deleteRef: ["DELETE /repos/{owner}/{repo}/git/refs/{ref}"],
    getBlob: ["GET /repos/{owner}/{repo}/git/blobs/{file_sha}"],
    getCommit: ["GET /repos/{owner}/{repo}/git/commits/{commit_sha}"],
    getRef: ["GET /repos/{owner}/{repo}/git/ref/{ref}"],
    getTag: ["GET /repos/{owner}/{repo}/git/tags/{tag_sha}"],
    getTree: ["GET /repos/{owner}/{repo}/git/trees/{tree_sha}"],
    listMatchingRefs: ["GET /repos/{owner}/{repo}/git/matching-refs/{ref}"],
    updateRef: ["PATCH /repos/{owner}/{repo}/git/refs/{ref}"]
  },
  gitignore: {
    getAllTemplates: ["GET /gitignore/templates"],
    getTemplate: ["GET /gitignore/templates/{name}"]
  },
  interactions: {
    getRestrictionsForOrg: ["GET /orgs/{org}/interaction-limits"],
    getRestrictionsForRepo: ["GET /repos/{owner}/{repo}/interaction-limits"],
    getRestrictionsForYourPublicRepos: ["GET /user/interaction-limits"],
    removeRestrictionsForOrg: ["DELETE /orgs/{org}/interaction-limits"],
    removeRestrictionsForRepo: ["DELETE /repos/{owner}/{repo}/interaction-limits"],
    removeRestrictionsForYourPublicRepos: ["DELETE /user/interaction-limits"],
    setRestrictionsForOrg: ["PUT /orgs/{org}/interaction-limits"],
    setRestrictionsForRepo: ["PUT /repos/{owner}/{repo}/interaction-limits"],
    setRestrictionsForYourPublicRepos: ["PUT /user/interaction-limits"]
  },
  issues: {
    addAssignees: ["POST /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    addLabels: ["POST /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    checkUserCanBeAssigned: ["GET /repos/{owner}/{repo}/assignees/{assignee}"],
    create: ["POST /repos/{owner}/{repo}/issues"],
    createComment: ["POST /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    createLabel: ["POST /repos/{owner}/{repo}/labels"],
    createMilestone: ["POST /repos/{owner}/{repo}/milestones"],
    deleteComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    deleteLabel: ["DELETE /repos/{owner}/{repo}/labels/{name}"],
    deleteMilestone: ["DELETE /repos/{owner}/{repo}/milestones/{milestone_number}"],
    get: ["GET /repos/{owner}/{repo}/issues/{issue_number}"],
    getComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    getEvent: ["GET /repos/{owner}/{repo}/issues/events/{event_id}"],
    getLabel: ["GET /repos/{owner}/{repo}/labels/{name}"],
    getMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}"],
    list: ["GET /issues"],
    listAssignees: ["GET /repos/{owner}/{repo}/assignees"],
    listComments: ["GET /repos/{owner}/{repo}/issues/{issue_number}/comments"],
    listCommentsForRepo: ["GET /repos/{owner}/{repo}/issues/comments"],
    listEvents: ["GET /repos/{owner}/{repo}/issues/{issue_number}/events"],
    listEventsForRepo: ["GET /repos/{owner}/{repo}/issues/events"],
    listEventsForTimeline: ["GET /repos/{owner}/{repo}/issues/{issue_number}/timeline", {
      mediaType: {
        previews: ["mockingbird"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/issues"],
    listForOrg: ["GET /orgs/{org}/issues"],
    listForRepo: ["GET /repos/{owner}/{repo}/issues"],
    listLabelsForMilestone: ["GET /repos/{owner}/{repo}/milestones/{milestone_number}/labels"],
    listLabelsForRepo: ["GET /repos/{owner}/{repo}/labels"],
    listLabelsOnIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    listMilestones: ["GET /repos/{owner}/{repo}/milestones"],
    lock: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    removeAllLabels: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    removeAssignees: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/assignees"],
    removeLabel: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}"],
    setLabels: ["PUT /repos/{owner}/{repo}/issues/{issue_number}/labels"],
    unlock: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/lock"],
    update: ["PATCH /repos/{owner}/{repo}/issues/{issue_number}"],
    updateComment: ["PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}"],
    updateLabel: ["PATCH /repos/{owner}/{repo}/labels/{name}"],
    updateMilestone: ["PATCH /repos/{owner}/{repo}/milestones/{milestone_number}"]
  },
  licenses: {
    get: ["GET /licenses/{license}"],
    getAllCommonlyUsed: ["GET /licenses"],
    getForRepo: ["GET /repos/{owner}/{repo}/license"]
  },
  markdown: {
    render: ["POST /markdown"],
    renderRaw: ["POST /markdown/raw", {
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    }]
  },
  meta: {
    get: ["GET /meta"],
    getOctocat: ["GET /octocat"],
    getZen: ["GET /zen"],
    root: ["GET /"]
  },
  migrations: {
    cancelImport: ["DELETE /repos/{owner}/{repo}/import"],
    deleteArchiveForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    deleteArchiveForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    downloadArchiveForOrg: ["GET /orgs/{org}/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getArchiveForAuthenticatedUser: ["GET /user/migrations/{migration_id}/archive", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getCommitAuthors: ["GET /repos/{owner}/{repo}/import/authors"],
    getImportStatus: ["GET /repos/{owner}/{repo}/import"],
    getLargeFiles: ["GET /repos/{owner}/{repo}/import/large_files"],
    getStatusForAuthenticatedUser: ["GET /user/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    getStatusForOrg: ["GET /orgs/{org}/migrations/{migration_id}", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForAuthenticatedUser: ["GET /user/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/migrations", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForOrg: ["GET /orgs/{org}/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    listReposForUser: ["GET /user/migrations/{migration_id}/repositories", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    mapCommitAuthor: ["PATCH /repos/{owner}/{repo}/import/authors/{author_id}"],
    setLfsPreference: ["PATCH /repos/{owner}/{repo}/import/lfs"],
    startForAuthenticatedUser: ["POST /user/migrations"],
    startForOrg: ["POST /orgs/{org}/migrations"],
    startImport: ["PUT /repos/{owner}/{repo}/import"],
    unlockRepoForAuthenticatedUser: ["DELETE /user/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    unlockRepoForOrg: ["DELETE /orgs/{org}/migrations/{migration_id}/repos/{repo_name}/lock", {
      mediaType: {
        previews: ["wyandotte"]
      }
    }],
    updateImport: ["PATCH /repos/{owner}/{repo}/import"]
  },
  orgs: {
    blockUser: ["PUT /orgs/{org}/blocks/{username}"],
    checkBlockedUser: ["GET /orgs/{org}/blocks/{username}"],
    checkMembershipForUser: ["GET /orgs/{org}/members/{username}"],
    checkPublicMembershipForUser: ["GET /orgs/{org}/public_members/{username}"],
    convertMemberToOutsideCollaborator: ["PUT /orgs/{org}/outside_collaborators/{username}"],
    createInvitation: ["POST /orgs/{org}/invitations"],
    createWebhook: ["POST /orgs/{org}/hooks"],
    deleteWebhook: ["DELETE /orgs/{org}/hooks/{hook_id}"],
    get: ["GET /orgs/{org}"],
    getMembershipForAuthenticatedUser: ["GET /user/memberships/orgs/{org}"],
    getMembershipForUser: ["GET /orgs/{org}/memberships/{username}"],
    getWebhook: ["GET /orgs/{org}/hooks/{hook_id}"],
    getWebhookConfigForOrg: ["GET /orgs/{org}/hooks/{hook_id}/config"],
    list: ["GET /organizations"],
    listAppInstallations: ["GET /orgs/{org}/installations"],
    listBlockedUsers: ["GET /orgs/{org}/blocks"],
    listForAuthenticatedUser: ["GET /user/orgs"],
    listForUser: ["GET /users/{username}/orgs"],
    listInvitationTeams: ["GET /orgs/{org}/invitations/{invitation_id}/teams"],
    listMembers: ["GET /orgs/{org}/members"],
    listMembershipsForAuthenticatedUser: ["GET /user/memberships/orgs"],
    listOutsideCollaborators: ["GET /orgs/{org}/outside_collaborators"],
    listPendingInvitations: ["GET /orgs/{org}/invitations"],
    listPublicMembers: ["GET /orgs/{org}/public_members"],
    listWebhooks: ["GET /orgs/{org}/hooks"],
    pingWebhook: ["POST /orgs/{org}/hooks/{hook_id}/pings"],
    removeMember: ["DELETE /orgs/{org}/members/{username}"],
    removeMembershipForUser: ["DELETE /orgs/{org}/memberships/{username}"],
    removeOutsideCollaborator: ["DELETE /orgs/{org}/outside_collaborators/{username}"],
    removePublicMembershipForAuthenticatedUser: ["DELETE /orgs/{org}/public_members/{username}"],
    setMembershipForUser: ["PUT /orgs/{org}/memberships/{username}"],
    setPublicMembershipForAuthenticatedUser: ["PUT /orgs/{org}/public_members/{username}"],
    unblockUser: ["DELETE /orgs/{org}/blocks/{username}"],
    update: ["PATCH /orgs/{org}"],
    updateMembershipForAuthenticatedUser: ["PATCH /user/memberships/orgs/{org}"],
    updateWebhook: ["PATCH /orgs/{org}/hooks/{hook_id}"],
    updateWebhookConfigForOrg: ["PATCH /orgs/{org}/hooks/{hook_id}/config"]
  },
  projects: {
    addCollaborator: ["PUT /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createCard: ["POST /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createColumn: ["POST /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForAuthenticatedUser: ["POST /user/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForOrg: ["POST /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    createForRepo: ["POST /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    delete: ["DELETE /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteCard: ["DELETE /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    deleteColumn: ["DELETE /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    get: ["GET /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getCard: ["GET /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getColumn: ["GET /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    getPermissionForUser: ["GET /projects/{project_id}/collaborators/{username}/permission", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCards: ["GET /projects/columns/{column_id}/cards", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listCollaborators: ["GET /projects/{project_id}/collaborators", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listColumns: ["GET /projects/{project_id}/columns", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForOrg: ["GET /orgs/{org}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForRepo: ["GET /repos/{owner}/{repo}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listForUser: ["GET /users/{username}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveCard: ["POST /projects/columns/cards/{card_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    moveColumn: ["POST /projects/columns/{column_id}/moves", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    removeCollaborator: ["DELETE /projects/{project_id}/collaborators/{username}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    update: ["PATCH /projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateCard: ["PATCH /projects/columns/cards/{card_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    updateColumn: ["PATCH /projects/columns/{column_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }]
  },
  pulls: {
    checkIfMerged: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    create: ["POST /repos/{owner}/{repo}/pulls"],
    createReplyForReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments/{comment_id}/replies"],
    createReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    createReviewComment: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    deletePendingReview: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    deleteReviewComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    dismissReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/dismissals"],
    get: ["GET /repos/{owner}/{repo}/pulls/{pull_number}"],
    getReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    getReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}"],
    list: ["GET /repos/{owner}/{repo}/pulls"],
    listCommentsForReview: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/comments"],
    listCommits: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/commits"],
    listFiles: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/files"],
    listRequestedReviewers: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    listReviewComments: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/comments"],
    listReviewCommentsForRepo: ["GET /repos/{owner}/{repo}/pulls/comments"],
    listReviews: ["GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews"],
    merge: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge"],
    removeRequestedReviewers: ["DELETE /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    requestReviewers: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/requested_reviewers"],
    submitReview: ["POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}/events"],
    update: ["PATCH /repos/{owner}/{repo}/pulls/{pull_number}"],
    updateBranch: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/update-branch", {
      mediaType: {
        previews: ["lydian"]
      }
    }],
    updateReview: ["PUT /repos/{owner}/{repo}/pulls/{pull_number}/reviews/{review_id}"],
    updateReviewComment: ["PATCH /repos/{owner}/{repo}/pulls/comments/{comment_id}"]
  },
  rateLimit: {
    get: ["GET /rate_limit"]
  },
  reactions: {
    createForCommitComment: ["POST /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssue: ["POST /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForIssueComment: ["POST /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForPullRequestReviewComment: ["POST /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    createForTeamDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssue: ["DELETE /repos/{owner}/{repo}/issues/{issue_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForIssueComment: ["DELETE /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForPullRequestComment: ["DELETE /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussion: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteForTeamDiscussionComment: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    deleteLegacy: ["DELETE /reactions/{reaction_id}", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }, {
      deprecated: "octokit.reactions.deleteLegacy() is deprecated, see https://docs.github.com/v3/reactions/#delete-a-reaction-legacy"
    }],
    listForCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssue: ["GET /repos/{owner}/{repo}/issues/{issue_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForIssueComment: ["GET /repos/{owner}/{repo}/issues/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForPullRequestReviewComment: ["GET /repos/{owner}/{repo}/pulls/comments/{comment_id}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }],
    listForTeamDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions", {
      mediaType: {
        previews: ["squirrel-girl"]
      }
    }]
  },
  repos: {
    acceptInvitation: ["PATCH /user/repository_invitations/{invitation_id}"],
    addAppAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    addCollaborator: ["PUT /repos/{owner}/{repo}/collaborators/{username}"],
    addStatusCheckContexts: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    addTeamAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    addUserAccessRestrictions: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    checkCollaborator: ["GET /repos/{owner}/{repo}/collaborators/{username}"],
    checkVulnerabilityAlerts: ["GET /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    compareCommits: ["GET /repos/{owner}/{repo}/compare/{base}...{head}"],
    createCommitComment: ["POST /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    createCommitSignatureProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    createCommitStatus: ["POST /repos/{owner}/{repo}/statuses/{sha}"],
    createDeployKey: ["POST /repos/{owner}/{repo}/keys"],
    createDeployment: ["POST /repos/{owner}/{repo}/deployments"],
    createDeploymentStatus: ["POST /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    createDispatchEvent: ["POST /repos/{owner}/{repo}/dispatches"],
    createForAuthenticatedUser: ["POST /user/repos"],
    createFork: ["POST /repos/{owner}/{repo}/forks"],
    createInOrg: ["POST /orgs/{org}/repos"],
    createOrUpdateFileContents: ["PUT /repos/{owner}/{repo}/contents/{path}"],
    createPagesSite: ["POST /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    createRelease: ["POST /repos/{owner}/{repo}/releases"],
    createUsingTemplate: ["POST /repos/{template_owner}/{template_repo}/generate", {
      mediaType: {
        previews: ["baptiste"]
      }
    }],
    createWebhook: ["POST /repos/{owner}/{repo}/hooks"],
    declineInvitation: ["DELETE /user/repository_invitations/{invitation_id}"],
    delete: ["DELETE /repos/{owner}/{repo}"],
    deleteAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    deleteAdminBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    deleteBranchProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection"],
    deleteCommitComment: ["DELETE /repos/{owner}/{repo}/comments/{comment_id}"],
    deleteCommitSignatureProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    deleteDeployKey: ["DELETE /repos/{owner}/{repo}/keys/{key_id}"],
    deleteDeployment: ["DELETE /repos/{owner}/{repo}/deployments/{deployment_id}"],
    deleteFile: ["DELETE /repos/{owner}/{repo}/contents/{path}"],
    deleteInvitation: ["DELETE /repos/{owner}/{repo}/invitations/{invitation_id}"],
    deletePagesSite: ["DELETE /repos/{owner}/{repo}/pages", {
      mediaType: {
        previews: ["switcheroo"]
      }
    }],
    deletePullRequestReviewProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    deleteRelease: ["DELETE /repos/{owner}/{repo}/releases/{release_id}"],
    deleteReleaseAsset: ["DELETE /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    deleteWebhook: ["DELETE /repos/{owner}/{repo}/hooks/{hook_id}"],
    disableAutomatedSecurityFixes: ["DELETE /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    disableVulnerabilityAlerts: ["DELETE /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    downloadArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}", {}, {
      renamed: ["repos", "downloadZipballArchive"]
    }],
    downloadTarballArchive: ["GET /repos/{owner}/{repo}/tarball/{ref}"],
    downloadZipballArchive: ["GET /repos/{owner}/{repo}/zipball/{ref}"],
    enableAutomatedSecurityFixes: ["PUT /repos/{owner}/{repo}/automated-security-fixes", {
      mediaType: {
        previews: ["london"]
      }
    }],
    enableVulnerabilityAlerts: ["PUT /repos/{owner}/{repo}/vulnerability-alerts", {
      mediaType: {
        previews: ["dorian"]
      }
    }],
    get: ["GET /repos/{owner}/{repo}"],
    getAccessRestrictions: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions"],
    getAdminBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    getAllStatusCheckContexts: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts"],
    getAllTopics: ["GET /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    getAppsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps"],
    getBranch: ["GET /repos/{owner}/{repo}/branches/{branch}"],
    getBranchProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection"],
    getClones: ["GET /repos/{owner}/{repo}/traffic/clones"],
    getCodeFrequencyStats: ["GET /repos/{owner}/{repo}/stats/code_frequency"],
    getCollaboratorPermissionLevel: ["GET /repos/{owner}/{repo}/collaborators/{username}/permission"],
    getCombinedStatusForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/status"],
    getCommit: ["GET /repos/{owner}/{repo}/commits/{ref}"],
    getCommitActivityStats: ["GET /repos/{owner}/{repo}/stats/commit_activity"],
    getCommitComment: ["GET /repos/{owner}/{repo}/comments/{comment_id}"],
    getCommitSignatureProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_signatures", {
      mediaType: {
        previews: ["zzzax"]
      }
    }],
    getCommunityProfileMetrics: ["GET /repos/{owner}/{repo}/community/profile"],
    getContent: ["GET /repos/{owner}/{repo}/contents/{path}"],
    getContributorsStats: ["GET /repos/{owner}/{repo}/stats/contributors"],
    getDeployKey: ["GET /repos/{owner}/{repo}/keys/{key_id}"],
    getDeployment: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}"],
    getDeploymentStatus: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses/{status_id}"],
    getLatestPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/latest"],
    getLatestRelease: ["GET /repos/{owner}/{repo}/releases/latest"],
    getPages: ["GET /repos/{owner}/{repo}/pages"],
    getPagesBuild: ["GET /repos/{owner}/{repo}/pages/builds/{build_id}"],
    getParticipationStats: ["GET /repos/{owner}/{repo}/stats/participation"],
    getPullRequestReviewProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    getPunchCardStats: ["GET /repos/{owner}/{repo}/stats/punch_card"],
    getReadme: ["GET /repos/{owner}/{repo}/readme"],
    getRelease: ["GET /repos/{owner}/{repo}/releases/{release_id}"],
    getReleaseAsset: ["GET /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    getReleaseByTag: ["GET /repos/{owner}/{repo}/releases/tags/{tag}"],
    getStatusChecksProtection: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    getTeamsWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams"],
    getTopPaths: ["GET /repos/{owner}/{repo}/traffic/popular/paths"],
    getTopReferrers: ["GET /repos/{owner}/{repo}/traffic/popular/referrers"],
    getUsersWithAccessToProtectedBranch: ["GET /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users"],
    getViews: ["GET /repos/{owner}/{repo}/traffic/views"],
    getWebhook: ["GET /repos/{owner}/{repo}/hooks/{hook_id}"],
    getWebhookConfigForRepo: ["GET /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    listBranches: ["GET /repos/{owner}/{repo}/branches"],
    listBranchesForHeadCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/branches-where-head", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listCollaborators: ["GET /repos/{owner}/{repo}/collaborators"],
    listCommentsForCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/comments"],
    listCommitCommentsForRepo: ["GET /repos/{owner}/{repo}/comments"],
    listCommitStatusesForRef: ["GET /repos/{owner}/{repo}/commits/{ref}/statuses"],
    listCommits: ["GET /repos/{owner}/{repo}/commits"],
    listContributors: ["GET /repos/{owner}/{repo}/contributors"],
    listDeployKeys: ["GET /repos/{owner}/{repo}/keys"],
    listDeploymentStatuses: ["GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses"],
    listDeployments: ["GET /repos/{owner}/{repo}/deployments"],
    listForAuthenticatedUser: ["GET /user/repos"],
    listForOrg: ["GET /orgs/{org}/repos"],
    listForUser: ["GET /users/{username}/repos"],
    listForks: ["GET /repos/{owner}/{repo}/forks"],
    listInvitations: ["GET /repos/{owner}/{repo}/invitations"],
    listInvitationsForAuthenticatedUser: ["GET /user/repository_invitations"],
    listLanguages: ["GET /repos/{owner}/{repo}/languages"],
    listPagesBuilds: ["GET /repos/{owner}/{repo}/pages/builds"],
    listPublic: ["GET /repositories"],
    listPullRequestsAssociatedWithCommit: ["GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls", {
      mediaType: {
        previews: ["groot"]
      }
    }],
    listReleaseAssets: ["GET /repos/{owner}/{repo}/releases/{release_id}/assets"],
    listReleases: ["GET /repos/{owner}/{repo}/releases"],
    listTags: ["GET /repos/{owner}/{repo}/tags"],
    listTeams: ["GET /repos/{owner}/{repo}/teams"],
    listWebhooks: ["GET /repos/{owner}/{repo}/hooks"],
    merge: ["POST /repos/{owner}/{repo}/merges"],
    pingWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/pings"],
    removeAppAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    removeCollaborator: ["DELETE /repos/{owner}/{repo}/collaborators/{username}"],
    removeStatusCheckContexts: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    removeStatusCheckProtection: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    removeTeamAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    removeUserAccessRestrictions: ["DELETE /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    replaceAllTopics: ["PUT /repos/{owner}/{repo}/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    requestPagesBuild: ["POST /repos/{owner}/{repo}/pages/builds"],
    setAdminBranchProtection: ["POST /repos/{owner}/{repo}/branches/{branch}/protection/enforce_admins"],
    setAppAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/apps", {}, {
      mapToData: "apps"
    }],
    setStatusCheckContexts: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks/contexts", {}, {
      mapToData: "contexts"
    }],
    setTeamAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/teams", {}, {
      mapToData: "teams"
    }],
    setUserAccessRestrictions: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection/restrictions/users", {}, {
      mapToData: "users"
    }],
    testPushWebhook: ["POST /repos/{owner}/{repo}/hooks/{hook_id}/tests"],
    transfer: ["POST /repos/{owner}/{repo}/transfer"],
    update: ["PATCH /repos/{owner}/{repo}"],
    updateBranchProtection: ["PUT /repos/{owner}/{repo}/branches/{branch}/protection"],
    updateCommitComment: ["PATCH /repos/{owner}/{repo}/comments/{comment_id}"],
    updateInformationAboutPagesSite: ["PUT /repos/{owner}/{repo}/pages"],
    updateInvitation: ["PATCH /repos/{owner}/{repo}/invitations/{invitation_id}"],
    updatePullRequestReviewProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_pull_request_reviews"],
    updateRelease: ["PATCH /repos/{owner}/{repo}/releases/{release_id}"],
    updateReleaseAsset: ["PATCH /repos/{owner}/{repo}/releases/assets/{asset_id}"],
    updateStatusCheckPotection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks", {}, {
      renamed: ["repos", "updateStatusCheckProtection"]
    }],
    updateStatusCheckProtection: ["PATCH /repos/{owner}/{repo}/branches/{branch}/protection/required_status_checks"],
    updateWebhook: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}"],
    updateWebhookConfigForRepo: ["PATCH /repos/{owner}/{repo}/hooks/{hook_id}/config"],
    uploadReleaseAsset: ["POST /repos/{owner}/{repo}/releases/{release_id}/assets{?name,label}", {
      baseUrl: "https://uploads.github.com"
    }]
  },
  search: {
    code: ["GET /search/code"],
    commits: ["GET /search/commits", {
      mediaType: {
        previews: ["cloak"]
      }
    }],
    issuesAndPullRequests: ["GET /search/issues"],
    labels: ["GET /search/labels"],
    repos: ["GET /search/repositories"],
    topics: ["GET /search/topics", {
      mediaType: {
        previews: ["mercy"]
      }
    }],
    users: ["GET /search/users"]
  },
  secretScanning: {
    getAlert: ["GET /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"],
    listAlertsForRepo: ["GET /repos/{owner}/{repo}/secret-scanning/alerts"],
    updateAlert: ["PATCH /repos/{owner}/{repo}/secret-scanning/alerts/{alert_number}"]
  },
  teams: {
    addOrUpdateMembershipForUserInOrg: ["PUT /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    addOrUpdateProjectPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    addOrUpdateRepoPermissionsInOrg: ["PUT /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    checkPermissionsForProjectInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects/{project_id}", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    checkPermissionsForRepoInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    create: ["POST /orgs/{org}/teams"],
    createDiscussionCommentInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    createDiscussionInOrg: ["POST /orgs/{org}/teams/{team_slug}/discussions"],
    deleteDiscussionCommentInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    deleteDiscussionInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    deleteInOrg: ["DELETE /orgs/{org}/teams/{team_slug}"],
    getByName: ["GET /orgs/{org}/teams/{team_slug}"],
    getDiscussionCommentInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    getDiscussionInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    getMembershipForUserInOrg: ["GET /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    list: ["GET /orgs/{org}/teams"],
    listChildInOrg: ["GET /orgs/{org}/teams/{team_slug}/teams"],
    listDiscussionCommentsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments"],
    listDiscussionsInOrg: ["GET /orgs/{org}/teams/{team_slug}/discussions"],
    listForAuthenticatedUser: ["GET /user/teams"],
    listMembersInOrg: ["GET /orgs/{org}/teams/{team_slug}/members"],
    listPendingInvitationsInOrg: ["GET /orgs/{org}/teams/{team_slug}/invitations"],
    listProjectsInOrg: ["GET /orgs/{org}/teams/{team_slug}/projects", {
      mediaType: {
        previews: ["inertia"]
      }
    }],
    listReposInOrg: ["GET /orgs/{org}/teams/{team_slug}/repos"],
    removeMembershipForUserInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/memberships/{username}"],
    removeProjectInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/projects/{project_id}"],
    removeRepoInOrg: ["DELETE /orgs/{org}/teams/{team_slug}/repos/{owner}/{repo}"],
    updateDiscussionCommentInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}"],
    updateDiscussionInOrg: ["PATCH /orgs/{org}/teams/{team_slug}/discussions/{discussion_number}"],
    updateInOrg: ["PATCH /orgs/{org}/teams/{team_slug}"]
  },
  users: {
    addEmailForAuthenticated: ["POST /user/emails"],
    block: ["PUT /user/blocks/{username}"],
    checkBlocked: ["GET /user/blocks/{username}"],
    checkFollowingForUser: ["GET /users/{username}/following/{target_user}"],
    checkPersonIsFollowedByAuthenticated: ["GET /user/following/{username}"],
    createGpgKeyForAuthenticated: ["POST /user/gpg_keys"],
    createPublicSshKeyForAuthenticated: ["POST /user/keys"],
    deleteEmailForAuthenticated: ["DELETE /user/emails"],
    deleteGpgKeyForAuthenticated: ["DELETE /user/gpg_keys/{gpg_key_id}"],
    deletePublicSshKeyForAuthenticated: ["DELETE /user/keys/{key_id}"],
    follow: ["PUT /user/following/{username}"],
    getAuthenticated: ["GET /user"],
    getByUsername: ["GET /users/{username}"],
    getContextForUser: ["GET /users/{username}/hovercard"],
    getGpgKeyForAuthenticated: ["GET /user/gpg_keys/{gpg_key_id}"],
    getPublicSshKeyForAuthenticated: ["GET /user/keys/{key_id}"],
    list: ["GET /users"],
    listBlockedByAuthenticated: ["GET /user/blocks"],
    listEmailsForAuthenticated: ["GET /user/emails"],
    listFollowedByAuthenticated: ["GET /user/following"],
    listFollowersForAuthenticatedUser: ["GET /user/followers"],
    listFollowersForUser: ["GET /users/{username}/followers"],
    listFollowingForUser: ["GET /users/{username}/following"],
    listGpgKeysForAuthenticated: ["GET /user/gpg_keys"],
    listGpgKeysForUser: ["GET /users/{username}/gpg_keys"],
    listPublicEmailsForAuthenticated: ["GET /user/public_emails"],
    listPublicKeysForUser: ["GET /users/{username}/keys"],
    listPublicSshKeysForAuthenticated: ["GET /user/keys"],
    setPrimaryEmailVisibilityForAuthenticated: ["PATCH /user/email/visibility"],
    unblock: ["DELETE /user/blocks/{username}"],
    unfollow: ["DELETE /user/following/{username}"],
    updateAuthenticated: ["PATCH /user"]
  }
};

const VERSION = "4.5.0";

function endpointsToMethods(octokit, endpointsMap) {
  const newMethods = {};

  for (const [scope, endpoints] of Object.entries(endpointsMap)) {
    for (const [methodName, endpoint] of Object.entries(endpoints)) {
      const [route, defaults, decorations] = endpoint;
      const [method, url] = route.split(/ /);
      const endpointDefaults = Object.assign({
        method,
        url
      }, defaults);

      if (!newMethods[scope]) {
        newMethods[scope] = {};
      }

      const scopeMethods = newMethods[scope];

      if (decorations) {
        scopeMethods[methodName] = decorate(octokit, scope, methodName, endpointDefaults, decorations);
        continue;
      }

      scopeMethods[methodName] = octokit.request.defaults(endpointDefaults);
    }
  }

  return newMethods;
}

function decorate(octokit, scope, methodName, defaults, decorations) {
  const requestWithDefaults = octokit.request.defaults(defaults);
  /* istanbul ignore next */

  function withDecorations(...args) {
    // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
    let options = requestWithDefaults.endpoint.merge(...args); // There are currently no other decorations than `.mapToData`

    if (decorations.mapToData) {
      options = Object.assign({}, options, {
        data: options[decorations.mapToData],
        [decorations.mapToData]: undefined
      });
      return requestWithDefaults(options);
    }

    if (decorations.renamed) {
      const [newScope, newMethodName] = decorations.renamed;
      octokit.log.warn(`octokit.${scope}.${methodName}() has been renamed to octokit.${newScope}.${newMethodName}()`);
    }

    if (decorations.deprecated) {
      octokit.log.warn(decorations.deprecated);
    }

    if (decorations.renamedParameters) {
      // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488
      const options = requestWithDefaults.endpoint.merge(...args);

      for (const [name, alias] of Object.entries(decorations.renamedParameters)) {
        if (name in options) {
          octokit.log.warn(`"${name}" parameter is deprecated for "octokit.${scope}.${methodName}()". Use "${alias}" instead`);

          if (!(alias in options)) {
            options[alias] = options[name];
          }

          delete options[name];
        }
      }

      return requestWithDefaults(options);
    } // @ts-ignore https://github.com/microsoft/TypeScript/issues/25488


    return requestWithDefaults(...args);
  }

  return Object.assign(withDecorations, requestWithDefaults);
}

/**
 * This plugin is a 1:1 copy of internal @octokit/rest plugins. The primary
 * goal is to rebuild @octokit/rest on top of @octokit/core. Once that is
 * done, we will remove the registerEndpoints methods and return the methods
 * directly as with the other plugins. At that point we will also remove the
 * legacy workarounds and deprecations.
 *
 * See the plan at
 * https://github.com/octokit/plugin-rest-endpoint-methods.js/pull/1
 */

function restEndpointMethods(octokit) {
  return endpointsToMethods(octokit, Endpoints);
}
restEndpointMethods.VERSION = VERSION;

exports.restEndpointMethods = restEndpointMethods;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 537:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var deprecation = __nccwpck_require__(8932);
var once = _interopDefault(__nccwpck_require__(1223));

const logOnce = once(deprecation => console.warn(deprecation));
/**
 * Error with extra properties to help with debugging
 */

class RequestError extends Error {
  constructor(message, statusCode, options) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = "HttpError";
    this.status = statusCode;
    Object.defineProperty(this, "code", {
      get() {
        logOnce(new deprecation.Deprecation("[@octokit/request-error] `error.code` is deprecated, use `error.status`."));
        return statusCode;
      }

    });
    this.headers = options.headers || {}; // redact request credentials without mutating original request options

    const requestCopy = Object.assign({}, options.request);

    if (options.request.headers.authorization) {
      requestCopy.headers = Object.assign({}, options.request.headers, {
        authorization: options.request.headers.authorization.replace(/ .*$/, " [REDACTED]")
      });
    }

    requestCopy.url = requestCopy.url // client_id & client_secret can be passed as URL query parameters to increase rate limit
    // see https://developer.github.com/v3/#increasing-the-unauthenticated-rate-limit-for-oauth-applications
    .replace(/\bclient_secret=\w+/g, "client_secret=[REDACTED]") // OAuth tokens can be passed as URL query parameters, although it is not recommended
    // see https://developer.github.com/v3/#oauth2-token-sent-in-a-header
    .replace(/\baccess_token=\w+/g, "access_token=[REDACTED]");
    this.request = requestCopy;
  }

}

exports.RequestError = RequestError;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 6234:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var endpoint = __nccwpck_require__(9440);
var universalUserAgent = __nccwpck_require__(5030);
var isPlainObject = __nccwpck_require__(9062);
var nodeFetch = _interopDefault(__nccwpck_require__(467));
var requestError = __nccwpck_require__(537);

const VERSION = "5.4.12";

function getBufferResponse(response) {
  return response.arrayBuffer();
}

function fetchWrapper(requestOptions) {
  if (isPlainObject.isPlainObject(requestOptions.body) || Array.isArray(requestOptions.body)) {
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let headers = {};
  let status;
  let url;
  const fetch = requestOptions.request && requestOptions.request.fetch || nodeFetch;
  return fetch(requestOptions.url, Object.assign({
    method: requestOptions.method,
    body: requestOptions.body,
    headers: requestOptions.headers,
    redirect: requestOptions.redirect
  }, requestOptions.request)).then(response => {
    url = response.url;
    status = response.status;

    for (const keyAndValue of response.headers) {
      headers[keyAndValue[0]] = keyAndValue[1];
    }

    if (status === 204 || status === 205) {
      return;
    } // GitHub API returns 200 for HEAD requests


    if (requestOptions.method === "HEAD") {
      if (status < 400) {
        return;
      }

      throw new requestError.RequestError(response.statusText, status, {
        headers,
        request: requestOptions
      });
    }

    if (status === 304) {
      throw new requestError.RequestError("Not modified", status, {
        headers,
        request: requestOptions
      });
    }

    if (status >= 400) {
      return response.text().then(message => {
        const error = new requestError.RequestError(message, status, {
          headers,
          request: requestOptions
        });

        try {
          let responseBody = JSON.parse(error.message);
          Object.assign(error, responseBody);
          let errors = responseBody.errors; // Assumption `errors` would always be in Array format

          error.message = error.message + ": " + errors.map(JSON.stringify).join(", ");
        } catch (e) {// ignore, see octokit/rest.js#684
        }

        throw error;
      });
    }

    const contentType = response.headers.get("content-type");

    if (/application\/json/.test(contentType)) {
      return response.json();
    }

    if (!contentType || /^text\/|charset=utf-8$/.test(contentType)) {
      return response.text();
    }

    return getBufferResponse(response);
  }).then(data => {
    return {
      status,
      url,
      headers,
      data
    };
  }).catch(error => {
    if (error instanceof requestError.RequestError) {
      throw error;
    }

    throw new requestError.RequestError(error.message, 500, {
      headers,
      request: requestOptions
    });
  });
}

function withDefaults(oldEndpoint, newDefaults) {
  const endpoint = oldEndpoint.defaults(newDefaults);

  const newApi = function (route, parameters) {
    const endpointOptions = endpoint.merge(route, parameters);

    if (!endpointOptions.request || !endpointOptions.request.hook) {
      return fetchWrapper(endpoint.parse(endpointOptions));
    }

    const request = (route, parameters) => {
      return fetchWrapper(endpoint.parse(endpoint.merge(route, parameters)));
    };

    Object.assign(request, {
      endpoint,
      defaults: withDefaults.bind(null, endpoint)
    });
    return endpointOptions.request.hook(request, endpointOptions);
  };

  return Object.assign(newApi, {
    endpoint,
    defaults: withDefaults.bind(null, endpoint)
  });
}

const request = withDefaults(endpoint.endpoint, {
  headers: {
    "user-agent": `octokit-request.js/${VERSION} ${universalUserAgent.getUserAgent()}`
  }
});

exports.request = request;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 9062:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(o) {
  return Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

exports.isPlainObject = isPlainObject;


/***/ }),

/***/ 3682:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var register = __nccwpck_require__(4670)
var addHook = __nccwpck_require__(5549)
var removeHook = __nccwpck_require__(6819)

// bind with array of arguments: https://stackoverflow.com/a/21792913
var bind = Function.bind
var bindable = bind.bind(bind)

function bindApi (hook, state, name) {
  var removeHookRef = bindable(removeHook, null).apply(null, name ? [state, name] : [state])
  hook.api = { remove: removeHookRef }
  hook.remove = removeHookRef

  ;['before', 'error', 'after', 'wrap'].forEach(function (kind) {
    var args = name ? [state, kind, name] : [state, kind]
    hook[kind] = hook.api[kind] = bindable(addHook, null).apply(null, args)
  })
}

function HookSingular () {
  var singularHookName = 'h'
  var singularHookState = {
    registry: {}
  }
  var singularHook = register.bind(null, singularHookState, singularHookName)
  bindApi(singularHook, singularHookState, singularHookName)
  return singularHook
}

function HookCollection () {
  var state = {
    registry: {}
  }

  var hook = register.bind(null, state)
  bindApi(hook, state)

  return hook
}

var collectionHookDeprecationMessageDisplayed = false
function Hook () {
  if (!collectionHookDeprecationMessageDisplayed) {
    console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4')
    collectionHookDeprecationMessageDisplayed = true
  }
  return HookCollection()
}

Hook.Singular = HookSingular.bind()
Hook.Collection = HookCollection.bind()

module.exports = Hook
// expose constructors as a named property for TypeScript
module.exports.Hook = Hook
module.exports.Singular = Hook.Singular
module.exports.Collection = Hook.Collection


/***/ }),

/***/ 5549:
/***/ ((module) => {

module.exports = addHook

function addHook (state, kind, name, hook) {
  var orig = hook
  if (!state.registry[name]) {
    state.registry[name] = []
  }

  if (kind === 'before') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(orig.bind(null, options))
        .then(method.bind(null, options))
    }
  }

  if (kind === 'after') {
    hook = function (method, options) {
      var result
      return Promise.resolve()
        .then(method.bind(null, options))
        .then(function (result_) {
          result = result_
          return orig(result, options)
        })
        .then(function () {
          return result
        })
    }
  }

  if (kind === 'error') {
    hook = function (method, options) {
      return Promise.resolve()
        .then(method.bind(null, options))
        .catch(function (error) {
          return orig(error, options)
        })
    }
  }

  state.registry[name].push({
    hook: hook,
    orig: orig
  })
}


/***/ }),

/***/ 4670:
/***/ ((module) => {

module.exports = register

function register (state, name, method, options) {
  if (typeof method !== 'function') {
    throw new Error('method for before hook must be a function')
  }

  if (!options) {
    options = {}
  }

  if (Array.isArray(name)) {
    return name.reverse().reduce(function (callback, name) {
      return register.bind(null, state, name, callback, options)
    }, method)()
  }

  return Promise.resolve()
    .then(function () {
      if (!state.registry[name]) {
        return method(options)
      }

      return (state.registry[name]).reduce(function (method, registered) {
        return registered.hook.bind(null, method, options)
      }, method)()
    })
}


/***/ }),

/***/ 6819:
/***/ ((module) => {

module.exports = removeHook

function removeHook (state, name, method) {
  if (!state.registry[name]) {
    return
  }

  var index = state.registry[name]
    .map(function (registered) { return registered.orig })
    .indexOf(method)

  if (index === -1) {
    return
  }

  state.registry[name].splice(index, 1)
}


/***/ }),

/***/ 8932:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

class Deprecation extends Error {
  constructor(message) {
    super(message); // Maintains proper stack trace (only available on V8)

    /* istanbul ignore next */

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }

    this.name = 'Deprecation';
  }

}

exports.Deprecation = Deprecation;


/***/ }),

/***/ 467:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Stream = _interopDefault(__nccwpck_require__(2413));
var http = _interopDefault(__nccwpck_require__(8605));
var Url = _interopDefault(__nccwpck_require__(8835));
var https = _interopDefault(__nccwpck_require__(7211));
var zlib = _interopDefault(__nccwpck_require__(8761));

// Based on https://github.com/tmpvar/jsdom/blob/aa85b2abf07766ff7bf5c1f6daafb3726f2f2db5/lib/jsdom/living/blob.js

// fix for "Readable" isn't a named export issue
const Readable = Stream.Readable;

const BUFFER = Symbol('buffer');
const TYPE = Symbol('type');

class Blob {
	constructor() {
		this[TYPE] = '';

		const blobParts = arguments[0];
		const options = arguments[1];

		const buffers = [];
		let size = 0;

		if (blobParts) {
			const a = blobParts;
			const length = Number(a.length);
			for (let i = 0; i < length; i++) {
				const element = a[i];
				let buffer;
				if (element instanceof Buffer) {
					buffer = element;
				} else if (ArrayBuffer.isView(element)) {
					buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
				} else if (element instanceof ArrayBuffer) {
					buffer = Buffer.from(element);
				} else if (element instanceof Blob) {
					buffer = element[BUFFER];
				} else {
					buffer = Buffer.from(typeof element === 'string' ? element : String(element));
				}
				size += buffer.length;
				buffers.push(buffer);
			}
		}

		this[BUFFER] = Buffer.concat(buffers);

		let type = options && options.type !== undefined && String(options.type).toLowerCase();
		if (type && !/[^\u0020-\u007E]/.test(type)) {
			this[TYPE] = type;
		}
	}
	get size() {
		return this[BUFFER].length;
	}
	get type() {
		return this[TYPE];
	}
	text() {
		return Promise.resolve(this[BUFFER].toString());
	}
	arrayBuffer() {
		const buf = this[BUFFER];
		const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		return Promise.resolve(ab);
	}
	stream() {
		const readable = new Readable();
		readable._read = function () {};
		readable.push(this[BUFFER]);
		readable.push(null);
		return readable;
	}
	toString() {
		return '[object Blob]';
	}
	slice() {
		const size = this.size;

		const start = arguments[0];
		const end = arguments[1];
		let relativeStart, relativeEnd;
		if (start === undefined) {
			relativeStart = 0;
		} else if (start < 0) {
			relativeStart = Math.max(size + start, 0);
		} else {
			relativeStart = Math.min(start, size);
		}
		if (end === undefined) {
			relativeEnd = size;
		} else if (end < 0) {
			relativeEnd = Math.max(size + end, 0);
		} else {
			relativeEnd = Math.min(end, size);
		}
		const span = Math.max(relativeEnd - relativeStart, 0);

		const buffer = this[BUFFER];
		const slicedBuffer = buffer.slice(relativeStart, relativeStart + span);
		const blob = new Blob([], { type: arguments[2] });
		blob[BUFFER] = slicedBuffer;
		return blob;
	}
}

Object.defineProperties(Blob.prototype, {
	size: { enumerable: true },
	type: { enumerable: true },
	slice: { enumerable: true }
});

Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
	value: 'Blob',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * fetch-error.js
 *
 * FetchError interface for operational errors
 */

/**
 * Create FetchError instance
 *
 * @param   String      message      Error message for human
 * @param   String      type         Error type for machine
 * @param   String      systemError  For Node.js system error
 * @return  FetchError
 */
function FetchError(message, type, systemError) {
  Error.call(this, message);

  this.message = message;
  this.type = type;

  // when err.type is `system`, err.code contains system error code
  if (systemError) {
    this.code = this.errno = systemError.code;
  }

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

FetchError.prototype = Object.create(Error.prototype);
FetchError.prototype.constructor = FetchError;
FetchError.prototype.name = 'FetchError';

let convert;
try {
	convert = __nccwpck_require__(2877).convert;
} catch (e) {}

const INTERNALS = Symbol('Body internals');

// fix an issue where "PassThrough" isn't a named export for node <10
const PassThrough = Stream.PassThrough;

/**
 * Body mixin
 *
 * Ref: https://fetch.spec.whatwg.org/#body
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
function Body(body) {
	var _this = this;

	var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	    _ref$size = _ref.size;

	let size = _ref$size === undefined ? 0 : _ref$size;
	var _ref$timeout = _ref.timeout;
	let timeout = _ref$timeout === undefined ? 0 : _ref$timeout;

	if (body == null) {
		// body is undefined or null
		body = null;
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		body = Buffer.from(body.toString());
	} else if (isBlob(body)) ; else if (Buffer.isBuffer(body)) ; else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		body = Buffer.from(body);
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
	} else if (body instanceof Stream) ; else {
		// none of the above
		// coerce to string then buffer
		body = Buffer.from(String(body));
	}
	this[INTERNALS] = {
		body,
		disturbed: false,
		error: null
	};
	this.size = size;
	this.timeout = timeout;

	if (body instanceof Stream) {
		body.on('error', function (err) {
			const error = err.name === 'AbortError' ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, 'system', err);
			_this[INTERNALS].error = error;
		});
	}
}

Body.prototype = {
	get body() {
		return this[INTERNALS].body;
	},

	get bodyUsed() {
		return this[INTERNALS].disturbed;
	},

	/**
  * Decode response as ArrayBuffer
  *
  * @return  Promise
  */
	arrayBuffer() {
		return consumeBody.call(this).then(function (buf) {
			return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
		});
	},

	/**
  * Return raw response as Blob
  *
  * @return Promise
  */
	blob() {
		let ct = this.headers && this.headers.get('content-type') || '';
		return consumeBody.call(this).then(function (buf) {
			return Object.assign(
			// Prevent copying
			new Blob([], {
				type: ct.toLowerCase()
			}), {
				[BUFFER]: buf
			});
		});
	},

	/**
  * Decode response as json
  *
  * @return  Promise
  */
	json() {
		var _this2 = this;

		return consumeBody.call(this).then(function (buffer) {
			try {
				return JSON.parse(buffer.toString());
			} catch (err) {
				return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, 'invalid-json'));
			}
		});
	},

	/**
  * Decode response as text
  *
  * @return  Promise
  */
	text() {
		return consumeBody.call(this).then(function (buffer) {
			return buffer.toString();
		});
	},

	/**
  * Decode response as buffer (non-spec api)
  *
  * @return  Promise
  */
	buffer() {
		return consumeBody.call(this);
	},

	/**
  * Decode response as text, while automatically detecting the encoding and
  * trying to decode to UTF-8 (non-spec api)
  *
  * @return  Promise
  */
	textConverted() {
		var _this3 = this;

		return consumeBody.call(this).then(function (buffer) {
			return convertBody(buffer, _this3.headers);
		});
	}
};

// In browsers, all properties are enumerable.
Object.defineProperties(Body.prototype, {
	body: { enumerable: true },
	bodyUsed: { enumerable: true },
	arrayBuffer: { enumerable: true },
	blob: { enumerable: true },
	json: { enumerable: true },
	text: { enumerable: true }
});

Body.mixIn = function (proto) {
	for (const name of Object.getOwnPropertyNames(Body.prototype)) {
		// istanbul ignore else: future proof
		if (!(name in proto)) {
			const desc = Object.getOwnPropertyDescriptor(Body.prototype, name);
			Object.defineProperty(proto, name, desc);
		}
	}
};

/**
 * Consume and convert an entire Body to a Buffer.
 *
 * Ref: https://fetch.spec.whatwg.org/#concept-body-consume-body
 *
 * @return  Promise
 */
function consumeBody() {
	var _this4 = this;

	if (this[INTERNALS].disturbed) {
		return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
	}

	this[INTERNALS].disturbed = true;

	if (this[INTERNALS].error) {
		return Body.Promise.reject(this[INTERNALS].error);
	}

	let body = this.body;

	// body is null
	if (body === null) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is blob
	if (isBlob(body)) {
		body = body.stream();
	}

	// body is buffer
	if (Buffer.isBuffer(body)) {
		return Body.Promise.resolve(body);
	}

	// istanbul ignore if: should never happen
	if (!(body instanceof Stream)) {
		return Body.Promise.resolve(Buffer.alloc(0));
	}

	// body is stream
	// get ready to actually consume the body
	let accum = [];
	let accumBytes = 0;
	let abort = false;

	return new Body.Promise(function (resolve, reject) {
		let resTimeout;

		// allow timeout on slow response body
		if (_this4.timeout) {
			resTimeout = setTimeout(function () {
				abort = true;
				reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, 'body-timeout'));
			}, _this4.timeout);
		}

		// handle stream errors
		body.on('error', function (err) {
			if (err.name === 'AbortError') {
				// if the request was aborted, reject with this Error
				abort = true;
				reject(err);
			} else {
				// other errors, such as incorrect content-encoding
				reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, 'system', err));
			}
		});

		body.on('data', function (chunk) {
			if (abort || chunk === null) {
				return;
			}

			if (_this4.size && accumBytes + chunk.length > _this4.size) {
				abort = true;
				reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, 'max-size'));
				return;
			}

			accumBytes += chunk.length;
			accum.push(chunk);
		});

		body.on('end', function () {
			if (abort) {
				return;
			}

			clearTimeout(resTimeout);

			try {
				resolve(Buffer.concat(accum, accumBytes));
			} catch (err) {
				// handle streams that have accumulated too much data (issue #414)
				reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, 'system', err));
			}
		});
	});
}

/**
 * Detect buffer encoding and convert to target encoding
 * ref: http://www.w3.org/TR/2011/WD-html5-20110113/parsing.html#determining-the-character-encoding
 *
 * @param   Buffer  buffer    Incoming buffer
 * @param   String  encoding  Target encoding
 * @return  String
 */
function convertBody(buffer, headers) {
	if (typeof convert !== 'function') {
		throw new Error('The package `encoding` must be installed to use the textConverted() function');
	}

	const ct = headers.get('content-type');
	let charset = 'utf-8';
	let res, str;

	// header
	if (ct) {
		res = /charset=([^;]*)/i.exec(ct);
	}

	// no charset in content type, peek at response body for at most 1024 bytes
	str = buffer.slice(0, 1024).toString();

	// html5
	if (!res && str) {
		res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
	}

	// html4
	if (!res && str) {
		res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
		if (!res) {
			res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
			if (res) {
				res.pop(); // drop last quote
			}
		}

		if (res) {
			res = /charset=(.*)/i.exec(res.pop());
		}
	}

	// xml
	if (!res && str) {
		res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
	}

	// found charset
	if (res) {
		charset = res.pop();

		// prevent decode issues when sites use incorrect encoding
		// ref: https://hsivonen.fi/encoding-menu/
		if (charset === 'gb2312' || charset === 'gbk') {
			charset = 'gb18030';
		}
	}

	// turn raw buffers into a single utf-8 buffer
	return convert(buffer, 'UTF-8', charset).toString();
}

/**
 * Detect a URLSearchParams object
 * ref: https://github.com/bitinn/node-fetch/issues/296#issuecomment-307598143
 *
 * @param   Object  obj     Object to detect by type or brand
 * @return  String
 */
function isURLSearchParams(obj) {
	// Duck-typing as a necessary condition.
	if (typeof obj !== 'object' || typeof obj.append !== 'function' || typeof obj.delete !== 'function' || typeof obj.get !== 'function' || typeof obj.getAll !== 'function' || typeof obj.has !== 'function' || typeof obj.set !== 'function') {
		return false;
	}

	// Brand-checking and more duck-typing as optional condition.
	return obj.constructor.name === 'URLSearchParams' || Object.prototype.toString.call(obj) === '[object URLSearchParams]' || typeof obj.sort === 'function';
}

/**
 * Check if `obj` is a W3C `Blob` object (which `File` inherits from)
 * @param  {*} obj
 * @return {boolean}
 */
function isBlob(obj) {
	return typeof obj === 'object' && typeof obj.arrayBuffer === 'function' && typeof obj.type === 'string' && typeof obj.stream === 'function' && typeof obj.constructor === 'function' && typeof obj.constructor.name === 'string' && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
}

/**
 * Clone body given Res/Req instance
 *
 * @param   Mixed  instance  Response or Request instance
 * @return  Mixed
 */
function clone(instance) {
	let p1, p2;
	let body = instance.body;

	// don't allow cloning a used body
	if (instance.bodyUsed) {
		throw new Error('cannot clone body after it is used');
	}

	// check that body is a stream and not form-data object
	// note: we can't clone the form-data object without having it as a dependency
	if (body instanceof Stream && typeof body.getBoundary !== 'function') {
		// tee instance body
		p1 = new PassThrough();
		p2 = new PassThrough();
		body.pipe(p1);
		body.pipe(p2);
		// set instance body to teed body and return the other teed body
		instance[INTERNALS].body = p1;
		body = p2;
	}

	return body;
}

/**
 * Performs the operation "extract a `Content-Type` value from |object|" as
 * specified in the specification:
 * https://fetch.spec.whatwg.org/#concept-bodyinit-extract
 *
 * This function assumes that instance.body is present.
 *
 * @param   Mixed  instance  Any options.body input
 */
function extractContentType(body) {
	if (body === null) {
		// body is null
		return null;
	} else if (typeof body === 'string') {
		// body is string
		return 'text/plain;charset=UTF-8';
	} else if (isURLSearchParams(body)) {
		// body is a URLSearchParams
		return 'application/x-www-form-urlencoded;charset=UTF-8';
	} else if (isBlob(body)) {
		// body is blob
		return body.type || null;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return null;
	} else if (Object.prototype.toString.call(body) === '[object ArrayBuffer]') {
		// body is ArrayBuffer
		return null;
	} else if (ArrayBuffer.isView(body)) {
		// body is ArrayBufferView
		return null;
	} else if (typeof body.getBoundary === 'function') {
		// detect form data input from form-data module
		return `multipart/form-data;boundary=${body.getBoundary()}`;
	} else if (body instanceof Stream) {
		// body is stream
		// can't really do much about this
		return null;
	} else {
		// Body constructor defaults other things to string
		return 'text/plain;charset=UTF-8';
	}
}

/**
 * The Fetch Standard treats this as if "total bytes" is a property on the body.
 * For us, we have to explicitly get it with a function.
 *
 * ref: https://fetch.spec.whatwg.org/#concept-body-total-bytes
 *
 * @param   Body    instance   Instance of Body
 * @return  Number?            Number of bytes, or null if not possible
 */
function getTotalBytes(instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		return 0;
	} else if (isBlob(body)) {
		return body.size;
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		return body.length;
	} else if (body && typeof body.getLengthSync === 'function') {
		// detect form data input from form-data module
		if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || // 1.x
		body.hasKnownLength && body.hasKnownLength()) {
			// 2.x
			return body.getLengthSync();
		}
		return null;
	} else {
		// body is stream
		return null;
	}
}

/**
 * Write a Body to a Node.js WritableStream (e.g. http.Request) object.
 *
 * @param   Body    instance   Instance of Body
 * @return  Void
 */
function writeToStream(dest, instance) {
	const body = instance.body;


	if (body === null) {
		// body is null
		dest.end();
	} else if (isBlob(body)) {
		body.stream().pipe(dest);
	} else if (Buffer.isBuffer(body)) {
		// body is buffer
		dest.write(body);
		dest.end();
	} else {
		// body is stream
		body.pipe(dest);
	}
}

// expose Promise
Body.Promise = global.Promise;

/**
 * headers.js
 *
 * Headers class offers convenient helpers
 */

const invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
const invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;

function validateName(name) {
	name = `${name}`;
	if (invalidTokenRegex.test(name) || name === '') {
		throw new TypeError(`${name} is not a legal HTTP header name`);
	}
}

function validateValue(value) {
	value = `${value}`;
	if (invalidHeaderCharRegex.test(value)) {
		throw new TypeError(`${value} is not a legal HTTP header value`);
	}
}

/**
 * Find the key in the map object given a header name.
 *
 * Returns undefined if not found.
 *
 * @param   String  name  Header name
 * @return  String|Undefined
 */
function find(map, name) {
	name = name.toLowerCase();
	for (const key in map) {
		if (key.toLowerCase() === name) {
			return key;
		}
	}
	return undefined;
}

const MAP = Symbol('map');
class Headers {
	/**
  * Headers class
  *
  * @param   Object  headers  Response headers
  * @return  Void
  */
	constructor() {
		let init = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

		this[MAP] = Object.create(null);

		if (init instanceof Headers) {
			const rawHeaders = init.raw();
			const headerNames = Object.keys(rawHeaders);

			for (const headerName of headerNames) {
				for (const value of rawHeaders[headerName]) {
					this.append(headerName, value);
				}
			}

			return;
		}

		// We don't worry about converting prop to ByteString here as append()
		// will handle it.
		if (init == null) ; else if (typeof init === 'object') {
			const method = init[Symbol.iterator];
			if (method != null) {
				if (typeof method !== 'function') {
					throw new TypeError('Header pairs must be iterable');
				}

				// sequence<sequence<ByteString>>
				// Note: per spec we have to first exhaust the lists then process them
				const pairs = [];
				for (const pair of init) {
					if (typeof pair !== 'object' || typeof pair[Symbol.iterator] !== 'function') {
						throw new TypeError('Each header pair must be iterable');
					}
					pairs.push(Array.from(pair));
				}

				for (const pair of pairs) {
					if (pair.length !== 2) {
						throw new TypeError('Each header pair must be a name/value tuple');
					}
					this.append(pair[0], pair[1]);
				}
			} else {
				// record<ByteString, ByteString>
				for (const key of Object.keys(init)) {
					const value = init[key];
					this.append(key, value);
				}
			}
		} else {
			throw new TypeError('Provided initializer must be an object');
		}
	}

	/**
  * Return combined header value given name
  *
  * @param   String  name  Header name
  * @return  Mixed
  */
	get(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key === undefined) {
			return null;
		}

		return this[MAP][key].join(', ');
	}

	/**
  * Iterate over all headers
  *
  * @param   Function  callback  Executed for each item with parameters (value, name, thisArg)
  * @param   Boolean   thisArg   `this` context for callback function
  * @return  Void
  */
	forEach(callback) {
		let thisArg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;

		let pairs = getHeaders(this);
		let i = 0;
		while (i < pairs.length) {
			var _pairs$i = pairs[i];
			const name = _pairs$i[0],
			      value = _pairs$i[1];

			callback.call(thisArg, value, name, this);
			pairs = getHeaders(this);
			i++;
		}
	}

	/**
  * Overwrite header values given name
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	set(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		this[MAP][key !== undefined ? key : name] = [value];
	}

	/**
  * Append a value onto existing header
  *
  * @param   String  name   Header name
  * @param   String  value  Header value
  * @return  Void
  */
	append(name, value) {
		name = `${name}`;
		value = `${value}`;
		validateName(name);
		validateValue(value);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			this[MAP][key].push(value);
		} else {
			this[MAP][name] = [value];
		}
	}

	/**
  * Check for header name existence
  *
  * @param   String   name  Header name
  * @return  Boolean
  */
	has(name) {
		name = `${name}`;
		validateName(name);
		return find(this[MAP], name) !== undefined;
	}

	/**
  * Delete all header values given name
  *
  * @param   String  name  Header name
  * @return  Void
  */
	delete(name) {
		name = `${name}`;
		validateName(name);
		const key = find(this[MAP], name);
		if (key !== undefined) {
			delete this[MAP][key];
		}
	}

	/**
  * Return raw headers (non-spec api)
  *
  * @return  Object
  */
	raw() {
		return this[MAP];
	}

	/**
  * Get an iterator on keys.
  *
  * @return  Iterator
  */
	keys() {
		return createHeadersIterator(this, 'key');
	}

	/**
  * Get an iterator on values.
  *
  * @return  Iterator
  */
	values() {
		return createHeadersIterator(this, 'value');
	}

	/**
  * Get an iterator on entries.
  *
  * This is the default iterator of the Headers object.
  *
  * @return  Iterator
  */
	[Symbol.iterator]() {
		return createHeadersIterator(this, 'key+value');
	}
}
Headers.prototype.entries = Headers.prototype[Symbol.iterator];

Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
	value: 'Headers',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Headers.prototype, {
	get: { enumerable: true },
	forEach: { enumerable: true },
	set: { enumerable: true },
	append: { enumerable: true },
	has: { enumerable: true },
	delete: { enumerable: true },
	keys: { enumerable: true },
	values: { enumerable: true },
	entries: { enumerable: true }
});

function getHeaders(headers) {
	let kind = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'key+value';

	const keys = Object.keys(headers[MAP]).sort();
	return keys.map(kind === 'key' ? function (k) {
		return k.toLowerCase();
	} : kind === 'value' ? function (k) {
		return headers[MAP][k].join(', ');
	} : function (k) {
		return [k.toLowerCase(), headers[MAP][k].join(', ')];
	});
}

const INTERNAL = Symbol('internal');

function createHeadersIterator(target, kind) {
	const iterator = Object.create(HeadersIteratorPrototype);
	iterator[INTERNAL] = {
		target,
		kind,
		index: 0
	};
	return iterator;
}

const HeadersIteratorPrototype = Object.setPrototypeOf({
	next() {
		// istanbul ignore if
		if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
			throw new TypeError('Value of `this` is not a HeadersIterator');
		}

		var _INTERNAL = this[INTERNAL];
		const target = _INTERNAL.target,
		      kind = _INTERNAL.kind,
		      index = _INTERNAL.index;

		const values = getHeaders(target, kind);
		const len = values.length;
		if (index >= len) {
			return {
				value: undefined,
				done: true
			};
		}

		this[INTERNAL].index = index + 1;

		return {
			value: values[index],
			done: false
		};
	}
}, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));

Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
	value: 'HeadersIterator',
	writable: false,
	enumerable: false,
	configurable: true
});

/**
 * Export the Headers object in a form that Node.js can consume.
 *
 * @param   Headers  headers
 * @return  Object
 */
function exportNodeCompatibleHeaders(headers) {
	const obj = Object.assign({ __proto__: null }, headers[MAP]);

	// http.request() only supports string as Host header. This hack makes
	// specifying custom Host header possible.
	const hostHeaderKey = find(headers[MAP], 'Host');
	if (hostHeaderKey !== undefined) {
		obj[hostHeaderKey] = obj[hostHeaderKey][0];
	}

	return obj;
}

/**
 * Create a Headers object from an object of headers, ignoring those that do
 * not conform to HTTP grammar productions.
 *
 * @param   Object  obj  Object of headers
 * @return  Headers
 */
function createHeadersLenient(obj) {
	const headers = new Headers();
	for (const name of Object.keys(obj)) {
		if (invalidTokenRegex.test(name)) {
			continue;
		}
		if (Array.isArray(obj[name])) {
			for (const val of obj[name]) {
				if (invalidHeaderCharRegex.test(val)) {
					continue;
				}
				if (headers[MAP][name] === undefined) {
					headers[MAP][name] = [val];
				} else {
					headers[MAP][name].push(val);
				}
			}
		} else if (!invalidHeaderCharRegex.test(obj[name])) {
			headers[MAP][name] = [obj[name]];
		}
	}
	return headers;
}

const INTERNALS$1 = Symbol('Response internals');

// fix an issue where "STATUS_CODES" aren't a named export for node <10
const STATUS_CODES = http.STATUS_CODES;

/**
 * Response class
 *
 * @param   Stream  body  Readable stream
 * @param   Object  opts  Response options
 * @return  Void
 */
class Response {
	constructor() {
		let body = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
		let opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		Body.call(this, body, opts);

		const status = opts.status || 200;
		const headers = new Headers(opts.headers);

		if (body != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(body);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		this[INTERNALS$1] = {
			url: opts.url,
			status,
			statusText: opts.statusText || STATUS_CODES[status],
			headers,
			counter: opts.counter
		};
	}

	get url() {
		return this[INTERNALS$1].url || '';
	}

	get status() {
		return this[INTERNALS$1].status;
	}

	/**
  * Convenience property representing if the request ended normally
  */
	get ok() {
		return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
	}

	get redirected() {
		return this[INTERNALS$1].counter > 0;
	}

	get statusText() {
		return this[INTERNALS$1].statusText;
	}

	get headers() {
		return this[INTERNALS$1].headers;
	}

	/**
  * Clone this response
  *
  * @return  Response
  */
	clone() {
		return new Response(clone(this), {
			url: this.url,
			status: this.status,
			statusText: this.statusText,
			headers: this.headers,
			ok: this.ok,
			redirected: this.redirected
		});
	}
}

Body.mixIn(Response.prototype);

Object.defineProperties(Response.prototype, {
	url: { enumerable: true },
	status: { enumerable: true },
	ok: { enumerable: true },
	redirected: { enumerable: true },
	statusText: { enumerable: true },
	headers: { enumerable: true },
	clone: { enumerable: true }
});

Object.defineProperty(Response.prototype, Symbol.toStringTag, {
	value: 'Response',
	writable: false,
	enumerable: false,
	configurable: true
});

const INTERNALS$2 = Symbol('Request internals');

// fix an issue where "format", "parse" aren't a named export for node <10
const parse_url = Url.parse;
const format_url = Url.format;

const streamDestructionSupported = 'destroy' in Stream.Readable.prototype;

/**
 * Check if a value is an instance of Request.
 *
 * @param   Mixed   input
 * @return  Boolean
 */
function isRequest(input) {
	return typeof input === 'object' && typeof input[INTERNALS$2] === 'object';
}

function isAbortSignal(signal) {
	const proto = signal && typeof signal === 'object' && Object.getPrototypeOf(signal);
	return !!(proto && proto.constructor.name === 'AbortSignal');
}

/**
 * Request class
 *
 * @param   Mixed   input  Url or Request instance
 * @param   Object  init   Custom options
 * @return  Void
 */
class Request {
	constructor(input) {
		let init = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		let parsedURL;

		// normalize input
		if (!isRequest(input)) {
			if (input && input.href) {
				// in order to support Node.js' Url objects; though WHATWG's URL objects
				// will fall into this branch also (since their `toString()` will return
				// `href` property anyway)
				parsedURL = parse_url(input.href);
			} else {
				// coerce input to a string before attempting to parse
				parsedURL = parse_url(`${input}`);
			}
			input = {};
		} else {
			parsedURL = parse_url(input.url);
		}

		let method = init.method || input.method || 'GET';
		method = method.toUpperCase();

		if ((init.body != null || isRequest(input) && input.body !== null) && (method === 'GET' || method === 'HEAD')) {
			throw new TypeError('Request with GET/HEAD method cannot have body');
		}

		let inputBody = init.body != null ? init.body : isRequest(input) && input.body !== null ? clone(input) : null;

		Body.call(this, inputBody, {
			timeout: init.timeout || input.timeout || 0,
			size: init.size || input.size || 0
		});

		const headers = new Headers(init.headers || input.headers || {});

		if (inputBody != null && !headers.has('Content-Type')) {
			const contentType = extractContentType(inputBody);
			if (contentType) {
				headers.append('Content-Type', contentType);
			}
		}

		let signal = isRequest(input) ? input.signal : null;
		if ('signal' in init) signal = init.signal;

		if (signal != null && !isAbortSignal(signal)) {
			throw new TypeError('Expected signal to be an instanceof AbortSignal');
		}

		this[INTERNALS$2] = {
			method,
			redirect: init.redirect || input.redirect || 'follow',
			headers,
			parsedURL,
			signal
		};

		// node-fetch-only options
		this.follow = init.follow !== undefined ? init.follow : input.follow !== undefined ? input.follow : 20;
		this.compress = init.compress !== undefined ? init.compress : input.compress !== undefined ? input.compress : true;
		this.counter = init.counter || input.counter || 0;
		this.agent = init.agent || input.agent;
	}

	get method() {
		return this[INTERNALS$2].method;
	}

	get url() {
		return format_url(this[INTERNALS$2].parsedURL);
	}

	get headers() {
		return this[INTERNALS$2].headers;
	}

	get redirect() {
		return this[INTERNALS$2].redirect;
	}

	get signal() {
		return this[INTERNALS$2].signal;
	}

	/**
  * Clone this request
  *
  * @return  Request
  */
	clone() {
		return new Request(this);
	}
}

Body.mixIn(Request.prototype);

Object.defineProperty(Request.prototype, Symbol.toStringTag, {
	value: 'Request',
	writable: false,
	enumerable: false,
	configurable: true
});

Object.defineProperties(Request.prototype, {
	method: { enumerable: true },
	url: { enumerable: true },
	headers: { enumerable: true },
	redirect: { enumerable: true },
	clone: { enumerable: true },
	signal: { enumerable: true }
});

/**
 * Convert a Request to Node.js http request options.
 *
 * @param   Request  A Request instance
 * @return  Object   The options object to be passed to http.request
 */
function getNodeRequestOptions(request) {
	const parsedURL = request[INTERNALS$2].parsedURL;
	const headers = new Headers(request[INTERNALS$2].headers);

	// fetch step 1.3
	if (!headers.has('Accept')) {
		headers.set('Accept', '*/*');
	}

	// Basic fetch
	if (!parsedURL.protocol || !parsedURL.hostname) {
		throw new TypeError('Only absolute URLs are supported');
	}

	if (!/^https?:$/.test(parsedURL.protocol)) {
		throw new TypeError('Only HTTP(S) protocols are supported');
	}

	if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
		throw new Error('Cancellation of streamed requests with AbortSignal is not supported in node < 8');
	}

	// HTTP-network-or-cache fetch steps 2.4-2.7
	let contentLengthValue = null;
	if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
		contentLengthValue = '0';
	}
	if (request.body != null) {
		const totalBytes = getTotalBytes(request);
		if (typeof totalBytes === 'number') {
			contentLengthValue = String(totalBytes);
		}
	}
	if (contentLengthValue) {
		headers.set('Content-Length', contentLengthValue);
	}

	// HTTP-network-or-cache fetch step 2.11
	if (!headers.has('User-Agent')) {
		headers.set('User-Agent', 'node-fetch/1.0 (+https://github.com/bitinn/node-fetch)');
	}

	// HTTP-network-or-cache fetch step 2.15
	if (request.compress && !headers.has('Accept-Encoding')) {
		headers.set('Accept-Encoding', 'gzip,deflate');
	}

	let agent = request.agent;
	if (typeof agent === 'function') {
		agent = agent(parsedURL);
	}

	if (!headers.has('Connection') && !agent) {
		headers.set('Connection', 'close');
	}

	// HTTP-network fetch step 4.2
	// chunked encoding is handled by Node.js

	return Object.assign({}, parsedURL, {
		method: request.method,
		headers: exportNodeCompatibleHeaders(headers),
		agent
	});
}

/**
 * abort-error.js
 *
 * AbortError interface for cancelled requests
 */

/**
 * Create AbortError instance
 *
 * @param   String      message      Error message for human
 * @return  AbortError
 */
function AbortError(message) {
  Error.call(this, message);

  this.type = 'aborted';
  this.message = message;

  // hide custom error implementation details from end-users
  Error.captureStackTrace(this, this.constructor);
}

AbortError.prototype = Object.create(Error.prototype);
AbortError.prototype.constructor = AbortError;
AbortError.prototype.name = 'AbortError';

// fix an issue where "PassThrough", "resolve" aren't a named export for node <10
const PassThrough$1 = Stream.PassThrough;
const resolve_url = Url.resolve;

/**
 * Fetch function
 *
 * @param   Mixed    url   Absolute url or Request instance
 * @param   Object   opts  Fetch options
 * @return  Promise
 */
function fetch(url, opts) {

	// allow custom promise
	if (!fetch.Promise) {
		throw new Error('native promise missing, set fetch.Promise to your favorite alternative');
	}

	Body.Promise = fetch.Promise;

	// wrap http.request into fetch
	return new fetch.Promise(function (resolve, reject) {
		// build request object
		const request = new Request(url, opts);
		const options = getNodeRequestOptions(request);

		const send = (options.protocol === 'https:' ? https : http).request;
		const signal = request.signal;

		let response = null;

		const abort = function abort() {
			let error = new AbortError('The user aborted a request.');
			reject(error);
			if (request.body && request.body instanceof Stream.Readable) {
				request.body.destroy(error);
			}
			if (!response || !response.body) return;
			response.body.emit('error', error);
		};

		if (signal && signal.aborted) {
			abort();
			return;
		}

		const abortAndFinalize = function abortAndFinalize() {
			abort();
			finalize();
		};

		// send request
		const req = send(options);
		let reqTimeout;

		if (signal) {
			signal.addEventListener('abort', abortAndFinalize);
		}

		function finalize() {
			req.abort();
			if (signal) signal.removeEventListener('abort', abortAndFinalize);
			clearTimeout(reqTimeout);
		}

		if (request.timeout) {
			req.once('socket', function (socket) {
				reqTimeout = setTimeout(function () {
					reject(new FetchError(`network timeout at: ${request.url}`, 'request-timeout'));
					finalize();
				}, request.timeout);
			});
		}

		req.on('error', function (err) {
			reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, 'system', err));
			finalize();
		});

		req.on('response', function (res) {
			clearTimeout(reqTimeout);

			const headers = createHeadersLenient(res.headers);

			// HTTP fetch step 5
			if (fetch.isRedirect(res.statusCode)) {
				// HTTP fetch step 5.2
				const location = headers.get('Location');

				// HTTP fetch step 5.3
				const locationURL = location === null ? null : resolve_url(request.url, location);

				// HTTP fetch step 5.5
				switch (request.redirect) {
					case 'error':
						reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, 'no-redirect'));
						finalize();
						return;
					case 'manual':
						// node-fetch-specific step: make manual redirect a bit easier to use by setting the Location header value to the resolved URL.
						if (locationURL !== null) {
							// handle corrupted header
							try {
								headers.set('Location', locationURL);
							} catch (err) {
								// istanbul ignore next: nodejs server prevent invalid response headers, we can't test this through normal request
								reject(err);
							}
						}
						break;
					case 'follow':
						// HTTP-redirect fetch step 2
						if (locationURL === null) {
							break;
						}

						// HTTP-redirect fetch step 5
						if (request.counter >= request.follow) {
							reject(new FetchError(`maximum redirect reached at: ${request.url}`, 'max-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 6 (counter increment)
						// Create a new Request object.
						const requestOpts = {
							headers: new Headers(request.headers),
							follow: request.follow,
							counter: request.counter + 1,
							agent: request.agent,
							compress: request.compress,
							method: request.method,
							body: request.body,
							signal: request.signal,
							timeout: request.timeout,
							size: request.size
						};

						// HTTP-redirect fetch step 9
						if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
							reject(new FetchError('Cannot follow redirect with body being a readable stream', 'unsupported-redirect'));
							finalize();
							return;
						}

						// HTTP-redirect fetch step 11
						if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === 'POST') {
							requestOpts.method = 'GET';
							requestOpts.body = undefined;
							requestOpts.headers.delete('content-length');
						}

						// HTTP-redirect fetch step 15
						resolve(fetch(new Request(locationURL, requestOpts)));
						finalize();
						return;
				}
			}

			// prepare response
			res.once('end', function () {
				if (signal) signal.removeEventListener('abort', abortAndFinalize);
			});
			let body = res.pipe(new PassThrough$1());

			const response_options = {
				url: request.url,
				status: res.statusCode,
				statusText: res.statusMessage,
				headers: headers,
				size: request.size,
				timeout: request.timeout,
				counter: request.counter
			};

			// HTTP-network fetch step 12.1.1.3
			const codings = headers.get('Content-Encoding');

			// HTTP-network fetch step 12.1.1.4: handle content codings

			// in following scenarios we ignore compression support
			// 1. compression support is disabled
			// 2. HEAD request
			// 3. no Content-Encoding header
			// 4. no content response (204)
			// 5. content not modified response (304)
			if (!request.compress || request.method === 'HEAD' || codings === null || res.statusCode === 204 || res.statusCode === 304) {
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// For Node v6+
			// Be less strict when decoding compressed responses, since sometimes
			// servers send slightly invalid responses that are still accepted
			// by common browsers.
			// Always using Z_SYNC_FLUSH is what cURL does.
			const zlibOptions = {
				flush: zlib.Z_SYNC_FLUSH,
				finishFlush: zlib.Z_SYNC_FLUSH
			};

			// for gzip
			if (codings == 'gzip' || codings == 'x-gzip') {
				body = body.pipe(zlib.createGunzip(zlibOptions));
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// for deflate
			if (codings == 'deflate' || codings == 'x-deflate') {
				// handle the infamous raw deflate response from old servers
				// a hack for old IIS and Apache servers
				const raw = res.pipe(new PassThrough$1());
				raw.once('data', function (chunk) {
					// see http://stackoverflow.com/questions/37519828
					if ((chunk[0] & 0x0F) === 0x08) {
						body = body.pipe(zlib.createInflate());
					} else {
						body = body.pipe(zlib.createInflateRaw());
					}
					response = new Response(body, response_options);
					resolve(response);
				});
				return;
			}

			// for br
			if (codings == 'br' && typeof zlib.createBrotliDecompress === 'function') {
				body = body.pipe(zlib.createBrotliDecompress());
				response = new Response(body, response_options);
				resolve(response);
				return;
			}

			// otherwise, use response as-is
			response = new Response(body, response_options);
			resolve(response);
		});

		writeToStream(req, request);
	});
}
/**
 * Redirect code matching
 *
 * @param   Number   code  Status code
 * @return  Boolean
 */
fetch.isRedirect = function (code) {
	return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
};

// expose Promise
fetch.Promise = global.Promise;

module.exports = exports = fetch;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.default = exports;
exports.Headers = Headers;
exports.Request = Request;
exports.Response = Response;
exports.FetchError = FetchError;


/***/ }),

/***/ 1223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

var wrappy = __nccwpck_require__(2940)
module.exports = wrappy(once)
module.exports.strict = wrappy(onceStrict)

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })

  Object.defineProperty(Function.prototype, 'onceStrict', {
    value: function () {
      return onceStrict(this)
    },
    configurable: true
  })
})

function once (fn) {
  var f = function () {
    if (f.called) return f.value
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  f.called = false
  return f
}

function onceStrict (fn) {
  var f = function () {
    if (f.called)
      throw new Error(f.onceError)
    f.called = true
    return f.value = fn.apply(this, arguments)
  }
  var name = fn.name || 'Function wrapped with `once`'
  f.onceError = name + " shouldn't be called more than once"
  f.called = false
  return f
}


/***/ }),

/***/ 877:
/***/ (function(module, __unused_webpack_exports, __nccwpck_require__) {

/* @license
Papa Parse
v5.3.0
https://github.com/mholt/PapaParse
License: MIT
*/

(function(root, factory)
{
	/* globals define */
	if (typeof define === 'function' && define.amd)
	{
		// AMD. Register as an anonymous module.
		define([], factory);
	}
	else if (true)
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{}
	// in strict mode we cannot access arguments.callee, so we need a named reference to
	// stringify the factory method for the blob worker
	// eslint-disable-next-line func-name
}(this, function moduleFactory()
{
	'use strict';

	var global = (function() {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

		// When running tests none of the above have been defined
		return {};
	})();


	function getWorkerBlob() {
		var URL = global.URL || global.webkitURL || null;
		var code = moduleFactory.toString();
		return Papa.BLOB_URL || (Papa.BLOB_URL = URL.createObjectURL(new Blob(['(', code, ')();'], {type: 'text/javascript'})));
	}

	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /blob:/i.test((global.location || {}).protocol);
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.NODE_STREAM_INPUT = 1;

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;
	if (typeof PAPA_BROWSER_CONTEXT === 'undefined') {
		Papa.DuplexStreamStreamer = DuplexStreamStreamer;
	}

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		};
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		var dynamicTyping = _config.dynamicTyping || false;
		if (isFunction(dynamicTyping)) {
			_config.dynamicTypingFunction = dynamicTyping;
			// Will be filled on first row call
			dynamicTyping = {};
		}
		_config.dynamicTyping = dynamicTyping;

		_config.transform = isFunction(_config.transform) ? _config.transform : false;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (_input === Papa.NODE_STREAM_INPUT && typeof PAPA_BROWSER_CONTEXT === 'undefined')
		{
			// create a node Duplex stream for use
			// with .pipe
			streamer = new DuplexStreamStreamer(_config);
			return streamer.getStream();
		}
		else if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character(s) */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		/** escaped quote character, either "" or <config.escapeChar>" */
		var _escapedQuote = _quoteChar + _quoteChar;

		/** whether to skip empty lines */
		var _skipEmptyLines = false;

		/** the columns (keys) we expect when we unparse objects */
		var _columns = null;

		/** whether to prevent outputting cells that can be parsed as formulae by spreadsheet software (Excel and LibreOffice) */
		var _escapeFormulae = false;

		unpackConfig();

		var quoteCharRegex = new RegExp(escapeRegExp(_quoteChar), 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (Array.isArray(_input))
		{
			if (!_input.length || Array.isArray(_input[0]))
				return serialize(null, _input, _skipEmptyLines);
			else if (typeof _input[0] === 'object')
				return serialize(_columns || objectKeys(_input[0]), _input, _skipEmptyLines);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (Array.isArray(_input.data))
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  Array.isArray(_input.data[0])
						? _input.fields
						: objectKeys(_input.data[0]);

				if (!(Array.isArray(_input.data[0])) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || [], _skipEmptyLines);
		}

		// Default (any valid paths should return before this)
		throw new Error('Unable to serialize unrecognized input');


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
                && !Papa.BAD_DELIMITERS.filter(function(value) { return _config.delimiter.indexOf(value) !== -1; }).length)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| typeof _config.quotes === 'function'
				|| Array.isArray(_config.quotes))
				_quotes = _config.quotes;

			if (typeof _config.skipEmptyLines === 'boolean'
				|| typeof _config.skipEmptyLines === 'string')
				_skipEmptyLines = _config.skipEmptyLines;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;

			if (Array.isArray(_config.columns)) {

				if (_config.columns.length === 0) throw new Error('Option columns is empty');

				_columns = _config.columns;
			}

			if (_config.escapeChar !== undefined) {
				_escapedQuote = _config.escapeChar + _quoteChar;
			}

			if (typeof _config.escapeFormulae === 'boolean')
				_escapeFormulae = _config.escapeFormulae;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data, skipEmptyLines)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = Array.isArray(fields) && fields.length > 0;
			var dataKeyedByField = !(Array.isArray(data[0]));

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				var emptyLine = false;
				var nullLine = hasHeader ? Object.keys(data[row]).length === 0 : data[row].length === 0;
				if (skipEmptyLines && !hasHeader)
				{
					emptyLine = skipEmptyLines === 'greedy' ? data[row].join('').trim() === '' : data[row].length === 1 && data[row][0].length === 0;
				}
				if (skipEmptyLines === 'greedy' && hasHeader) {
					var line = [];
					for (var c = 0; c < maxCol; c++) {
						var cx = dataKeyedByField ? fields[c] : c;
						line.push(data[row][cx]);
					}
					emptyLine = line.join('').trim() === '';
				}
				if (!emptyLine)
				{
					for (var col = 0; col < maxCol; col++)
					{
						if (col > 0 && !nullLine)
							csv += _delimiter;
						var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
						csv += safe(data[row][colIdx], col);
					}
					if (row < data.length - 1 && (!skipEmptyLines || (maxCol > 0 && !nullLine)))
					{
						csv += _newline;
					}
				}
			}
			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			if (str.constructor === Date)
				return JSON.stringify(str).slice(1, 25);

			if (_escapeFormulae === true && typeof str === "string" && (str.match(/^[=+\-@].*$/) !== null)) {
				str = "'" + str;
			}

			var escapedQuoteStr = str.toString().replace(quoteCharRegex, _escapedQuote);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (typeof _quotes === 'function' && _quotes(str, col))
							|| (Array.isArray(_quotes) && _quotes[col])
							|| hasAny(escapedQuoteStr, Papa.BAD_DELIMITERS)
							|| escapedQuoteStr.indexOf(_delimiter) > -1
							|| escapedQuoteStr.charAt(0) === ' '
							|| escapedQuoteStr.charAt(escapedQuoteStr.length - 1) === ' ';

			return needsQuotes ? _quoteChar + escapedQuoteStr + _quoteChar : escapedQuoteStr;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._finished = false;
		this._completed = false;
		this._halted = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk, isFakeChunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;
			this._halted = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted()) {
				this._halted = true;
				return;
			}

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk) && !isFakeChunk)
			{
				this._config.chunk(results, this._handle);
				if (this._handle.paused() || this._handle.aborted()) {
					this._halted = true;
					return;
				}
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (!this._completed && finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted)) {
				this._config.complete(this._completeResults, this._input);
				this._completed = true;
			}

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open(this._config.downloadRequestBody ? 'POST' : 'GET', this._input, !IS_WORKER);
			// Headers can only be set when once the request state is OPENED
			if (this._config.downloadRequestHeaders)
			{
				var headers = this._config.downloadRequestHeaders;

				for (var headerName in headers)
				{
					xhr.setRequestHeader(headerName, headers[headerName]);
				}
			}

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes=' + this._start + '-' + end);
			}

			try {
				xhr.send(this._config.downloadRequestBody);
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
		};

		this._chunkLoaded = function()
		{
			if (xhr.readyState !== 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			// Use chunckSize as it may be a diference on reponse lentgh due to characters with more than 1 byte
			this._start += this._config.chunkSize ? this._config.chunkSize : xhr.responseText.length;
			this._finished = !this._config.chunkSize || this._start >= getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		};

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(new Error(errorText));
		};

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
				return -1;
			}
			return parseInt(contentRange.substring(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		};

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		};

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		};

		this._chunkError = function()
		{
			this._sendError(reader.error);
		};

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var remaining;
		this.stream = function(s)
		{
			remaining = s;
			return this._nextChunk();
		};
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk;
			if(size) {
				chunk = remaining.substring(0, size);
				remaining = remaining.substring(size);
			} else {
				chunk = remaining;
				remaining = '';
			}
			this._finished = !remaining;
			return this.parseChunk(chunk);
		};
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;
		var streamHasEnded = false;

		this.pause = function()
		{
			ChunkStreamer.prototype.pause.apply(this, arguments);
			this._input.pause();
		};

		this.resume = function()
		{
			ChunkStreamer.prototype.resume.apply(this, arguments);
			this._input.resume();
		};

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		};

		this._checkIsFinished = function()
		{
			if (streamHasEnded && queue.length === 1) {
				this._finished = true;
			}
		};

		this._nextChunk = function()
		{
			this._checkIsFinished();
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		};

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this._checkIsFinished();
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			streamHasEnded = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	function DuplexStreamStreamer(_config) {
		var Duplex = __nccwpck_require__(2413).Duplex;
		var config = copy(_config);
		var parseOnWrite = true;
		var writeStreamHasFinished = false;
		var parseCallbackQueue = [];
		var stream = null;

		this._onCsvData = function(results)
		{
			var data = results.data;
			if (!stream.push(data) && !this._handle.paused()) {
				// the writeable consumer buffer has filled up
				// so we need to pause until more items
				// can be processed
				this._handle.pause();
			}
		};

		this._onCsvComplete = function()
		{
			// node will finish the read stream when
			// null is pushed
			stream.push(null);
		};

		config.step = bindFunction(this._onCsvData, this);
		config.complete = bindFunction(this._onCsvComplete, this);
		ChunkStreamer.call(this, config);

		this._nextChunk = function()
		{
			if (writeStreamHasFinished && parseCallbackQueue.length === 1) {
				this._finished = true;
			}
			if (parseCallbackQueue.length) {
				parseCallbackQueue.shift()();
			} else {
				parseOnWrite = true;
			}
		};

		this._addToParseQueue = function(chunk, callback)
		{
			// add to queue so that we can indicate
			// completion via callback
			// node will automatically pause the incoming stream
			// when too many items have been added without their
			// callback being invoked
			parseCallbackQueue.push(bindFunction(function() {
				this.parseChunk(typeof chunk === 'string' ? chunk : chunk.toString(config.encoding));
				if (isFunction(callback)) {
					return callback();
				}
			}, this));
			if (parseOnWrite) {
				parseOnWrite = false;
				this._nextChunk();
			}
		};

		this._onRead = function()
		{
			if (this._handle.paused()) {
				// the writeable consumer can handle more data
				// so resume the chunk parsing
				this._handle.resume();
			}
		};

		this._onWrite = function(chunk, encoding, callback)
		{
			this._addToParseQueue(chunk, callback);
		};

		this._onWriteComplete = function()
		{
			writeStreamHasFinished = true;
			// have to write empty string
			// so parser knows its done
			this._addToParseQueue('');
		};

		this.getStream = function()
		{
			return stream;
		};
		stream = new Duplex({
			readableObjectMode: true,
			decodeStrings: false,
			read: bindFunction(this._onRead, this),
			write: bindFunction(this._onWrite, this)
		});
		stream.once('finish', bindFunction(this._onWriteComplete, this));
	}
	if (typeof PAPA_BROWSER_CONTEXT === 'undefined') {
		DuplexStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
		DuplexStreamStreamer.prototype.constructor = DuplexStreamStreamer;
	}


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var MAX_FLOAT = Math.pow(2, 53);
		var MIN_FLOAT = -MAX_FLOAT;
		var FLOAT = /^\s*-?(\d+\.?|\.\d+|\d+\.\d+)(e[-+]?\d+)?\s*$/;
		var ISO_DATE = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;
		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _rowCounter = 0;	// Number of rows that have been parsed so far
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;	// Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else {
						_results.data = _results.data[0];
						userStep(_results, self);
					}
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			var quoteChar = _config.quoteChar || '"';
			if (!_config.newline)
				_config.newline = guessLineEndings(input, quoteChar);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines, _config.comments, _config.delimitersToGuess);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(isFunction(_config.delimiter))
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();

			// If it is streaming via "chunking", the reader will start appending correctly already so no need to substring,
			// otherwise we can get duplicate content within a row
			_input = isFunction(_config.chunk) ? "" : _input.substring(_parser.getCharIndex());
		};

		this.resume = function()
		{
			if(self.streamer._halted) {
				_paused = false;
				self.streamer.parseChunk(_input, true);
			} else {
				// Bugfix: #636 In case the processing hasn't halted yet
				// wait for it to halt in order to resume
				setTimeout(self.resume, 3);
			}
		};

		this.aborted = function()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function testEmptyLine(s) {
			return _config.skipEmptyLines === 'greedy' ? s.join('').trim() === '' : s.length === 1 && s[0].length === 0;
		}

		function testFloat(s) {
			if (FLOAT.test(s)) {
				var floatValue = parseFloat(s);
				if (floatValue > MIN_FLOAT && floatValue < MAX_FLOAT) {
					return true;
				}
			}
			return false;
		}

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \'' + Papa.DefaultDelimiter + '\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (testEmptyLine(_results.data[i]))
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTypingAndTransformation();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;

			function addHeader(header, i)
			{
				if (isFunction(_config.transformHeader))
					header = _config.transformHeader(header, i);

				_fields.push(header);
			}

			if (Array.isArray(_results.data[0]))
			{
				for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
					_results.data[i].forEach(addHeader);

				_results.data.splice(0, 1);
			}
			// if _results.data[0] is not an array, we are in a step where _results.data is the row.
			else
				_results.data.forEach(addHeader);
		}

		function shouldApplyDynamicTyping(field) {
			// Cache function values to avoid calling it for each row
			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
			}
			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true;
		}

		function parseDynamic(field, value)
		{
			if (shouldApplyDynamicTyping(field))
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else if (testFloat(value))
					return parseFloat(value);
				else if (ISO_DATE.test(value))
					return new Date(value);
				else
					return (value === '' ? null : value);
			}
			return value;
		}

		function applyHeaderAndDynamicTypingAndTransformation()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping && !_config.transform))
				return _results;

			function processRow(rowSource, i)
			{
				var row = _config.header ? {} : [];

				var j;
				for (j = 0; j < rowSource.length; j++)
				{
					var field = j;
					var value = rowSource[j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					if (_config.transform)
						value = _config.transform(value,field);

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}


				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, _rowCounter + i);
				}

				return row;
			}

			var incrementBy = 1;
			if (!_results.data.length || Array.isArray(_results.data[0]))
			{
				_results.data = _results.data.map(processRow);
				incrementBy = _results.data.length;
			}
			else
				_results.data = processRow(_results.data, 0);


			if (_config.header && _results.meta)
				_results.meta.fields = _fields;

			_rowCounter += incrementBy;
			return _results;
		}

		function guessDelimiter(input, newline, skipEmptyLines, comments, delimitersToGuess) {
			var bestDelim, bestDelta, fieldCountPrevRow, maxFieldCount;

			delimitersToGuess = delimitersToGuess || [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];

			for (var i = 0; i < delimitersToGuess.length; i++) {
				var delim = delimitersToGuess[i];
				var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					comments: comments,
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++) {
					if (skipEmptyLines && testEmptyLine(preview.data[j])) {
						emptyLinesCount++;
						continue;
					}
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined') {
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 0) {
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= (preview.data.length - emptyLinesCount);

				if ((typeof bestDelta === 'undefined' || delta <= bestDelta)
					&& (typeof maxFieldCount === 'undefined' || avgFieldCount > maxFieldCount) && avgFieldCount > 1.99) {
					bestDelta = delta;
					bestDelim = delim;
					maxFieldCount = avgFieldCount;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			};
		}

		function guessLineEndings(input, quoteChar)
		{
			input = input.substring(0, 1024 * 1024);	// max length 1 MB
			// Replace all the text inside quotes
			var re = new RegExp(escapeRegExp(quoteChar) + '([^]*?)' + escapeRegExp(quoteChar), 'gm');
			input = input.replace(re, '');

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function addError(type, code, msg, row)
		{
			var error = {
				type: type,
				code: code,
				message: msg
			};
			if(row !== undefined) {
				error.row = row;
			}
			_results.errors.push(error);
		}
	}

	/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions */
	function escapeRegExp(string)
	{
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar;
		/** Allows for no quoteChar by setting quoteChar to undefined in config */
		if (config.quoteChar === undefined) {
			quoteChar = '"';
		} else {
			quoteChar = config.quoteChar;
		}
		var escapeChar = quoteChar;
		if (config.escapeChar !== undefined) {
			escapeChar = config.escapeChar;
		}

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw new Error('Comment character same as delimiter');
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline !== '\n' && newline !== '\r' && newline !== '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw new Error('Input must be a string');

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = isFunction(step);

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substring(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(escapeRegExp(escapeChar) + escapeRegExp(quoteChar), 'g');
			var quoteSearch = input.indexOf(quoteChar, cursor);

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						quoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

						//No other quotes are found - no other delimiters
						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						// Closing quote at EOF
						if (quoteSearch === inputLen - 1)
						{
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						// If the quote character is the escape character, then check if the next character is the escape character
						if (quoteChar === escapeChar &&  input[quoteSearch + 1] === escapeChar)
						{
							quoteSearch++;
							continue;
						}

						// If the quote character is not the escape character, then check if the previous character was the escape character
						if (quoteChar !== escapeChar && quoteSearch !== 0 && input[quoteSearch - 1] === escapeChar)
						{
							continue;
						}

						if(nextDelim !== -1 && nextDelim < (quoteSearch + 1)) {
							nextDelim = input.indexOf(delim, (quoteSearch + 1));
						}
						if(nextNewline !== -1 && nextNewline < (quoteSearch + 1)) {
							nextNewline = input.indexOf(newline, (quoteSearch + 1));
						}
						// Check up to nextDelim or nextNewline, whichever is closest
						var checkUpTo = nextNewline === -1 ? nextDelim : Math.min(nextDelim, nextNewline);
						var spacesBetweenQuoteAndDelimiter = extraSpaces(checkUpTo);

						// Closing quote followed by delimiter or 'unnecessary spaces + delimiter'
						if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter] === delim)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen;

							// If char after following delimiter is not quoteChar, we find next quote char position
							if (input[quoteSearch + 1 + spacesBetweenQuoteAndDelimiter + delimLen] !== quoteChar)
							{
								quoteSearch = input.indexOf(quoteChar, cursor);
							}
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						var spacesBetweenQuoteAndNewLine = extraSpaces(nextNewline);

						// Closing quote followed by newline or 'unnecessary spaces + newLine'
						if (input.substring(quoteSearch + 1 + spacesBetweenQuoteAndNewLine, quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen) === newline)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + spacesBetweenQuoteAndNewLine + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field
							quoteSearch = input.indexOf(quoteChar, cursor);	// we search for first quote in next line

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}


						// Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
						errors.push({
							type: 'Quotes',
							code: 'InvalidQuotes',
							message: 'Trailing quote on quoted field is malformed',
							row: data.length,	// row has yet to be inserted
							index: cursor
						});

						quoteSearch++;
						continue;

					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substring(cursor, cursor + commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					// we check, if we have quotes, because delimiter char may be part of field enclosed in quotes
					if (quoteSearch > nextDelim) {
						// we have quotes, so we try to find the next delimiter not enclosed in quotes and also next starting quote char
						var nextDelimObj = getNextUnquotedDelimiter(nextDelim, quoteSearch, nextNewline);

						// if we have next delimiter char which is not enclosed in quotes
						if (nextDelimObj && typeof nextDelimObj.nextDelim !== 'undefined') {
							nextDelim = nextDelimObj.nextDelim;
							quoteSearch = nextDelimObj.quoteSearch;
							row.push(input.substring(cursor, nextDelim));
							cursor = nextDelim + delimLen;
							// we look for next delimiter char
							nextDelim = input.indexOf(delim, cursor);
							continue;
						}
					} else {
						row.push(input.substring(cursor, nextDelim));
						cursor = nextDelim + delimLen;
						nextDelim = input.indexOf(delim, cursor);
						continue;
					}
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
             * checks if there are extra spaces after closing quote and given index without any text
             * if Yes, returns the number of spaces
             */
			function extraSpaces(index) {
				var spaceLength = 0;
				if (index !== -1) {
					var textBetweenClosingQuoteAndIndex = input.substring(quoteSearch + 1, index);
					if (textBetweenClosingQuoteAndIndex && textBetweenClosingQuoteAndIndex.trim() === '') {
						spaceLength = textBetweenClosingQuoteAndIndex.length;
					}
				}
				return spaceLength;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substring(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [];
				errors = [];
			}

			/** Gets the delimiter character, which is not inside the quoted field */
			function getNextUnquotedDelimiter(nextDelim, quoteSearch, newLine) {
				var result = {
					nextDelim: undefined,
					quoteSearch: undefined
				};
				// get the next closing quote character
				var nextQuoteSearch = input.indexOf(quoteChar, quoteSearch + 1);

				// if next delimiter is part of a field enclosed in quotes
				if (nextDelim > quoteSearch && nextDelim < nextQuoteSearch && (nextQuoteSearch < newLine || newLine === -1)) {
					// get the next delimiter character after this one
					var nextNextDelim = input.indexOf(delim, nextQuoteSearch);

					// if there is no next delimiter, return default result
					if (nextNextDelim === -1) {
						return result;
					}
					// find the next opening quote char position
					if (nextNextDelim > nextQuoteSearch) {
						nextQuoteSearch = input.indexOf(quoteChar, nextQuoteSearch + 1);
					}
					// try to get the next delimiter position
					result = getNextUnquotedDelimiter(nextNextDelim, nextQuoteSearch, newLine);
				} else {
					result = {
						nextDelim: nextDelim,
						quoteSearch: quoteSearch
					};
				}

				return result;
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;

		var workerUrl = getWorkerBlob();
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: msg.results.data[i],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw new Error('Not implemented.');
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object' || obj === null)
			return obj;
		var cpy = Array.isArray(obj) ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));


/***/ }),

/***/ 2582:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {Writable, Readable} = __nccwpck_require__(2413);
const {EventEmitter} = __nccwpck_require__(8614);

class ReReadable extends Writable {

    constructor(options) {

        options = Object.assign({
            length: 1048576,
            highWaterMark: 32,
            dropInterval: 1e3
        }, options);

        super(options);

        this._readableOptions = options;

        this._highWaterMark = options.highWaterMark;
        this._bufArrLength = options.length;

        this._reading = 0;
        this._bufArr = [];
        this.hiBufCr = 0;
        this.loBufCr = 0;
        this._waiting = null;
        this._ended = new Promise((res) => this.on("finish", res));

    }

    _write(chunk, encoding, callback) {
        this._bufArr.push([chunk, encoding]);
        if (this._bufArr.length > this._bufArrLength) {
            this._waiting = callback;
            this.drop();
        } else {
            callback();
        }
        this.emit("wrote");
    }

    _writev(chunks, callback) {
        this._bufArr.push(...chunks.map(({chunk, encoding}) => [chunk, encoding]));
        if (this._bufArr.length > this._bufArrLength) {
            this._waiting = callback;
            this.drop();
        } else {
            callback();
        }
        this.emit("wrote");
    }

    updateBufPosition(bufCr) {
        this.hiBufCr = bufCr > this.hiBufCr ? bufCr : this.hiBufCr;
        this.loBufCr = bufCr > this.loBufCr ? bufCr : this.loBufCr;
        if (this._waiting && this.hiBufCr >= this._bufArrLength - this._highWaterMark) {
            const cb = this._waiting;
            this._waiting = null;
            cb();
        }
    }

    drop() {
        if (this._bufArr.length > this._bufArrLength)
            this.emit("drop", this._bufArr.splice(0, this._bufArr.length - this._bufArrLength).length);
    }

    rewind() {
        return this.tail(-1);
    }

    tail(count) {
        let end = false;
        this._ended.then(() => ret._read(end = true));
        this.setMaxListeners(++this._reading + EventEmitter.defaultMaxListeners);

        const ret = new Readable(Object.assign(this._readableOptions, {
            read: () => {
                if (ret.bufCr < this._bufArr.length) {
                    while(ret.bufCr < this._bufArr.length) {                 // while there's anything to read
                        const resp = ret.push(...this._bufArr[ret.bufCr++]); // push to readable
                        if (!resp && !end) break;                            // until there's not willing to read and we're not ended
                    }
                    this.updateBufPosition(ret.bufCr);
                } else if (!end) {
                    this.once("wrote", ret._read);
                }

                if (end)
                    ret.push(null);
            }
        }));

        ret.bufCr = count < this._bufArr.length && count > 0 ? this._bufArr.length - count : 0;

        this.on("drop", (count) => {
            ret.bufCr -= count;
            if (ret.bufCr < 0) {
                ret.emit("drop", -ret.bufCr);
                ret.bufCr = 0;
            }
        });

        return ret;
    }
}

module.exports = {ReReadable};


/***/ }),

/***/ 2172:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const scramjet = __nccwpck_require__(4238);

/**
 * A facilitation stream created for easy splitting or parsing buffers.
 *
 * Useful for working on built-in Node.js streams from files, parsing binary formats etc.
 *
 * A simple use case would be:
 *
 * ```javascript
 *  fs.createReadStream('pixels.rgba')
 *      .pipe(new BufferStream)         // pipe a buffer stream into scramjet
 *      .breakup(4)                     // split into 4 byte fragments
 *      .parse(buffer => [
 *          buffer.readInt8(0),            // the output is a stream of R,G,B and Alpha
 *          buffer.readInt8(1),            // values from 0-255 in an array.
 *          buffer.readInt8(2),
 *          buffer.readInt8(3)
 *      ]);
 * ```
 *
 * @memberof module:scramjet.
 * @borrows BufferStream#stringify as BufferStream#toStringStream
 * @borrows BufferStream#shift as BufferStream#pop
 * @borrows BufferStream#parse as BufferStream#toDataStream
 * @extends DataStream
 */
class BufferStream extends scramjet.DataStream {

    /**
     * Creates the BufferStream
     *
     * @param {DataStreamOptions} [opts={}] Stream options passed to superclass
     * @test test/methods/buffer-stream-constructor.js
     */
    constructor(...args) {
        super(...args);
        this.buffer = [];
    }

    /**
     * Shift Function
     *
     * @callback ShiftBufferCallback
     * @memberof module:scramjet~
     * @param {Buffer|any} shifted shifted bytes
     */

    /**
     * Shift given number of bytes from the original stream
     *
     * Works the same way as {@see DataStream.shift}, but in this case extracts
     * the given number of bytes.
     *
     * @chainable
     * @param {number} chars The number of bytes to shift
     * @param {ShiftBufferCallback} func Function that receives a string of shifted bytes
     *
     * @test test/methods/string-stream-shift.js
     */
    shift(bytes, func) {
        const ret = Buffer.alloc(bytes);
        const str = this.tap()._selfInstance();
        let offs = 0;

        const chunkHandler = (chunk) => {
            const length = Math.min(ret.length - offs, chunk.length);
            chunk.copy(ret, offs, 0, length);
            offs += length;
            if (length >= bytes) {
                unHook()
                    .then(
                        () => {
                            str.write(chunk.slice(length));
                            this.pipe(str);
                        }
                    );
            }
        };

        const endHandler = (...args) => {
            if (ret.length < bytes) {
                unHook();
            }
            str.end(...args);
        };

        const errorHandler = str.emit.bind(str, "error");

        const unHook = () => {
            this.removeListener("data", chunkHandler);
            this.removeListener("end", endHandler);
            this.removeListener("error", errorHandler);
            return func(ret);
        };


        this.on("data", chunkHandler);
        this.on("end", endHandler);
        this.on("error", errorHandler);

        return str;
    }

    /**
     * Splits the buffer stream into buffer objects
     *
     * @chainable
     * @param  {string|Buffer} splitter the buffer or string that the stream
     *                                  should be split by.
     * @return {BufferStream}  the re-split buffer stream.
     * @test test/methods/buffer-stream-split.js
     */
    split(splitter) {
        if (splitter instanceof Buffer || typeof splitter === "string") {
            const needle = Buffer.from(splitter);
            return this.tap().pipe(this._selfInstance({
                transform(buffer, enc, callback) {
                    if (Buffer.isBuffer(this._haystack) && this._haystack.length > 0) {
                        this._haystack = Buffer.from([this._haystack, buffer]);
                    } else {
                        this._haystack = buffer;
                    }

                    let pos;
                    while((pos = this._haystack.indexOf(needle)) > -1) {
                        this.push(Buffer.from(this._haystack.slice(0, pos)));
                        this._haystack = this._haystack.slice(pos + needle.length);
                    }

                    callback();
                },
                flush(callback) {
                    if (this._haystack && this._haystack.length) this.push(this._haystack);

                    this._haystack = null;
                    callback();
                }
            }));
        }
    }

    /**
     * Breaks up a stream apart into chunks of the specified length
     *
     * @chainable
     * @param  {number} number the desired chunk length
     * @return {BufferStream}  the resulting buffer stream.
     * @test test/methods/buffer-stream-breakup.js
     */
    breakup(number) {
        if (number <= 0 || !isFinite(+number))
            throw new Error("Breakup number is invalid - must be a positive, finite integer.");

        return this.tap().pipe(this._selfInstance({
            transform(chunk, encoding, callback) {
                if (Buffer.isBuffer(this.buffer)) {
                    chunk = Buffer.concat([this.buffer, chunk]);
                }
                let offset;
                for (offset = 0; offset < chunk.length - number; offset += number) {
                    this.push(chunk.slice(offset, offset + number));
                }
                this.buffer = chunk.slice(offset);
                callback();
            },
            flush(callback) {
                this.push(this.buffer);
                this.buffer = null;
                callback();
            }
        }));

    }

    /**
     * Creates a string stream from the given buffer stream
     *
     * Still it returns a DataStream derivative and isn't the typical node.js
     * stream so you can do all your transforms when you like.
     *
     * @param  {string|any} [encoding="utf-8"] The encoding to be used to convert the buffers
     *                           to streams.
     * @return {StringStream}  The converted stream.
     * @test test/methods/buffer-stream-tostringstream.js
     */
    stringify(encoding = "utf-8") {
        return this.pipe(new scramjet.StringStream(encoding, {objectMode: true}));
    }

    /**
     * @callback BufferParseCallback
     * @memberof module:scramjet~
     * @param {Buffer} chunk the transformed chunk
     * @return {Promise<any>|any}  the promise should be resolved with the parsed object
     */

    /**
     * Parses every buffer to object
     *
     * The method MUST parse EVERY buffer into a single object, so the buffer
     * stream here should already be split or broken up.
     *
     * @param  {BufferParseCallback} parser The transform function
     * @return {DataStream}  The parsed objects stream.
     * @test test/methods/buffer-stream-parse.js
     */
    parse(parser) {
        return this.tap().map(parser, scramjet.DataStream);
    }

    /**
     * @meta.noReadme
     * @ignore
     */
    _transform(chunk, encoding, callback) {
        this.push(Buffer.from(chunk, encoding));
        return callback();
    }

    /**
     * Creates a pipeline of streams and returns a scramjet stream.
     *
     * @see DataStream.pipeline
     * @static
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} readable the initial readable argument that is streamable by scramjet.from
     * @param {Array<AsyncFunction|Function|Transform>} ...transforms Transform functions (as in {@link DataStream..use}) or Transform streams (any number of these as consecutive arguments)
     *
     * @returns {BufferStream} a new StringStream instance of the resulting pipeline
     */
    static pipeline(...args) {
        return scramjet.DataStream.pipeline.call(this, ...args);
    }

    /**
     * Create BufferStream from anything.
     *
     * @see module:scramjet.from
     *
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|Readable} stream argument to be turned into new stream
     * @param {DataStreamOptions|Writable} [options={}] options passed to the new stream if created
     * @return {BufferStream}          new StringStream.
     */
    static from(...args) {
        return scramjet.DataStream.from.call(this, ...args);
    }

}

BufferStream.prototype.pop = BufferStream.prototype.shift;
BufferStream.prototype.toDataStream = BufferStream.prototype.parse;
BufferStream.prototype.toStringStream = BufferStream.prototype.stringify;

module.exports = BufferStream;


/***/ }),

/***/ 7248:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {PromiseTransformStream} = __nccwpck_require__(9421);
const {Readable, Writable, Transform} = __nccwpck_require__(2413);
const scramjet = __nccwpck_require__(4238);

const {
    AsyncGeneratorFunction,
    GeneratorFunction,
    resolveCalleeBlackboxed,
    pipeIfTarget
} = __nccwpck_require__(8603);

/**
 * DataStream is the primary stream type for Scramjet. When you parse your
 * stream, just pipe it you can then perform calculations on the data objects
 * streamed through your flow.
 *
 * Use as:
 *
 * ```javascript
 * const { DataStream } = require('scramjet');
 *
 * await (DataStream.from(aStream) // create a DataStream
 *     .map(findInFiles)           // read some data asynchronously
 *     .map(sendToAPI)             // send the data somewhere
 *     .run());                    // wait until end
 * ```
 * @memberof module:scramjet.
 * @alias DataStream
 * @borrows module:scramjet.DataStream#bufferify as module:scramjet.DataStream#toBufferStream
 * @borrows module:scramjet.DataStream#stringify as module:scramjet.DataStream#toStringStream
 * @extends import("stream").PassThrough
 */
class DataStream extends PromiseTransformStream {

    /**
     * Create the DataStream.
     *
     * @param {DataStreamOptions} [opts={}] Stream options passed to superclass
     *
     * @test test/methods/data-stream-constructor.js
     */
    constructor(opts) {
        super(Object.assign({
            objectMode: true,
            writableObjectMode: true,
            readableObjectMode: true
        }, opts));
    }

    /**
     * Returns a DataStream from pretty much anything sensibly possible.
     *
     * Depending on type:
     * * `self` will return self immediately
     * * `Readable` stream will get piped to the current stream with errors forwarded
     * * `Array` will get iterated and all items will be pushed to the returned stream.
     *   The stream will also be ended in such case.
     * * `GeneratorFunction` will get executed to return the iterator which will be used as source for items
     * * `AsyncGeneratorFunction` will also work as above (including generators) in node v10.
     * * `Iterable`s iterator will be used as a source for streams
     *
     * You can also pass a `Function` or `AsyncFunction` that will be executed and it's outcome will be
     * passed again to `from` and piped to the initially returned stream. Any additional arguments will be
     * passed as arguments to the function.
     *
     * If a `String` is passed, scramjet will attempt to resolve it as a module and use the outcome
     * as an argument to `from` as in the Function case described above. For more information see {@link modules.md}
     *
     * A simple example from a generator:
     *
     * ```javascript
     * DataStream
     *   .from(function* () {
     *      while(x < 100) yield {x: x++};
     *   })
     *   .each(console.log)
     *   // {x: 0}
     *   // {x: 1}
     *   // ...
     *   // {x: 99}
     * ```
     *
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Promise<any>|Function|string|Readable} input argument to be turned into new stream
     * @param {DataStreamOptions|Writable} [options={}] options for creation of a new stream or the target stream
     * @param {any[]} ...args additional arguments for the stream - will be passed to the function or generator
     * @return {DataStream}
     */
    static from(input, options, ...args) {
        const target = options instanceof this && options;

        const {errors: {StreamError}} = scramjet;

        if (input instanceof this) {
            return target ? input.pipe(target) : input;
        }

        if (input instanceof Readable || (
            typeof input.readable === "boolean" &&
            typeof input.pipe === "function" &&
            typeof input.on === "function"
        )) {
            const out = target || new this(
                Object.assign(
                    {},
                    options,
                    { referrer: input instanceof DataStream ? input : null }
                )
            );

            input.pipe(out);
            input.on("error", e => out.raise(e));
            return out;
        }

        if (input instanceof GeneratorFunction || input instanceof AsyncGeneratorFunction) {
            const iterator = input(...args);
            const iteratorStream = this.fromIterator(iterator, options);
            return pipeIfTarget(iteratorStream, target);
        }

        if (Array.isArray(input))
            return pipeIfTarget(this.fromArray(input, options), target);

        const iter = input[Symbol.iterator] || (Symbol.asyncIterator && input[Symbol.asyncIterator]);
        if (iter) {
            try {
                const iterator = iter.call(input);
                return pipeIfTarget(this.fromIterator(iterator, options), target);
            } catch(e) {
                const out = target || new this();
                out.raise(new StreamError(e, out, "EXTERNAL", null));

                return out;
            }
        }

        if (input instanceof Promise) {
            const out = new this(Object.assign({}, options));

            input
                .then(source => this.from(source, out))
                .catch(e => out.raise(new StreamError(e, out, "EXTERNAL", null)));

            return out;
        }

        if (typeof input === "function") {
            const out = new this(Object.assign({}, options));

            Promise.resolve(options)
                .then(input)
                .then(source => this.from(source, out))
                .catch(e => out.raise(new StreamError(e, out, "EXTERNAL", null)));

            return out;
        }

        if (typeof input === "string") {
            return new DataStream([]).use(input, ...args);
        }

        throw new Error("Cannot return a stream from passed object");
    }

    /**
     * @callback MapCallback
     * @memberof module:scramjet~
     * @param {any} chunk the chunk to be mapped
     * @returns {Promise<any>|any}  the mapped object
     */

    /**
     * Transforms stream objects into new ones, just like Array.prototype.map
     * does.
     *
     * Map takes an argument which is the Function function operating on every element
     * of the stream. If the function returns a Promise or is an AsyncFunction then the
     * stream will await for the outcome of the operation before pushing the data forwards.
     *
     * A simple example that turns stream of urls into stream of responses
     *
     * ```javascript
     * stream.map(async url => fetch(url));
     * ```
     *
     * Multiple subsequent map operations (as well as filter, do, each and other simple ops)
     * will be merged together into a single operation to improve performance. Such behaviour
     * can be suppressed by chaining `.tap()` after `.map()`.
     *
     * @param {MapCallback} func The function that creates the new object
     * @param {function(new:DataStream)} [ClassType=this.constructor] The class to be mapped to.
     * @chainable
     *
     * @test test/methods/data-stream-map.js
     */
    map(func, ClassType = this.constructor) {
        return this.pipe(new ClassType({
            promiseTransform: func,
            referrer: this
        }));
    }

    /**
     * @callback FilterCallback
     * @memberof module:scramjet~
     * @param {any} chunk the chunk to be filtered or not
     * @returns {Promise<Boolean>|Boolean} information if the object should remain in the filtered stream.
     */

    /**
     * Filters object based on the function outcome, just like Array.prototype.filter.
     *
     * Filter takes a Function argument which should be a Function or an AsyncFunction that
     * will be called on each stream item. If the outcome of the operation is `falsy` (`0`, `''`,
     * `false`, `null` or `undefined`) the item will be filtered from subsequent operations
     * and will not be pushed to the output of the stream. Otherwise the item will not be affected.
     *
     * A simple example that filters out non-2xx responses from a stream
     *
     * ```javascript
     * stream.filter(({statusCode}) => !(statusCode >= 200 && statusCode < 300));
     * ```
     *
     * @chainable
     * @param  {FilterCallback} func The function that filters the object
     *
     * @test test/methods/data-stream-filter.js
     */
    filter(func) {
        return this.pipe(this._selfInstance({
            promiseTransform: func,
            afterTransform: (chunk, ret) => ret ? chunk : Promise.reject(DataStream.filter),
            referrer: this
        }));
    }

    /**
     * @callback ReduceCallback
     * @memberof module:scramjet~
     * @param {any} accumulator the accumulator - the object initially passed or returned by the previous reduce operation
     * @param {object} chunk the stream chunk.
     * @return {Promise<any>|any}  accumulator for the next pass
     */

    /**
     * Reduces the stream into a given accumulator
     *
     * Works similarly to Array.prototype.reduce, so whatever you return in the
     * former operation will be the first operand to the latter. The result is a
     * promise that's resolved with the return value of the last transform executed.
     *
     * A simple example that sums values from a stream
     *
     * ```javascript
     * stream.reduce((accumulator, {value}) => accumulator + value);
     * ```
     *
     * This method is serial - meaning that any processing on an entry will
     * occur only after the previous entry is fully processed. This does mean
     * it's much slower than parallel functions.
     *
     * @async
     * @param {ReduceCallback} func The into object will be passed as the  first argument, the data object from the stream as the second.
     * @param {object} into Any object passed initially to the transform function
     *
     * @test test/methods/data-stream-reduce.js
     */
    reduce(func, into) {

        let last = Promise.resolve(into);

        return this.tap()
            .pipe(new PromiseTransformStream({
                promiseTransform: (chunk) => {
                    return last = last.then((acc) => func(acc, chunk));
                },
                referrer: this,
                initial: into
            }))
            .resume()
            .whenFinished()
            .then(() => last);
    }

    /**
     * @callback DoCallback
     * @memberof module:scramjet~
     * @async
     * @param {object} chunk source stream chunk
     * @returns {Promise<any>|any} the outcome is discarded
     */

    /**
     * Perform an asynchronous operation without changing or resuming the stream.
     *
     * In essence the stream will use the call to keep the backpressure, but the resolving value
     * has no impact on the streamed data (except for possible mutation of the chunk itself)
     *
     * @chainable
     * @param {DoCallback} func the async function
     */
    do(func) {
        return this.map(async (chunk) => (await func(chunk), chunk));
    }

    /**
     * Processes a number of functions in parallel, returns a stream of arrays of results.
     *
     * This method is to allow running multiple asynchronous operations and receive all the
     * results at one, just like Promise.all behaves.
     *
     * Keep in mind that if one of your methods rejects, this behaves just like Promise.all
     * you won't be able to receive partial results.
     *
     * @chainable
     * @param {Function[]} functions list of async functions to run
     *
     * @test test/methods/data-stream-all.js
     */
    all(functions) {
        return this.map(chunk => {
            const chunkPromise = Promise.resolve(chunk);
            return Promise.all(functions.map(func => chunkPromise.then(func)));
        });
    }

    /**
     * Processes a number of functions in parallel, returns the first resolved.
     *
     * This method is to allow running multiple asynchronous operations awaiting just the
     * result of the quickest to execute, just like Promise.race behaves.
     *
     * Keep in mind that if one of your methods it will only raise an error if that was
     * the first method to reject.
     *
     * @chainable
     * @param {Function[]} functions list of async functions to run
     *
     * @test test/methods/data-stream-race.js
     */
    race(functions) {
        return this.map(chunk => {
            const chunkPromise = Promise.resolve(chunk);
            return Promise.race(functions.map(func => chunkPromise.then(func)));
        });
    }

    /**
     * Allows processing items without keeping order
     *
     * This method useful if you are not concerned about the order in which the
     * chunks are being pushed out of the operation. The `maxParallel` option is
     * still used for keeping a number of simultaneous number of parallel operations
     * that are currently happening.
     *
     * @param {MapCallback} func the async function that will be unordered
     */
    unorder(func) {
        const waiting = [];
        const processing = Array(this._options.maxParallel).fill(null);
        const out = this._selfInstance({referrer: this});

        this
            .each(async chunk => {
                // we're using this race condition on purpose
                /* eslint-disable require-atomic-updates */
                let slot = processing.findIndex(x => x === null);
                if (slot < 0 && processing.length < this._options.maxParallel) slot = processing.length;
                if (slot < 0) slot = await new Promise(res => waiting.push(res));

                processing[slot] = Promise
                    .resolve(chunk)
                    .then(func)
                    .then(result => out.whenWrote(result))
                    .then(() => {
                        const next = waiting.shift();
                        if (next) next(slot);
                        else processing[slot] = null;
                    });
                /* eslint-enable require-atomic-updates */
            })
            .run()
            .then(() => Promise.all(processing))
            .then(() => out.end());

        return out;
    }

    /**
     * @callback IntoCallback
     * @memberof module:scramjet~
     * @async
     * @param {*} into stream passed to the into method
     * @param {any} chunk source stream chunk
     * @return {Promise<any>|any} resolution for the old stream (for flow control only)
     */

    /**
     * Allows own implementation of stream chaining.
     *
     * The async Function is called on every chunk and should implement writes in it's own way. The
     * resolution will be awaited for flow control. The passed `into` argument is passed as the first
     * argument to every call.
     *
     * It returns the DataStream passed as the second argument.
     *
     * @chainable
     * @param  {IntoCallback} func the method that processes incoming chunks
     * @param  {DataStream} into the DataStream derived class
     *
     * @test test/methods/data-stream-into.js
     */
    into(func, into) {
        if (!(into instanceof DataStream)) throw new Error("Stream must be passed!");

        if (!into._options.referrer)
            into.setOptions({referrer: this});

        this.tap()
            .catch(e => into.raise(e))
            .pipe(new (this.constructor)({
                promiseTransform: async (chunk) => {
                    try {
                        await func(into, chunk);
                    } catch(e) {
                        into.raise(e);
                    }
                },
                referrer: this
            }))
            .on("end", () => into.end())
            .resume();

        return into;
    }

    /**
     * @callback UseCallback
     * @memberof module:scramjet~
     * @async
     * @param {DataStream} stream
     * @param  {any[]} ...parameters
     * @returns {DataStream}
     */

    /**
     * Calls the passed method in place with the stream as first argument, returns result.
     *
     * The main intention of this method is to run scramjet modules - transforms that allow complex transforms of
     * streams. These modules can also be run with [scramjet-cli](https://github.com/signicode/scramjet-cli) directly
     * from the command line.
     *
     * @chainable
     * @param {AsyncGeneratorFunction|GeneratorFunction|UseCallback|string|Readable} func if passed, the function will be called on self to add an option to inspect the stream in place, while not breaking the transform chain. Alternatively this can be a relative path to a scramjet-module. Lastly it can be a Transform stream.
     * @param {any[]} ...parameters any additional parameters top be passed to the module
     * @test test/methods/data-stream-use.js
     */
    use(func, ...parameters) {
        if (typeof func == "string") {
            func = require(func.startsWith(".") ? resolveCalleeBlackboxed(func) : func);
        }

        if (func instanceof Transform || (
            typeof func.readable === "boolean" && func.readable &&
            typeof func.writable === "boolean" && func.writable &&
            typeof func.pipe === "function" &&
            typeof func.on === "function"
        )) {
            return this.constructor.from(this.pipe(func));
        }

        if (func instanceof GeneratorFunction || func instanceof AsyncGeneratorFunction) {
            return this.constructor.from(func, {}, this, ...parameters);
        }

        if (typeof func === "function") {
            const result = func(this, ...parameters);
            if (result instanceof Promise) {
                const out = new this.constructor();
                result
                    .then(res => this.constructor.from(res).pipe(out))
                    .catch(e => out.raise(e));

                return out;
            } else {
                return result;
            }
        }

        throw new Error("Unknown argument type.");
    }

    /**
     * Consumes all stream items doing nothing. Resolves when the stream is ended.
     *
     * This is very convienient if you're looking to use up the stream in operations that work on each entry like `map`. This uncorks the stream
     * and allows all preceding operations to be run at any speed.
     *
     * All the data of the current stream will be discarded.
     *
     * The function returns a promise that is resolved when the stream ends.
     *
     * @async
     */
    async run() {
        return this.tap()
            .pipe(new DataStream())
            .on("data", () => 0)
            .whenEnd();
    }

    /**
     * Creates a pipeline of streams and returns a scramjet stream.
     *
     * This is similar to node.js stream pipeline method, but also takes scramjet modules
     * as possibilities in an array of transforms. It may be used to run a series of non-scramjet
     * transform streams.
     *
     * The first argument is anything streamable and will be sanitized by {@link DataStream..from}.
     *
     * Each following argument will be understood as a transform and can be any of:
     * * AsyncFunction or Function - will be executed by {@link DataStream..use}
     * * A transform stream that will be piped to the preceding stream
     *
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} readable the initial readable argument that is streamable by scramjet.from
     * @param {Array<AsyncFunction|Function|Transform>} ...transforms Transform functions (as in {@link DataStream..use}) or Transform streams (any number of these as consecutive arguments)
     *
     * @returns {DataStream} a new DataStream instance of the resulting pipeline
     */
    static pipeline(readable, ...transforms) {
        const out = new this();
        let current = this.from(readable);

        (async () => {
            for (let transform of transforms) {
                if (transform instanceof Transform || (
                    typeof transform.readable === "boolean" && transform.readable &&
                    typeof transform.writable === "boolean" && transform.writable &&
                    typeof transform.pipe === "function" &&
                    typeof transform.on === "function"
                )) {
                    current = this.from(current.pipe(transform));
                } else {
                    current = this.from(current).use(transform);
                }
            }

            this
                .from(current)
                .pipe(out);

        })()
            .then()
            .catch(e => {
                return out.raise(e);
            });

        return out;
    }

    /**
     * Stops merging transform Functions at the current place in the command chain.
     *
     * @name tap
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @method
     * @test test/methods/data-stream-tap.js
     */

    /**
     * Reads a chunk from the stream and resolves the promise when read.
     *
     * @async
     * @name whenRead
     * @memberof module:scramjet.DataStream#
     * @method
     */

    /**
     * Writes a chunk to the stream and returns a Promise resolved when more chunks can be written.
     *
     * @async
     * @name whenWrote
     * @memberof module:scramjet.DataStream#
     * @method
     * @param {*} chunk a chunk to write
     * @param {any[]} ...more more chunks to write
     */

    /**
     * Resolves when stream ends - rejects on uncaught error
     *
     * @async
     * @name whenEnd
     * @memberof module:scramjet.DataStream#
     * @method
     */

    /**
     * Returns a promise that resolves when the stream is drained
     *
     * @async
     * @name whenDrained
     * @memberof module:scramjet.DataStream#
     * @method
     */

    /**
     * Returns a promise that resolves (!) when the stream is errors
     *
     * @async
     * @name whenError
     * @memberof module:scramjet.DataStream#
     * @method
     */

    /**
     * Allows resetting stream options.
     *
     * It's much easier to use this in chain than constructing new stream:
     *
     * ```javascript
     *     stream.map(myMapper).filter(myFilter).setOptions({maxParallel: 2})
     * ```
     *
     * @meta.conditions keep-order,chain
     *
     * @memberof module:scramjet.DataStream#
     * @name setOptions
     * @method
     * @param {DataStreamOptions} options
     * @chainable
     */

    /**
     * Returns a copy of the stream
     *
     * Creates a new stream and pushes all the data from the current one to the new one.
     * This can be called serveral times.
     *
     * @chainable
     * @param {TeeCallback|Writable} func The duplicate stream will be passed as first argument.
     */
    copy() {
        return this.tap().pipe(this._selfInstance());
    }

    /**
     * Duplicate the stream
     *
     * Creates a duplicate stream instance and passes it to the Function.
     *
     * @chainable
     * @param {TeeCallback|Writable} func The duplicate stream will be passed as first argument.
     *
     * @test test/methods/data-stream-tee.js
     */
    tee(func) {
        if (func instanceof Writable)
            return (this.tap().pipe(func), this);
        func(this.pipe(this._selfInstance()));
        return this.tap();
    }

    /**
     * @callback TeeCallback
     * @memberof module:scramjet~
     * @param {DataStream} teed The teed stream
     */

    /**
     * Performs an operation on every chunk, without changing the stream
     *
     * This is a shorthand for ```stream.on("data", func)``` but with flow control.
     * Warning: this resumes the stream!
     *
     * @chainable
     * @param  {MapCallback} func a Function called for each chunk.
     */
    each(func) {
        return this.tap().map(
            (a) => Promise.resolve(func(a))
                .then(() => a)
        ).resume();
    }

    /**
     * Reads the stream while the function outcome is truthy.
     *
     * Stops reading and emits end as soon as it finds the first chunk that evaluates
     * to false. If you're processing a file until a certain point or you just need to
     * confirm existence of some data, you can use it to end the stream before reaching end.
     *
     * Keep in mind that whatever you piped to the stream will still need to be handled.
     *
     * @chainable
     * @param  {FilterCallback} func The condition check
     *
     * @test test/methods/data-stream-while.js
     */
    while(func) {
        let condition = true;
        const out = this._selfInstance();
        return this.tap().pipe(out.filter(
            (chunk) => {
                const result = condition && func(chunk);
                if (condition != result) {
                    condition = result;
                    this.unpipe(out);
                    out.end();
                }

                return Promise
                    .resolve(result)
                    .then(result => result ? chunk : Promise.reject(DataStream.filter));
            }
        ));
    }

    /**
     * Reads the stream until the function outcome is truthy.
     *
     * Works opposite of while.
     *
     * @chainable
     * @param  {FilterCallback} func The condition check
     *
     * @test test/methods/data-stream-until.js
     */
    until(func) {
        let condition = false;
        const out = this._selfInstance();
        return this.tap().pipe(out).filter(
            (chunk) => {
                const result = condition || func(chunk);
                const ref = !result ? chunk : Promise.reject(DataStream.filter);

                if (condition != result) {
                    condition = result;
                    this.unpipe(out);
                    out.end();
                }

                return ref;
            }
        );
    }

    /**
     * Provides a way to catch errors in chained streams.
     *
     * The handler will be called as asynchronous
     *  - if it resolves then the error will be muted.
     *  - if it rejects then the error will be passed to the next handler
     *
     * If no handlers will resolve the error, an `error` event will be emitted
     *
     * @chainable
     * @name catch
     * @memberof module:scramjet.DataStream#
     * @method
     * @param {Function} callback Error handler (async function)
     *
     * @test test/methods/data-stream-catch.js
     */

    /**
     * Executes all error handlers and if none resolves, then emits an error.
     *
     * The returned promise will always be resolved even if there are no successful handlers.
     *
     * @async
     * @name raise
     * @memberof module:scramjet.DataStream#
     * @method
     * @param {Error} err The thrown error
     *
     * @test test/methods/data-stream-raise.js
     */

    /**
     * Override of node.js Readable pipe.
     *
     * Except for calling overridden method it proxies errors to piped stream.
     *
     * @name pipe
     * @chainable
     * @ignore
     * @method
     * @memberof module:scramjet.DataStream#
     * @param  {NodeJS.WritableStream} to  Writable stream to write to
     * @param  {WritableOptions} [options={}]
     * @return {NodeJS.WritableStream}  the `to` stream
     */

    /**
     * Creates a BufferStream.
     *
     * The passed serializer must return a buffer.
     *
     * @meta.noReadme
     * @chainable
     * @param  {MapCallback} serializer A method that converts chunks to buffers
     * @return {BufferStream}  the resulting stream
     *
     * @test test/methods/data-stream-tobufferstream.js
     */
    bufferify(serializer) {
        return this.map(serializer, scramjet.BufferStream);
    }

    /**
     * Creates a StringStream.
     *
     * The passed serializer must return a string. If no serializer is passed chunks
     * toString method will be used.
     *
     * @chainable
     * @param  {MapCallback|never} [serializer] A method that converts chunks to strings
     * @return {StringStream} the resulting stream
     *
     * @test test/methods/data-stream-tostringstream.js
     */
    stringify(serializer = a => `${a}`) {
        return this.map(serializer, scramjet.StringStream);
    }

    /**
     * Create a DataStream from an Array
     *
     * @param  {Array<*>} array list of chunks
     * @param {DataStreamOptions} [options={}] the read stream options
     * @return {DataStream}
     *
     * @test test/methods/data-stream-fromarray.js
     */
    static fromArray(array, options = {}) {
        const ret = new this(options);
        array = array.slice();
        array.forEach((item) => ret.write(item));
        ret.end();
        return ret;
    }

    /**
     * Create a DataStream from an Iterator
     *
     * Doesn't end the stream until it reaches end of the iterator.
     *
     * @param {Iterator<any>} iterator the iterator object
     * @param {DataStreamOptions} [options={}] the read stream options
     * @return {DataStream}
     *
     * @test test/methods/data-stream-fromiterator.js
     */
    static fromIterator(iterator, options) {
        return new this(Object.assign({}, options, {
            // TODO: handle count argument
            // problem here is how do we know which promises are resolved and until where?
            // need to queue a number of promises up to maxParallel, but push them with
            // Promise.all with the previous one.
            async parallelRead() {
                const read = await iterator.next();
                if (read.done) {
                    return read.value ? [await read.value, null] : [null];
                } else {
                    return [await read.value];
                }
            }
        }));
    }

    /**
     * Aggregates the stream into a single Array
     *
     * In fact it's just a shorthand for reducing the stream into an Array.
     *
     * @async
     * @param  {Array} [initial=[]] Array to begin with (defaults to an empty array).
     * @returns {any[]}
     */
    toArray(initial = []) {
        return this.reduce(
            (arr, item) => (arr.push(item), arr),
            initial
        );
    }

    /**
     * Returns an async generator
     *
     * @return {Generator<Promise<any>>} Returns an iterator that returns a promise for each item.
     */
    toGenerator() {
        this.tap();
        const ref = this;
        return function* () {
            let ended = false;
            ref.on("end", () => ended = true);
            while (!ended) {
                yield ref.whenRead();
            }
            return;
        };
    }

    /**
     * Returns a new instance of self.
     *
     * Normally this doesn't have to be overridden.
     * When the constructor would use some special arguments this may be used to
     * override the object construction in {@link tee}...
     *
     * @meta.noReadme
     * @memberof module:scramjet.DataStream#
     * @name _selfInstance
     * @method
     * @return {DataStream}  an empty instance of the same class.
     * @test test/methods/data-stream-selfinstance.js
     */
}

/**
 * Transform async callback. The passed transform should return a new chunk, unless
 * the output should be filtered - if so, the transform should return `undefined`.
 *
 * Additionally the function can reject with `DataStream.filter` - the result will be
 * filtered and no other transforms will be run on the chunk.
 *
 * @callback ScramjetTransformCallback
 * @memberof module:scramjet~
 * @param {Buffer|string|any} chunk the stream chunk
 * @param {string} encoding encoding of the chunk
 * @returns {Promise<any|undefined>|any|undefined} the result, undefined will be treated as filtered out.
 */

/**
 * Write async callback. Await your async write and resolve.
 *
 * @callback ScramjetWriteCallback
 * @memberof module:scramjet~
 * @param {Buffer|string|any} chunk the stream chunk
 * @param {string} encoding encoding of the chunk
 * @returns {Promise<void>|void} should resolve when the write ends
 */

/**
 * Read async callback. Simply await your async operations and return the result as array.
 *
 * @callback ScramjetReadCallback
 * @memberof module:scramjet~
 * @param {number} count the number of chunks that should be read ("this is more like a set of guideline than actual rules").
 * @returns {Array<any>|Promise<Array<any>>} the read chunk.
 */

/**
 * Standard options for scramjet streams.
 *
 * Defines async transforms or read/write methods for a stream.
 * @typedef {object} DataStreamOptions
 * @memberof module:scramjet~
 * @property {ScramjetReadCallback} [promiseRead=null] an async function returning the next read item
 * @property {ScramjetWriteCallback} [promiseWrite=null] an async function writing the next written item
 * @property {ScramjetTransformCallback} [promiseTransform=null] an async function returning a transformed chunk
 * @property {ScramjetReadCallback} [promiseFlush=null] an async function run before transform stream ends to push last chunks from the buffer
 * @property {ScramjetTransformCallback} [beforeTransform=null] an async function run before the transform
 * @property {ScramjetTransformCallback} [afterTransform=null] an async function run after the transform
 * @property {number} [maxParallel=os.cpus.length*2] the number of transforms done in parallel
 * @property {DataStream} [referrer=null] a referring stream to point to (if possible the transforms will be pushed to it
 * @property {boolean} [objectMode=true] should the object mode be used instead of creating a new stream)
 * @property {number} [highWaterMark] The maximum number of bytes to store in the internal buffer before ceasing to read from the underlying resource. Default: 16384 (16KB), or 16 for objectMode streams.
 * @property {string} [encoding] If specified, then buffers will be decoded to strings using the specified encoding. Default: null.
 * @property {boolean} [emitClose] Whether or not the stream should emit 'close' after it has been destroyed. Default: true.
 * @property {Function} [read] Implementation for the stream._read() method.
 * @property {Function} [destroy] Implementation for the stream._destroy() method.
 * @property {Function} [construct] Implementation for the stream._construct() method.
 * @property {boolean} [autoDestroy] Whether this stream should automatically call .destroy() on itself after ending. Default: true.
 */

DataStream.prototype.toBufferStream = DataStream.prototype.bufferify;
DataStream.prototype.toStringStream = DataStream.prototype.stringify;

module.exports = DataStream;


/***/ }),

/***/ 4238:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/** @ignore */
const {plgctor} = __nccwpck_require__(9421);

/**
 * Scramjet main exports expose all the stream classes and a number of methods.
 *
 * All scramjet streams allow writing, reading or transform modes - currently
 * exclusively (meaning you can't have two at once). Any of the scramjet streams
 * can be constructed with the following options passed to mimic node.js standard streams:
 *
 * * `async promiseTransform(chunk)` - transform method that resolves with a single output chunk
 * * `async promiseWrite(chunk)` - write method that that resolves when chunk is written
 * * `async promiseRead(count)` - read method that resolves with an array of chunks when called
 *
 * See {@link https://nodejs.org/api/stream.html#stream_api_for_stream_implementers node.js API for stream implementers for details}
 *
 * The object exposes the following classes:
 *
 * * `DataStream` {@see DataStream} - the basic object stream of any type
 * * `StringStream` {@see StringStream} - a stream of strings
 * * `BufferStream` {@see BufferStream} - a stream of buffers
 * * `MultiStream` {@see MultiStream} - a group of streams
 * * `NumberStream` {@see NumberStream} - a stream of numbers
 * * `WindowStream` {@see WindowStream} - a stream of windows of objects
 *
 * The general concept of Scramjet streams is facilitating node's TransformStream mechanism so that you don't need
 * to create a number of streams and create the pipeline, but use the concept of chaining instead. When you call `parse`
 * method for instance, scramjet creates a new stream, pipes it to the callee and forwards errors.
 *
 * What's worth mentioning - scramjet tries to limit the number of created transform streams and pushes the transforms
 * one after another into the same stream class therefore a code `stream.map(transform1).map(transform2).filter(transform3)`
 * will only operate on a single transform stream that evaluates all three transforms one after another.
 *
 * @exports scramjet
 * @module scramjet
 */
module.exports = {
    /**
     * Creates a DataStream that's piped from the passed readable.
     *
     * @memberof module:scramjet
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} input argument to be turned into new stream
     * @param {DataStreamOptions|Writable} [options={}] options for creation of a new stream or the target stream
     * @param {any[]} ...args additional arguments for the stream - will be passed to the function or generator
     * @return {DataStream}
     */
    from(...args) {
        return this.DataStream.from(...args);
    },

    /**
     * Creates a DataStream from an Array
     *
     * @memberof module:scramjet
     * @param  {Array} array list of chunks
     * @param {DataStreamOptions} [options={}] the read stream options
     * @return {DataStream}
     */
    fromArray(...args) {
        return this.DataStream.fromArray(...args);
    },

    get ScramjetOptions() { return __nccwpck_require__(2650); },

    /**
     * Creates a safe wrapper for scramjet transform module. See [Modules documentation](modules.md) for more info.
     *
     * @param {UseCallback} transform
     * @param {CreateModuleOptions} [options={}]
     * @param  {any[]} ...initialArgs
     * @return {Function} a scramjet module function
     */
    createTransformModule(transform, {StreamClass = module.exports.DataStream} = {}, ...initialArgs) {
        return function (stream, ...extraArgs) {
            return StreamClass.from(stream)
                .use(transform, ...initialArgs, ...extraArgs);
        };
    },

    /**
     * Creates a safe wrapper for scramjet read module. See [Modules documentation](modules.md) for more info.
     *
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} anything
     * @param {CreateModuleOptions} [options={}]
     * @param  {any[]} ...initialArgs
     * @return {Function} a scramjet module function
     */
    createReadModule(anything, {StreamClass = module.exports.DataStream} = {}, ...initialArgs) {
        StreamClass = StreamClass || this.DataStream;

        return (...extraArgs) => {
            return StreamClass.from(anything, ...initialArgs, ...extraArgs);
        };
    },

    /**
     * Options for createModule
     *
     * @typedef {object} CreateModuleOptions
     * @memberof module:scramjet~
     * @prop {DataStream} StreamClass defines what class should the module assume
     */

    get errors()  { return __nccwpck_require__(7532); },

    /**
     * @ignore
     * @see {@link buffer-stream.md}
     */
    get BufferStream() { return __nccwpck_require__(2172); },

    /**
     * @ignore
     * @see {@link data-stream.md}
     */
    get DataStream() { return __nccwpck_require__(7248); },

    /**
     * @ignore
     * @see {@link multi-stream.md}
     */
    get MultiStream() { return __nccwpck_require__(2157); },

    /**
     * @ignore
     * @see {@link string-stream.md}
     */
    get StringStream() { return __nccwpck_require__(6428); },

    /**
     * Provides a lazy-load accessor to PromiseTransformStream - the base class of scramjet streams
     *
     * @ignore
     */
    get PromiseTransformStream() { return __nccwpck_require__(9421).PromiseTransformStream; },

    /**
     * Definition of a single mixin for a specific Scramjet class. Should contain any number of stream methods.
     *
     * @typedef {object} StreamMixin
     * @memberof module:scramjet~
     * @property {Function} constructor optional constructor that will be called in the stream constructor (this has to be an own property!)
     */

    /**
     * Definition of a plugin in Scramjet
     *
     * @typedef {object} ScramjetPlugin
     * @memberof module:scramjet~
     * @internal
     * @property {StreamMixin} BufferStream definition of constructor and properties for the BufferStream prototype.
     * @property {StreamMixin} DataStream definition of constructor and properties for the DataStream prototype.
     * @property {StreamMixin} MultiStream definition of constructor and properties for the MultiStream prototype.
     * @property {StreamMixin} StringStream definition of constructor and properties for the StringStream prototype.
     */

    /**
     * Plugs in methods for any of the classes
     *
     * @static
     * @memberof module:scramjet
     * @param  {ScramjetPlugin} mixin the plugin object
     * @return {ScramjetPlugin}
     *
     * @test test/methods/scramjet-plugin.js
     */
    plugin(mixins) {
        for (const key of Object.keys(mixins)) {
            if (key in this) {
                const Mixin = mixins[key];
                const Stream = this[key];
                if (Object.prototype.hasOwnProperty.call(Mixin, "constructor") && Stream[plgctor]) {
                    Stream[plgctor].ctors.push(Mixin.constructor);
                    delete Mixin.constructor;
                }
                Object.getOwnPropertyNames(Mixin).forEach(
                    (prop) => Object.defineProperty(Stream.prototype, prop, Object.getOwnPropertyDescriptor(Mixin, prop))
                );
            } else {
                this[key] = mixins[key];
            }
        }
        return this;
    },

    /**
     * Gets an API version (this may be important for future use)
     *
     * @static
     * @memberof module:scramjet
     * @param {number} version The required version (currently only: 1)
     * @return {ScramjetPlugin}
     */
    API(version) {
        if (version === 1) {
            return module.exports;
        }
    }
};

// ----- Externals documentation -----

/**
 * Asynchronous Generator.
 *
 * @ignore
 * @external AsyncGeneratorFunction
 * @see https://github.com/tc39/proposal-async-iteration#async-generator-functions
 */

/**
 * Generator function (`function* ()`).
 *
 * @ignore
 * @external GeneratorFunction
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction
 */

/**
 * Simple Node.js Passthrough stream.
 *
 * @ignore
 * @external stream.PassThrough
 * @see https://nodejs.org/api/stream.html#stream_class_stream_passthrough
 */


/***/ }),

/***/ 2157:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const OUT = Symbol("OUT");

/** @ignore */
const mergesortStream = __nccwpck_require__(658);
/** @ignore */
const EventEmitter = __nccwpck_require__(8614).EventEmitter;
/** @ignore */
const scramjet = __nccwpck_require__(4238);
const { DataStream, PromiseTransformStream } = scramjet;

/**
 * An object consisting of multiple streams than can be refined or muxed.
 *
 * The idea behind a MultiStream is being able to mux and demux streams when needed.
 *
 * Usage:
 * ```javascript
 * new MultiStream([...streams])
 *  .mux();
 *
 * new MultiStream(function*(){ yield* streams; })
 *  .map(stream => stream.filter(myFilter))
 *  .mux();
 * ```
 *
 * @memberof module:scramjet.
 */
class MultiStream extends EventEmitter {

    /**
     * Crates an instance of MultiStream with the specified stream list
     *
     * @param  {stream.Readable[]|AsyncGenerator<Readable>|Generator<Readable>} streams the list of readable streams (other objects will be filtered out!)
     * @param  {object} [options={}] Optional options for the super object. ;)
     *
     * @test test/methods/multi-stream-constructor.js
     */
    constructor(streams, ...args) {

        super(args.length ? args[0] : streams);

        /**
         * Array of all streams
         * @type {Array}
         */
        this.streams = [];

        /**
         * Source of the MultiStream.
         *
         * This is nulled when the stream ends and is used to control the
         *
         * @type {DataStream}
         */
        this.source = null;

        if (Array.isArray(streams)) {
            streams.forEach((str) => this.add(str));
        } else if (streams) {
            this.source = scramjet.DataStream
                .from(streams)
                .do(stream => this.add(stream))
                .run()
                .then(() => this._checkEmpty(true))
            ;
        }
    }

    /**
     * Constructs MultiStream from any number of streams-likes
     *
     * @param {Array<Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable>} streams the array of input streamlike elements
     * @param {function(new:DataStream)} [StreamClass=DataStream]
     * @returns {MultiStream}
     */
    static from(streams, StreamClass = DataStream) {
        if (!(StreamClass.prototype instanceof PromiseTransformStream))
            throw new Error("From can instantiate stream-like classes only");

        // We should handle non-arrays here as well
        return new this(streams.map(x => StreamClass.from(x)));
    }

    /**
     * Returns the current stream length
     * @return {number}
     */
    get length() {
        return this.streams.length;
    }


    /**
     * @callback MultiMapCallback
     * @memberof module:scramjet~
     * @async
     * @param {DataStream} stream
     * @returns {DataStream}
     */

    /**
     * Returns new MultiStream with the streams returned by the transform.
     *
     * Runs a callback for every stream, returns a new MultiStream of mapped
     * streams and creates a new MultiStream consisting of streams returned
     * by the Function.
     *
     * @chainable
     * @param  {MultiMapCallback} aFunc Add callback (normally you need only this)
     * @param  {MultiMapCallback} rFunc Remove callback, called when the stream is removed
     * @return {Promise<MultiStream>}  the mapped instance
     *
     * @test test/methods/multi-stream-map.js
     */
    map(aFunc, rFunc) {
        return Promise.all(
            this.streams.map(
                (s) => {
                    return Promise.resolve(s)
                        .then(aFunc)
                    ;
                }
            )
        ).then(
            (streams) => {
                const out = new (this.constructor)(
                    streams
                );

                this.on(
                    "add",
                    (stream) => Promise.resolve(stream)
                        .then(aFunc)
                        .then(out.add.bind(out))
                );

                if (rFunc)
                    this.on(
                        "remove",
                        (stream) => Promise.resolve(stream)
                            .then(rFunc)
                            .then(out.remove.bind(out))
                    );

                return out;
            }
        );
    }

    /**
     * Calls Array.prototype.find on the streams
     *
     * @param  {any[]} ...args arguments for
     * @return {DataStream}  found DataStream
     */
    find(...args) {
        return this.streams.find(...args);
    }

    each(aFunc, rFunc) {
        return Promise.all(
            this.streams.map(
                (s) => {
                    return Promise.resolve(s)
                        .then(aFunc)
                    ;
                }
            )
        ).then(
            () => {
                this.on(
                    "add",
                    (stream) => Promise.resolve(stream).then(aFunc)
                );

                if (rFunc)
                    this.on(
                        "remove",
                        (stream) => Promise.resolve(stream).then(rFunc)
                    );

                return this;
            }
        );
    }

    /**
     * Filters the stream list and returns a new MultiStream with only the
     * streams for which the Function returned true
     *
     * @chainable
     * @param  {Function} func Filter ran in Promise::then (so you can
     *                                  return a promise or a boolean)
     * @return {MultiStream}  the filtered instance
     *
     * @test test/methods/multi-stream-filter.js
     */
    filter(func) {
        return Promise.all(
            this.streams.map(
                (s) => Promise.resolve(s)
                    .then(func)
                    .then((o) => o ? s : null)
            )
        ).then(
            (streams) => {
                const out = new (this.constructor)(
                    streams.filter((s) => s)
                );
                this.on(
                    "add",
                    (stream) => Promise.resolve(stream)
                        .then(func)
                        .then(out.add.bind(out))
                );
                this.on(
                    "remove", out.remove.bind(out)
                );
                return out;
            }
        );
    }

    /**
     * Muxes the streams into a single one
     *
     * @todo For now using comparator will not affect the mergesort.
     * @todo Sorting requires all the streams to be constantly flowing, any
     *       single one drain results in draining the muxed too even if there
     *       were possible data on other streams.
     *
     * @param  {Function} [comparator] Should return -1 0 or 1 depending on the
     *                                  desired order. If passed the chunks will
     *                                  be added in a sorted order.
     * @param {function(new:DataStream)} [ClassType=DataStream] the class to be outputted
     * @return {DataStream}  The resulting DataStream
     *
     * @test test/methods/multi-stream-mux.js
     */
    mux(comparator = undefined, ClassType = scramjet.DataStream) {

        this[OUT] = new ClassType();

        if (!comparator) {

            const unpipeStream = (stream) => {
                if (stream) stream.unpipe(this[OUT]);
                this[OUT].setMaxListeners(this.streams.length);
            };

            const pipeStream = (stream) => {
                this[OUT].setMaxListeners(this.streams.length);
                stream.pipe(this[OUT], {end: false});
            };

            this.on("add", pipeStream);
            this.on("remove", unpipeStream);

            this.streams.forEach(pipeStream);

            this.on("empty", () => this[OUT].end());

            return this[OUT];
        }

        return mergesortStream(this, comparator, 0, ClassType);
    }

    /**
     * Adds a stream to the MultiStream
     *
     * If the stream was muxed, filtered or mapped, this stream will undergo the
     * same transforms and conditions as if it was added in constructor.
     *
     * @meta.noReadme
     * @param {Readable} stream [description]
     *
     * @test test/methods/multi-stream-add.js
     */
    add(stream) {

        if (stream) {
            this.streams.push(stream);
            this.setMaxListeners(this.streams.length + EventEmitter.defaultMaxListeners);
            this.emit("add", stream, this.streams.length - 1);
            stream.on("end", () => this.remove(stream));
        }

        return this;
    }

    /**
     * Removes a stream from the MultiStream
     *
     * If the stream was muxed, filtered or mapped, it will be removed from same
     * streams.
     *
     * @meta.noReadme
     * @param {Readable} stream [description]
     *
     * @test test/methods/multi-stream-remove.js
     */
    remove(stream) {

        const strIndex = this.streams.indexOf(stream);
        if (strIndex >= 0) {
            this.setMaxListeners(this.streams.length + EventEmitter.defaultMaxListeners);
            this.streams.splice(strIndex, 1);
            this.emit("remove", stream, strIndex);
        }

        this._checkEmpty();

        return this;
    }

    _checkEmpty(ended) {
        if (ended) this.source = null;
        if (!this.source && !this.streams.length) this.emit("empty");
    }

}

module.exports = MultiStream;


/***/ }),

/***/ 6428:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/** @ignore */
const scramjet = __nccwpck_require__(4238);

/** @ignore */
const SPLIT_LINE = /\r\n?|\n/g;

/**
 * A stream of string objects for further transformation on top of DataStream.
 *
 * Example:
 *
 * ```js
 * StringStream.from(async () => (await fetch('https://example.com/data/article.txt')).text())
 *     .lines()
 *     .append("\r\n")
 *     .pipe(fs.createWriteStream('./path/to/file.txt'))
 * ```
 * @extends DataStream
 * @memberof module:scramjet.
 * @scope public
 */
class StringStream extends scramjet.DataStream {

    /**
     * Constructs the stream with the given encoding
     *
     * @param  {string} [encoding="utf-8"] the encoding to use
     * @param  {DataStreamOptions} [options={}] the encoding to use
     * @return {StringStream}  the created data stream
     *
     * @test test/methods/string-stream-constructor.js
     */
    constructor(encoding, options) {
        super(typeof encoding === "string" ? options : encoding);

        this.buffer = "";
        this.encoding = typeof encoding === "string" ? encoding : "utf8";
    }

    /**
     * @callback ShiftStringCallback
     * @memberof module:scramjet~
     * @param {string|any} shifted Shifted chars
     */

    /**
     * Shifts given length of chars from the original stream
     *
     * Works the same way as {@see DataStream.shift}, but in this case extracts
     * the given number of characters.
     *
     * @chainable
     * @alias module:scramjet.StringStream#pop
     * @alias module:scramjet.StringStream#shift
     * @param {number} bytes The number of characters to shift.
     * @param {ShiftStringCallback} func Function that receives a string of shifted chars.
     *
     * @test test/methods/string-stream-shift.js
     */
    shift(bytes, func) {
        const ret = "";
        const str = this.tap()._selfInstance({
            referrer: this
        });
        let offs = 0;

        const chunkHandler = (chunk) => {
            const length = Math.min(bytes - offs, chunk.length);
            chunk.substr(0, length);
            offs += length;
            if (length >= bytes) {
                unHook()
                    .then(
                        () => {
                            str.write(chunk.slice(length));
                            this.pipe(str);
                        }
                    );
            }
        };

        const endHandler = (...args) => {
            if (ret.length < bytes) {
                unHook();
            }
            str.end(...args);
        };

        const errorHandler = str.emit.bind(str, "error");

        const unHook = () => {
            this.removeListener("data", chunkHandler);
            this.removeListener("end", endHandler);
            this.removeListener("error", errorHandler);
            return Promise.resolve(ret)
                .then(func);
        };


        this.on("data", chunkHandler);
        this.on("end", endHandler);
        this.on("error", errorHandler);

        return str;
    }

    /**
     * A handy split by line regex to quickly get a line-by-line stream
     */
    static get SPLIT_LINE() {
        return SPLIT_LINE;
    }

    /**
     * Splits the string stream by the specified RegExp or string
     *
     * @chainable
     * @param  {RegExp|string} splitter What to split by
     *
     * @test test/methods/string-stream-split.js
     */
    split(splitter) {
        if (splitter instanceof RegExp || typeof splitter === "string") {
            return this.tap().pipe(this._selfInstance({
                transform(chunk, encoding, callback) {
                    this.buffer += chunk.toString(this.encoding);
                    const newChunks = this.buffer.split(splitter);
                    while(newChunks.length > 1) {
                        this.push(newChunks.shift());
                    }
                    this.buffer = newChunks[0];
                    callback();
                },
                flush(callback) {
                    this.push(this.buffer);
                    this.buffer = "";
                    callback();
                },
                referrer: this
            }));
        } else if (splitter instanceof Function) {
            return this.tap().pipe(new (this.constructor)({
                transform: splitter,
                referrer: this
            }));
        }
    }

    /**
     * Finds matches in the string stream and streams the match results
     *
     * @chainable
     * @param  {RegExp} matcher A function that will be called for every
     *                             stream chunk.
     *
     * @test test/methods/string-stream-match.js
     */
    match(matcher) {
        if (matcher instanceof RegExp) {
            const replaceRegex = (matcher.source.search(/\((?!\?)/g) > -1) ?
                new RegExp("[\\s\\S]*?" + matcher.source, (matcher.ignoreCase ? "i" : "") + (matcher.multiline ? "m" : "") + (matcher.unicode ? "u" : "") + "g") :
                new RegExp("[\\s\\S]*?(" + matcher.source + ")", (matcher.ignoreCase ? "i" : "") + (matcher.multiline ? "m" : "") + (matcher.unicode ? "u" : "") + "g")
                ;

            return this.tap().pipe(this._selfInstance({
                transform(chunk, encoding, callback) {
                    this.buffer = (this.buffer || "") + chunk.toString("utf-8");
                    this.buffer = this.buffer.replace(replaceRegex, (...match) => {
                        this.push(match.slice(1, match.length - 2).join(""));
                        return "";
                    });

                    callback();
                },
                referrer: this
            }));

        }
        throw new Error("Matcher must be a RegExp!");
    }

    /**
     * Transforms the StringStream to BufferStream
     *
     * Creates a buffer stream from the given string stream. Still it returns a
     * DataStream derivative and isn't the typical node.js stream so you can do
     * all your transforms when you like.
     *
     * @meta.noReadme
     * @chainable
     * @return {BufferStream}  The converted stream.
     *
     * @test test/methods/string-stream-tobufferstream.js
     */
    toBufferStream() {
        return this.tap().map(
            (str) => Buffer.from(str, this.encoding),
            new scramjet.BufferStream({
                referrer: this
            })
        );
    }

    toStringStream(encoding) {
        if (encoding)
            return this.tap().pipe(this._selfInstance(encoding, {
                referrer: this
            }));
        else
            return this;
    }

    /**
     * @callback ParseCallback
     * @memberof module:scramjet~
     * @param {string} chunk the transformed chunk
     * @return {Promise<any>|any}  the promise should be resolved with the parsed object
     */

    /**
      * Parses every string to object
      *
      * The method MUST parse EVERY string into a single object, so the string
      * stream here should already be split.
      *
      * @chainable
      * @param  {ParseCallback} parser The transform function
      * @param {function(new:DataStream)} [StreamClass] the output stream class to return
      * @return {DataStream}  The parsed objects stream.
      *
      * @test test/methods/string-stream-parse.js
      */
    parse(parser, StreamClass = scramjet.DataStream) {
        return this.tap().map(parser, StreamClass);
    }

    /**
     * Alias for {@link StringStream#parse}
     * @memberof module:scramjet.StringStream#
     * @method toDataStream
     */

    /**
      * @meta.noReadme
      * @ignore
      */
    _transform(chunk, encoding, callback) {
        this.push(chunk.toString(this.encoding));
        return callback();
    }

    /**
     * Creates a StringStream and writes a specific string.
     *
     * @param  {string} stream   the string to push the your stream
     * @param  {string} encoding optional encoding
     * @return {StringStream}          new StringStream.
     */
    static fromString(stream, encoding) {
        const st =  new this(encoding || "utf-8");
        st.end(stream);
        return st;
    }

    /**
     * Creates a pipeline of streams and returns a scramjet stream.
     *
     * @see DataStream.pipeline
     * @static
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} readable the initial readable argument that is streamable by scramjet.from
     * @param {AsyncFunction|Function|Transform} transforms Transform functions (as in {@link DataStream..use}) or Transform streams (any number of these as consecutive arguments)
     *
     * @returns {StringStream} a new StringStream instance of the resulting pipeline
     */
    static pipeline(...args) {
        return scramjet.DataStream.pipeline.call(this, ...args);
    }

    /**
     * Create StringStream from anything.
     *
     * @see DataStream.from
     * @see module:scramjet.from
     *
     * @param {string|Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|Readable} source argument to be turned into new stream
     * @param {DataStreamOptions|Writable} [options={}]
     * @return {StringStream}          new StringStream.
     */
    static from(source, options, ...args) {
        try {
            return scramjet.DataStream.from.call(this, source, options, ...args);
        } catch(e) {
            if (typeof source === "string") {
                return this.fromString(source);
            }
            throw e;
        }
    }

}

/**
 * @ignore
 */
StringStream.prototype.pop = StringStream.prototype.shift;

module.exports = StringStream;


/***/ }),

/***/ 1720:
/***/ ((module) => {

// eslint-disable-next-line node/no-unsupported-features/es-syntax
module.exports = Object.getPrototypeOf(async function*(){}).constructor;


/***/ }),

/***/ 658:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const DataStream = __nccwpck_require__(4238).DataStream;
const DefaultBufferLength = 16;

const wrapComparator = (comparator) => (a, b) => comparator(a[0], b[0]);
const DefaultComparator = (a, b) => {
    if (a < b) return -1;
    if (b < a) return 1;
    return 0;
};

module.exports = (multi, passedComparator, bufferLength, Clazz) => {

    bufferLength = bufferLength || DefaultBufferLength;

    Clazz = Clazz || DataStream;

    const comparator = wrapComparator(passedComparator || DefaultComparator);

    const out = new Clazz();
    const readIndex = new Map();
    const endIndex = new WeakMap();

    const rest = [];

    const onceTouchedStream = (stream) => {
        return Promise.race([
            new Promise((res) => stream.on("readable", res)),
            endIndex.get(stream)
        ]);
    };

    const getMoreItemsForEntry = (stream, arr) => {
        while (arr.length < bufferLength) {
            let haveMore = stream.read();

            if (haveMore !== null)
                arr.push(haveMore);
            else
                break;
        }

        if (arr.length || !readIndex.has(stream))
            return Promise.resolve(arr);

        return onceTouchedStream(stream)
            .then(
                () => getMoreItemsForEntry(stream, arr),
                () => Promise.resolve(arr)
            );
    };

    const getMoreItems = () => {
        const ret = [];
        for (let entry of readIndex.entries()) {
            ret.push(getMoreItemsForEntry(...entry));
        }

        if (!ret.length)
            return Promise.resolve([]);

        return Promise.all(ret);
    };

    // TODO: rewrite as generator?
    const getSorted = (inArys) => {
        const arr = [];
        const arys = inArys.slice();

        let min_length = 0;
        let j = 0;

        if (rest.length) {
            arys.push(rest);
        }

        if (!arys.length)
            return [];

        while (true) {  // eslint-disable-line
            let cnt = 0;

            for (let ary of arys)
                cnt += ary.length > j;

            if (cnt === arys.length) {
                for (let i = 0; i < arys.length; i++) {
                    arr.push([arys[i][j], i, j, arys[i].length - j - 1]);
                }
                min_length = ++j;
            } else {
                break;
            }
        }

        arr.sort(comparator);

        const ret = [];
        while (min_length > 0 && arr.length > 0) {

            const item = arr.shift();
            arys[item[1]].shift(item[2]);
            ret.push(item[0]);
            min_length = item[3];
        }

        return ret;
    };

    const writeSorted = (sorted) => {
        let ret = true;

        for (var i = 0; i < sorted.length; i++) {
            ret = out.write(sorted[i]);
        }

        return ret || new Promise((res) => out.once("drain", () => res(sorted.end)));
    };

    let removing = null;
    let pushing = null;
    const pushMoreItems = () => {

        if (pushing)
            return pushing;

        pushing =
            getMoreItems()
                .then(
                    (arys) => getSorted(arys)
                )
                .then(
                    writeSorted
                )
                .catch(
                    (e) => e instanceof Error ? out.emit("error", e) : (pushing = null, Promise.resolve())
                )
                .then(
                    () => {
                        pushing = null;

                        if (readIndex.size) {
                            pushMoreItems();
                        } else if (rest.length) {
                            return writeSorted(rest.sort(passedComparator));
                        }
                    }
                );

        return pushing;
    };

    const onEmpty = () => {
        return Promise.resolve(pushing)
            .then(() => out.end());
    };

    multi.each(
        (addedStream) => {
            const endPromise = new Promise(
                (res, rej) => addedStream.on("end", () => {
                    multi.remove(addedStream);
                    rej();
                })
            );

            endPromise.catch(() => 0);

            readIndex.set(addedStream, []);
            endIndex.set(
                addedStream,
                endPromise
            );
        },
        (removedStream) => {
            removing = Promise.all([
                getMoreItemsForEntry(removedStream, readIndex.get(removedStream))
                    .then(
                        (items) => {
                            readIndex.delete(removedStream);
                            rest.push(...items);
                        }
                    ),
                removing
            ]).then(
                () => readIndex.size ? pushMoreItems() : onEmpty()
            );
        }
    ).then(
        pushMoreItems
    ).catch(
        e => out.emit("error", e)
    );

    return out;
};


/***/ }),

/***/ 1057:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { StreamError } = __nccwpck_require__(7532);

/**
 * Generate read methods on the stream class.
 *
 * @internal
 * @param  {DataStreamOptions} newOptions Sanitized options passed to scramjet stream
 * @return {Boolean} returns true if creation of new stream is not necessary (promise can be pushed to queue)
 */
module.exports = () => function mkRead(newOptions) {
    this.setOptions(
        {
            // transforms: [],
            promiseRead: newOptions.promiseRead
        }
    );

    let chunks = [];
    let done = false;
    // TODO: implement the actual parallel logic - items can be promises and should be flushed when resolved.
    const pushSome = () => Array.prototype.findIndex.call(chunks, chunk => {
        return !this.push(chunk);
    }) + 1;

    // let last = Promise.resolve();
    // let processing = [];

    this.on("pipe", () => {
        throw new Error("Cannot pipe to a Readable stream");
    });

    this._read = async (size) => {
        try {
            let add = 0;
            if (!done) {
                const nw = await this._options.promiseRead(size);
                chunks.push(...nw);
                add = nw.length;
            }
            const pushed = pushSome();
            chunks = chunks.slice(pushed || Infinity);

            // Yes, it could be reassigned, but only with true so we don't need to care
            // eslint-disable-next-line require-atomic-updates
            done = done || !add;

            if (done && !chunks.length) {
                await new Promise((res, rej) => this._flush((err) => err ? rej(err) : res()));
                this.push(null);
            }

            // console.log("read", pushed, chunks, add, size);
            // TODO: check for existence of transforms and push to transform directly.
            // TODO: but in both cases transform methods must be there... which aren't there now.
            // TODO: at least the subset that makes the transform - yes, otherwise all that transform stuff
            // TODO: is useless and can be bypassed...
        } catch(e) {
            await this.raise(new StreamError(e, this));
            return this._read(size);
        }
    };

};


/***/ }),

/***/ 7600:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const ignore = () => 0;
const { StreamError } = __nccwpck_require__(7532);


/**
 * Generate transform methods on the stream class.
 *
 * @internal
 * @memberof PromiseTransformStream
 * @param  {DataStreamOptions} newOptions Sanitized options passed to scramjet stream
 * @return {Boolean} returns true if creation of new stream is not necessary (promise can be pushed to queue)
 */
module.exports = ({filter}) => function mkTransform(newOptions) {
    this.setOptions(
        {
            transforms: [],
            beforeTransform: newOptions.beforeTransform,
            afterTransform: newOptions.afterTransform,
            promiseFlush: newOptions.promiseFlush
        }
    );

    this.cork();
    if (newOptions.referrer instanceof this.constructor && !newOptions.referrer._tapped && !newOptions.referrer._options.promiseFlush) {
        return true;
    }

    process.nextTick(this.uncork.bind(this));

    this.pushTransform(newOptions);

    if (this._scramjet_options.transforms.length) {

        const processing = [];
        let last = Promise.resolve();

        this._transform = (chunk, encoding, callback) => {
            if (!this._scramjet_options.transforms.length) {
                return last.then(
                    () => callback(null, chunk)
                );
            }

            const prev = last;
            const ref = last = Promise
                .all([
                    this._scramjet_options.transforms.reduce(
                        (prev, transform) => prev.then(transform),
                        Promise.resolve(chunk)
                    ).catch(
                        (err) => err === filter ? filter : Promise.reject(err)
                    ),
                    prev
                ])
                .catch(
                    async (e) => {
                        if (e instanceof Error) {
                            return Promise.all([
                                this.raise(new StreamError(e, this, "EXTERNAL", chunk), chunk),
                                prev
                            ]);
                        } else {
                            throw new Error("New stream error raised without cause!");
                        }
                    }
                )
                .then(
                    (args) => {
                        if (args && args[0] !== filter && typeof args[0] !== "undefined") {
                            try {
                                this.push(args[0]);
                            } catch(e) {
                                return this.raise(new StreamError(e, this, "INTERNAL", chunk), chunk);
                            }
                        }
                    }
                );

            processing.push(ref);   // append item to queue
            if (processing.length >= this._options.maxParallel) {
                processing[processing.length - this._options.maxParallel]
                    .then(() => callback())
                    .catch(ignore);
            } else {
                callback();
            }

            ref.then(
                () => {
                    const next = processing.shift();
                    return ref !== next && this.raise(new StreamError(new Error(`Promise resolved out of sequence in ${this.name}!`), this, "TRANSFORM_OUT_OF_SEQ", chunk), chunk);
                }
            );

        };

        this._flush = (callback) => {
            if (this._scramjet_options.runFlush) {
                last
                    .then(this._scramjet_options.runFlush)
                    .then(
                        (data) => {
                            if (Array.isArray(data))
                                data.forEach(item => this.push(item));
                            else if (data)
                                this.push(data);
                        },
                        e => this.raise(e)
                    )
                    .then(() => callback());
            } else {
                last.then(() => callback());
            }
        };
    }
};


/***/ }),

/***/ 7087:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { StreamError } = __nccwpck_require__(7532);

/**
 * Generate write methods on the stream class.
 *
 * @internal
 * @param  {DataStreamOptions} newOptions Sanitized options passed to scramjet stream
 * @return {Boolean} returns true if creation of new stream is not necessary (promise can be pushed to queue)
 */
module.exports = () => function mkWrite(newOptions) {
    this.tap().setOptions(
        {
            // transforms: [],
            promiseWrite: newOptions.promiseWrite
        }
    );

    this.pipe = () => {
        throw new Error("Method not allowed on a Writable only stream");
    };

    this._write = (chunk, encoding, callback) => {
        Promise.resolve(chunk)
            .then((chunk) => this._options.promiseWrite(chunk, encoding))
            .then(() => callback())
            .catch(
                (e) => this.raise(new StreamError(e, this, "EXTERNAL", chunk), chunk)
            );
    };

};


/***/ }),

/***/ 2650:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const { EventEmitter } = __nccwpck_require__(8614);
const _declarations = Symbol("declarations");
const _values = Symbol("values");
const _chain = Symbol("chain");
const _owner = Symbol("owner");

const isClass = cls => cls && typeof cls === "function" && cls.prototype.constructor === cls && cls !== Object;
const _superClass = (cls) => {
    return isClass(cls) && cls.prototype.__proto__ && cls.prototype.__proto__.constructor;
};

const inheritedProxy = (parent) => {
    return new Proxy({}, {
        has(target, prop) {
            return prop in target || parent && prop in parent;
        },
        get(target, prop) {
            if (prop in target)
                return target[prop];

            return parent && parent[prop];
        },
        set(target, prop, value) {
            if (prop in target)
                throw new Error(`Option "${prop}" already defined`);

            target[prop] = value;
            return true;
        }
    });
};

const findProxyForInstance = (ref, instance) => {
    return findProxyForClass(ref.__proto__.constructor[_declarations], instance.__proto__.constructor);
};

const findProxyForClass = (map, cls) => {
    if (!isClass(cls)) {
        throw new Error("Cannot get options declaration for a non-constructor");
    }

    if (map.has(cls))
        return map.get(cls);

    const superClass = _superClass(cls);
    const parent = isClass(superClass) ? findProxyForClass(map, superClass) : null;

    const declaration = inheritedProxy(parent);
    map.set(cls, declaration);

    return declaration;
};

const DefaultDefinition = {};

/**
 * Scramjet options for streams
 */
module.exports = class ScramjetOptions extends EventEmitter {
    /**
     *
     * @param {PromiseTransformStream} owner
     * @param {ScramjetOptions} chain
     */
    constructor(owner, chain, initial) {
        super();
        this[_owner] = owner;
        this[_chain] = chain;
        this[_declarations] = findProxyForInstance(this, owner);
        this[_values] = {};
        Object.assign(this[_values], initial);
    }

    get proxy() {
        const value = new Proxy(this, {
            has(target, key) {
                if (!(key in target[_declarations]))
                    return false;
                return key in target[_values] || target[_declarations][key].value;
            },
            ownKeys(target) {
                return Object.keys(target[_values]);
            },
            getOwnPropertyDescriptor(target, key) {
                if (key in target[_values]) {
                    return {
                        value: this.get(target, key),
                        enumerable: true,
                        configurable: true,
                        writable: true
                    };
                }
            },
            get(target, key) {
                if (key in target[_declarations]) {
                    if (key in target[_values])
                        return target[_values][key];

                    if (target[_chain] && target[_declarations][key].chained && Object.prototype.hasOwnProperty.call(target[_chain], key))
                        return target[_chain][key];

                    return target[_declarations][key].value;
                }

                throw new Error(`Attempting to access undeclared option: ${key}`);
            },
            set(target, key, value) {
                if (key in target[_declarations]) {
                    target[_values][key] = value;
                    return;
                }

                throw new Error(`Attempting to set undeclared option: ${key}`);
            }
        });

        Object.defineProperty(this, "proxy", { value });
        return value;
    }

    /**
     * Declares a usable option.
     *
     * @param {Function<PromiseTransformStream>} cls
     * @param {string} name
     * @param {object} definition
     */
    static declare(cls, name, { chained = false, value } = DefaultDefinition) {
        this[_declarations] = this[_declarations] || new Map();
        const optionsList = findProxyForClass(this[_declarations], cls);

        optionsList[name] = { chained, value };
    }
};


/***/ }),

/***/ 9421:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {Transform, Readable} = __nccwpck_require__(2413);
const {EventEmitter} = __nccwpck_require__(8614);
const DefaultHighWaterMark = __nccwpck_require__(2087).cpus().length * 2;

const filter = Symbol("FILTER");
const plgctor = Symbol("plgctor");
const storector = Symbol("storector");

let seq = 0;

const shared = { filter, DefaultHighWaterMark, plgctor, storector };
const mkTransform = __nccwpck_require__(7600)(shared);
const mkRead = __nccwpck_require__(1057)(shared);
const mkWrite = __nccwpck_require__(7087)(shared);
const {StreamError} = __nccwpck_require__(7532);

const rename = (ob, fr, to) => {
    if (ob[fr]) {
        ob[to] = ob[fr];
        delete ob[fr];
    }
};

const checkOptions = (options) => {
    rename(options, "parallelRead", "promiseRead");
    rename(options, "parallelWrite", "promiseWrite");
    rename(options, "parallelTransform", "promiseTransform");
    rename(options, "flushPromise", "promiseFlush");

    if (["promiseRead", "promiseWrite", "promiseTransform"].reduce((acc, key) => acc += (options[key] ? 1 : 0), 0) > 1)
        throw new Error("Scramjet stream can be either Read, Write or Transform");
};

/**
 * This class is an underlying class for all Scramjet streams.
 *
 * It allows creation of simple transform streams that use async functions for transforms, reading or writing.
 *
 * @internal
 * @extends stream.PassThrough
 */
class PromiseTransformStream extends Transform {

    constructor(options) {
        options = options || {};
        const newOptions = Object.assign({
            objectMode: true,
            promiseRead: null,
            promiseWrite: null,
            promiseTransform: null,
            promiseFlush: null,
            beforeTransform: null,
            afterTransform: null
        }, options);

        checkOptions(newOptions);

        super(newOptions);

        this._tapped = false;

        this._error_handlers = [];
        this._scramjet_options = {
            referrer: options.referrer,
            constructed: (new Error().stack)
        };

        this.seq = seq++;

        this.setMaxListeners(DefaultHighWaterMark);
        this.setOptions(newOptions);

        if (newOptions.promiseRead) {
            this.type = "Read";
            mkRead.call(this, newOptions);
            this.tap();
        } else if (newOptions.promiseWrite) {
            this.type = "Write";
            mkWrite.call(this, newOptions);
        } else if (newOptions.transform || !newOptions.promiseTransform) {
            this.type = "Transform-";
            this.tap();
        } else {
            this.type = "Transform";
            if (newOptions.promiseTransform && mkTransform.call(this, newOptions)) { // returns true if transform can be pushed to referring stream
                return options.referrer.pushTransform(options);
            }
        }

        const pluginConstructors = this.constructor[plgctor].get();
        if (pluginConstructors.length) {

            let ret;
            pluginConstructors.find(
                (Ctor) => ret = Ctor.call(this, options)
            );

            if (typeof ret !== "undefined") {
                return ret;
            }
        }
    }

    get name() {
        return `${this.constructor.name}(${this._options.name || this.seq})`;
    }

    set name(name) {
        this.setOptions({name});
    }

    get constructed() {
        return this._scramjet_options.constructed;
    }

    get _options() {
        if (this._scramjet_options.referrer && this._scramjet_options.referrer !== this) {
            return Object.assign({maxParallel: DefaultHighWaterMark}, this._scramjet_options.referrer._options, this._scramjet_options);
        }
        return Object.assign({maxParallel: DefaultHighWaterMark}, this._scramjet_options);
    }

    setOptions(...options) {
        Object.assign(this._scramjet_options, ...options);

        if (this._scramjet_options.maxParallel)
            this.setMaxListeners(this._scramjet_options.maxParallel);

        if (this._flushed) {
            options.forEach(
                ({promiseFlush}) => Promise
                    .resolve()
                    .then(promiseFlush)
                    .catch(e => this.raise(e))
            );
        }

        return this;
    }

    setMaxListeners(value) {
        return super.setMaxListeners.call(this, value + EventEmitter.defaultMaxListeners);
    }

    static get [plgctor]() {
        const proto = Object.getPrototypeOf(this);
        return {
            ctors: this[storector] = Object.prototype.hasOwnProperty.call(this, storector) ? this[storector] : [],
            get: () => proto[plgctor] ? proto[plgctor].get().concat(this[storector]) : this[storector]
        };
    }

    async whenRead(count) {
        return Promise.race([
            new Promise((res) => {

                const read = () => {
                    const ret = this.read(count);
                    if (ret !== null) {
                        return res(ret);
                    } else {
                        this.once("readable", read);
                    }
                };
                read();
            }),
            this.whenError(),
            this.whenEnd()
        ]);
    }

    async whenDrained() {
        return this._scramjet_drainPromise || (this._scramjet_drainPromise = new Promise(
            (res, rej) => this
                .once("drain", () => {
                    this._scramjet_drainPromise = null;
                    res();
                })
                .whenError().then(rej)
        ));
    }

    async whenWrote(...data) {
        let ret;
        for (var item of data)
            ret = this.write(item);

        if (ret) {
            return;
        } else {
            return this.whenDrained();
        }
    }

    async whenError() {
        return this._scramjet_errPromise || (this._scramjet_errPromise = new Promise((res) => {
            this.once("error", (e) => {
                this._scramjet_errPromise = null;
                res(e);
            });
        }));
    }

    async whenEnd() {
        return this._scramjet_endPromise || (this._scramjet_endPromise = new Promise((res, rej) => {
            this.whenError().then(rej);
            this.on("end", () => res());
        }));
    }

    async whenFinished() {
        return this._scramjet_finishPromise || (this._scramjet_finishPromise = new Promise((res, rej) => {
            this.whenError().then(rej);
            this.on("finish", () => res());
        }));
    }

    catch(callback) {
        this._error_handlers.push(callback);
        return this;
    }

    async raise(err, ...args) {
        return this._error_handlers
            .reduce(
                (promise, handler) => promise.catch(
                    (lastError) => handler(
                        lastError instanceof StreamError
                            ? lastError
                            : new StreamError(lastError, this, err.code, err.chunk),
                        ...args
                    )
                ),
                Promise.reject(err)
            )
            .catch(
                (err) => this.emit("error", err, ...args)
            );
    }

    pipe(to, options) {
        if (to === this) {
            return this;
        }

        if (this !== to && to instanceof PromiseTransformStream) {
            to.setOptions({referrer: this});
            this.on("error", err => to.raise(err));
            this.tap().catch(async (err, ...args) => {
                await to.raise(err, ...args);
                return filter;
            });
        } else if (to instanceof Readable) {
            this.on("error", (...err) => to.emit("error", ...err));
        }

        return super.pipe(to, options || {end: true});
    }

    graph(func) {
        let referrer = this;
        const ret = [];
        while(referrer) {
            ret.push(referrer);
            referrer = referrer._options.referrer;
        }
        func(ret);
        return this;
    }

    tap() {
        this._tapped = true;
        return this;
    }

    dropTransform(transform) {
        if (!this._scramjet_options.transforms) {
            if (!this._transform.currentTransform)
                return this;

            this._transform = this._transform.currentTransform;
            return this;
        }
        let i = 0;
        while (i++ < 1000) {
            const x = this._scramjet_options.transforms.findIndex(t => t.ref === transform);
            if (x > -1) {
                this._scramjet_options.transforms.splice(x, 1);
            } else {
                return this;
            }
        }
        throw new Error("Maximum remove attempt count reached!");
    }

    pushTransform(options) {

        if (typeof options.promiseTransform === "function") {
            if (!this._scramjet_options.transforms) {
                this._pushedTransform = options.promiseTransform;
                return this;
            }

            const markTransform = (bound) => {
                bound.ref = options.promiseTransform;
                return bound;
            };

            const before = typeof options.beforeTransform === "function";
            const after = typeof options.afterTransform === "function";

            if (before)
                this._scramjet_options.transforms.push(markTransform(
                    options.beforeTransform.bind(this)
                ));

            if (after)
                this._scramjet_options.transforms.push(markTransform(
                    async (chunk) => options.afterTransform.call(
                        this,
                        chunk,
                        await options.promiseTransform.call(this, chunk)
                    )
                ));
            else
                this._scramjet_options.transforms.push(markTransform(
                    options.promiseTransform.bind(this)
                ));

        }

        if (typeof options.promiseFlush === "function") {
            if (this._scramjet_options.runFlush) {
                throw new Error("Promised Flush cannot be overwritten!");
            } else {
                this._scramjet_options.runFlush = options.promiseFlush;
            }
        }

        return this;
    }

    _selfInstance(...args) {
        return new this.constructor(...args);
    }

    async _transform(chunk, encoding, callback) {
        if (!this._delayed_first) {
            await new Promise(res => res());
            this._delayed_first = 1;
        }

        try {
            if (this._pushedTransform)
                chunk = await this._pushedTransform(chunk);
            callback(null, chunk);
        } catch(err) {
            callback(err);
        }
    }

    _flush(callback) {
        const last = Promise.resolve();

        if (this._scramjet_options.runFlush) {
            last
                .then(this._scramjet_options.runFlush)
                .then(
                    (data) => {
                        if (Array.isArray(data))
                            data.forEach(item => this.push(item));
                        else if (data)
                            this.push(data);

                        callback();
                    },
                    e => this.raise(e)
                );
        } else {
            last.then(() => callback());
        }
    }

    static get filter() { return filter; }
}

module.exports = {
    plgctor: plgctor,
    PromiseTransformStream
};


/***/ }),

/***/ 7532:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const os = __nccwpck_require__(2087);
const combineStack = (stack, ...errors) => {
    return errors.reduce(
        (stack, trace) => {
            if (!trace) return stack;
            if (trace.indexOf("\n") >= 0)
                return stack + os.EOL + trace.substr(trace.indexOf("\n") + 1);

            else
                return stack + os.EOL + trace;
        },
        stack
    );
};

class StreamError extends Error {

    constructor(cause, stream, code = "GENERAL", chunk = null) {
        code = cause.code || code;
        stream = cause.stream || stream;
        chunk = cause.chunk || chunk;

        super(cause.message);

        if (cause instanceof StreamError)
            return cause;

        this.chunk = chunk;
        this.stream = stream;
        this.code = "ERR_SCRAMJET_" + code;
        this.cause = cause;

        const stack = this.stack;
        Object.defineProperty(this, "stack", {
            get: function () {
                return combineStack(
                    stack,
                    "  caused by:",
                    cause.stack,
                    `  --- raised in ${stream.name} constructed ---`,
                    stream.constructed
                );
            }
        });

        /** Needed to fix babel errors. */
        this.constructor = StreamError;
        this.__proto__ = StreamError.prototype;
    }

}

/**
 * Stream errors class
 *
 * @module scramjet/errors
 * @prop {Class<StreamError>} StreamError
 * @prop {Function} combineStack
 */
module.exports = {StreamError, combineStack};


/***/ }),

/***/ 8603:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {dirname, resolve} = __nccwpck_require__(5622);

/** @ignore */
const getCalleeDirname = function(depth) {
    const p = Error.prepareStackTrace;
    Error.prepareStackTrace = (dummy, stack) => stack;
    const e = new Error();
    Error.captureStackTrace(e, arguments.callee);
    const stack = e.stack;
    Error.prepareStackTrace = p;
    return dirname(stack[depth].getFileName());
};

const resolveCalleeRelative = function(depth, ...relatives) {
    return resolve(getCalleeDirname(depth + 1), ...relatives);
};

/** @ignore */
const resolveCalleeBlackboxed = function() {
    const p = Error.prepareStackTrace;
    Error.prepareStackTrace = (dummy, stack) => stack;
    const e = new Error();
    Error.captureStackTrace(e, arguments.callee);
    const stack = e.stack;
    Error.prepareStackTrace = p;

    let pos = stack.find(entry => entry.getFileName().indexOf(resolve(__dirname, "..")) === -1);

    return resolve(dirname(pos.getFileName()), ...arguments);
};

/**
 * @external AsyncGeneratorFunction
 */
let AsyncGeneratorFunction = function() {};
try {
    AsyncGeneratorFunction = __nccwpck_require__(1720);
} catch (e) {} // eslint-disable-line

/**
 * @external GeneratorFunction
 */
const GeneratorFunction = Object.getPrototypeOf(function*(){}).constructor;

/** @ignore */
const pipeIfTarget = (stream, target) => (target ? stream.pipe(target) : stream);

/** @ignore */
const pipeThen = async (func, target) => Promise
    .resolve()
    .then(func)
    .then(x => x.pipe(target))
    .catch(e => target.raise(e));

/**
 * @external stream.PassThrough
 * @see https://nodejs.org/api/stream.html#stream_class_stream_passthrough
 */

module.exports = {
    AsyncGeneratorFunction,
    GeneratorFunction,
    getCalleeDirname,
    resolveCalleeRelative,
    resolveCalleeBlackboxed,
    pipeIfTarget,
    pipeThen
};


/***/ }),

/***/ 3946:
/***/ ((module) => {

module.exports = {};


/***/ }),

/***/ 9738:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const scramjet = __nccwpck_require__(8750);
const { PromiseTransformStream, StringStream, DataStream, MultiStream } = scramjet;
const { EventEmitter } = __nccwpck_require__(8614);
const { ReReadable } = __nccwpck_require__(2582);
const { AsyncGeneratorFunction, GeneratorFunction } = __nccwpck_require__(8603);

const os = __nccwpck_require__(2087);
const path = __nccwpck_require__(5622);

/** @ignore */
const {getCalleeDirname} = __nccwpck_require__(8603);

module.exports = {

    constructor() {
        this.TimeSource = Date;
        this.setTimeout = setTimeout;
        this.clearTimeout = clearTimeout;

        this.buffer = null;
    },

    /**
     * Pulls in any readable stream, resolves when the pulled stream ends.
     *
     * You can also pass anything that can be passed to `DataStream.from`.
     *
     * Does not preserve order, does not end this stream.
     *
     * @async
     * @memberof module:scramjet.DataStream#
     * @param {Array|Iterable<any>|AsyncGeneratorFunction|GeneratorFunction|AsyncFunction|Function|string|Readable} pullable
     * @param {any[]} ...args any additional args
     * @returns {Promise<any>} resolved when incoming stream ends, rejects on incoming error
     *
     * @test test/methods/data-stream-pull.js
     */
    async pull(pullable, ...args) {
        return new Promise((res, rej) => {
            const incoming = this.constructor.from(pullable, {}, ...args);

            incoming.pipe(this, { end: false });
            incoming.on("end", res);
            incoming.on("error", rej);
        });
    },

    /**
     * Shift Function
     *
     * @callback ShiftCallback
     * @memberof module:scramjet~
     * @param {Array<object>|any} shifted an array of shifted chunks
     */

    /**
     * Shifts the first n items from the stream and pushes out the remaining ones.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {number} count The number of items to shift.
     * @param {ShiftCallback} func Function that receives an array of shifted items
     *
     * @test test/methods/data-stream-shift.js
     */
    shift(count, func) {
        const ret = [];
        const str = this.tap()._selfInstance({referrer: this});

        const chunkHandler = (chunk) => {
            ret.push(chunk);
            if (ret.length >= count) {
                this.pause();
                unHook().then(
                    () => this.resume().pipe(str)
                );
            }
        };

        const endHandler = (...args) => {
            unHook().then(
                () => str.end(...args)
            );
        };

        const errorHandler = str.emit.bind(str, "error");

        let hooked = true;
        const unHook = () => {
            if (hooked) {
                hooked = false;
                this.removeListener("data", chunkHandler);
                this.removeListener("end", endHandler);
                this.removeListener("error", errorHandler);
            }
            return Promise.resolve(ret)
                .then(func);
        };

        this.on("data", chunkHandler);
        this.on("end", endHandler);
        this.on("error", errorHandler);

        return str;
    },

    /**
     * Allows previewing some of the streams data without removing them from the stream.
     *
     * Important: Peek does not resume the flow.
     *
     * @memberof module:scramjet.DataStream#
     * @param  {number} count The number of items to view before
     * @param  {ShiftCallback} func Function called before other streams
     * @chainable
     */
    peek(count, func) {
        const ref = this._selfInstance({referrer: this});

        this
            .tap()
            .pipe(ref)
            .shift(count, batch => {
                this.unpipe(ref);
                return func(batch);
            });

        return this;
    },

    /**
     * Slices out a part of the stream to the passed Function.
     *
     * Returns a stream consisting of an array of items with `0` to `start`
     * omitted and `length` items after `start` included. Works similarly to
     * Array.prototype.slice.
     *
     * Takes count from the moment it's called. Any previous items will not be
     * taken into account.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {number} [start=0] omit this number of entries.
     * @param {number} [length=Infinity] get this number of entries to the resulting stream
     *
     * @test test/methods/data-stream-slice.js
     */
    slice(start = 0, length = Infinity) {
        let n = 0;

        let stream = this;
        if (start > 0) {
            stream = this.shift(start, () => 0);
        }

        if (length === Infinity) {
            return this;
        }

        return stream.until(() => n++ >= length);
    },

    /**
     * Transforms stream objects by assigning the properties from the returned
     * data along with data from original ones.
     *
     * The original objects are unaltered.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {MapCallback|object} func The function that returns new object properties or just the new properties
     *
     * @test test/methods/data-stream-assign.js
     */
    assign(func) {
        if (typeof func === "function") {
            return this.map(
                (chunk) => Promise.resolve(func(chunk))
                    .then(obj => Object.assign({}, chunk, obj))
            );
        } else {
            return this.map(
                (chunk) => Object.assign({}, chunk, func)
            );
        }
    },

    /**
     * Called only before the stream ends without passing any items
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {Function} callback Function called when stream ends
     *
     * @test test/methods/data-stream-empty.js
     */
    empty(callback) {
        let z = false;
        const promiseTransform = () => {
            z = true;
            this.dropTransform(promiseTransform);
        };

        this.pushTransform({promiseTransform})
            .tap()
            .whenEnd()
            .then(
                () => (z || Promise.resolve().then(callback)),
                () => 0
            );

        return this;
    },


    /**
     * Pushes any data at call time (essentially at the beginning of the stream)
     *
     * This is a synchronous only function.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {any[]} ...item list of items to unshift (you can pass more items)
     */
    unshift(...items) {
        items.forEach(
            item => this.write(item)
        );
        return this.tap();
    },

    /**
     * Pushes any data at end of stream
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {*} item list of items to push at end
     * @meta.noreadme
     *
     * @test test/methods/data-stream-endwith.js
     */
    endWith(...items) {
        // TODO: overhead on unneeded transform, but requires changes in core.
        // TODO: should accept similar args as `from`
        return this.pipe(this._selfInstance({
            referrer: this,
            promiseTransform: (a) => a,
            flushPromise: () => items
        }));
    },

    /**
     * Accumulates data into the object.
     *
     * Works very similarly to reduce, but result of previous operations have
     * no influence over the accumulator in the next one.
     *
     * Method works in parallel.
     *
     * @async
     * @memberof module:scramjet.DataStream#
     * @param  {AccumulateCallback} func The accumulation function
     * @param  {*} into Accumulator object
     * @return {Promise<any>}  resolved with the "into" object on stream end.
     * @meta.noreadme
     *
     * @test test/methods/data-stream-accumulate.js
     */
    async accumulate(func, into) {
        return new Promise((res, rej) => {
            const bound = async (chunk) => (await func(into, chunk), Promise.reject(DataStream.filter));
            bound.to = func;

            this.tap().pipe(new PromiseTransformStream({
                promiseTransform: bound,
                referrer: this
            }))
                .on("end", () => res(into))
                .on("error", rej)
                .resume();
        });
    },

    /**
     * @callback AccumulateCallback
     * @memberof module:scramjet~
     * @param {*} accumulator Accumulator passed to accumulate function
     * @param {*} chunk the stream chunk
     * @return {Promise<any>|*} resolved when all operations are completed
     */

    /**
     * Consumes the stream by running each Function
     *
     * @deprecated use {@link DataStream#each} instead
     *
     * @async
     * @memberof module:scramjet.DataStream#
     * @param {ConsumeCallback|AsyncGeneratorFunction|GeneratorFunction} func the consument
     * @param {any[]} ...args additional args will be passed to generators
     * @meta.noreadme
     */
    async consume(func, ...args) {
        let runFunc = func;
        if (func instanceof GeneratorFunction || func instanceof AsyncGeneratorFunction) {
            const gen = await func(...args);
            await gen.next();
            runFunc = async item => {
                await gen.next(item);
            };
        }

        return this.tap()
            .do(runFunc)
            .resume()
            .whenEnd();
    },

    /**
     * @callback ConsumeCallback
     * @memberof module:scramjet~
     * @param {*} chunk the stream chunk
     * @return {Promise<any>|*} resolved when all operations are completed
     */

    /**
     * Reduces the stream into the given object, returning it immediately.
     *
     * The main difference to reduce is that only the first object will be
     * returned at once (however the method will be called with the previous
     * entry).
     * If the object is an instance of EventEmitter then it will propagate the
     * error from the previous stream.
     *
     * This method is serial - meaning that any processing on an entry will
     * occur only after the previous entry is fully processed. This does mean
     * it's much slower than parallel functions.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {ReduceCallback} func The into object will be passed as the first argument, the data object from the stream as the second.
     * @param  {*|EventEmitter} into Any object passed initially to the transform  function
     * @return {*} whatever was passed as into
     *
     * @test test/methods/data-stream-reduceNow.js
     */
    reduceNow(func, into) {
        const prm = this.reduce(func, into);

        if (into instanceof EventEmitter) {
            prm.catch((e) => into.emit("error", e));
        }

        return into;
    },

    /**
     * @callback RemapCallback
     * @memberof module:scramjet~
     * @param {Function} emit a method to emit objects in the remapped stream
     * @param {*} chunk the chunk from the original stream
     * @returns {Promise<any>|*} promise to be resolved when chunk has been processed
     */

    /**
     * Remaps the stream into a new stream.
     *
     * This means that every item may emit as many other items as we like.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {RemapCallback} func A Function that is called on every chunk
     * @param  {function(new:DataStream)} [ClassType=this.constructor] Optional DataStream subclass to be constructed
     *
     * @test test/methods/data-stream-remap.js
     */
    remap(func, ClassType = this.constructor) {

        const ref = new (ClassType || this.constructor)({referrer: this});

        return this.into(
            async (str, chunk) => {
                let out = [];
                await func((newChunk) => out.push(newChunk), chunk);

                let last = true;
                for (const val of out)
                    last = ref.write(val);

                return last ? null : ref.whenDrained();
            },
            ref
        );
    },

    /**
     * Takes any method that returns any iterable and flattens the result.
     *
     * The passed Function must return an iterable (otherwise an error will be emitted). The resulting stream will
     * consist of all the items of the returned iterables, one iterable after another.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {FlatMapCallback} func A Function that is called on every chunk
     * @param {function(new:DataStream)} [ClassType=this.constructor] Optional DataStream subclass to be constructed
     * @param {any[]} ...args additional args will be passed to generators
     *
     * @test test/methods/data-stream-flatmap.js
     */
    flatMap(func, ClassType, ...args) {
        if (typeof ClassType !== "function")
            ClassType = this.constructor;

        const ref = new ClassType({referrer: this});
        const iteratorSymbol = Symbol.asyncIterator;

        return this.into(
            async (ref, chunk) => {
                const out = await func(chunk, ...args);
                if (!out) {
                    throw new Error("Non iterable object returned for flatMap!");
                }

                if (iteratorSymbol && out[iteratorSymbol]) {
                    const iterator = out[iteratorSymbol]();
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const item = await iterator.next();
                        if (item.done) return;
                        if (!ref.write(item.value)) await ref.whenDrained();
                    }
                } else {
                    await ref.whenWrote(...out);
                }
            },
            ref
        );
    },

    /**
     * @callback FlatMapCallback
     * @memberof module:scramjet~
     * @param {*} chunk the chunk from the original stream
     * @returns {AsyncGenerator<any, void, any>|Promise<Iterable<any>>|Iterable<any>}  promise to be resolved when chunk has been processed
     */

    /**
     * A shorthand for streams of arrays or iterables to flatten them.
     *
     * More efficient equivalent of: `.flatmap(i => i);`
     * Works on streams of async iterables too.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @return {DataStream}
     *
     * @test test/methods/data-stream-flatten.js
     */
    flatten() {
        const iteratorSymbol = Symbol.asyncIterator;
        let wroteAll = Promise.resolve();

        return this.into(
            async (ref, chunk) => {
                const prevWrote = wroteAll;
                let res;
                wroteAll = new Promise(_res => res = _res);

                if (iteratorSymbol && chunk[iteratorSymbol]) {
                    const iterator = chunk[iteratorSymbol]();
                    await prevWrote;
                    // eslint-disable-next-line no-constant-condition
                    while (true) {
                        const item = await iterator.next();
                        
                        if (item.value && !ref.write(item.value)) await ref.whenDrained();
                        if (item.done) return res();
                    }
                } else {
                    let last = true;
                    await prevWrote;
                    for (const val of chunk) {
                        last = ref.write(val);
                        if (!last) await ref.whenDrained();
                    }
                    return res();
                }
            },
            this._selfInstance()
        );
    },

    /**
     * Returns a new stream that will append the passed streams to the callee
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {Readable[]} ...streams Streams to be injected into the current stream
     *
     * @test test/methods/data-stream-concat.js
     */
    concat(...streams) {
        const out = this._selfInstance({referrer: this});

        streams.unshift(this);

        const next = () => {
            if (streams.length)
                streams.shift()
                    .on("end", next)
                    .pipe(out, {end: !streams.length});
        };
        next();

        return out;
    },

    /**
     * @callback JoinCallback
     * @memberof module:scramjet~
     * @param {*} previous the chunk before
     * @param {*} next the chunk after
     * @returns {Promise<*>|*}  promise that is resolved with the joining item
     */

    /**
     * Method will put the passed object between items. It can also be a function call or generator / iterator.
     *
     * If a generator or iterator is passed, when the iteration is done no items will be interweaved.
     * Generator receives
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {*|AsyncGeneratorFunction|GeneratorFunction|JoinCallback} item An object that should be interweaved between stream items
     * @param {any[]} ...args additional args will be passed to generators
     *
     * @test test/methods/data-stream-join.js
     */
    join(item, ...args) {
        const ref = this._selfInstance({referrer: this});

        let prev;
        let consumer;
        if (typeof item !== "function") {
            consumer = (cur) => Promise.all([
                ref.whenWrote(item),
                ref.whenWrote(cur)
            ]);
        } else if (item instanceof GeneratorFunction || item instanceof AsyncGeneratorFunction) {
            const iterator = item(...args);
            consumer = cur => Promise.resolve()
                .then(() => iterator.next(prev))
                .then(({value, done}) => Promise.all([
                    !done && ref.whenWrote(value),
                    ref.whenWrote(prev = cur)
                ]))
            ;
        } else {
            consumer = cur =>
                Promise.resolve([prev, prev = cur])
                    .then(([prev, cur]) => item(prev, cur, ...args),)
                    .then(joint => Promise.all([
                        joint && ref.whenWrote(joint),
                        ref.whenWrote(cur)
                    ]))
            ;
        }

        this.shift(1, ([first]) => ref.push(prev = first))
            .consume(consumer)
            .then(() => ref.end());

        return ref;
    },

    /**
     * Keep a buffer of n-chunks for use with {@see DataStream..rewind}
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {number} [count=Infinity] Number of objects or -1 for all the stream
     *
     * @test test/methods/data-stream-keep.js
     */
    keep(count = -1) {
        if (count < 0)
            count = Infinity;

        this.pipe(this.buffer = new ReReadable({ length: count, objectMode: true }));

        return this.tap();
    },

    /**
     * Rewinds the buffered chunks the specified length backwards. Requires a prior call to {@see DataStream..keep}
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {number} [count=Infinity] Number of objects or -1 for all the buffer
     */
    rewind(count = -1) {
        if (count < 0)
            count = Infinity;

        if (this.buffer) {
            return this.buffer.tail(count).pipe(this._selfInstance());
        } else {
            throw new Error("Stream not buffered, cannot rewind.");
        }
    },

    /**
     * Returns a stream that stacks up incoming items always feeding out the newest items first.
     * It returns the older items when read
     *
     * When the stack length exceeds the given `count` the given `drop` function is awaited
     * and used for flow control.
     *
     * By default the drop function ignores and quietly disposes of items not read before overflow.
     *
     * @chainable
     * @param {number} [count=1000]
     * @param {function} [drop]
     * @memberof module:scramjet.DataStream#
     *
     * @test test/methods/data-stream-stack.js
     */
    stack(count = 1000, drop = () => 0) {
        if (count < 0)
            count = Infinity;

        return this.tap().use(
            source => {
                const stack = [];
                const waiting = [];
                let end = false;
                const target = new this.constructor({referrer: this, promiseRead() {
                    if (end) {
                        if (stack.length) {
                            const out = stack.slice().reverse();
                            stack.length = 0;
                            return out;
                        } else {
                            return [];
                        }
                    }
                    if (stack.length) {
                        return [stack.pop()];
                    }

                    return new Promise(res => {
                        waiting.push(res);
                    });
                }});

                source
                    .each(item => {
                        if (waiting.length === 0) {
                            stack.push(item);
                            if (stack.length > count) {
                                return drop(stack.shift());
                            }
                        } else {
                            waiting.shift()([item]);
                        }
                    })
                    .catch(
                        e => target.raise(e)
                    )
                    .whenEnd()
                    .then(() => {
                        end = true;
                        if (waiting.length) {
                            console.log(waiting[0]);
                            waiting.shift()([]);
                        }
                    });

                return target;
            }
        );
    },

    /**
     * Distributes processing into multiple sub-processes or threads if you like.
     *
     * @todo Currently order is not kept.
     * @todo Example test breaks travis-ci build
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {AffinityCallback|Function|number} [affinity] A Function that affixes the item to specific output stream which must exist in the object for each chunk, must return a string. A number may be passed to identify how many round-robin threads to start up. Defaults to Round Robin to twice the number of CPU threads.
     * @param {Function|DataStreamOptions} [clusterFunc] stream transforms similar to {@see DataStream#use method}
     * @param {DataStreamOptions} [options] Options
     *
     * @test test/methods/data-stream-distribute.js
     */
    distribute(affinity, clusterFunc = null, {
        plugins = [],
        options = {}
    } = {}) {

        if (!clusterFunc && affinity) {
            clusterFunc = affinity;
            affinity = os.cpus().length * 2;
        }

        if (typeof affinity === "number") {
            const roundRobinLength = affinity;
            let z = 0;
            options.threads = affinity;
            affinity = () => z = ++z % roundRobinLength;
        }

        if (!Array.isArray(clusterFunc))
            clusterFunc = [clusterFunc];

        const streams = this
            .separate(affinity, options.createOptions, this.constructor)
            .cluster(clusterFunc, {
                plugins,
                threads: options.threads,
                StreamClass: this.constructor
            });

        return streams.mux();
    },

    /**
     * Separates stream into a hash of streams. Does not create new streams!
     *
     * @chainable
     * @meta.noreadme
     * @memberof module:scramjet.DataStream#
     * @param {object} streams the object hash of streams. Keys must be the outputs of the affinity function
     * @param {AffinityCallback} affinity the Function that affixes the item to specific streams which must exist in the object for each chunk.
     */
    separateInto(streams, affinity) {
        this.consume(
            async (chunk) => {
                const streamId = await affinity(chunk);
                const found = streams[streamId];

                if (found) {
                    return found.whenWrote(chunk);
                }

                throw new Error("Output for " + streamId + " not found in " + JSON.stringify(chunk));
            }
        );
        return this;
    },

    /**
     * @callback AffinityCallback
     * @memberof module:scramjet~
     * @param {*} chunk
     * @returns {Symbol|string}
     */

    /**
     * Separates execution to multiple streams using the hashes returned by the passed Function.
     *
     * Calls the given Function for a hash, then makes sure all items with the same hash are processed within a single
     * stream. Thanks to that streams can be distributed to multiple threads.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {AffinityCallback} affinity the affinity function
     * @param {DataStreamOptions} [createOptions] options to use to create the separated streams
     * @param {function(new:DataStream)} [ClassType=this.constructor] options to use to create the separated streams
     * @return {MultiStream} separated stream
     *
     * @test test/methods/data-stream-separate.js
     */
    separate(affinity, createOptions = {}, ClassType = this.constructor) {
        const ret = new MultiStream();
        const hashes = new Map();

        ClassType = ClassType || this.constructor;

        const pushChunk = async (hash, chunk) => {
            const _hash = hash.toString();
            let rightStream;
            if (!hashes.has(_hash)) {
                rightStream = new ClassType(createOptions);
                rightStream._separateId = _hash;
                hashes.set(_hash, rightStream);
                ret.add(rightStream);
            } else {
                rightStream = hashes.get(_hash);
            }

            return rightStream.whenWrote(chunk);
        };

        this.pipe(
            new this.constructor({
                async promiseTransform(chunk) {
                    try {
                        const hash = await affinity(chunk);
                        if (Array.isArray(hash)) return Promise.all(hash.map(str => pushChunk(str, chunk)));
                        else return pushChunk(hash, chunk);
                    } catch (e) {
                        ret.emit("error", e);
                    }
                },
                referrer: this
            })
                .on("end", () => {
                    ret.streams.forEach(stream => stream.end());
                })
                .resume()
        );

        return ret;
    },

    /**
     * @memberof module:scramjet~
     * @typedef {Function} DelegateCallback
     */

    /**
     * Delegates work to a specified worker.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {DelegateCallback} delegateFunc A function to be run in the sub-thread.
     * @param  {StreamWorker}     worker
     * @param  {Array}            [plugins=[]]
     */
    delegate(delegateFunc, worker, plugins = []) {
        const ret = this._selfInstance({referrer: this});
        return worker.delegate(this, delegateFunc, plugins).pipe(ret);
    },

    /**
     * Limit the rate of the stream to a given number of chunks per second or given timeframe.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {number}      cps Chunks per timeframe, the default timeframe is 1000 ms.
     * @param  {RateOptions} [options={}] Options for the limiter controlling the timeframe and time source. Both must work on same units.
     */
    rate(cps, {windowSize = 1000, getTime = Date.now, setTimeout = global.setTimeout} = {}) {
        const refs = [];

        const defer = (time) => new Promise(res => setTimeout(res, time));

        return this.do(
            () => {
                const time = getTime();
                refs.push(time);

                if (refs.length <= cps) return; // DRY fail on purpose here - we don't need to slice the lemon twice.

                refs.splice(0, refs.find(x => x < time - windowSize));
                if (refs.length <= cps) return;

                return defer(time - refs.shift() + windowSize);
            }
        );
    },

    /**
     * @typedef {object} RateOptions
     * @memberof module:scramjet~
     * @param  {number}   [timeFrame=1000] The size of the window to look for streams.
     * @param  {Function} [getTime=Date.now] Time source - anything that returns time.
     * @param  {Function} [setTimeout=setTimeout] Timing function that works identically to setTimeout.
     */

    /**
     * Aggregates chunks in arrays given number of number of items long.
     *
     * This can be used for micro-batch processing.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {number} count How many items to aggregate
     *
     * @test test/methods/data-stream-batch.js
     */
    batch(count) {
        let arr = [];

        const ret = this.tap().pipe(new this.constructor({
            promiseTransform(chunk) {
                arr.push(chunk);
                if (arr.length >= count) {
                    const push = arr;
                    arr = [];
                    return push;
                }
                return Promise.reject(DataStream.filter);
            },
            promiseFlush() {
                if (arr.length > 0) {
                    return [arr];
                } else
                    return [];
            },
            referrer: this
        }));

        return ret;
    },

    /**
     * Aggregates chunks to arrays not delaying output by more than the given number of ms.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {number} ms    Maximum amount of milliseconds
     * @param  {number} [count] Maximum number of items in batch (otherwise no limit)
     *
     * @test test/methods/data-stream-timebatch.js
     */
    timeBatch(ms, count = Infinity) {
        let arr = [];

        const setTimeout = this.setTimeout;
        const clearTimeout = this.clearTimeout;

        let ret = this._selfInstance({referrer: this});

        let pushTimeout = null;

        const push = () => {
            if (pushTimeout) {
                clearTimeout(pushTimeout);
                pushTimeout = null;
            }
            const last = ret.whenWrote(arr);
            arr = [];
            return last;
        };

        this.consume(async (chunk) => {
            arr.push(chunk);
            if (arr.length >= count) {
                await push();
            } else if (!pushTimeout) {
                pushTimeout = setTimeout(push, ms);
            }
        }).then(async () => {
            if (arr.length) {
                clearTimeout(pushTimeout);
                await ret.whenWrote(arr);
            }
            ret.end();
        });

        return ret;
    },

    /**
     * Performs the Nagle's algorithm on the data. In essence it waits until we receive some more data and releases them
     * in bulk.
     *
     * @memberof module:scramjet.DataStream#
     * @todo needs more work, for now it's simply waiting some time, not checking the queues.
     * @param  {number} [size=32] maximum number of items to wait for
     * @param  {number} [ms=10]   milliseconds to wait for more data
     * @chainable
     * @meta.noreadme
     */
    nagle(size = 32, ms = 10) {
        return this.timeBatch(size, ms)
            .flatten();
    },

    /**
     * Returns a WindowStream of the specified length
     *
     * @memberof module:scramjet.DataStream#
     * @chainable
     * @param {number} length
     * @returns {WindowStream} a stream of array's
     * @meta.noreadme
     */
    window(length) {
        if (!(+length > 0))
            throw new Error("Length argument must be a positive integer!");

        const arr = [];
        return this.into(
            (out, chunk) => {
                arr.push(chunk);
                if (arr.length > length)
                    arr.shift();

                return out.whenWrote(arr.slice());
            },
            new scramjet.WindowStream()
        );
    },

    /**
     * Transforms the stream to a streamed JSON array.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {Iterable<any>} [enclosure='[]'] Any iterable object of two items (beginning and end)
     * @return {StringStream}
     * @meta.noreadme
     *
     * @test test/methods/data-stream-tojsonarray.js
     */
    toJSONArray(enclosure = ["[\n", "\n]"], separator = ",\n", stringify = JSON.stringify) {
        const ref = new StringStream({referrer: this});

        this.shift(1, ([first]) => (ref.push(enclosure[0]), ref.whenWrote(stringify(first))))
            .consume(
                (chunk) => Promise.all([
                    ref.whenWrote(separator),
                    ref.whenWrote(stringify(chunk))
                ])
            )
            .then(
                () => ref.end(enclosure[1])
            );

        return ref;
    },

    /**
     * Transforms the stream to a streamed JSON object.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {MapCallback} [entryCallback] async function returning an entry (array of [key, value])
     * @param  {Iterable<any>} [enclosure='{}'] Any iterable object of two items (beginning and end)
     * @return {StringStream}
     * @meta.noreadme
     *
     * @test test/methods/data-stream-tojsonobject.js
     */
    toJSONObject(entryCallback, enclosure = ["{\n","\n}"], separator = ",\n") {
        let ref = this;

        return ref.map((item) => [entryCallback(item), item])
            .toJSONArray(enclosure, separator, ([key, value]) => JSON.stringify(key.toString()) + ":" + JSON.stringify(value));
    },


    /**
     * Returns a StringStream containing JSON per item with optional end line
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {Boolean|string} [endline=os.EOL] whether to add endlines (boolean or string as delimiter)
     * @return {StringStream}  output stream
     */
    JSONStringify(eol = os.EOL) {
        if (!eol)
            eol = "";

        return this.stringify((item) => JSON.stringify(item) + eol);
    },

    /**
     * Stringifies CSV to DataString using 'papaparse' module.
     *
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param {object} [options={}] options for the papaparse.unparse module.
     * @return {StringStream}  stream of parsed items
     *
     * @test test/methods/data-stream-csv.js
     */
    CSVStringify(options = {}) {
        const Papa = __nccwpck_require__(877);
        let header = null;
        let start = 1;
        options = Object.assign({
            header: true,
            newline: os.EOL
        }, options);

        const outOptions = Object.assign({}, options, {
            header: false
        });

        return this
            .timeBatch(16, 64)
            .map((arr) => {
                const out = [];
                if (!header) {
                    header = Object.keys(arr[0]);
                    if (options.header) out.push(header);
                }
                for (const item of arr)
                    out.push(header.map(key => item[key]));

                const x = Papa.unparse(out, outOptions) + options.newline;
                if (start) {
                    start = 0;
                    return x;
                }
                return x;
            })
            .pipe(new StringStream());
    },

    /**
     * @typedef {object} ExecDataOptions
     * @memberof module:scramjet~
     * @property {UseCallback} [parse] scramjet module to transform the stream to string or buffer stream
     * @property {UseCallback} [stringify] scramjet module to transform from string or buffer stream to wanted version
     * @extends StringStream.ExecOptions
     */

    /**
     * Executes a given sub-process with arguments and pipes the current stream into it while returning the output as another DataStream.
     *
     * Pipes the current stream into the sub-processes stdin.
     * The data is serialized and deserialized as JSON lines by default. You
     * can provide your own alternative methods in the ExecOptions object.
     *
     * Note: if you're piping both stderr and stdout (options.stream=3) keep in mind that chunks may get mixed up!
     *
     * @param {string} command command to execute
     * @memberof module:scramjet.DataStream#
     * @param {ExecDataOptions|any} [options={}] options to be passed to `spawn` and defining serialization.
     * @param {string[]} ...args additional args will be passed to function
     *
     * @test test/methods/data-stream-exec.js
     */
    exec(command, options = {}, ...args) {
        const resolvedCmd = path.resolve(getCalleeDirname(1), command);
        const stringify = options.stringify || (stream => stream.JSONStringify());
        const parse = options.parse || (stream => stream.JSONParse());

        return this
            .use(stringify)
            .exec(resolvedCmd, options, ...args)
            .use(parse);
    },

    /**
     * Injects a ```debugger``` statement when called.
     *
     * @meta.noreadme
     * @chainable
     * @memberof module:scramjet.DataStream#
     * @param  {Function} func if passed, the function will be called on self to add an option to inspect the stream in place, while not breaking the transform chain
     * @return {DataStream}  self
     *
     * @test test/methods/data-stream-debug.js
     */
    debug(func) {
        debugger; // eslint-disable-line
        this.use(func);
        return this;
    },

};

module.exports.pop = module.exports.shift;
module.exports.group = module.exports.separate;


/***/ }),

/***/ 8750:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4238);

module.exports = module.exports.plugin({
    /**
     * A Stream Worker class
     *
     * @inject StreamWorker
     * @memberof module:scramjet
     * @type {StreamWorker}
     */
    StreamWorker: __nccwpck_require__(7010)
});

module.exports = module.exports.plugin({
    DataStream: __nccwpck_require__(9738),
    BufferStream: __nccwpck_require__(3946),
    StringStream: __nccwpck_require__(6687),
    NumberStream: __nccwpck_require__(223),
    MultiStream: __nccwpck_require__(9577)
}).plugin({
    WindowStream: __nccwpck_require__(2374)
});


/***/ }),

/***/ 9577:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const scramjet = __nccwpck_require__(8750);
const os = __nccwpck_require__(2087);

module.exports = {
    /**
     * Re-routes streams to a new MultiStream of specified size
     *
     * @meta.noreadme
     * @memberof module:scramjet.MultiStream#
     * @todo NYT: not yet tested
     * @todo NYD: not yet documented
     * @param  {Function} [policy=Affinity.RoundRobin] [description]
     * @param  {number} [count=os.cpus().length]       [description]
     * @return {MultiStream}                             [description]
     */
    route(policy, count = os.cpus().length) {
        const affine = policy(null, count);
        return this.mux().separate(
            async (item) => await affine(item)
        );
    },

    /**
     * Map stream synchronously
     *
     * @chainable
     * @memberof module:scramjet.MultiStream#
     * @param  {Function} transform mapping function ran on every stream (SYNCHRONOUS!)
     */
    smap(transform) {
        const out = new this.constructor(this.streams.map(transform));
        this.each(
            (stream) => out.add(transform(stream)),
            (stream) => out.remove(transform(stream))
        );
        return out;
    },

    /**
     * Distribute options
     *
     * @typedef {object} DistributeOptions
     * @memberof module:scramjet~
     * @prop {Array} [plugins=[]] a list of scramjet plugins to load (if omitted, will use just the ones in scramjet itself)
     * @prop {string} [StreamClass=DataStream] the class to deserialize the stream to.
     * @prop {number} [threads=os.cpus().length * 2] maximum threads to use - defaults to number of processor threads in os, but it may be sensible to go over this value if you'd intend to run synchronous code.
     * @prop {DataStreamOptions} [createOptions={}] maximum threads to use - defaults to number of processor threads in os, but it may be sensible to go over this value if you'd intend to run synchronous code.
     * @prop {StreamWorker} [StreamWorker=scramjet.StreamWorker] worker implementation.
     */

    /**
     * Distributes processing to multiple forked subprocesses.
     *
     * @chainable
     * @memberof module:scramjet.MultiStream#
     * @param {Function|string} clusterFunc a cluster callback with all operations working similarly to DataStream::use
     * @param {DistributeOptions} [options={}]
     */
    cluster(clusterFunc, {plugins = [], threads = os.cpus().length * 2, StreamClass = scramjet.DataStream, createOptions = {}, StreamWorker = scramjet.StreamWorker} = {}) {
        const out = new this.constructor();

        StreamWorker.fork(threads);

        this.each(
            (stream) => StreamWorker
                .fork(threads)
                .then(
                    ([worker]) => out.add(worker.delegate(stream, [clusterFunc], plugins).pipe(new StreamClass(createOptions)))
                )
        );

        return out;
    },

};


/***/ }),

/***/ 223:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {DataStream} = __nccwpck_require__(8750);

/**
 * Simple scramjet stream that by default contains numbers or other containing with `valueOf` method. The streams
 * provides simple methods like `sum`, `average`. It derives from DataStream so it's still fully supporting all `map`,
 * `reduce` etc.
 *
 * @memberof module:scramjet.
 * @extends DataStream
 */
class NumberStream extends DataStream {

    /**
     * @callback ValueOfCallback
     * @memberof module:scramjet~
     * @param {*} chunk stream object
     * @returns {Promise<number>|number} value of the object
     */

    /**
     * NumberStream options
     *
     * @typedef {object} NumberStreamOptions
     * @memberof module:scramjet~
     * @prop {ValueOfCallback} [valueOf=x => +x] value of the data item function.
     * @extends DataStreamOptions
     */

    /**
     * Creates an instance of NumberStream.
     * @param {NumberStreamOptions} options
     * @memberof module:scramjet
     */
    constructor(options, ...args) {
        super(options, ...args);
    }

    get _valueOf() {
        return this._options.valueOf || ((x) => +x);
    }

    /**
     * Calculates the sum of all items in the stream.
     *
     * @return {Promise<number>|any}
     */
    async sum() {
        const _valueOf = this._valueOf;
        return this.reduce(async (a, x) => a + await _valueOf(x), 0);
    }

    /**
     * Calculates the sum of all items in the stream.
     *
     * @return {Promise<number>|any}
     */
    async avg() {
        let cnt = 0;
        const _valueOf = this._valueOf;
        return this.reduce(async (a, x) => (cnt * a + await _valueOf(x)) / ++cnt, 0);
    }

}

module.exports = NumberStream;


/***/ }),

/***/ 7010:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {DataStream, StringStream} = __nccwpck_require__(8750);
const ref = {};
const {fork} = __nccwpck_require__(3129);
const os = __nccwpck_require__(2087);

const net = __nccwpck_require__(1631);

let workerSeq = 0;
const workers = [];

/**
 * StreamWorker class - intended for internal use
 *
 * This class provides control over the subprocesses, including:
 *  - spawning
 *  - communicating
 *  - delivering streams
 *
 * @internal
 * @memberof module:scramjet
 */
class StreamWorker {

    /**
     * Private constructor
     */
    constructor(def) {
        if (def !== ref) {
            throw new Error("Private constructor");
        }

        this._refcount = 0;

        this.timeout = 1e3;
        this.child = null;
        this.resolving = null;

        this.ip = "localhost";
        this.port = 0;
    }

    /**
     * Spawns the worker if necessary and provides the port information to it.
     *
     * @async
     * @return {StreamWorker}
     */
    async spawn() {
        return this.resolving || (this.resolving = new Promise((res, rej) => {
            this._child = fork(__dirname + "/stream-child", [this.ip, this.timeout]);

            let resolved = false;
            let rejected = false;

            this._child.once("message", ({port}) => (this.port = +port, resolved = true, res(this)));
            this._child.once("error", (e) => (rejected = true, rej(e)));
            this._child.once("exit", (code) => {
                if (!code) // no error, child exited, clear the promise so that it respawns when needed
                    this.resolving = null;
                else
                    this.resolving = Promise.reject(new Error("Child exited with non-zero status code: " + code));
            });

            setTimeout(() => resolved || rejected || (rejected = true) && rej(new Error("StreamWorker child timeout!")), this.timeout);
        }));
    }

    /**
     * Delegates a stream to the child using tcp socket.
     *
     * The stream gets serialized using JSON and passed on to the sub-process.
     * The sub-process then performs transforms on the stream and pushes them back to the main process.
     * The stream gets deserialized and outputted to the returned DataStream.
     *
     * @param  {DataStream} input stream to be delegated
     * @param  {TeeCallback[]|Array} delegateFunc Array of transforms or arrays describing ['module', 'method']
     * @param  {any[]} [plugins=[]] List of plugins to load in the child
     * @return {DataStream} stream after transforms and back to the main process.
     */
    delegate(input, delegateFunc, plugins = []) {

        const sock = new net.Socket().setNoDelay(true);

        const _in = new DataStream();

        const _out = _in
            .JSONStringify()
            .pipe(sock.connect(this.port, this.ip))
            .pipe(new StringStream)
            .JSONParse()
            .filter(
                ({error}) => {
                    if (error) {
                        const err = new Error(error.message);
                        err.stack = "[child]" + error.stack;
                    }
                    return true;
                }
            )
        ;

        _in.unshift({
            type: 0, // 0 - start, 1 - end
            plugins,
            streamClass: input.constructor.name,
            transforms: delegateFunc.map(
                func => typeof func === "function" ? func.toString() : (Array.isArray(func) ? func : [func])
            )
        });

        input.pipe(_in);

        return _out;
    }

    /**
     * Spawns (Preforks) a given number of subprocesses and returns the worker asynchronously.
     *
     * @async
     * @param  {number}  [count=os.cpus().length] Number of processes to spawn. If other subprocesses are active only the missing ones will be spawned.
     * @return {Array<StreamWorker>}  list of StreamWorkers
     */
    static async fork(count = os.cpus().length) {

        for (let i = workers.length; i < count; i++)
            workers.push(new StreamWorker(ref));

        return Promise.all(new Array(count).fill(1).map(() => this._getWorker()));
    }

    /**
     * Picks next worker (not necessarily free one!)
     *
     * @async
     * @return {StreamWorker}
     */
    static async _getWorker() {
        // TODO: Use free / not fully utilized workers first.

        return workers[workerSeq = ++workerSeq % workers.length].spawn();
    }

}

module.exports = StreamWorker;


/***/ }),

/***/ 6687:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {DataStream} = __nccwpck_require__(8750);
const {spawn} = __nccwpck_require__(3129);
const path = __nccwpck_require__(5622);

const platform = __nccwpck_require__(2087).platform();

/** @ignore */
const getCalleeDirname = __nccwpck_require__(8603).getCalleeDirname;

module.exports = {

    /**
     * Splits the string stream by the specified regexp or string
     *
     * @chainable
     * @memberof module:scramjet.StringStream#
     * @param  {string|RegExp} [eol=/\r?\n/] End of line string or regex
     *
     * @test test/methods/string-stream-split.js
     */
    lines(eol = /\r?\n/) {
        return this.split(eol);
    },

    /**
     * Parses each entry as JSON.
     * Ignores empty lines
     *
     * @chainable
     * @memberof module:scramjet.StringStream#
     * @param {Boolean} [perLine=true] instructs to split per line
     * @return {DataStream}  stream of parsed items
     */
    JSONParse(perLine = true) {
        let str = this;
        if (perLine) {
            str = str.lines();
        }

        return str.filter(a => a !== "").parse(JSON.parse);
    },

    /**
     * Parses CSV to DataString using 'papaparse' module.
     *
     * @chainable
     * @memberof module:scramjet.StringStream#
     * @param {object} [options={}] options for the papaparse.parse method.
     * @return {DataStream}  stream of parsed items
     * @test test/methods/data-stream-separate.js
     */
    CSVParse(options = {}) {
        const out = new DataStream();
        __nccwpck_require__(877).parse(this, Object.assign(options, {
            chunk: async ({data, errors}, parser) => {
                if (errors.length) {
                    return out.raise(Object.assign(new Error(), errors[0]));
                }

                if (!out.write(data)) {
                    parser.pause();
                    await out.whenDrained();
                    parser.resume();
                }
            },
            complete: () => {
                out.end();
            },
            error: (e) => {
                out.emit("error", e);
            }
        }));

        return out.flatten();
    },

    /**
     * Appends given argument to all the items.
     *
     * @chainable
     * @memberof module:scramjet.StringStream#
     * @param {ThenFunction|string} param the argument to append. If function passed then it will be called and resolved and the resolution will be appended.
     *
     * @test test/methods/string-stream-append.js
     */
    append(param) {
        return typeof param === "function" ? this.map(item => Promise.resolve(item).then(param).then((result) => item + result)) : this.map(item => item + param);
    },

    /**
     * Prepends given argument to all the items.
     *
     * @chainable
     * @memberof module:scramjet.StringStream#
     * @param {ThenFunction|string} param the argument to prepend. If function passed then it will be called and resolved
     *                              and the resolution will be prepended.
     *
     * @test test/methods/string-stream-prepend.js
     */
    prepend(param) {
        return typeof param === "function" ? this.map(item => Promise.resolve(item).then(param).then((result) => result + item)) : this.map(item => param + item);
    },

    /**
     * @typedef {object} ExecOptions
     * @memberof module:scramjet~
     * @property {number} [stream=1] (bitwise) the output stdio number to push out (defaults to stdout = 1)
     * @property {string[]} [interpreter=[]] defaults to nothing, except on windows where "cmd.exe /c" will be spawned by default
     * @extends child_process.SpawnOptions
     */

    /**
     * Executes a given sub-process with arguments and pipes the current stream into it while returning the output as another DataStream.
     *
     * Pipes the current stream into the sub-processes stdin.
     * The data is serialized and deserialized as JSON lines by default. You
     * can provide your own alternative methods in the ExecOptions object.
     *
     * Note: if you're piping both stderr and stdout (options.stream=3) keep in mind that chunks may get mixed up!
     *
     * @param {string} command command to execute
     * @memberof module:scramjet.StringStream#
     * @param {ExecOptions|any} [options={}] options to be passed to `spawn` and defining serialization.
     * @param {string[]} ...args additional arguments (will overwrite to SpawnOptions args even if not given)
     *
     * @test test/methods/string-stream-exec.js
     */
    exec(command, options, ...args) {
        const shell = process.env.SHELL ? [process.env.SHELL] : platform === "win32" ? ["cmd.exe","/c"] : [];
        const { stream = 1, interpreter = shell } = (options || {});

        const out = this.tap()._selfInstance({referrer: this});

        const spawnOptions = Object.assign({}, options);
        spawnOptions.stdio = ["pipe", "pipe", "pipe"];

        const resolvedCommand = path.resolve(getCalleeDirname(1), command);

        const actualArgs = interpreter && interpreter.length ? [...interpreter.slice(1), resolvedCommand, ...args] : args;
        const actualCmd = interpreter && interpreter.length ? interpreter[0] : resolvedCommand;

        let end = 1;
        const ended = () => end-- || out.end();

        const proc = spawn(actualCmd, actualArgs, spawnOptions);
        this.catch(e => proc.kill(e.signal));
        proc.on("error", e => {
            ended();
            return out.raise(e);
        });
        proc.on("exit", async exitCode => {
            if (exitCode > 0) {
                const error = Object.assign(new Error(`Non-zero exitcode (${exitCode}) returned from command "${resolvedCommand}"`), {exitCode});
                await out.raise(error);
            }

            ended();
        });

        this.pipe(proc.stdin);
        proc.stdin.on("error", async e => {
            if (!(e.code === "EPIPE")) {
                await out.raise(e);
            }
            // ignore EPIPE after end
        });
        if (stream & 1) proc.stdout.on("end", () => ended()).pipe(out, {end: false});
        if (stream & 2) proc.stderr.on("end", () => ended()).pipe(out, {end: false});

        return out;

    }

};


/***/ }),

/***/ 2374:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const {NumberStream} = __nccwpck_require__(8750);

/**
 * A stream for moving window calculation with some simple methods.
 *
 * In essence it's a stream of Array's containing a list of items - a window.
 * It's best used when created by the `DataStream..window`` method.
 *
 * @memberof module:scramjet.
 * @extends NumberStream
 */
class WindowStream extends NumberStream {

    /**
     * Calculates moving sum of items, the output NumberStream will contain the moving sum.
     *
     * @chainable
     * @param {ValueOfCallback} [valueOf] value of method for array items
     * @return {NumberStream}
     */
    sum(valueOf = (x) => +x) {
        return this.map(
            arr => arr.reduce((a, x) => a + valueOf(x)),
            NumberStream
        );
    }

    /**
     * Calculates the moving average of the window and returns the NumberStream
     *
     * @chainable
     * @param {ValueOfCallback} [valueOf] value of method for array items
     * @return {NumberStream}
     */
    avg(valueOf = (x) => +x) {
        let cnt = 0;
        return this.map(
            arr => arr.reduce((a, x) => (cnt * a + valueOf(x)) / ++cnt, 0),
            NumberStream
        );
    }
}

module.exports = WindowStream;


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1631);
var tls = __nccwpck_require__(4016);
var http = __nccwpck_require__(8605);
var https = __nccwpck_require__(7211);
var events = __nccwpck_require__(8614);
var assert = __nccwpck_require__(2357);
var util = __nccwpck_require__(1669);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5030:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function getUserAgent() {
  if (typeof navigator === "object" && "userAgent" in navigator) {
    return navigator.userAgent;
  }

  if (typeof process === "object" && "version" in process) {
    return `Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`;
  }

  return "<environment undetectable>";
}

exports.getUserAgent = getUserAgent;
//# sourceMappingURL=index.js.map


/***/ }),

/***/ 2940:
/***/ ((module) => {

// Returns a wrapper function that returns a wrapped callback
// The wrapper function should do some stuff, and return a
// presumably different callback function.
// This makes sure that own properties are retained, so that
// decorations and such are not lost along the way.
module.exports = wrappy
function wrappy (fn, cb) {
  if (fn && cb) return wrappy(fn)(cb)

  if (typeof fn !== 'function')
    throw new TypeError('need wrapper function')

  Object.keys(fn).forEach(function (k) {
    wrapper[k] = fn[k]
  })

  return wrapper

  function wrapper() {
    var args = new Array(arguments.length)
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i]
    }
    var ret = fn.apply(this, args)
    var cb = args[args.length-1]
    if (typeof ret === 'function' && ret !== cb) {
      Object.keys(cb).forEach(function (k) {
        ret[k] = cb[k]
      })
    }
    return ret
  }
}


/***/ }),

/***/ 6373:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const github = __importStar(__nccwpck_require__(5438));
const defaultCloseComment = `
This issue has been automatically closed because there has been no response
to our request for more information from the original author. With only the
information that is currently in the issue, we don't have enough information
to take action. Please reach out if you have or find the answers we need so
that we can investigate further.
`;
/**
 * Reads, interprets, and encapsulates the configuration for the current run of the Action.
 */
class Config {
    constructor() {
        this.closeComment = this.valueOrDefault(core.getInput('closeComment'), defaultCloseComment);
        if (this.closeComment === 'false') {
            this.closeComment = undefined;
        }
        this.daysUntilClose = parseInt(this.valueOrDefault(core.getInput('daysUntilClose'), '14'));
        this.repo = github.context.repo;
        this.responseRequiredColor = this.valueOrDefault(core.getInput('responseRequiredColor'), 'ffffff');
        this.responseRequiredLabel = this.valueOrDefault(core.getInput('responseRequiredLabel'), 'more-information-needed');
        this.token = core.getInput('token', { required: true });
    }
    valueOrDefault(value, defaultValue) {
        return value !== '' ? value : defaultValue;
    }
}
exports.default = Config;


/***/ }),

/***/ 399:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const config_1 = __importDefault(__nccwpck_require__(6373));
const no_response_1 = __importDefault(__nccwpck_require__(8908));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const eventName = process.env['GITHUB_EVENT_NAME'];
            const config = new config_1.default();
            const noResponse = new no_response_1.default(config);
            if (eventName === 'schedule') {
                noResponse.sweep();
            }
            else if (eventName === 'issue_comment') {
                noResponse.unmark();
            }
            else {
                core.error(`Unrecognized event: ${eventName}`);
            }
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();


/***/ }),

/***/ 8908:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__nccwpck_require__(2186));
const fs = __importStar(__nccwpck_require__(5747));
const github = __importStar(__nccwpck_require__(5438));
const scramjet = __importStar(__nccwpck_require__(8750));
const fsp = fs.promises;
class NoResponse {
    constructor(config) {
        this.config = config;
        this.octokit = github.getOctokit(this.config.token);
    }
    sweep() {
        return __awaiter(this, void 0, void 0, function* () {
            core.debug('Starting sweep');
            yield this.ensureLabelExists();
            const issues = yield this.getCloseableIssues();
            for (const issue of issues) {
                this.close(Object.assign({ issue_number: issue.number }, this.config.repo));
            }
        });
    }
    unmark() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            core.debug('Starting unmark');
            const { responseRequiredLabel } = this.config;
            const payload = yield this.readPayload();
            const owner = payload.repository.owner.login;
            const repo = payload.repository.name;
            const { number } = payload.issue;
            const comment = payload.comment;
            const issue = { owner, repo, issue_number: number };
            const issueInfo = yield this.octokit.issues.get(issue);
            const isMarked = yield this.hasResponseRequiredLabel(issue);
            if (isMarked && ((_a = issueInfo.data.user) === null || _a === void 0 ? void 0 : _a.login) === comment.user.login) {
                core.info(`${owner}/${repo}#${number} is being unmarked`);
                yield this.octokit.issues.removeLabel({
                    owner,
                    repo,
                    issue_number: number,
                    name: responseRequiredLabel
                });
                if (issueInfo.data.state === 'closed' &&
                    issueInfo.data.user.login !== ((_b = issueInfo.data.closed_by) === null || _b === void 0 ? void 0 : _b.login)) {
                    this.octokit.issues.update({ owner, repo, issue_number: number, state: 'open' });
                }
            }
        });
    }
    close(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const { closeComment } = this.config;
            core.info(`${issue.owner}/${issue.repo}#${issue.issue_number} is being closed`);
            if (closeComment) {
                yield this.octokit.issues.createComment(Object.assign({ body: closeComment }, issue));
            }
            yield this.octokit.issues.update(Object.assign({ state: 'closed' }, issue));
        });
    }
    ensureLabelExists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.octokit.issues.getLabel(Object.assign({ name: this.config.responseRequiredLabel }, this.config.repo));
            }
            catch (e) {
                this.octokit.issues.createLabel(Object.assign({ name: this.config.responseRequiredLabel, color: this.config.responseRequiredColor }, this.config.repo));
            }
        });
    }
    findLastLabeledEvent(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const { responseRequiredLabel } = this.config;
            const events = yield this.octokit.paginate((yield this.octokit.issues.listEvents(Object.assign(Object.assign({}, issue), { per_page: 100 }))));
            return events
                .reverse()
                .find((event) => event.event === 'labeled' && event.label.name === responseRequiredLabel);
        });
    }
    getCloseableIssues() {
        return __awaiter(this, void 0, void 0, function* () {
            const { owner, repo } = this.config.repo;
            const { daysUntilClose, responseRequiredLabel } = this.config;
            const q = `repo:${owner}/${repo} is:issue is:open label:"${responseRequiredLabel}"`;
            const labeledEarlierThan = this.since(daysUntilClose);
            const issues = yield this.octokit.search.issuesAndPullRequests({
                q,
                sort: 'updated',
                order: 'desc',
                per_page: 30
            });
            core.debug(`Issues to check for closing:`);
            core.debug(JSON.stringify(issues, null, 2));
            const closableIssues = yield scramjet
                .fromArray(issues.data.items)
                .filter((issue) => __awaiter(this, void 0, void 0, function* () {
                const event = yield this.findLastLabeledEvent(Object.assign({ issue_number: issue.number }, this.config.repo));
                core.debug(`Checking: ${JSON.stringify(issue, null, 2)}`);
                core.debug(`Using: ${JSON.stringify(event, null, 2)}`);
                if (event) {
                    const creationDate = new Date(event.created_at);
                    core.debug(`${creationDate} < ${labeledEarlierThan} === ${creationDate < labeledEarlierThan}`);
                    return creationDate < labeledEarlierThan;
                }
                else {
                    return false;
                }
            }))
                .toArray();
            core.debug(`Closeable: ${JSON.stringify(closableIssues, null, 2)}`);
            return closableIssues;
        });
    }
    hasResponseRequiredLabel(issue) {
        return __awaiter(this, void 0, void 0, function* () {
            const labels = yield this.octokit.issues.listLabelsOnIssue(Object.assign({}, issue));
            return labels.data.map((label) => label.name).includes(this.config.responseRequiredLabel);
        });
    }
    readPayload() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!process.env.GITHUB_EVENT_PATH) {
                throw new Error('GITHUB_EVENT_PATH is not defined');
            }
            const text = (yield fsp.readFile(process.env.GITHUB_EVENT_PATH)).toString();
            return JSON.parse(text);
        });
    }
    since(days) {
        const ttl = days * 24 * 60 * 60 * 1000;
        return new Date(new Date().getTime() - ttl);
    }
}
exports.default = NoResponse;


/***/ }),

/***/ 2877:
/***/ ((module) => {

module.exports = eval("require")("encoding");


/***/ }),

/***/ 2357:
/***/ ((module) => {

"use strict";
module.exports = require("assert");;

/***/ }),

/***/ 3129:
/***/ ((module) => {

"use strict";
module.exports = require("child_process");;

/***/ }),

/***/ 8614:
/***/ ((module) => {

"use strict";
module.exports = require("events");;

/***/ }),

/***/ 5747:
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ 8605:
/***/ ((module) => {

"use strict";
module.exports = require("http");;

/***/ }),

/***/ 7211:
/***/ ((module) => {

"use strict";
module.exports = require("https");;

/***/ }),

/***/ 1631:
/***/ ((module) => {

"use strict";
module.exports = require("net");;

/***/ }),

/***/ 2087:
/***/ ((module) => {

"use strict";
module.exports = require("os");;

/***/ }),

/***/ 5622:
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ 2413:
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ 4016:
/***/ ((module) => {

"use strict";
module.exports = require("tls");;

/***/ }),

/***/ 8835:
/***/ ((module) => {

"use strict";
module.exports = require("url");;

/***/ }),

/***/ 1669:
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ 8761:
/***/ ((module) => {

"use strict";
module.exports = require("zlib");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	__nccwpck_require__.ab = __dirname + "/";/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __nccwpck_require__(399);
/******/ })()
;