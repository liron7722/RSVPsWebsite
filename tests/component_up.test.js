const app = require("../app")
const supertest = require("supertest")
const request = supertest(app)

describe("/test endpoint", () => {
    it("should return a response", async () => {
        const response = await request.get("/users/api/test/all")
        expect(response.status).toBe(200)
        expect(response.text).toBe("Public Content.");
    })
})