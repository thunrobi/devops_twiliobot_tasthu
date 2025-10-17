const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const cors = require("cors");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors());


const QUESTIONS = [
  { q: "What planet is known as the Red Planet? Press 1 for Venus, 2 for Mars, 3 for Jupiter.", correct: "2" },
  { q: "How many continents are there? Press 1 for six, 2 for eight, 3 for seven.", correct: "3" },
  { q: "What is the largest mammal? Press 1 for blue whale, 2 for elephant, 3 for giraffe.", correct: "2" },
];

let currentQuestion = null;

const sendTwiML = (res, twiml) => res.type("text/xml").send(twiml.toString());

app.get("/", (req, res) => {
  res.send("Twilio Trivia Bot is running ");
});

app.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({ numDigits: 1, action: "/menu", method: "POST" });
  gather.say("Welcome to the Twilio Trivia Challenge! Press 1 to start a question.");
  twiml.redirect("/voice");
  sendTwiML(res, twiml);
});


app.post("/menu", (req, res) => {
  const twiml = new VoiceResponse();
  if (req.body.Digits === "1") {
    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const gather = twiml.gather({ numDigits: 1, action: "/answer", method: "POST" });
    gather.say(currentQuestion.q);
  } else {
    twiml.say("Invalid choice. Press 1 to start a question.");
    twiml.redirect("/voice");
  }
  sendTwiML(res, twiml);
});


app.post("/answer", (req, res) => {
  const twiml = new VoiceResponse();
  const answer = req.body.Digits;

  if (!currentQuestion) {
    twiml.say("No active question. Press 1 to start.");
    twiml.redirect("/voice");
    currentQuestion = null;
  } else {
    twiml.say(answer === currentQuestion.correct ? "Correct!" : "Incorrect.");
    twiml.say("Press 1 to try another question.");
    twiml.redirect("/voice");
    currentQuestion = null;
  }

  sendTwiML(res, twiml);
});


const resetTrivia = () => {
  currentQuestion = null;
};


const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Trivia bot running on port ${PORT}`));
}


module.exports = { app, resetTrivia };
