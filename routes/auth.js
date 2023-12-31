const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const { Client } = require('pg');
const DATABASE_URL="postgres://miacqskbeyafwb:d7036d55422fa5330f1a78999dc85500b8e57b5611226416b9329639579fabe4@ec2-34-242-199-141.eu-west-1.compute.amazonaws.com:5432/d967mmgnsklhd0";


const connectToClient = async () => {
  try {
    console.log(DATABASE_URL);
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
  }
};

// login user
router.route("/").post(bodyParser.json(), async (req, res, next) => {
  try {
    const { email = "", password = "" } = req.body;


    // Query the database for the user's login information
    console.log("email", email, "password", password);
    const { rows } = await client.query(
      "SELECT * FROM users WHERE email = $1 AND password = $2",
      [email, password]
    );

    await client.end();

    // If the user is not found, return an error
    if (rows.length === 0) {
      return res.status(401).send("Invalid email or password");
    }

    // Otherwise, create a payload with the user's information
    const payload = {
      id: rows[0].id,
      email: rows[0].email,
      expiresIn: new Date(Date.now() + expiresInMins * 60000),
    };

    // Return the payload
    res.send(payload);
  } catch (error) {
    next(error);
  }
});

// register user
router.route("/registeruser").post(bodyParser.json(), async (req, res, next) => {
  try {
    const { email = "", username = "", password = "" } = req.body;


    // Check if the user already exists
    const { rows } = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    // If the user already exists, return an error
    if (rows.length > 0) {
      return res.status(409).send("User already exists");
    }

    // Otherwise, insert the new user into the database
    await client.query(
      "INSERT INTO users (email, username, password) VALUES ($1, $2, $3)",
      [email, username, password]
    );

    // Return a success message
    res.send("User registered successfully");
  } catch (error) {
    next(error);
  }
});

// register institute

router.route("/registerinstitute").post(bodyParser.json(), async (req, res, next) => {
  try {
    const { email = "", institutesuser = "", password = "" } = req.body;
    console.log(DATABASE_URL);
    const client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    await client.connect();

    // Check if the user already exists
    const { rows } = await client.query("SELECT * FROM institutesuser WHERE email = $1", [
      email,
    ]);

    // If the user already exists, return an error
    if (rows.length > 0) {
      return res.status(409).send("Institutesuser already exists");
    }

    // Otherwise, insert the new user into the database
    await client.query(
      "INSERT INTO institutesuser (email, username, password) VALUES ($1, $2, $3)",
      [email, institutesuser, password]
    );

    // Return a success message
    res.send("Institutesuser registered successfully");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
