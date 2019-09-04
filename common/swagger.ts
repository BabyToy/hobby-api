import "reflect-metadata";

import routingControllers = require("routing-controllers");
import { SwaggerGenerator } from "typeswag";

import pkg = require("../package.json");

export const generateSwagger = () => {
  const swagger = new SwaggerGenerator();

  // This registers custom route decorators, that will be known during generating.
  // , path => `/${path}`
  swagger.registerRouteDecorator(routingControllers.Controller);
  swagger.registerRouteDecorator(routingControllers.JsonController);

  swagger.generate({
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    entryFile: "./index.ts",
    basePath: "/",
    output: {
      path: "./dist/"
    }
  });
};
