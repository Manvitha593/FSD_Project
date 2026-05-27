const db = require("../config/db");

// ADD INCOME
const addIncome = (req, res) => {
  try {
    const {
      source,
      amount,
      description,
      date,
    } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    db.run(
      `
      INSERT INTO income
      (source, amount, description,
       date, user_id)
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        source,
        amount,
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
          message: "Income added successfully",
          incomeId: this.lastID,
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER INCOME
const getIncome = (req, res) => {
  try {
    db.all(
      `
      SELECT * FROM income
      WHERE user_id = ?
      ORDER BY date DESC
      `,
      [req.user.id],
      (err, income) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }

        res.status(200).json(income);
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE INCOME
const updateIncome = (req, res) => {
  try {
    const { id } = req.params;

    const {
      source,
      amount,
      description,
      date,
    } = req.body;

    db.run(
      `
      UPDATE income
      SET source = ?,
          amount = ?,
          description = ?,
          date = ?
      WHERE id = ? AND user_id = ?
      `,
      [
        source,
        amount,
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
            message: "Income not found",
          });
        }

        res.status(200).json({
          message: "Income updated successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE INCOME
const deleteIncome = (req, res) => {
  try {
    const { id } = req.params;

    db.run(
      `
      DELETE FROM income
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
            message: "Income not found",
          });
        }

        res.status(200).json({
          message: "Income deleted successfully",
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
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};