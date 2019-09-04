import "reflect-metadata";

import parser = require("body-parser");
import compression = require("compression");
import express = require("express");
import helmet = require("helmet");
import { useExpressServer } from "routing-controllers";

import MongoProvider from "./common/mongoProvider";
import { generateSwagger } from "./common/swagger";
import { ignoreFavicon } from "./common/util";
import RootController from "./controllers/root";
import UserController from "./controllers/users";

const app = express();

const mongoose = new MongoProvider();

mongoose.connect().catch(error => {
  console.log(`${error.name}: ${error.message}`);
});

export function expressApp() {
  app.use(helmet());
  app.use(compression());
  app.use(parser.json());
  app.use(parser.urlencoded({ extended: false }));
  app.use(ignoreFavicon);
  app.use("/swagger", express.static("./dist/swagger.json"));

  useExpressServer(app, {
    controllers: [RootController, UserController],
    defaultErrorHandler: true,
    defaults: { paramOptions: { required: true } }
  });

  generateSwagger();

  return app;
}
