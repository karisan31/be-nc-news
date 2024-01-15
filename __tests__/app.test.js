const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const testData = require("../db/data/test-data/index");

afterAll(() => {
    return db.end()
})

beforeEach(() => {
    return seed(testData)
})

describe("GET /api/topics", () => {
    test("status code: 200", () => {
        return request(app).get("/api/topics").expect(200)
    })
})