import { Document, Model, model, Schema } from "mongoose";
import Int32 = require("mongoose-int32");

import { IHobby } from "../interfaces/IHobby";

interface IHobbyDocument extends IHobby, Document {}

interface IHobbyModel extends Model<IHobbyDocument> {}

const schema = new Schema({
  passionLevel: Int32,
  name: { type: String, index: true, unique: true },
  year: Int32
});

schema.post("save", (error, doc, next) => {
  if (error.name === "MongoError") {
    switch (error.code) {
      case 11000: {
        next(new Error(error.message));
      }
    }
    next(new Error(error.message));
  } else {
    next(error);
  }
});

// tslint:disable-next-line:variable-name
const Hobby: IHobbyModel = <IHobbyModel>model("hobby", schema);
export { Hobby, IHobbyDocument };
