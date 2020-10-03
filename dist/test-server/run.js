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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var OauthClient_1 = __importDefault(require("../OauthClient"));
var app = express_1.default();
var httpServer = http_1.default.createServer(app);
var noreaApi = new OauthClient_1.default({
    oauthOptions: {
        clientId: "2054f3ef-7360-4779-b01c-5bb8ee09f61b",
        clientSecret: "9c40df4a551e2d92e45026ef5189f4116ffde949963a826c94d6b7f5f12a9a99f90d3a3cdbdd2dd840ea0c0b665cd8babca4cbac214fd09915f18ac824b41258",
        callbackUrl: "http://127.0.0.1:3500/implicit/callback",
        accessTokenUrl: "http://localhost:3000/oauth/v2/token",
        authUrl: "http://localhost:3000/oauth/v2/authorize",
    },
    requestOptions: {
        body: {
            baby: "boom"
        },
        headers: {
            "Accept": "application/json"
        }
    }
});
/**
 * Implicit
 * --------------
 */
app.get("/oauth/implicit", function (req, res) {
    res.redirect(noreaApi.implicit.getAuthUri());
});
app.get("/implicit/callback", function (req, res) {
    res.json(noreaApi.implicit.getToken(req.originalUrl));
});
/**
 * Authorization code
 * -----------------------
 */
app.get("/oauth/auth-code", function (req, res) {
    res.redirect(noreaApi.authorizationCode.getAuthUri("http://127.0.0.1:3500/auth-code/callback"));
});
app.get("/auth-code/callback", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, noreaApi.authorizationCode.getToken({
                        callbackUri: req.originalUrl,
                        onSuccess: function (data) {
                            return res.status(200).json(data);
                        },
                        onError: function (error) {
                            var _a;
                            return res.status(500).json((_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                        },
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Authorization code PKCE
 * ----------------------------
 */
app.get("/oauth/auth-code-pkce", function (req, res) {
    // "http://127.0.0.1:3500/auth-code-pkce/callback"
    res.redirect(noreaApi.authorizationCodePKCE.getAuthUri());
});
app.get("/auth-code-pkce/callback", function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = res).json;
                    return [4 /*yield*/, noreaApi.authorizationCodePKCE.getToken(req.originalUrl)];
                case 1:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
});
/**
 * Home
 */
app.get("/", function (req, res) {
    res.json({
        message: "Hey we there",
    });
});
httpServer.listen(3500);
