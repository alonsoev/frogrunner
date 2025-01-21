const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();
const app = express();

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get("/", (req, res) => {
    res.setHeader("Content-Type", "text/html"); // Set Content-Type
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FrogRunner</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: #f0f8ff;
          }
          .container {
            margin: 50px auto;
            max-width: 600px;
            padding: 20px;
            border-radius: 10px;
            background: #fff;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 2.5em;
            color: #2c3e50;
          }
          p {
            font-size: 1.2em;
            color: #34495e;
          }
          button {
            font-size: 1.2em;
            padding: 10px 20px;
            background-color: #27ae60;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          button:hover {
            background-color: #2ecc71;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>FrogRunner 🐸🏃‍♀️</h1>
          <p>A Ribbit-powered bot to sync Strava, Whoop, & Apple Health, track leaderboards, and ignite fitness challenges. Built with the same energy that drives our passion for fintech, crypto, and innovation. Leap ahead—together! 🌟</p>
          <button onclick="location.href='/auth'">Connect with Strava</button>
        </div>
      </body>
      </html>
    `);
  });

// Route to initiate Strava authentication
app.get("/auth", (req, res) => {
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=read,activity:read`;
  res.redirect(authUrl);
});

// Callback route to handle Strava's response
app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    const tokenResponse = await axios.post("https://www.strava.com/oauth/token", {
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    });

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>FrogRunner</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            background-color: #f0f8ff;
          }
          .container {
            margin: 50px auto;
            max-width: 600px;
            padding: 20px;
            border-radius: 10px;
            background: #fff;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          }
          h1 {
            font-size: 2.5em;
            color: #2c3e50;
          }
          p {
            font-size: 1.2em;
            color: #34495e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Welcome to the Frog Challenge! 🐸</h1>
          <p>Thanks for joining the challenge. Leap into fitness and crush those leaderboards!</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    res.status(500).send("Failed to exchange code for token.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));