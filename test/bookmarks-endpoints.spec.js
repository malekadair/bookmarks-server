const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeBookmarksArray } = require("./bookmarks.fixtures");

describe.only("Bookmarks Endpoints", function() {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db("bookmarks").truncate());

  afterEach("cleanup", () => db("bookmarks").truncate());

  context(`Given no bookmarks`, () => {
    it(`responds with 200 and an empty list`, () => {
      console.log(process.env.API_TOKEN);

      return supertest(app)
        .get("/bookmarks")
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(200, []);
    });
  });
  context("Given there are Bookmarks in the database", () => {
    const testBookmarks = makeBookmarksArray();

    beforeEach("insert Bookmarks", () => {
      return db.into("bookmarks").insert(testBookmarks);
    });
    it("GET /Bookmarks responds with 200 and all of the Bookmarks", () => {
      return supertest(app)
        .get("/bookmarks")
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(200, testBookmarks);
    });
  });
});
