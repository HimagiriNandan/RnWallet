import { sql } from "../config/db.js"; 

async function getTransactionsbyUserId(req, res){
  try{
    const { userid } = req.params;
    if(!userid){
      return res.status(400).json({ message: "User ID is required." });
    }

    const transactions = await sql`
      SELECT * FROM transactions WHERE user_id = ${userid} ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  }catch(err){
    console.error("Error fetching transactions:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function createTransaction(req, res){
  try{
    const { user_id, title, amount, category } = req.body;
    if(!user_id || !title || amount === undefined || !category){
      return res.status(400).json({ message: "All fields are required." });
    }

    const transaction = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction[0]);
    
  }catch(err){
    console.error("Error creating transaction:", err);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function deleteTransaction(req, res){
  try {
    const {id} = req.params;
    if(isNaN(parseInt(id))){
      return res.status(400).json({ message: "Invalid transaction ID." });
    }
    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if(result.length === 0){
      return res.status(404).json({ message: "Transaction not found." });
    }

    res.status(200).json({ message: "Transaction deleted successfully.", transaction: result[0] });

  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getSummarybyUserId(req, res){
  try {
    const { userid } = req.params;
    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance 
      FROM transactions where user_id = ${userid}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income 
      FROM transactions WHERE user_id = ${userid} AND amount > 0
    `;

    const expenses = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses 
      FROM transactions WHERE user_id = ${userid} AND amount < 0
    `;

    const summary = {
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expenses[0].expenses
    };

    res.status(200).json(summary);

  } catch (error) {
    console.error("Error fetching transaction summary:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

export { getTransactionsbyUserId, createTransaction, deleteTransaction, getSummarybyUserId };