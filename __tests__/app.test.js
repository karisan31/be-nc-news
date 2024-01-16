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

describe("GET /api/articles", () => {
    test("responds with a status code: 200", () => {
        return request(app).get("/api/articles").expect(200)
    })
    test("respond with an array of articles objects each with the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count AND have its body propery removed", () => {
        return request(app)
            .get("/api/articles")
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article.hasOwnProperty('author')).toBe(true)
                    expect(article.hasOwnProperty('title')).toBe(true)
                    expect(article.hasOwnProperty('article_id')).toBe(true)
                    expect(article.hasOwnProperty('topic')).toBe(true)
                    expect(article.hasOwnProperty('created_at')).toBe(true)
                    expect(article.hasOwnProperty('votes')).toBe(true)
                    expect(article.hasOwnProperty('article_img_url')).toBe(true)
                    expect(article.hasOwnProperty('comment_count')).toBe(true)
                    expect(article.hasOwnProperty('body')).toBe(false)
                })
                expect(articles[0].author).toBe("icellusedkars")
                expect(articles[0].title).toBe("Eight pug gifs that remind me of mitch")
                expect(articles[0].article_id).toBe(3)
                expect(articles[0].topic).toBe("mitch")
                expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z")
                expect(articles[0].votes).toBe(0)
                expect(articles[0].article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
                expect(articles[0].comment_count).toBe('2')
            });
    });
    test('should return articles in correct order by date in descending order', () => {
        return request(app)
        .get("/api/articles")
        .then(({body}) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("responds with a status code: 200 and sends all comments as an array for a single article to the client if article_id is valid", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBe(11)
                comments.forEach((comment) => {
                    expect(comment.hasOwnProperty('author')).toBe(true)
                    expect(comment.hasOwnProperty('comment_id')).toBe(true)
                    expect(comment.hasOwnProperty('created_at')).toBe(true)
                    expect(comment.hasOwnProperty('votes')).toBe(true)
                    expect(comment.hasOwnProperty('body')).toBe(true)
                    expect(comment['article_id']).toBe(1)
                })
            })
    });
    test('should return comments in correct order by date in descending order', () => {
        return request(app)
        .get("/api/articles/1/comments")
        .then(({ body }) => {
            const { comments } = body;
            expect(comments).toBeSortedBy('created_at', {descending: true});
            expect(comments[0]).toEqual({
                comment_id: 5,
                body: 'I hate streaming noses',
                article_id: 1,
                author: 'icellusedkars',
                votes: 0,
                created_at: '2020-11-03T21:00:00.000Z'
              });
        });
    });
    test('responds with an appropriate status: 404 and error message when given a valid but non-existent id', () => {
        return request(app)
            .get('/api/articles/999/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Article Does Not Exist');
            });
    });
    test('responds with an appropriate status: 400 and error message when given an invalid id', () => {
        return request(app)
            .get('/api/articles/not-an-article/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
            });
    });
});

describe("POST /api/articles/:article_id/comments", () => {
    test("inserts a new comment into the database and sends the new comment back to the database", () => {
        const newComment = {
            username: 'lurker',
            body: "I hate POST requests"
        }
        return request(app)
            .post("/api/articles/6/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                const currentTime = new Date()
                expect(comment.comment_id).toBe(19);
                expect(comment.body).toBe('I hate POST requests');
                expect(comment.article_id).toBe(6);
                expect(comment.author).toBe('lurker');
                expect(comment.votes).toBe(0);
            })
    });
});
