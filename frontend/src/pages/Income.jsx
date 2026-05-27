import { useEffect, useState } from "react";

import {
  addIncome,
  getIncome,
  deleteIncome,
  updateIncome,
} from "../services/incomeService";

import { toast } from "react-toastify";

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);

  const [editingId, setEditingId] =
    useState(null);

  const [formData, setFormData] = useState({
    source: "",
    amount: "",
    description: "",
    date: "",
  });

  // Fetch Income
  const fetchIncome = async () => {
    try {
      const data = await getIncome();

      setIncomeList(data);
    } catch (error) {
      toast.error("Failed to fetch income");
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // Handle Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (
        !formData.source ||
        !formData.amount ||
        !formData.date
      ) {
        toast.error(
          "Please fill required fields"
        );

        return;
      }

      if (editingId) {
        await updateIncome(
          editingId,
          formData
        );

        toast.success("Income updated");
      } else {
        await addIncome(formData);

        toast.success("Income added");
      }

      setFormData({
        source: "",
        amount: "",
        description: "",
        date: "",
      });

      setEditingId(null);

      fetchIncome();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteIncome(id);

      toast.success("Income deleted");

      fetchIncome();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // Edit
  const handleEdit = (income) => {
    setEditingId(income.id);

    setFormData({
      source: income.source,
      amount: income.amount,
      description:
        income.description || "",
      date: income.date,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Total Income
  const totalIncome = incomeList.reduce(
    (sum, income) =>
      sum + Number(income.amount),
    0
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Income
      </h1>

      {/* Summary */}
      <div className="bg-green-600 text-white p-6 rounded-xl mb-8">
        <h2 className="text-2xl font-semibold">
          Total Income
        </h2>

        <p className="text-3xl mt-2">
          ₹ {totalIncome}
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white shadow-lg p-6 rounded-xl mb-8"
      >
        <input
          type="text"
          name="source"
          placeholder="Income Source"
          value={formData.source}
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
          className="bg-green-600 text-white p-3 rounded-lg"
        >
          {editingId
            ? "Update Income"
            : "Add Income"}
        </button>
      </form>

      {/* Income Cards */}
      <div className="grid gap-4">
        {incomeList.map((income) => (
          <div
            key={income.id}
            className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <h2 className="text-xl font-bold">
                {income.source}
              </h2>

              <p>₹ {income.amount}</p>

              <p>{income.date}</p>

              <p>{income.description}</p>
            </div>

            <div className="flex gap-3 mt-4 md:mt-0">
              <button
                onClick={() =>
                  handleEdit(income)
                }
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  handleDelete(income.id)
                }
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Income;