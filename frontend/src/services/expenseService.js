import API from "../api/axios";

// Get token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.token;
};

// Add Expense
export const addExpense = async (expenseData) => {
  const response = await API.post(
    "/expenses",
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Get Expenses
export const getExpenses = async () => {
  const response = await API.get("/expenses", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Delete Expense
export const deleteExpense = async (id) => {
  const response = await API.delete(
    `/expenses/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Expense
export const updateExpense = async (
  id,
  expenseData
) => {
  const response = await API.put(
    `/expenses/${id}`,
    expenseData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};