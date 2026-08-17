import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import * as faceapi from "face-api.js";

function Students() {
  const [students, setStudents] = useState([]);

  const [uploadStudentId, setUploadStudentId] = useState(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  const fileRef = useRef(null);

  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    email: "",
    department: "",
    year: "",
    section: "",
  });

  // ============================
  // Load Students + Face Models
  // ============================
  useEffect(() => {
    fetchStudents();
    loadFaceModels();
  }, []);

  // ============================
  // Load Face Recognition Models
  // ============================
  const loadFaceModels = async () => {
    try {
      const MODEL_URL = "/face-models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL
      );

      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL
      );

      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL
      );

      setModelsLoaded(true);

      console.log("Face models loaded successfully");
    } catch (error) {
      console.error(
        "Failed to load face models:",
        error
      );
    }
  };

  // ============================
  // Fetch Students
  // ============================
  const fetchStudents = async () => {
    try {
      const response = await API.get("/students");

      setStudents(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ============================
  // Handle Input
  // ============================
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ============================
  // Add Student
  // ============================
  const addStudent = async (e) => {
    e.preventDefault();

    try {
      await API.post("/students", {
        ...student,
        year: Number(student.year),
      });

      alert("Student Added Successfully");

      setStudent({
        name: "",
        rollNumber: "",
        email: "",
        department: "",
        year: "",
        section: "",
      });

      fetchStudents();
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Failed to add student"
      );
    }
  };

  // ============================
  // Delete Student
  // ============================
  const deleteStudent = async (id) => {
    try {
      await API.delete(`/students/${id}`);

      alert("Student Deleted Successfully");

      fetchStudents();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  // ============================
  // Open File Upload
  // ============================
  const openUpload = (id) => {
    if (!modelsLoaded) {
      alert(
        "Face recognition models are still loading. Please wait."
      );

      return;
    }

    setUploadStudentId(id);

    fileRef.current.value = "";

    fileRef.current.click();
  };

  // ============================
  // Register Face
  // ============================
  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!modelsLoaded) {
      alert(
        "Face recognition models are still loading."
      );

      return;
    }

    try {
      // Create temporary image URL
      const imageUrl = URL.createObjectURL(file);

      // Load image
      const img = await faceapi.fetchImage(
        imageUrl
      );

      // Detect face + landmarks + descriptor
      const detection = await faceapi
        .detectSingleFace(
          img,
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.5,
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptor();

      // Release temporary URL
      URL.revokeObjectURL(imageUrl);

      if (!detection) {
        alert(
          "No face detected. Please upload a clear photo containing one face."
        );

        return;
      }

      // Convert Float32Array to normal array
      const faceEmbedding = Array.from(
        detection.descriptor
      );

      // Create form data
      const formData = new FormData();

      formData.append(
        "faceImage",
        file
      );

      formData.append(
        "faceEmbedding",
        JSON.stringify(faceEmbedding)
      );

      // Send image + embedding
      await API.post(
        `/students/upload/${uploadStudentId}`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Face registered successfully!"
      );

      fetchStudents();

      e.target.value = "";
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Face registration failed"
      );
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8 bg-slate-900 min-h-screen text-white">

        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Students
        </h1>

        {/* ============================
            Add Student
        ============================ */}

        <form
          onSubmit={addStudent}
          className="bg-slate-800 p-6 rounded-xl shadow mb-8"
        >
          <h2 className="text-xl font-bold mb-4 text-green-400">
            Add Student
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              "name",
              "rollNumber",
              "email",
              "department",
              "year",
              "section",
            ].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field}
                value={student[field]}
                onChange={handleChange}
                className="bg-slate-900 border border-slate-600 p-3 rounded text-white"
              />
            ))}
          </div>

          <button
            type="submit"
            className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"
          >
            Add Student
          </button>
        </form>

        {/* ============================
            Student List
        ============================ */}

        <div className="bg-slate-800 p-6 rounded-xl shadow">

          <h2 className="text-xl font-bold mb-4 text-green-400">
            Student List
          </h2>

          {/* Hidden file input */}

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={handleUpload}
          />

          <table className="w-full">

            <thead>
              <tr className="border-b border-slate-600">

                <th className="p-3 text-left">
                  Name
                </th>

                <th>
                  Roll No
                </th>

                <th>
                  Department
                </th>

                <th>
                  Year
                </th>

                <th>
                  Face
                </th>

                <th>
                  Action
                </th>

              </tr>
            </thead>

            <tbody>

              {students.map((s) => (
                <tr
                  key={s._id}
                  className="border-b border-slate-700"
                >

                  <td className="p-3">
                    {s.name}
                  </td>

                  <td className="text-center">
                    {s.rollNumber}
                  </td>

                  <td className="text-center">
                    {s.department}
                  </td>

                  <td className="text-center">
                    {s.year}
                  </td>

                  <td className="text-center">

                    {s.faceImage ? (
                      <>
                        <img
                          src={`http://localhost:5000/uploads/${s.faceImage}`}
                          alt="student"
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                        />

                        {s.faceEmbedding &&
                        s.faceEmbedding.length > 0 ? (
                          <p className="text-green-400 text-sm mb-2">
                            ✓ Face Registered
                          </p>
                        ) : (
                          <p className="text-yellow-400 text-sm mb-2">
                            Face Not Registered
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-400 mb-2">
                        No Photo
                      </p>
                    )}

                    <button
                      onClick={() =>
                        openUpload(s._id)
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                    >
                      📷{" "}
                      {s.faceImage
                        ? "Update Face"
                        : "Register Face"}
                    </button>

                  </td>

                  <td className="text-center">

                    <button
                      onClick={() =>
                        deleteStudent(s._id)
                      }
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}

export default Students;
