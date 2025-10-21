# Twilio Trivia Bot by Taskines & Thunrobi

This project is a simple Twilio voice bot built with Node.js and Express. When a user calls the bot, they are greeted with a trivia challenge where they can answer questions by pressing keypad numbers. The bot responds with feedback based on the user’s input and allows them to try again.

---

## Features

* Interactive voice experience using Twilio Voice API
* Multiple-choice trivia questions with spoken prompts
* Voice response logic implemented using Twilio’s `VoiceResponse`
* REST endpoints built with Express
* Tested using Jest and Supertest
* Automated CI/CD pipeline using GitHub Actions

---

## Route

The application is deployed automatically by a GitHub Actions pipeline on every commit or merge to the `main` branch.
You can access the running version here:

**Route:**
[https://devops-twiliobot-tasthu-1.onrender.com](https://devops-twiliobot-tasthu-1.onrender.com)

---

## Pipeline

A **GitHub Actions** workflow has been configured to automatically build and deploy the application.

* The pipeline is triggered on **commits or merges to the `main` branch**.
* It runs automated tests using **Jest**.
* If all tests pass, it **deploys** the updated application.
* The workflow configuration file can be found in:

  ```
  .github/workflows/
  ```


---

## Local Development

### Prerequisites

* Node.js (version 18 or higher)
* npm

### Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/thunrobi/devops_twiliobot_tasthu.git
   cd devops_twiliobot_tasthu
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the application locally:

   ```bash
   npm start
   ```

4. The app will be available at:

   ```
   http://localhost:3000
   ```

---

## Testing

Automated tests are included to verify API responses and TwiML output.

Run tests locally with:

```bash
npm test
```

All tests are executed automatically as part of the CI/CD pipeline.

---

## Deployment

Deployment is handled automatically by GitHub Actions.

When you push or merge to the `main` branch:

1. The workflow installs dependencies.
2. Jest tests are executed.
3. If successful, the app is deployed to the configured environment Render.

You can view the workflow status in your repository under **Actions**.

---



