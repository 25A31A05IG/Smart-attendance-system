import { Link } from "react-router-dom";

function Sidebar() {

  return (

    <>

      {/* Desktop Sidebar */}

      <div className="hidden md:block h-screen w-64 bg-slate-950 text-white p-5 shadow-xl">

        <h1 className="text-2xl font-bold mb-10 text-green-400">

          Smart Attendance

        </h1>

        <nav className="space-y-5">

          <Link
            to="/dashboard"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Dashboard
          </Link>

          <Link
            to="/students"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Students
          </Link>

          <Link
            to="/attendance"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance
          </Link>

          <Link
            to="/attendance-history"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance History
          </Link>

          <Link
            to="/attendance-report"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Attendance Report
          </Link>

          <Link
            to="/working-days"
            className="block p-3 rounded-lg hover:bg-green-600 hover:text-white transition"
          >
            Working Days
          </Link>

        </nav>

      </div>


      {/* Mobile Navigation */}

      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-slate-950 text-white shadow-xl">

        <div className="flex items-center justify-between px-4 py-3">

          <h1 className="text-lg font-bold text-green-400">
            Smart Attendance
          </h1>

        </div>


        <nav className="flex overflow-x-auto gap-2 px-3 pb-3">

          <Link
            to="/dashboard"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            🏠 Dashboard
          </Link>

          <Link
            to="/students"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            👨‍🎓 Students
          </Link>

          <Link
            to="/attendance"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            ✅ Attendance
          </Link>

          <Link
            to="/attendance-history"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            📋 History
          </Link>

          <Link
            to="/attendance-report"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            📊 Reports
          </Link>

          <Link
            to="/working-days"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-slate-800 hover:bg-green-600 transition text-sm"
          >
            📅 Working Days
          </Link>

        </nav>

      </div>

    </>

  );

}

export default Sidebar;
