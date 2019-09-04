import { hostname } from "os";
import { Get, JsonController } from "routing-controllers";

@JsonController()
export default class RootController {
  @Get("/")
  root() {
    return `Backend listening on http://${hostname()}:${process.env.PORT}`;
  }

  @Get("/error")
  throwError() {
    throw new Error("Not implemented");
  }

  /**
   *  returns a time stamp as a heartbeat
   */
  @Get("/healthcheck")
  healthCheck() {
    const startTime = new Date();
    return startTime.toISOString();
  }
}
