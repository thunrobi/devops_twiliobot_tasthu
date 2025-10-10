const express = require("express");
const { VoiceResponse } = require("twilio").twiml;

const app = express();
app.use(express.urlencoded({ extended: false }));

const QUESTIONS = [
  {
    q: "What planet is known as the Red Planet? Press 1 for Venus, 2 for Mars, 3 for Jupiter.",
    correct: "2"
  },
  {
    q: "How many continents are there? Press 1 for six, 2 for seven, 3 for eight.",
    correct: "2"
  },
  {
    q: "What is the largest mammal? Press 1 for elephant, 2 for blue whale, 3 for giraffe.",
    correct: "2"
  }
];

let currentQuestion = null;
let score = 0;

app.post("/voice", (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    numDigits: 1,
    action: "/menu",
    method: "POST",
  });
  gather.say(
    "Welcome to the Twilio Trivia Challenge! Press 1 for a trivia question, or 2 to hear your score."
  );
  twiml.redirect("/voice");
  res.type("text/xml").send(twiml.toString());
});

app.post("/menu", (req, res) => {
  const digit = req.body.Digits;
  const twiml = new VoiceResponse();

  if (digit === "1") {
    currentQuestion = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const gather = twiml.gather({
      numDigits: 1,
      action: "/answer",
      method: "POST",
    });
    gather.say(currentQuestion.q);
  } else if (digit === "2") {
    twiml.say(`Your current score is ${score} points.`);
    twiml.redirect("/voice");
  } else {
    twiml.say("Sorry, I didn’t get that.");
    twiml.redirect("/voice");
  }

  res.type("text/xml").send(twiml.toString());
});

app.post("/answer", (req, res) => {
  const answer = req.body.Digits;
  const twiml = new VoiceResponse();

  if (!currentQuestion) {
    twiml.say("No active question. Returning to main menu.");
    twiml.redirect("/voice");
  } else {
    if (answer === currentQuestion.correct) {
      score++;
      twiml.say("Correct! Well done!");
    } else {
      twiml.say("Sorry, that’s incorrect.");
    }
    twiml.say("Press 1 to play again, or 2 to check your score.");
    twiml.redirect("/voice");
  }

  res.type("text/xml").send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Trivia bot running on port ${PORT}`));

module.exports = app; // for testing
