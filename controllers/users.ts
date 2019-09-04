import {
  BodyParam,
  Delete,
  JsonController,
  NotFoundError,
  Param,
  Post,
  InternalServerError,
  Get
} from "routing-controllers";
import { BodyProp } from "typeswag";

import { User } from "../data/models/users";

@JsonController("/user")
export default class UserController {
  @Get("/:id")
  async get(@Param("id") id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  @Post("/create")
  async addUser(
    @BodyProp("name") @BodyParam("name") name: string,
    @BodyProp("hobby") @BodyParam("hobby") hobby: string
  ) {
    const newUser = new User({ name, hobby: [hobby] });
    return newUser.save();
  }

  @Post("/update")
  async updateUser(
    @BodyProp("id") @BodyParam("id") id: string,
    @BodyProp("name") @BodyParam("name", { required: false }) name: string,
    @BodyProp("hobbies") @BodyParam("hobbies", { required: false }) hobby: string[]
  ) {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  @Delete("/delete/:id")
  async delete(@Param("id") id: string) {
    const response = await User.deleteOne({ _id: id });
    if (response.ok) {
      return "User deleted";
    } else {
      throw new InternalServerError("Unable to delete user");
    }
  }
}
