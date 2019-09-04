import os = require("os");

import { expressApp } from "./app";
import gracefulExit from "./common/gracefulExit";

const app = expressApp();
const listener = app.listen(process.env.PORT || 80, () => {
  console.log(`"http://${os.hostname()}:${process.env.PORT || 80}`);
});

app.use(gracefulExit(listener));
