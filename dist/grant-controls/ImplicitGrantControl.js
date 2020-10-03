"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GrantControl_1 = __importDefault(require("./GrantControl"));
var query_string_1 = require("query-string");
var ImplicitGrantControl = /** @class */ (function (_super) {
    __extends(ImplicitGrantControl, _super);
    function ImplicitGrantControl(options) {
        var _a;
        var _this = _super.call(this) || this;
        _this.options = options;
        // state generation
        _this.state = (_a = _this.options.state) !== null && _a !== void 0 ? _a : Math.random().toString(36);
        return _this;
    }
    ImplicitGrantControl.prototype.getAuthUri = function (callbackUrl) {
        var url = new URL(this.options.authUrl);
        url.searchParams.set("response_type", "token");
        url.searchParams.set("redirect_uri", callbackUrl !== null && callbackUrl !== void 0 ? callbackUrl : this.options.callbackUrl);
        url.searchParams.set("client_id", this.options.clientId);
        url.searchParams.set("state", this.state);
        url.searchParams.set("scope", this.options.scope ? this.options.scope.join(" ") : "");
        return url.toString();
    };
    /**
     * Extract the token within the callback uri
     * @param callbackUri the full callback uri
     */
    ImplicitGrantControl.prototype.getToken = function (callbackUri) {
        // callback url data
        var urlData = query_string_1.parseUrl(callbackUri);
        if (urlData.query.state !== this.state) {
            throw new Error("Corrupted answer, the state doesn't match.");
        }
        else {
            // delete the state in the answer
            delete urlData.query.state;
        }
        return urlData.query;
    };
    return ImplicitGrantControl;
}(GrantControl_1.default));
exports.default = ImplicitGrantControl;
