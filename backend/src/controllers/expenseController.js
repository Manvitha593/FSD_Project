const db = require("../config/db");

// ADD EXPENSE
const addExpense = (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      payment_method,
      description,
      date,
    } = req.body;

    if (!title || !amount || !category || !date) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    db.run(
      `
      INSERT INTO expenses
      (title, amount, category, payment_method,
       description, date, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [
        title,
        amount,
        category,
        payment_method,
        description,
        date,
        req.user.id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(201).json({
          message: "Expense added successfully",
          expenseId: this.lastID,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL USER EXPENSES
const getExpenses = (req, res) => {
  try {
    db.all(
      `
      SELECT * FROM expenses
      WHERE user_id = ?
      ORDER BY date DESC
      `,
      [req.user.id],
      (err, expenses) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(200).json(expenses);
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE EXPENSE
const updateExpense = (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      amount,
      category,
      payment_method,
      description,
      date,
    } = req.body;

    db.run(
      `
      UPDATE expenses
      SET title = ?,
          amount = ?,
          category = ?,
          payment_method = ?,
          description = ?,
          date = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        title,
        amount,
        category,
        payment_method,
        description,
        date,
        id,
        req.user.id,
      ],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message: "Expense not found",
          });
        }

        res.status(200).json({
          message: "Expense updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE EXPENSE
const deleteExpense = (req, res) => {
  try {
    const { id } = req.params;

    db.run(
      `
      DELETE FROM expenses
      WHERE id = ? AND user_id = ?
      `,
      [id, req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        if (this.changes === 0) {
          return res.status(404).json({
            message: "Expense not found",
          });
        }

        res.status(200).json({
          message: "Expense deleted successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};