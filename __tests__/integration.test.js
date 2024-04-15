const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const request = require("supertest");
const app = require('../MVC/app')

beforeEach(() => { return seed(testData)});
afterAll(() => db.end());

describe("General not found error",()=>{
    test('GET ERROR: returns 404 error if there is an invalid point entered.',()=>{
        return request(app)
        .get("/notAnyValidEndpoint")
        .expect(404)
        .then(({body})=>{
            const {message} = body;
            expect(message).toBe("Error 404! endpoint not found :(")
        });
    });
});

describe("/api/topics", () => {
    test(" General health-check test checks api connecting successfully.", ()=>{
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
               // console.log('baaaaaaaaaaaaaaaaaaaaaaaaa', topics)
                expect(topics.length).toBe(3)
                topics.forEach((topic) => {
                    expect(typeof topic.description).toBe('string')
                    expect(typeof topic.slug).toBe('string')
                })
            })

    })
    test('ERROR: returns 404 error if there is an invalid point entered.',()=>{
        return request(app)
        .get("/api/tApics")
        .expect(404)
        .then(({body})=>{
            const {message} = body;
            expect(message).toBe("Error 404! endpoint not found :(")
        });
    });

})

describe('Being on api',()=>{
    test("Responds with an object describing all the aviable endpoints in this API",()=>{
        return request(app)
        .get("/api")
        .expect(200)
        .then(({body})=>{
            const {endpoint} = body
            expect(typeof endpoint).toBe("object")
        })
    })

})