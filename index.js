const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const BASE_URL = process.env.BASE_URL || "https://devops-twiliobot-tasthu-1.onrender.com";

const QUESTIONS = [
  { q: "What planet is known as the Red Planet? Press 1 for Venus, 2 for Mars, 3 for Jupiter.", correct: "2" },
  { q: "How many continents are there? Press 1 for six, 2 for eight, 3 for seven.", correct: "3" },
  { q: "What is the largest mammal? Press 1 for blue whale, 2 for elephant, 3 for giraffe.", correct: "1" },
];

let currentQuestion = null;

const sendTwiML = (res, twiml) => {
  res.type("text/xml").send(twiml.toString());
};

app.get("/", (req, res) => {
  res.send("Twilio Trivia Bot is running");
});

app.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    numDigits: 1,
    action: `${BASE_URL}/menu`,
    method: "POST",
  });
  gather.say("Welcome to the Twilio Trivia Challenge! Press 1 to start a question.");
  sendTwiML(res, twiml);
});

app.post("/menu", (req, res) => {
  const twiml = new VoiceResponse();
  const digits = req.body.Digits;
  console.log("Menu digits:", req.body);

  if (digits === "1") {
    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const gather = twiml.gather({
      numDigits: 1,
      action: `${BASE_URL}/answer`,
      method: "POST",
    });
    gather.say(currentQuestion.q);
  } else {
    twiml.say("Invalid choice. Press 1 to start a question.");
    twiml.redirect(`${BASE_URL}/voice`);
  }

  sendTwiML(res, twiml);
});

app.post("/answer", (req, res) => {
  const twiml = new VoiceResponse();
  const answer = req.body.Digits;
  console.log("Answer digits:", req.body);

  if (!currentQuestion) {
    twiml.say("No active question. Press 1 to start.");
    twiml.redirect(`${BASE_URL}/voice`);
  } else {
    const correct = answer === currentQuestion.correct;
    twiml.say(correct ? "Correct!" : "Incorrect.");
    twiml.say("Press 1 to try another question.");
    twiml.redirect(`${BASE_URL}/voice`);
    currentQuestion = null;
  }

  sendTwiML(res, twiml);
});

const resetTrivia = () => {
  currentQuestion = null;
};

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).send("Internal Server Error");
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Trivia bot running on port ${PORT}`));
}

module.exports = { app, resetTrivia };
