const request = require("supertest");

let app;
let resetTrivia;

beforeEach(() => {
  delete require.cache[require.resolve("../index")];
  ({ app, resetTrivia } = require("../index"));
  resetTrivia(); 
});

describe("Twilio Trivia Bot", () => {
  it("GET / should return a running message", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Twilio Trivia Bot is running");
  });

  it("POST /voice should return TwiML with welcome message", async () => {
    const res = await request(app).post("/voice").send();
    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/xml/);
    expect(res.text).toContain("Welcome to the Twilio Trivia Challenge");
  });

  it("POST /menu with '1' should ask a question", async () => {
    const res = await request(app)
      .post("/menu")
      .send("Digits=1")
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(res.statusCode).toBe(200);
    expect(res.type).toMatch(/xml/);
    expect(res.text).toMatch(/What|planet|continent|mammal/i);
  });

  it("POST /menu with invalid input should redirect", async () => {
    const res = await request(app)
      .post("/menu")
      .send("Digits=9")
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Invalid choice");
  });

  it("POST /answer with no active question should respond accordingly", async () => {
    resetTrivia(); 
    const res = await request(app)
      .post("/answer")
      .send("Digits=1")
      .set("Content-Type", "application/x-www-form-urlencoded");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("No active question");
  });
});
