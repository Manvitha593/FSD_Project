import { Link, Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const navigate = useNavigate();

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black text-white p-6 hidden md:flex flex-col">
        <h1 className="text-3xl font-bold mb-10">
          Expense Manager
        </h1>

        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="hover:bg-gray-800 p-3 rounded-lg"
          >
            Dashboard
          </Link>

          <Link
            to="/expenses"
            className="hover:bg-gray-800 p-3 rounded-lg"
          >
            Expenses
          </Link>

          <Link
            to="/income"
            className="hover:bg-gray-800 p-3 rounded-lg"
          >
            Income
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 mt-6 p-3 rounded-lg"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Financial Tracker
          </h2>

          <div className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center">
            U
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;