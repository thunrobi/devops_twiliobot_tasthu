const request = require("supertest");
const app = require("../index");

describe("Trivia Bot", () => {
  it("should respond to /voice with XML TwiML", async () => {
    const res = await request(app).post("/voice");
    expect(res.type).toMatch(/xml/);
    expect(res.text).toContain("Twilio Trivia Challenge");
  });
});
