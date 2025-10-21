const request = require("supertest");
const { app } = require("../index");

describe("Twilio Trivia Bot", () => {
  it("GET / should return a running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toMatch(/Twilio Trivia Bot is running/i);
  });

  it("POST /voice should return TwiML with welcome message", async () => {
    const res = await request(app).post("/voice").send();
    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/xml/);
    expect(res.text).toContain("Welcome to the Twilio Trivia Challenge");
    expect(res.text).toContain("/menu");
  });

  it("POST /menu with '1' should ask a question", async () => {
    const res = await request(app)
      .post("/menu")
      .send("Digits=1")
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/xml/);
    expect(res.text).toMatch(/planet|continent|mammal/i);
    expect(res.text).toContain("/answer");
  });

  it("POST /menu with invalid input should redirect to /voice", async () => {
    const res = await request(app)
      .post("/menu")
      .send("Digits=9")
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Invalid choice");
    expect(res.text).toContain("/voice");
  });

  it("POST /answer should respond with Correct or Incorrect and redirect to /voice", async () => {
    await request(app)
      .post("/menu")
      .send("Digits=1")
      .set("Content-Type", "application/x-www-form-urlencoded");

    const res = await request(app)
      .post("/answer")
      .send("Digits=1")
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/xml/);
    expect(res.text).toMatch(/Correct|Incorrect/);
    expect(res.text).toContain("/voice");
  });
});
