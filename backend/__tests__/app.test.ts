import request from "supertest";

import app from "../src/app";

describe("Test app.ts", () => {
    test("Catch-all route", async () => {
        await request(app).get("/")
            .expect("Content-Type", /json/)
            .expect(200)
            .expect({
                message: "Hello World",
            });
    });
});