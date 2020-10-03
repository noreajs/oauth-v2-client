import { AppRoutes, NoreaApplication } from "@noreajs/core";
import { Request, Response } from "express";

export default new AppRoutes({
  routes(app: NoreaApplication): void {
    /**
     * Api home
     */
    app.get("/", (request: Request, response: Response) => {
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
  middlewares(app: NoreaApplication): void {},
});
