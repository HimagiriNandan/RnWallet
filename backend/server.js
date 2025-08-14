import express from "express"
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";
import cors from "cors";
import { initDB } from "./config/db.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(rateLimiter);

app.use(
  cors({
    credentials: true, 
    origin: ["https://rn-wallet-frontend.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 5001;

app.use("/api/transactions", transactionsRoute);

initDB().then(() => {
  app.listen(port, () => {
    console.log("Server is up and running on port: ", port);
  });
});

