import express from "express"
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import { initDB } from "./config/db.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(rateLimiter);

const port = process.env.PORT || 5001;



app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(port, () => {
    console.log("Server is up and running on port: ", port);
  });
});

