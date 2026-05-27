import { useEffect, useState } from "react";

import {
  addExpense,
  getExpenses,
  deleteExpense,
  updateExpense,
} from "../services/expenseService";

import { toast } from "react-toastify";

const categories = [
  "Food",
  "Travel",
  "Shopping",
  "Bills",
  "Health",
  "Entertainment",
  "Education",
  "Others",
];

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);

  const [search, setSearch] = useState("");

  const [filterCategory, setFilterCategory] =
    useState("");

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    payment_method: "",
    description: "",
    date: "",
  });

  // Fetch Expenses
  const fetchExpenses = async () => {
    try {
      const data = await getExpenses();

      setExpenses(data);
    } catch (error) {
      toast.error("Failed to fetch expenses");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation
      if (
        !formData.title ||
        !formData.amount ||
        !formData.category ||
        !formData.date
      ) {
        toast.error("Please fill required fields");

        return;
      }

      if (editingId) {
        await updateExpense(editingId, formData);

        toast.success("Expense updated");
      } else {
        await addExpense(formData);

        toast.success("Expense added");
      }

      setFormData({
        title: "",
        amount: "",
        category: "",
        payment_method: "",
        description: "",
        date: "",
      });

      setEditingId(null);

      fetchExpenses();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // Delete Expense
  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);

      toast.success("Expense deleted");

      fetchExpenses();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Edit Expense
  const handleEdit = (expense) => {
    setEditingId(expense.id);

    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      payment_method:
        expense.payment_method || "",
      description: expense.description || "",
      date: expense.date,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Filtered Expenses
  const filteredExpenses = expenses.filter(
    (expense) => {
      const matchesSearch =
        expense.title
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "" ||
        expense.category === filterCategory;

      return matchesSearch && matchesCategory;
    }
  );

  // Total Expenses
  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Expenses
      </h1>

      {/* Summary Card */}
      <div className="bg-black text-white p-6 rounded-xl mb-8">
        <h2 className="text-2xl font-semibold">
          Total Expenses
        </h2>

        <p className="text-3xl mt-2">
          ₹ {totalExpenses}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg p-6 rounded-xl mb-8"
      >
        <input
          type="text"
          name="title"
          placeholder="Expense Title"
          value={formData.title}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        {/* Category Dropdown */}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        >
          <option value="">
            Select Category
          </option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="payment_method"
          placeholder="Payment Method"
          value={formData.payment_method}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="border p-3 rounded-lg"
        />

        <button
          type="submit"
          className="bg-black text-white p-3 rounded-lg"
        >
          {editingId
            ? "Update Expense"
            : "Add Expense"}
        </button>
      </form>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search Expenses"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border p-3 rounded-lg flex-1"
        />

        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(e.target.value)
          }
          className="border p-3 rounded-lg"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Expense Cards */}
      <div className="grid gap-4">
        {filteredExpenses.length === 0 ? (
          <p>No expenses found</p>
        ) : (
          filteredExpenses.map((expense) => (
            <div
              key={expense.id}
              className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h2 className="text-xl font-bold">
                  {expense.title}
                </h2>

                <p className="text-gray-600">
                  ₹ {expense.amount}
                </p>

                <p>{expense.category}</p>

                <p>
                  {expense.payment_method}
                </p>

                <p>{expense.date}</p>

                <p className="text-gray-500">
                  {expense.description}
                </p>
              </div>

              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() =>
                    handleEdit(expense)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(expense.id)
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;