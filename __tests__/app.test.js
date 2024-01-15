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
    test("responds with a status code: 200", () => {
        return request(app).get("/api/topics").expect(200)
    })
    test("respond with an array of topic objects each with the following properties: slug, description", () => {
        return request(app)
            .get("/api/topics")
            .then(({ body }) => {
                const { topics } = body;
                expect(Array.isArray(topics)).toBe(true);
                expect(topics.length).toBeGreaterThan(0)
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe("string")
                    expect(typeof topic.slug).toBe("string")
                })
                expect(topics[0].slug).toBe("mitch")
                expect(topics[0].description).toBe("The man, the Mitch, the legend")
            });
    });
});

// describe("GET /api/banana", () => {
//     test("responds with a status code: 404", () => {
//         return request(app)
//             .get("/api/banana").expect(404)
//             .then((response) => {
//                 expect(response.body.msg).toBe('Route Not Found')
//             })
//     });
// });