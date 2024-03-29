import { Document, Model, model, Schema } from "mongoose";

import { IUser } from "../interfaces/IUser";

interface IUserDocument extends IUser, Document {}

interface IUserModel extends Model<IUserDocument> {}

const schema = new Schema({
  name: { type: String, index: true },
  hobbies: [{ type: Schema.Types.ObjectId, ref: "Hobby" }]
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
const User: IUserModel = <IUserModel>model("user", schema);
export { User, IUserDocument };
