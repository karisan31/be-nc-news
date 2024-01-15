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
                expect(parsedBody['GET /api']).toEqual({
                    "description": "serves up a json representation of all the available endpoints of the api"
                })
                expect(parsedBody['GET /api/topics']).toEqual({
                    "description": "serves an array of all topics",
                    "queries": [],
                    "exampleResponse": {
                        "topics": [{ "slug": "football", "description": "Footie!" }]
                    }
                })
                expect(parsedBody['GET /api/articles']).toEqual({
                    "description": "serves an array of all articles",
                    "queries": ["author", "topic", "sort_by", "order"],
                    "exampleResponse": {
                        "articles": [
                            {
                                "title": "Seafood substitutions are increasing",
                                "topic": "cooking",
                                "author": "weegembump",
                                "body": "Text from the article..",
                                "created_at": "2018-05-30T15:59:13.341Z",
                                "votes": 0,
                                "comment_count": 6
                            }
                        ]
                    }
                })
                expect(parsedBody['GET /api/comments']).toEqual({
                    "description": "serves an array of all comments",
                    "queries": ["author", "votes", "sort_by"],
                    "exampleResponse": {
                        "articles": [
                            {
                                "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                                "votes": 16,
                                "author": "butter_bridge",
                                "article_id": 9,
                                "created_at": 1586179020000
                            }
                        ]
                    }
                })
                expect(parsedBody['GET /api/users']).toEqual({
                    "description": "serves an array of all users",
                    "queries": [],
                    "exampleResponse": {
                        "articles": [
                            {
                                "username": "butter_bridge",
                                "name": "jonny",
                                "avatar_url":
                                    "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                            }
                        ]
                    }
                })
            })
    })
});

describe("GET /api/articles/:article_id", () => {
    test("responds with a status code: 200 and sends a single article to the client", () => {
        return request(app).get("/api/articles/1").expect(200)
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
});

