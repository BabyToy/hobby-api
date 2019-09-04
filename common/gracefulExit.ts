import { NextFunction, Request, Response } from "express";

let shuttingDown = false;
let server: any = {};
const forceTimeout = 10 * 1000; // giving the app 10 seconds to shutdown gracefully

function gracefulExit() {
  if (shuttingDown) {
    return;
  }
  shuttingDown = true;
  console.log("Received kill signal (SIGTERM), shutting down");

  setTimeout(() => {
    process.exit(1);
  }, forceTimeout);

  server.close(() => {
    console.log("Closed remaining connections.");
    process.exit();
  });
}

function middleware(request: Request, response: Response, next: NextFunction) {
  if (!shuttingDown) {
    return next();
  }
  response.set("Connection", "close");
  response.status(503).send("Server is restarting.");
}

export default function(listener) {
  server = listener;
  process.on("SIGTERM", gracefulExit); // TERM signal (e.g. kill)
  process.on("SIGINT", gracefulExit); // INT signal (e.g. Ctrl-C)

  return middleware;
}
