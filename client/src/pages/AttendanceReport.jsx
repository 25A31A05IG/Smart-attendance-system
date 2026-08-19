import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

function AttendanceReport() {
  const [rollNumber, setRollNumber] = useState("");

  const [report, setReport] = useState(null);

  const searchStudent = async () => {
    try {
      const response = await API.get(
        `/report/${rollNumber}`
      );

      setReport(response.data.data);
    } catch (error) {
      console.log(error);

      alert("Student not found");
    }
  };

  const shareReport = async () => {
    const text = `
Attendance Report

Student Name: ${report.student.name}

Roll Number: ${report.student.rollNumber}

Department: ${report.student.department}

Year: ${report.student.year}

Section: ${report.student.section}

Total Working Days: ${report.attendance.totalWorkingDays}

Present Days: ${report.attendance.presentDays}

Absent Days: ${report.attendance.absentDays}

Attendance Percentage: ${report.attendance.percentage}%
`;

    if (navigator.share) {
      await navigator.share({
        title: "Attendance Report",
        text: text
      });
    } else {
      navigator.clipboard.writeText(text);

      alert("Report copied to clipboard");
    }
  };

  return (
    <div className="flex min-h-screen">

      <Sidebar />

      <div className="flex-1 bg-slate-900 min-h-screen p-4 sm:p-6 lg:p-8 text-white pt-28 md:pt-0">

        {/* ================= TITLE ================= */}

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-green-400">
          Attendance Report
        </h1>


        {/* ================= SEARCH ================= */}

        <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-6">

          <h2 className="text-lg sm:text-xl font-bold mb-4 text-green-400">
            Search Student
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">

            <input
              type="text"
              placeholder="Enter Roll Number"
              value={rollNumber}
              onChange={(e) =>
                setRollNumber(e.target.value)
              }
              className="bg-slate-900 border border-slate-600 p-3 rounded w-full sm:w-80"
            />

            <button
              onClick={searchStudent}
              className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded w-full sm:w-auto"
            >
              Search
            </button>

          </div>

        </div>


        {/* ================= REPORT ================= */}

        {report && (
          <>

            {/* ================= SHARE ================= */}

            <div className="flex justify-end mb-5">

              <button
                onClick={shareReport}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded w-full sm:w-auto"
              >
                📤 Share Report
              </button>

            </div>


            {/* ================= STUDENT PROFILE ================= */}

            <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-6">

              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-green-400">
                Student Profile
              </h2>

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">

                <img
                  src={
                    report.student.faceImage
                      ? `http://localhost:5000/${report.student.faceImage}`
                      : "https://via.placeholder.com/150"
                  }
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover"
                />

                <div className="text-center sm:text-left space-y-2">

                  <p>
                    <b>Name:</b>{" "}
                    {report.student.name}
                  </p>

                  <p>
                    <b>Roll Number:</b>{" "}
                    {report.student.rollNumber}
                  </p>

                  <p>
                    <b>Department:</b>{" "}
                    {report.student.department}
                  </p>

                  <p>
                    <b>Year:</b>{" "}
                    {report.student.year}
                  </p>

                  <p>
                    <b>Section:</b>{" "}
                    {report.student.section}
                  </p>

                </div>

              </div>

            </div>


            {/* ================= ATTENDANCE SUMMARY ================= */}

            <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow mb-6">

              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-green-400">
                Attendance Summary
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <div className="bg-slate-700 p-4 sm:p-5 rounded">

                  <h3>
                    Total Working Days
                  </h3>

                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    {report.attendance.totalWorkingDays}
                  </p>

                </div>


                <div className="bg-slate-700 p-4 sm:p-5 rounded">

                  <h3>
                    Present
                  </h3>

                  <p className="text-2xl sm:text-3xl font-bold text-green-400">
                    {report.attendance.presentDays}
                  </p>

                </div>


                <div className="bg-slate-700 p-4 sm:p-5 rounded">

                  <h3>
                    Absent
                  </h3>

                  <p className="text-2xl sm:text-3xl font-bold text-red-400">
                    {report.attendance.absentDays}
                  </p>

                </div>


                <div className="bg-slate-700 p-4 sm:p-5 rounded">

                  <h3>
                    Percentage
                  </h3>

                  <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                    {report.attendance.percentage}%
                  </p>

                </div>

              </div>

            </div>


            {/* ================= ATTENDANCE HISTORY ================= */}

            <div className="bg-slate-800 p-4 sm:p-6 rounded-xl shadow">

              <h2 className="text-xl sm:text-2xl font-bold mb-5 text-green-400">
                Attendance History
              </h2>


              {/* ================= MOBILE HISTORY ================= */}

              <div className="block md:hidden space-y-3">

                {report.attendanceHistory?.map(
                  (item) => (

                    <div
                      key={item._id}
                      className="bg-slate-900 border border-slate-700 rounded-xl p-4"
                    >

                      <div className="flex justify-between items-center mb-3">

                        <span className="font-semibold">
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </span>

                        <span
                          className={
                            item.status === "Present"
                              ? "text-green-400 font-bold"
                              : "text-red-400 font-bold"
                          }
                        >
                          {item.status}
                        </span>

                      </div>

                      <div className="text-sm text-gray-400">

                        Method:
                        <span className="text-white ml-2">
                          {item.method}
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>


              {/* ================= DESKTOP HISTORY ================= */}

              <div className="hidden md:block overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b border-slate-600">

                      <th className="p-3">
                        Date
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Method
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {report.attendanceHistory?.map(
                      (item) => (

                        <tr
                          key={item._id}
                          className="border-b border-slate-700"
                        >

                          <td className="p-3 text-center">
                            {new Date(
                              item.date
                            ).toLocaleDateString()}
                          </td>


                          <td className="text-center">

                            <span
                              className={
                                item.status ===
                                "Present"
                                  ? "text-green-400 font-bold"
                                  : "text-red-400 font-bold"
                              }
                            >
                              {item.status}
                            </span>

                          </td>


                          <td className="text-center">
                            {item.method}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          </>
        )}

      </div>

    </div>
  );
}

export default AttendanceReport;
