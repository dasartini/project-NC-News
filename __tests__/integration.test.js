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

describe('GET:/api', () => {
    test("Responds with an object describing all the aviable endpoints in this API", () => {
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

    })

    test("GET: Returns an error message when provided an invalid article id",()=>{
        return request(app)
        .get('/api/articles/papa_pear')
        .expect(400)
        .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("Bad request :(")
        })
    })

    test.only("GET: Returns an error message when provided an higher id number",()=>{
        return request(app)
        .get('/api/articles/99999999')
        .expect(400)
        .then(({ body }) => {
            const { message } = body;
            expect(message).toBe("The id provided does not exist!")
        })
    })

});
