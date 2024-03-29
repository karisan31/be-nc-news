const request = require("supertest");
const app = require("../app");

const db = require("../db/connection");
const seed = require("../db/seeds/seed");

const testData = require("../db/data/test-data/index");
const endpointsData = require("../endpoints.json");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api/topics", () => {
  test("responds with a status code: 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("respond with an array of topic objects each with the following properties: slug, description", () => {
    return request(app)
      .get("/api/topics")
      .then(({ body }) => {
        const { topics } = body;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(typeof topic.description).toBe("string");
          expect(typeof topic.slug).toBe("string");
        });
        expect(topics[0].slug).toBe("mitch");
        expect(topics[0].description).toBe("The man, the Mitch, the legend");
      });
  });
});

describe("GET /api", () => {
  test("responds with a status code: 200", () => {
    return request(app).get("/api").expect(200);
  });
  test("responds with an object of all available endpoints of this API", () => {
    return request(app)
      .get("/api")
      .then(({ text }) => {
        const parsedBody = JSON.parse(text);
        expect(parsedBody).toEqual(endpointsData);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("responds with a status code: 200 and sends a single article to the client if article_id is valid", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Does Not Exist");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("responds with a status code: 200", () => {
    return request(app).get("/api/articles").expect(200);
  });
  test("respond with an array of articles objects each with the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count AND have its body propery removed", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
        expect(articles[0].author).toBe("icellusedkars");
        expect(articles[0].title).toBe(
          "Eight pug gifs that remind me of mitch"
        );
        expect(articles[0].article_id).toBe(3);
        expect(articles[0].topic).toBe("mitch");
        expect(articles[0].created_at).toBe("2020-11-03T09:12:00.000Z");
        expect(articles[0].votes).toBe(0);
        expect(articles[0].article_img_url).toBe(
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        );
        expect(articles[0].comment_count).toBe(2);
      });
  });
  test("should return articles in correct order by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
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
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment["article_id"]).toBe(1);
        });
      });
  });
  test("should return comments in correct order by date in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeSortedBy("created_at", { descending: true });
        expect(comments[0]).toEqual({
          comment_id: 5,
          body: "I hate streaming noses",
          article_id: 1,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-11-03T21:00:00.000Z",
        });
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Does Not Exist");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("responds with an appropriate status: 200 and sends an empty array when given a valid id but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBe(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("inserts a new comment into the database, responds with an appropriate status: 201 and sends the new comment back to the database", () => {
    const newComment = {
      username: "lurker",
      body: "I hate POST requests",
    };
    return request(app)
      .post("/api/articles/6/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.comment_id).toBe(19);
        expect(comment.body).toBe("I hate POST requests");
        expect(comment.article_id).toBe(6);
        expect(comment.author).toBe("lurker");
        expect(comment.votes).toBe(0);
        expect(comment.created_at).toEqual(expect.any(String));
      });
  });
  test("responds with an appropriate status: 400 and error message when provided with a bad comment (no username)", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send({
        body: "I've spent 4 hours on documentation today trying to figure out how to test for the current time and also I cannot add my username in this post request now apparently",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    const newComment = {
      username: "lurker",
      body: "Adding extra tests",
    };
    return request(app)
      .post("/api/articles/999/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          'Key (article_id)=(999) is not present in table "articles".'
        );
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    const newComment = {
      username: "lurker",
      body: "Adding MORE extra tests",
    };
    return request(app)
      .post("/api/articles/not-an-article/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent username", () => {
    const newComment = {
      username: "karisan",
      body: "Testing if username is non-existent",
    };
    return request(app)
      .post("/api/articles/9/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe(
          'Key (author)=(karisan) is not present in table "users".'
        );
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("responds with a status code: 200 and sends a single updated article with increased votes to the client if article_id is valid", () => {
    const newVotes = {
      inc_votes: 1,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with a status code: 200 and sends a single updated article with decreased votes to the client if article_id is valid", () => {
    const newVotes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with a status code: 200 and sends a single updated article with decreased votes if there is no votes property to the client if article_id is valid", () => {
    const newVotes = {
      inc_votes: -10,
    };
    return request(app)
      .patch("/api/articles/2")
      .send(newVotes)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toEqual({
          article_id: 2,
          title: "Sony Vaio; or, The Laptop",
          topic: "mitch",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: -10,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with an appropriate status: 400 and error message when provided with a bad votes object (NaN)", () => {
    return request(app)
      .patch("/api/articles/9")
      .send({
        inc_votes: "100 more votes",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    const newVotes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/999")
      .send(newVotes)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Does Not Exist");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    const newVotes = {
      inc_votes: -100,
    };
    return request(app)
      .patch("/api/articles/not-an-article")
      .send(newVotes)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("responds with a status code: 204, deletes the specified comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Comment Does Not Exist");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("responds with a status code: 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("respond with an array of user objects each with the following properties: username, name, avatar_url", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const { users } = body;
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
        expect(users[0]).toEqual({
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        });
      });
  });
});

describe("GET /api/articles (topic query)", () => {
  test("responds with a status code: 200 and sends all articles with the topic value specified in the query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(12);
        articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(article).toHaveProperty("topic", "mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(typeof article.comment_count).toBe("number");
        });
        expect(articles[0]).toEqual({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
  test("responds with a status code: 200 and an empty array when given a valid but non-existent topic", () => {
    return request(app)
      .get("/api/articles?topic=karisan")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(0);
      });
  });
  test("responds with a status code: 200 and sends all articles if query is omitted or incorrect", () => {
    return request(app)
      .get("/api/articles?topc=mitch")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(false);
        });
        expect(articles[0]).toEqual({
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          topic: "mitch",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 2,
        });
      });
  });
});

describe("GET /api/articles/:article_id (comment_count)", () => {
  test("responds with a status code: 200 and sends a single article to the client with the comment_count property if article_id is valid", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty("comment_count");
        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          comment_count: "11",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("responds with an appropriate status: 404 and error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article Does Not Exist");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles (sort_by query)", () => {
  test("responds with a status code: 200 and sends all articles sorted by descending created_at", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("responds with a status code: 200 and sends all articles sorted by ascending created_at", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("responds with a status code: 200 and sends all articles sorted by descending votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });
  test("responds with a status code: 200 and sends all articles sorted by ascending votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("votes", { ascending: true });
      });
  });
  test("responds with a status code: 200 and sends all articles sorted by descending comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("comment_count", { descending: true });
      });
  });
  test("responds with a status code: 200 and sends all articles sorted by ascending comment_count", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("comment_count", { ascending: true });
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid sorting query", () => {
    return request(app)
      .get("/api/articles?sort_by=topic")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid sort_by query");
      });
  });
  test("responds with an appropriate status: 400 and error message when given an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=random")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("invalid sort_by query");
      });
  });
});
