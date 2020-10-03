"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var app = express_1.default();
var httpServer = http_1.default.createServer(app);
app.get("/", function (req, res) {
    res.json({
        message: 'Hey we there'
    });
});
httpServer.listen(3000);
