import mongoose = require("mongoose");
import { Connection } from "mongoose";

export default class MongoProvider {
  private _connection: Connection = {} as Connection;
  database: string;

  constructor(database?: string) {
    this.database = "mongodb://backend:7zXzMPMYxCB74B94@ds050869.mlab.com:50869/hobbies";
    mongoose.Promise = global.Promise;
    mongoose.connection.on("connected", () => {
      this.database = mongoose.connection.db.databaseName;
      this._connection = mongoose.connection;
      console.log(`connect: ${this.database}`);
    });
    mongoose.connection.on("reconnected", error => {
      console.log("reconnected");
    });
    mongoose.connection.on("disconnected", error => {
      console.log("disconnected");
    });
    mongoose.connection.on("reconnectFailed", error => {
      console.log("Reconnect failed");
    });
    if (process.env.MONGODEBUG) {
      mongoose.set("debug", true);
    }
  }

  get connection() {
    return this._connection;
  }

  get connected() {
    const state = this._connection.readyState;
    return state === 1 || state === 2;
  }

  async connect(database?: string) {
    let db = this.database;
    if (database) {
      db = database;
    }
    // connection.readyState will be "connecting"
    // until further methods are called
    // consider increasing poolSize to 10
    try {
      return mongoose.connect(db, {
        useNewUrlParser: true,
        numberOfRetries: Number.MAX_VALUE,
        useCreateIndex: true,
        autoReconnect: true,
        keepAlive: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
      });
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
