import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import * as faceapi from "face-api.js";

function Students() {
  const [students, setStudents] = useState([]);

  const [uploadStudentId, setUploadStudentId] =
    useState(null);

  const [modelsLoaded, setModelsLoaded] =
    useState(false);

  const [loadingModels, setLoadingModels] =
    useState(true);

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
      setLoadingModels(true);

      const MODEL_URL = "/face-models";

      console.log("Loading face models...");

      await faceapi.nets.tinyFaceDetector.loadFromUri(
        MODEL_URL
      );

      console.log("TinyFaceDetector loaded");

      await faceapi.nets.faceLandmark68Net.loadFromUri(
        MODEL_URL
      );

      console.log("FaceLandmark68Net loaded");

      await faceapi.nets.faceRecognitionNet.loadFromUri(
        MODEL_URL
      );

      console.log("FaceRecognitionNet loaded");

      setModelsLoaded(true);

      console.log(
        "All face recognition models loaded successfully"
      );
    } catch (error) {
      console.error(
        "Face model loading error:",
        error
      );

      alert(
        "Face recognition models could not be loaded. Check your face-models folder."
      );
    } finally {
      setLoadingModels(false);
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
      console.error(
        "Fetch students error:",
        error
      );
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
      console.error(
        "Add student error:",
        error
      );

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
      console.error(
        "Delete student error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  // ============================
  // Open Face Upload
  // ============================
  const openUpload = (id) => {
    if (!modelsLoaded) {
      alert(
        "Face recognition models are still loading. Please wait."
      );

      return;
    }

    setUploadStudentId(id);

    // Clear previous selected file
    if (fileRef.current) {
      fileRef.current.value = "";
    }

    fileRef.current?.click();
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

    if (!uploadStudentId) {
      alert(
        "Student was not selected."
      );

      return;
    }

    try {
      console.log(
        "================================="
      );

      console.log(
        "Starting face registration..."
      );

      console.log(
        "Selected file:",
        file.name
      );

      console.log(
        "File type:",
        file.type
      );

      console.log(
        "File size:",
        file.size
      );

      // ============================
      // Create temporary image URL
      // ============================

      const imageUrl =
        URL.createObjectURL(file);

      console.log(
        "Temporary image URL created"
      );

      // ============================
      // Load Image
      // ============================

      const img =
        await faceapi.fetchImage(
          imageUrl
        );

      console.log(
        "Image loaded successfully"
      );

      console.log(
        "Image width:",
        img.width
      );

      console.log(
        "Image height:",
        img.height
      );

      // ============================
      // Detect Face
      // ============================

      console.log(
        "Detecting face..."
      );

      const detection =
        await faceapi
          .detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 320,
                scoreThreshold: 0.3,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      // Release temporary URL
      URL.revokeObjectURL(imageUrl);

      // ============================
      // Check Detection
      // ============================

      if (!detection) {
        console.error(
          "NO FACE DETECTED"
        );

        alert(
          "Face could not be detected. Please upload a clear front-facing photo."
        );

        return;
      }

      console.log(
        "Face detected successfully!"
      );

      console.log(
        "Detection score:",
        detection.detection.score
      );

      console.log(
        "Face box:",
        detection.detection.box
      );

      // ============================
      // Generate Face Descriptor
      // ============================

      const faceEmbedding =
        Array.from(
          detection.descriptor
        );

      console.log(
        "Face descriptor generated"
      );

      console.log(
        "Embedding length:",
        faceEmbedding.length
      );

      // Face-api.js descriptors
      // should contain 128 numbers
      if (
        faceEmbedding.length !== 128
      ) {
        alert(
          "Face descriptor generation failed."
        );

        console.error(
          "Invalid embedding length:",
          faceEmbedding.length
        );

        return;
      }

      // ============================
      // Create FormData
      // ============================

      const formData =
        new FormData();

      formData.append(
        "faceImage",
        file
      );

      formData.append(
        "faceEmbedding",
        JSON.stringify(
          faceEmbedding
        )
      );

      console.log(
        "Image and face embedding prepared"
      );

      console.log(
        "Uploading to server..."
      );

      // ============================
      // Send To Backend
      // ============================

      const response =
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

      console.log(
        "Backend response:",
        response.data
      );

      // ============================
      // Success
      // ============================

      alert(
        "Face registered successfully!"
      );

      console.log(
        "Face registration completed successfully"
      );

      // Refresh students
      await fetchStudents();

      // Clear file
      e.target.value = "";

      console.log(
        "================================="
      );
    } catch (error) {
      console.error(
        "================================="
      );

      console.error(
        "FULL FACE REGISTRATION ERROR:"
      );

      console.error(error);

      console.error(
        "Error message:",
        error.message
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      console.error(
        "HTTP status:",
        error.response?.status
      );

      console.error(
        "================================="
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Face registration failed"
      );
    }
  };

  return (
    <div className="flex">

      {/* ============================
          Sidebar
      ============================ */}

      <Sidebar />

      {/* ============================
          Main Content
      ============================ */}

      <div className="flex-1 p-8 bg-slate-900 min-h-screen text-white">

        {/* ============================
            Page Title
        ============================ */}

        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Students
        </h1>

        {/* ============================
            Face Model Status
        ============================ */}

        <div
          className={`mb-6 p-4 rounded-lg ${
            modelsLoaded
              ? "bg-green-900 text-green-300"
              : "bg-yellow-900 text-yellow-300"
          }`}
        >
          {modelsLoaded
            ? "✅ Face Recognition Models Loaded"
            : loadingModels
            ? "⏳ Loading Face Recognition Models..."
            : "❌ Face Recognition Models Failed to Load"}
        </div>

        {/* ============================
            Add Student Form
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
                required
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

          {/* Hidden File Input */}

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            hidden
            onChange={handleUpload}
          />

          {/* ============================
              Student Table
          ============================ */}

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-600">

                  <th className="p-3 text-left">
                    Name
                  </th>

                  <th className="text-center">
                    Roll No
                  </th>

                  <th className="text-center">
                    Department
                  </th>

                  <th className="text-center">
                    Year
                  </th>

                  <th className="text-center">
                    Face
                  </th>

                  <th className="text-center">
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

                    {/* Name */}

                    <td className="p-3">
                      {s.name}
                    </td>

                    {/* Roll Number */}

                    <td className="text-center">
                      {s.rollNumber}
                    </td>

                    {/* Department */}

                    <td className="text-center">
                      {s.department}
                    </td>

                    {/* Year */}

                    <td className="text-center">
                      {s.year}
                    </td>

                    {/* Face */}

                    <td className="text-center">

                      {s.faceImage ? (
                        <>

                          <img
                            src={`http://localhost:5000/uploads/${s.faceImage}`}
                            alt="student"
                            className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                          />

                          {s.faceEmbedding &&
                          s.faceEmbedding.length >
                            0 ? (
                            <p className="text-green-400 text-sm mb-2">
                              ✓ Face Registered
                            </p>
                          ) : (
                            <p className="text-yellow-400 text-sm mb-2">
                              ⚠ Face Not Registered
                            </p>
                          )}

                        </>
                      ) : (

                        <p className="text-gray-400 mb-2">
                          No Photo
                        </p>

                      )}

                      {/* Register / Update */}

                      <button
                        type="button"
                        onClick={() =>
                          openUpload(
                            s._id
                          )
                        }
                        disabled={
                          !modelsLoaded
                        }
                        className={`text-white px-3 py-2 rounded ${
                          modelsLoaded
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-gray-600 cursor-not-allowed"
                        }`}
                      >
                        📷{" "}
                        {s.faceImage
                          ? "Update Face"
                          : "Register Face"}
                      </button>

                    </td>

                    {/* Delete */}

                    <td className="text-center">

                      <button
                        type="button"
                        onClick={() =>
                          deleteStudent(
                            s._id
                          )
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

    </div>
  );
}

export default Students;
