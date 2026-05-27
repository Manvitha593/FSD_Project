import { getExpenses } from "./expenseService";
import { getIncome } from "./incomeService";

export const getDashboardData = async () => {
  const expenses = await getExpenses();

  const income = await getIncome();

  return {
    expenses,
    income,
  };
};