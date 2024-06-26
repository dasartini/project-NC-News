const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const request = require("supertest");
const app = require('../app');
const { sort } = require('../db/data/test-data/articles');

beforeEach(() => { return seed(testData) });
afterAll(() => db.end());

describe("General not found error", () => {
    test('GET (ERROR): returns 404 error if there is an invalid point entered.', () => {
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
    test('GET (ERROR): returns 404 error if there is an invalid point entered.', () => {
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
                const firstArticle = articles[0].created_at
                expect(articles[0].created_at).toBe(firstArticle)
                expect(articles).toBeSortedBy('created_at', {descending:true})
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article.hasOwnProperty("article.body")).toBe(false)
                    expect(article).toMatchObject(
                        {
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number)
                        });
                });
            });
    });
    test("GET: /api/articles?topic=mitch, Returns all the articles sorted by Mitch topic", () => {
        return request(app)
            .get('/api/articles?topic=mitch')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                expect(articles.length).toBe(12)
               articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                });

            });
    });
    test("GET: /api/articles?topic=cats, Returns all the articles sorted by cats topic", () => {
        return request(app)
            .get('/api/articles?topic=cats')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                expect(articles.length).toBe(1)
               articles.forEach((article) => {
                    expect(article.topic).toBe("cats")
                });

            });
    });
    test("GET: /api/articles?sort_by=created_at&sort_dir=DESC, Returns all the articles sorted by date and descending order by default", () => {
        return request(app)
            .get('/api/articles?sort_by=created_at&sort_dir=DESC')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                 expect(articles.length).toBe(13)
                 expect(articles).toBeSortedBy('created_at', {descending:true})
            });
    });
    test("GET: /api/articles?sort_by=created_at&sort_dir=ASC, Returns all the articles sorted by date and ascending order", () => {
        return request(app)
            .get('/api/articles?sort_by=created_at&sort_dir=ASC')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                 expect(articles.length).toBe(13)
                 expect(articles).toBeSortedBy('created_at', {ascending:true})
            });
    });
    test("GET: /api/articles?sort_by=comment_count, Returns all the articles sorted by date and descending order (default)", () => {
        return request(app)
            .get('/api/articles?sort_by=comment_count')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                 expect(articles.length).toBe(13)
                 expect(articles).toBeSortedBy('comment_count', {descending:true})
            });
    });
    test("GET: /api/articles?sort_by=votes&sort_dir=ASC, Returns all the articles sorted by vote and ascending order", () => {
        return request(app)
            .get('/api/articles?sort_by=votes&sort_dir=ASC')
            .expect(200)
            .then(({ body }) => {
                const { articles } = body
                 expect(articles.length).toBe(13)
                 expect(articles).toBeSortedBy('votes', {ascending:true})
            });
    });

    test("GET (ERROR): /api/articles?topic=WREXHAMFC, Returns an error if the topic does not exist", () => {
        return request(app)
            .get('/api/articles?topic=WREXHAMFC')
            .expect(400)
            .then(({ body }) => {
                const {message} = body
                expect(message).toBe('Bad request :(')
    });
    
});

    test("GET (ERROR): /api/articles?sort_by=WREXHAMFC&sort_dir=ASC, Returns an error if the topic does not exist", () => {
        return request(app)
            .get('/api/articles?sort_by=WREXHAMFC&sort_dir=ASC')
            .expect(400)
             .then(({ body }) => {
            const {message} = body
            expect(message).toBe('Invalid query value')
    });
});

    test("GET (ERROR): /api/articles?sort_by=votes&WARSZEWO, Returns the articles sorted by the valid query ignoring the undefined second query parameter", () => {
        return request(app)
            .get('/api/articles?sort_by=votes&WARSZEWO')
            .expect(200)
             .then(({ body }) => {
            const {articles} = body
            expect(articles).toBeSortedBy('votes', {descending:true})
            expect(articles.length).toBe(13)
            articles.forEach((article) => {
                expect(article.hasOwnProperty("article.body")).toBe(false)
                expect(article).toMatchObject(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number)
                    });
            });


    });
});
       test("GET (ERROR): /api/articles?sort_by=votes&sort_dir=WARSZEWO, Returns an error if the sort query is not valid", () => {
        return request(app)
            .get('/api/articles?sort_by=votes&sort_dir=WARSZEWO')
            .expect(400)
             .then(({ body }) => {
            const {message} = body
            expect(message).toBe('Invalid query value')
    });
});
    test("GET: /api/articles?tUpic=cats, Returns all the articles ommiting the bad query", () => {
        return request(app)
        .get('/api/articles?tUpic=cats')
        .expect(200)
            .then(({ body }) => {
                const { articles } = body
                const firstArticle = articles[0].created_at
                expect(articles[0].created_at).toBe(firstArticle)
                expect(articles.length).toBe(13)
                articles.forEach((article) => {
                    expect(article.hasOwnProperty("article.body")).toBe(false)
                    expect(article).toMatchObject(
                        {
                            article_id: expect.any(Number),
                            title: expect.any(String),
                            topic: expect.any(String),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                            article_img_url: expect.any(String),
                            comment_count: expect.any(Number)
                        });
                });
});

})


describe("/api/articles/article:id", () => {
    test("GET:/api/articles/article:id returns the specified article", () => {
        return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
                const { article } = body
                expect(article).toMatchObject(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                    });
            });
    });

    test("PATCH: /api/articles/:article_id updates an article by its id.", () => {
        return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: 5 })
            .expect(201)
            .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    article_id: 6,
                    title: 'A',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'Delicious tin of cat food',
                    created_at: '2020-10-18T01:00:00.000Z',
                    votes: 5,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });

    test("PATCH: /api/articles/:article_id updates an article by its id.", () => {
        return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: -99 })
            .expect(201)
            .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    article_id: 1,
                    title: 'Living in the shadow of a great man',
                    topic: 'mitch',
                    author: 'butter_bridge',
                    body: 'I find this existence challenging',
                    created_at: '2020-07-09T20:11:00.000Z',
                    votes: 1,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });

    test("PATCH: /api/articles/:article_id updates an article by its id (negative numbers).", () => {
        return request(app)
            .patch("/api/articles/3")
            .send({ inc_votes: -99 })
            .expect(201)
            .then(({ body }) => {
                const { article } = body
                expect(article).toEqual({
                    article_id: 3,
                    title: 'Eight pug gifs that remind me of mitch',
                    topic: 'mitch',
                    author: 'icellusedkars',
                    body: 'some gifs',
                    created_at: '2020-11-03T09:12:00.000Z',
                    votes: -99,
                    article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
                });
            });
    });

    test("PATCH (ERROR): Returns an error message when provided a valid but non-existing article id", () => {
        return request(app)
            .patch('/api/articles/RobinsAndDays')
            .expect(400)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("Bad request :(")
            });
    });
    test("PATCH (ERROR): Returns an error message when provided an higher id number", () => {
        return request(app)
            .patch('/api/articles/600')
            .expect(404)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("The id provided does not exist!")
            });
    });



    test("GET (ERROR): Returns an error message when provided a valid but non-existing article id", () => {
        return request(app)
            .get('/api/articles/papa_pear')
            .expect(400)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("Bad request :(")
            });
    });


    test("GET (ERROR): Returns an error message when provided an higher id number", () => {
        return request(app)
            .get('/api/articles/99999999')
            .expect(404)
            .then(({ body }) => {
                const { message } = body;
                expect(message).toBe("The id provided does not exist!")
            });
    });
});

describe("/api/articles/article:id extra query", () => {
    test("GET:/api/articles/article:id returns the specified article and adds the comment count", () => {
        return request(app)
            .get('/api/articles/3')
            .expect(200)
            .then(({ body }) => {
                const { article } = body
                expect(article).toMatchObject(
                    {
                        article_id: expect.any(Number),
                        title: expect.any(String),
                        topic: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        article_img_url: expect.any(String),
                        comment_count: expect.any(Number),
                    });
            });
    });
});



describe('/api/articles/:article_id/comments', () => {
    test("GET: /api/articles/:article_id/comments returns all the comments for an especified article", () => {
        return request(app)
            .get("/api/articles/9/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments.length).toBe(2)
                const firstComment = comments[0].created_at
                expect(comments[0].created_at).toBe(firstComment)
                expect(comments).toBeSortedBy('created_at', {descending:true})
                comments.forEach((comment) => {
                    expect(comment).toMatchObject(
                        {
                            comment_id: expect.any(Number),
                            body: expect.any(String),
                            article_id: expect.any(Number),
                            author: expect.any(String),
                            votes: expect.any(Number),
                            created_at: expect.any(String),
                        });
                });
            });
    });

    test("POST:/api/articles/:article_id/comments", () => {
        return request(app)
            .post('/api/articles/2/comments')
            .send({
                username: "rogersop",
                body: "I love Poland"
            })
            .expect(201)
            .then(({ body }) => {
                const { newComment } = body
                expect(newComment).toMatchObject(
                    {
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        article_id: expect.any(Number),
                        author: expect.any(String),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                    });
            });
    });
    test("POST (ERROR):/api/articles/200/comments Returns a 404 error if passed a non existing Id", () => {
        return request(app)
            .post('/api/articles/200/comments')
            .send({
                username: "rogersop",
                body: "I love Poland"
            })
            .expect(404)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("The article id attempting to post in does not exist!")
            });
    });

    test("POST (ERROR):/api/articles/2/comments Returns a 404 error if passed a non existing username", () => {
        return request(app)
            .post('/api/articles/2/comments')
            .send({
                username: "Dariusz",
                body: "I love Poland"
            })
            .expect(404)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("The username attempting to post does not exist!")
            });
    });
    test("POST (ERROR):/api/articles/NotValidEndpoint/comments Returns an error message when passed a comment using an invalid article ID", () => {
        return request(app)
            .post('/api/articles/GarethBale/comments')
            .send({
                username: "rogersop",
                body: "I love Poland"
            })
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("Bad request :(")
            });
    });

    test("GET:/api/articles/2/comments Returns an empty array when passed an comment id without comments", () => {
        return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then(({ body }) => {
                const { comments } = body
                expect(comments.length).toBe(0)
            });
    });

    test("GET (ERROR):/api/articles/99999999/comments Returns an error when passed an unexisting comment id ", () => {
        return request(app)
            .get('/api/articles/99999999/comments')
            .expect(404)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("The id provided does not exist!")
            });
    });

    test("GET (ERROR):/api/articles/ThisIsABadRequest/comments Returns an error when passed a non valid comment id ", () => {
        return request(app)
            .get('/api/articles/mushy_peas/comments')
            .expect(400)
            .then(({ body }) => {
                const { message } = body
                expect(message).toBe("Bad request :(")
            });
    });

describe('/api/comments/:comment_id', () => {

    test('DELETE:/api/comments/:comment_id Deletes the given comment by ID.', () => {
            return request(app)
                .delete('/api/comments/5')
                .expect(204)
        });
    test('DELETE (ERROR):/api/comments/99999 Returns an error when passed an invalid ID.', () => {
            return request(app)
                .delete('/api/comments/99999')
                .expect(404)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("The id provided does not exist!")
                });

        });
    test('DELETE (ERROR):/api/comments/NotAnId Returns an error when passed an invalid ID.', () => {
            return request(app)
                .delete('/api/comments/Monster_energy')
                .expect(400)
                .then(({ body }) => {
                    const { message } = body
                    expect(message).toBe("Bad request :(")
                });
        });
    });

describe('/api/users', () => {

     test('GET:/api/users Returns an array of objects, each containing all users information.', () => {
        return request(app)
                .get("/api/users")
                .expect(200)
                .then(({ body }) => {
                    const { users } = body
                    expect(typeof users).toBe("object")
                    expect(users.length).toBe(4)
                    users.forEach((user) => {
                        expect(user).toMatchObject({
                            username: expect.any(String),
                            name: expect.any(String),
                            avatar_url: expect.any(String)
                        });
                    });
                });
        });
     test('GET (ERROR):/api/asers Returns an error when passed an invalid enpoint', () => {
        return request(app)
                .get("/api/asers")
                .expect(404)
                .then(({ body }) => {
                    const { message } = body;
                    expect(message).toBe("Error 404! endpoint not found :(")
                });
        })
    });
});
})
