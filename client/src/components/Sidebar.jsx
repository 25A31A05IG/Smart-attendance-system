import { Link } from "react-router-dom";


function Sidebar() {


  return (

    <div className="h-screen w-64 bg-slate-950 text-white p-5 shadow-xl">


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

  );

}


export default Sidebar;