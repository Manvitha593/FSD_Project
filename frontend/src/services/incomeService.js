import API from "../api/axios";

// Get token
const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return user?.token;
};

// Add Income
export const addIncome = async (incomeData) => {
  const response = await API.post(
    "/income",
    incomeData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Get Income
export const getIncome = async () => {
  const response = await API.get("/income", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

// Delete Income
export const deleteIncome = async (id) => {
  const response = await API.delete(
    `/income/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// Update Income
export const updateIncome = async (
  id,
  incomeData
) => {
  const response = await API.put(
    `/income/${id}`,
    incomeData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};