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
import { Hobby } from "../data/models/hobbies";

@JsonController("/hobby")
export default class UserController {
  @Get("/:id")
  async get(@Param("id") id: string) {
    const user = await Hobby.findById(id);
    if (!user) {
      throw new NotFoundError("Hobby not found");
    }
    return user;
  }

  @Post("/create")
  async addUser(
    @BodyProp("name") @BodyParam("name") name: string,
    @BodyProp("level") @BodyParam("level") level: number,
    @BodyProp("year") @BodyParam("year") year: number
  ) {
    const newHobby = new Hobby({ name, passionLevel: level, year });
    return newHobby.save();
  }

  @Post("/update")
  async updateUser(
    @BodyProp("id") @BodyParam("id") id: string,
    @BodyProp("name") @BodyParam("name", { required: false }) name?: string,
    @BodyProp("level") @BodyParam("level", { required: false }) level?: number,
    @BodyProp("year") @BodyParam("year", { required: false }) year?: number
  ) {
    const hobby = await Hobby.findById(id);
    if (!hobby) {
      throw new NotFoundError("Hobby not found");
    }
    if (name) {
      hobby.name = name;
    }
    if (level) {
      hobby.passionLevel = level;
    }
    if (year) {
      hobby.year = year;
    }
    return hobby.save();
  }

  @Delete("/delete/:id")
  async delete(@Param("id") id: string) {
    const response = await Hobby.deleteOne({ _id: id });
    if (response.ok) {
      return "Hobby deleted";
    } else {
      throw new InternalServerError("Unable to delete hobby");
    }
  }
}
