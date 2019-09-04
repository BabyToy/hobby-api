import assert = require("assert");
import request = require("supertest");

import { expressApp } from "../app";
import MongoProvider from "../common/mongoProvider";
import { User } from "../data/models/users";

const mongoose: MongoProvider = new MongoProvider();
const newName = "Updated name";

describe("Test user controller", () => {
  const app = expressApp();
  let id = "";

  before(() => {
    mongoose.connect();
  });

  it("test create", async () => {
    await request(app)
      .post("/user/create")
      .send({ name: "Ian", hobby: "diving" })
      .expect("Content-Type", /json/)
      .expect(response => {
        id = response.body.id;
      })
      .expect(200);
  });

  it("verify user created", async () => {
    await request(app)
      .get("/user/")
      .query({ id })
      .expect("Content-Type", /json/)
      .expect(response => {
        assert.strictEqual(response.body.name, "Ian");
      });
  });

  it("test update", async () => {
    await request(app)
      .post("/user/update")
      .send({ id, name: newName })
      .expect("Content-Type", /json/)
      .expect(response => {
        assert.strictEqual(response.body.name, newName);
      });
  });

  it("verify user was updated", async () => {
    const user = await User.findById(id);
    if (!user) {
      return assert.fail("User not found");
    }
    assert.strictEqual(user.name, newName);
  });

  it("test delete", async () => {
    await request(app)
      .delete("/user/delete")
      .query({ id });
    const user = await User.findById(id);
    assert.ok(!user, "User not deleted");
  });
});
