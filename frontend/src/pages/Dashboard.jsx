import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import { getDashboardData } from "../services/dashboardService";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);

  const [income, setIncome] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await getDashboardData();

      setExpenses(data.expenses);

      setIncome(data.income);
    } catch (error) {
      console.log(error);
    }
  };

  // Totals
  const totalExpenses = expenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount),
    0
  );

  const totalIncome = income.reduce(
    (sum, item) =>
      sum + Number(item.amount),
    0
  );

  const balance =
    totalIncome - totalExpenses;

  const savingsRate =
    totalIncome > 0
      ? (
          (balance / totalIncome) *
          100
        ).toFixed(1)
      : 0;

  // Pie Chart Data
  const categoryTotals = {};

  expenses.forEach((expense) => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }

    categoryTotals[expense.category] +=
      Number(expense.amount);
  });

  const pieData = Object.keys(
    categoryTotals
  ).map((category) => ({
    name: category,
    value: categoryTotals[category],
  }));

  // Monthly Chart
  const monthlyTotals = {};

  expenses.forEach((expense) => {
    const month = new Date(
      expense.date
    ).toLocaleString("default", {
      month: "short",
    });

    if (!monthlyTotals[month]) {
      monthlyTotals[month] = 0;
    }

    monthlyTotals[month] += Number(
      expense.amount
    );
  });

  const barData = Object.keys(
    monthlyTotals
  ).map((month) => ({
    month,
    amount: monthlyTotals[month],
  }));

  // Recent Transactions
  const recentExpenses = expenses.slice(
    0,
    5
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold">
            Financial Dashboard
          </h1>

          <p className="text-gray-600 mt-2">
            Track your finances smartly
          </p>
        </div>

        <div className="flex gap-4 mt-4 md:mt-0">
          <Link
            to="/expenses"
            className="bg-black text-white px-5 py-3 rounded-xl shadow-lg"
          >
            Expenses
          </Link>

          <Link
            to="/income"
            className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg"
          >
            Income
          </Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {/* Balance */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-gray-500">
            Total Balance
          </h2>

          <p className="text-3xl font-bold mt-3">
            ₹ {balance}
          </p>
        </div>

        {/* Income */}
        <div className="bg-green-500 text-white rounded-2xl shadow-lg p-6">
          <h2>Total Income</h2>

          <p className="text-3xl font-bold mt-3">
            ₹ {totalIncome}
          </p>
        </div>

        {/* Expenses */}
        <div className="bg-red-500 text-white rounded-2xl shadow-lg p-6">
          <h2>Total Expenses</h2>

          <p className="text-3xl font-bold mt-3">
            ₹ {totalExpenses}
          </p>
        </div>

        {/* Savings */}
        <div className="bg-blue-500 text-white rounded-2xl shadow-lg p-6">
          <h2>Savings Rate</h2>

          <p className="text-3xl font-bold mt-3">
            {savingsRate}%
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            Expense Categories
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={100}
                label
              >
                {pieData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={[
                      "#000000",
                      "#22c55e",
                      "#ef4444",
                      "#3b82f6",
                      "#f59e0b",
                      "#8b5cf6",
                    ][index % 6]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">
            Monthly Expenses
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="amount"
                fill="#000000"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Recent Expenses
        </h2>

        <div className="space-y-4">
          {recentExpenses.length === 0 ? (
            <p>No recent expenses</p>
          ) : (
            recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex justify-between items-center border-b pb-3"
              >
                <div>
                  <h3 className="font-semibold">
                    {expense.title}
                  </h3>

                  <p className="text-gray-500">
                    {expense.category}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    ₹ {expense.amount}
                  </p>

                  <p className="text-gray-500">
                    {expense.date}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;