import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">
        Expense Manager Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/expenses"
          className="bg-black text-white p-8 rounded-xl text-center text-2xl font-semibold"
        >
          Manage Expenses
        </Link>

        <Link
          to="/income"
          className="bg-green-600 text-white p-8 rounded-xl text-center text-2xl font-semibold"
        >
          Manage Income
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;