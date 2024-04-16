const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const request = require("supertest");
const app = require('../MVC/app')

beforeEach(() => { return seed(testData) });
afterAll(() => db.end());

describe("General not found error", () => {
    test('GET ERROR: returns 404 error if there is an invalid point entered.', () => {
        return request(app)
            .get("/notAnyValidEndpoint")
            .expect(404)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("Error 404! endpoint not found :(")
            });
    });
});

describe("/api/topics", () => {
    test(" General health-check test checks api connecting successfully.", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)

    });

    test("GET: returns an array of the topics", () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                const { topics } = body;
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                });
            });

    });
    test('ERROR: returns 404 error if there is an invalid point entered.', () => {
        return request(app)
            .get("/api/tApics")
            .expect(404)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("Error 404! endpoint not found :(")
            });
    });

});

describe('/api', () => {
    test("GET:/api Responds with an object describing all the aviable endpoints in this API", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(({ body }) => {
                const { endpoint } = body
                expect(typeof endpoint).toBe("object")
                expect(endpoint.hasOwnProperty("GET /api")).toBe(true)
                expect(endpoint.hasOwnProperty("GET /api/topics")).toBe(true)
                expect(endpoint.hasOwnProperty("GET /api/articles")).toBe(true)
                expect(endpoint.hasOwnProperty("GET /api/articles/:article_id")).toBe(true)
            });
    });

});

describe("/api/articles", () => {
    test("GET:/api/articles returns an array containing all the articles", () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                expect(articles[0].created_at).toBe('2020-11-03T09:12:00.000Z')
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(typeof article.comment_count).toBe('number')
                    expect(typeof article.article_id).toBe('number')
                    expect(typeof article.title).toBe('string')
                    expect(typeof article.topic).toBe('string')
                    expect(typeof article.author).toBe('string')
                    expect(article.hasOwnProperty("article.body")).toBe(false)
                    expect(typeof article.created_at).toBe('string')
                    expect(typeof article.votes).toBe('number')
                    expect(typeof article.article_img_url).toBe("string")
                });
            });
    })


});

test("GET:/api/articles/article:id returns the specified article", () => {
    return request(app)
        .get('/api/articles/6')
        .expect(200)
        .then(({ body }) => {
            const { article } = body
            expect(typeof article).toBe("object")
            expect(article.hasOwnProperty('article_id')).toBe(true)
            expect(article.hasOwnProperty('article_img_url')).toBe(true)
            expect(article.hasOwnProperty('author')).toBe(true)
            expect(article.hasOwnProperty('body')).toBe(true)
            expect(article.hasOwnProperty('created_at')).toBe(true)
            expect(article.hasOwnProperty('title')).toBe(true)
            expect(article.hasOwnProperty('topic')).toBe(true)
            expect(article.hasOwnProperty('votes')).toBe(true)
        })

});

test("GET: Returns an error message when provided a valid but non-existing article id", () => {
    return request(app)
        .get('/api/articles/papa_pear')
        .expect(400)
        .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("Bad request :(")
        })
});

test("GET: Returns an error message when provided an higher id number", () => {
    return request(app)
        .get('/api/articles/99999999')
        .expect(404)
        .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("The id provided does not exist!")
        })
});


describe('/api/articles/:article_id/comments', () => {
    test("GET: /api/articles/:article_id/comments returns all the comments for an especified article", () => {
        return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments.length).toBe(2)
                expect(comments[0].created_at).toBe("2020-04-06T12:17:00.000Z")
                comments.forEach((comment) => {
                    expect(typeof comment).toBe('object')
                    expect(typeof comment.comment_id).toBe('number')
                    expect(typeof comment.body).toBe('string')
                    expect(typeof comment.article_id).toBe('number')
                    expect(typeof comment.author).toBe('string')
                    expect(typeof comment.votes).toBe('number')
                    expect(typeof comment.created_at).toBe('string')
                })
            });
    });

    test("GET:/api/articles/2/comments Returns an empty array when passed an comment id without comments", () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments.length).toBe(0)
            })
    })

    test("GET:/api/articles/99999999/comments Returns an error when passed an unexisting comment id ", () => {
        return request(app)
            .get('/api/articles/99999999/comments')
            .expect(404)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("The id provided does not exist!")
            })
    })

    test("GET:/api/articles/ThisIsABadRequest/comments Returns an error when passed a non valid comment id ", () => {
        return request(app)
            .get('/api/articles/mushy_peas/comments')
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("Bad request :(")
            })
    })

});