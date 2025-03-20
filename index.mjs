import express from 'express';
import dotenv from 'dotenv'; //used to acces the .env data(make the security better???) 
import apiRoute from './src/routes/apiRoute.mjs';
import cors from 'cors'; //alows requests from other ports
import db from "./src/utils/db.mjs";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
    origin: '*', // Allow any origin
    exposedHeaders: ['X-Auth-Token'], // Expose the custom header
  }));

// Middleware to serve static files from 'public' (ex. if it wants to acces /img.pgn it will searh it in public directory)
app.use(express.static('public'));

// Middleware to parse x-www-form-urlencoded data
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON
app.use(express.json());

// Use routes from apiRoute
app.use('/api', apiRoute);

app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${port}`);
  });

app.get('/health', async (req, res) => {
  let dbConnection;
  try {
    // Running a simple query to check connection
    await db.raw('SELECT 1+1 AS result');
    dbConnection = "OK";
  } catch (error) {
    console.log("ERROR: ", error)
    dbConnection = false;
  }

  return res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: Date.now(),
    db_connection: dbConnection
  });


})


export default app;
