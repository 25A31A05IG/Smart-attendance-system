import { useEffect, useRef, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import * as faceapi from "face-api.js";

function Students() {
  const [students, setStudents] = useState([]);

  const [uploadStudentId, setUploadStudentId] =
    useState(null);

  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    email: "",
    department: "",
    year: "",
    section: "",
  });

  const fileRef = useRef(null);

  const [faceModelsReady, setFaceModelsReady] =
    useState(false);

  const [loadingFaceModels, setLoadingFaceModels] =
    useState(false);

  // ==================================================
  // Initial Load
  // ==================================================

  useEffect(() => {
    fetchStudents();
  }, []);

  // ==================================================
  // Fetch Students
  // ==================================================

  const fetchStudents = async () => {
    try {
      const response = await API.get("/students");

      setStudents(response.data.data);
    } catch (error) {
      console.error(
        "FETCH STUDENTS ERROR:",
        error
      );
    }
  };

  // ==================================================
  // Load Face Models
  // This happens silently when needed
  // ==================================================

  const loadFaceModels = async () => {
    if (faceModelsReady) {
      return true;
    }

    try {
      setLoadingFaceModels(true);

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

      setFaceModelsReady(true);

      console.log(
        "Face recognition models loaded"
      );

      return true;
    } catch (error) {
      console.error(
        "FACE MODEL LOADING ERROR:",
        error
      );

      alert(
        "Face recognition models could not be loaded. Please check the face-models folder."
      );

      return false;
    } finally {
      setLoadingFaceModels(false);
    }
  };

  // ==================================================
  // Handle Input
  // ==================================================

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  // ==================================================
  // Add Student
  // ==================================================

  const addStudent = async (e) => {
    e.preventDefault();

    try {
      await API.post("/students", {
        ...student,
        year: Number(student.year),
      });

      alert(
        "Student Added Successfully"
      );

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
        "ADD STUDENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to add student"
      );
    }
  };

  // ==================================================
  // Delete Student
  // ==================================================

  const deleteStudent = async (id) => {
    try {
      await API.delete(
        `/students/${id}`
      );

      alert(
        "Student Deleted Successfully"
      );

      fetchStudents();
    } catch (error) {
      console.error(
        "DELETE STUDENT ERROR:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Delete Failed"
      );
    }
  };

  // ==================================================
  // Open Upload
  // ==================================================

  const openUpload = async (id) => {
    // Load models silently
    const ready =
      await loadFaceModels();

    if (!ready) {
      return;
    }

    setUploadStudentId(id);

    if (fileRef.current) {
      fileRef.current.value = "";
    }

    fileRef.current?.click();
  };

  // ==================================================
  // Face Registration
  // ==================================================

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    try {
      console.log(
        "================================"
      );

      console.log(
        "FACE REGISTRATION STARTED"
      );

      console.log(
        "File:",
        file.name
      );

      // ------------------------------------------
      // Make sure models are loaded
      // ------------------------------------------

      const ready =
        await loadFaceModels();

      if (!ready) {
        return;
      }

      // ------------------------------------------
      // Load image
      // ------------------------------------------

      const imageUrl =
        URL.createObjectURL(file);

      const img =
        await faceapi.fetchImage(
          imageUrl
        );

      console.log(
        "Image loaded:",
        img.width,
        "x",
        img.height
      );

      // ------------------------------------------
      // Detect face
      // ------------------------------------------

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

      URL.revokeObjectURL(
        imageUrl
      );

      // ------------------------------------------
      // No face
      // ------------------------------------------

      if (!detection) {
        alert(
          "No face detected. Please upload a clear front-facing photo."
        );

        return;
      }

      console.log(
        "Face detected"
      );

      console.log(
        "Detection score:",
        detection.detection.score
      );

      // ------------------------------------------
      // Generate descriptor
      // ------------------------------------------

      const faceEmbedding =
        Array.from(
          detection.descriptor
        );

      console.log(
        "Embedding length:",
        faceEmbedding.length
      );

      if (
        faceEmbedding.length !== 128
      ) {
        alert(
          "Unable to generate face descriptor."
        );

        return;
      }

      // ------------------------------------------
      // FormData
      // ------------------------------------------

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
        "Sending face registration to backend..."
      );

      // IMPORTANT:
      // Don't manually set Content-Type.
      // Axios/browser will create the correct
      // multipart boundary automatically.

      const response =
        await API.post(
          `/students/upload/${uploadStudentId}`,
          formData
        );

      console.log(
        "SERVER RESPONSE:",
        response.data
      );

      if (
        response.data.success
      ) {
        alert(
          "Face registered successfully!"
        );

        await fetchStudents();
      }

      console.log(
        "================================"
      );
    } catch (error) {
      console.error(
        "FACE REGISTRATION ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      console.error(
        "STATUS:",
        error.response?.status
      );

      const serverMessage =
        error.response?.data?.message;

      alert(
        serverMessage ||
          "Face registration failed"
      );
    }

    // Clear file input
    e.target.value = "";
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8 bg-slate-900 min-h-screen text-white">

        {/* ==========================================
            Title
        ========================================== */}

        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Students
        </h1>

        {/* ==========================================
            Add Student
        ========================================== */}

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

        {/* ==========================================
            Student List
        ========================================== */}

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

                    {/* Face */}

                    <td className="text-center">

                      {s.faceImage ? (

                        <img
                          src={`http://localhost:5000/uploads/${s.faceImage}`}
                          alt="student"
                          className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                        />

                      ) : (

                        <p className="text-gray-400 mb-2">
                          No Photo
                        </p>

                      )}

                      <button
                        type="button"
                        onClick={() =>
                          openUpload(
                            s._id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                      >
                        📷{" "}
                        {s.faceImage
                          ? "Update Face"
                          : "Register Face"}
                      </button>

                      {s.faceEmbedding &&
                      s.faceEmbedding.length ===
                        128 ? (

                        <p className="text-green-400 text-sm mt-2">
                          ✓ Face Registered
                        </p>

                      ) : null}

                    </td>

                    {/* Action */}

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
