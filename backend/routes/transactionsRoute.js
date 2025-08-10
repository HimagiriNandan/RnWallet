import express from "express";
import { getTransactionsbyUserId, createTransaction, deleteTransaction, getSummarybyUserId } from "../controllers/transactionsController.js";
const router = express.Router();

router.get("/:userid", getTransactionsbyUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);
router.get("/summary/:userid", getSummarybyUserId);

export default router;