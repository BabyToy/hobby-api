import { hostname } from "os";
import { Get, JsonController } from "routing-controllers";

@JsonController()
export default class RootController {
  @Get("/")
  root() {
    return `Backend listening on http://${hostname()}:${process.env.PORT}`;
  }
}
