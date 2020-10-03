"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@noreajs/core");
exports.default = new core_1.AppRoutes({
    routes: function (app) {
        /**
         * Api home
         */
        app.get("/", function (request, response) {
            response.send({
                title: "Norea.js realtime test server",
                description: "Realtime tools for Norea.js",
                contact: {
                    name: "OvniCode Team",
                    email: "team@ovnicode.com",
                },
            });
        });
    },
    middlewares: function (app) { },
});
