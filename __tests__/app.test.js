const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json")

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
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe("string")
                    expect(typeof topic.slug).toBe("string")
                })
                expect(topics[0].slug).toBe("mitch")
                expect(topics[0].description).toBe("The man, the Mitch, the legend")
            });
    });
});

describe("GET /api", () => {
    test("responds with a status code: 200", () => {
        return request(app).get("/api").expect(200)
    })
    test("responds with an object of all available endpoints of this API", () => {
        return request(app)
            .get("/api")
            .then(({ text }) => {
                const parsedBody = JSON.parse(text);
                expect(parsedBody).toEqual(endpointsData)
            })
    })
});

describe("GET /api/articles/:article_id", () => {
    test("responds with a status code: 200 and sends a single article to the client if article_id is valid", () => {
        return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body }) => {
                const { article } = body;
                expect(article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 100,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                })
            })
    });
    test('responds with an appropriate status: 404 and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article Does Not Exist');
            });
    });
    test('responds with an appropriate status: 400 and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-an-article')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
            });
    });
});

