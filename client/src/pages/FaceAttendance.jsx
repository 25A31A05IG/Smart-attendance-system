import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import Sidebar from "../components/Sidebar";
import API from "../api/axios";

function FaceAttendance() {
  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] =
    useState(false);

  const [students, setStudents] =
    useState([]);

  const [processing, setProcessing] =
    useState(false);

  const [message, setMessage] =
    useState("Loading face recognition models...");

  // ==========================================
  // Load Models + Students
  // ==========================================

  useEffect(() => {
    loadModels();
    fetchStudents();
  }, []);

  // ==========================================
  // Load Models
  // ==========================================

  const loadModels = async () => {
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

      setMessage(
        "Models loaded. Ready for recognition."
      );

    } catch (error) {
      console.error(
        "MODEL LOADING ERROR:",
        error
      );

      setMessage(
        "Failed to load face recognition models."
      );
    }
  };

  // ==========================================
  // Fetch Students
  // ==========================================

  const fetchStudents = async () => {
    try {
      const response =
        await API.get("/students");

      const registeredStudents =
        response.data.data.filter(
          (student) =>
            Array.isArray(
              student.faceEmbedding
            ) &&
            student.faceEmbedding.length === 128
        );

      setStudents(
        registeredStudents
      );

      console.log(
        "Registered face students:",
        registeredStudents
      );

    } catch (error) {
      console.error(
        "STUDENT LOADING ERROR:",
        error
      );

      setMessage(
        "Failed to load students."
      );
    }
  };

  // ==========================================
  // Euclidean Distance
  // ==========================================

  const getDistance = (
    descriptor1,
    descriptor2
  ) => {
    let sum = 0;

    for (
      let i = 0;
      i < descriptor1.length;
      i++
    ) {
      const difference =
        descriptor1[i] -
        descriptor2[i];

      sum +=
        difference * difference;
    }

    return Math.sqrt(sum);
  };

  // ==========================================
  // Capture Face
  // ==========================================

  const capture = async () => {

    if (processing) {
      return;
    }

    if (!modelsLoaded) {
      alert(
        "Models are still loading..."
      );

      return;
    }

    if (students.length === 0) {
      alert(
        "No registered faces found."
      );

      return;
    }

    if (!webcamRef.current) {
      alert(
        "Camera is not available."
      );

      return;
    }

    setProcessing(true);

    setMessage(
      "Scanning face..."
    );

    try {

      // ========================================
      // Capture Camera Image
      // ========================================

      const imageSrc =
        webcamRef.current.getScreenshot();

      if (!imageSrc) {

        setMessage(
          "Camera capture failed."
        );

        alert(
          "Could not capture image."
        );

        return;
      }

      // ========================================
      // Convert Image
      // ========================================

      const img =
        await faceapi.fetchImage(
          imageSrc
        );

      // ========================================
      // Detect Face
      // ========================================

      const detection =
        await faceapi
          .detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 416,
                scoreThreshold: 0.6,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!detection) {

        setMessage(
          "No face detected."
        );

        alert(
          "No face detected. Please look directly at the camera."
        );

        return;
      }

      // ========================================
      // Current Face Descriptor
      // ========================================

      const currentDescriptor =
        Array.from(
          detection.descriptor
        );

      console.log(
        "Current descriptor length:",
        currentDescriptor.length
      );

      // ========================================
      // Compare With ALL Students
      // ========================================

      let bestMatch = null;

      let bestDistance =
        Infinity;

      students.forEach(
        (student) => {

          if (
            !Array.isArray(
              student.faceEmbedding
            )
          ) {
            return;
          }

          if (
            student.faceEmbedding.length !==
            128
          ) {
            return;
          }

          const distance =
            getDistance(
              currentDescriptor,
              student.faceEmbedding
            );

          console.log(
            student.name,
            "=>",
            distance
          );

          if (
            distance <
            bestDistance
          ) {

            bestDistance =
              distance;

            bestMatch =
              student;
          }

        }
      );

      // ========================================
      // Debug Information
      // ========================================

      console.log(
        "=============================="
      );

      console.log(
        "BEST MATCH:",
        bestMatch?.name
      );

      console.log(
        "BEST DISTANCE:",
        bestDistance
      );

      console.log(
        "=============================="
      );

      // ========================================
      // STRICT MATCH THRESHOLD
      // ========================================

      const MATCH_THRESHOLD = 0.48;

      // ========================================
      // Reject Unknown Face
      // ========================================

      if (
        !bestMatch ||
        bestDistance >
          MATCH_THRESHOLD
      ) {

        setMessage(
          "❌ Face not recognized."
        );

        alert(
          "Face not recognized. Attendance was NOT marked."
        );

        return;
      }

      // ========================================
      // Student Recognized
      // ========================================

      console.log(
        "Recognized student:",
        bestMatch.name
      );

      console.log(
        "Distance:",
        bestDistance
      );

      setMessage(
        `Recognized: ${bestMatch.name}`
      );

      // ========================================
      // Send Student ID To Backend
      // ========================================

      const response =
        await API.post(
          "/attendance/face",
          {
            student:
              bestMatch._id,
          }
        );

      // ========================================
      // Success
      // ========================================

      alert(
        `${bestMatch.name} - Attendance marked successfully`
      );

      setMessage(
        `✅ ${bestMatch.name} marked Present`
      );

      console.log(
        "SERVER RESPONSE:",
        response.data
      );

    } catch (error) {

      console.error(
        "FACE ATTENDANCE ERROR:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Face attendance failed";

      setMessage(
        errorMessage
      );

      alert(
        errorMessage
      );

    } finally {

      setProcessing(false);

    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 bg-slate-900 min-h-screen p-8 text-white">

        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Face Recognition Attendance
        </h1>

        <div className="bg-slate-800 p-8 rounded-xl shadow max-w-3xl">

          {/* Camera */}

          <div className="flex justify-center">

            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={500}
              className="rounded-xl"
            />

          </div>

          {/* Status */}

          <div className="text-center mt-6">

            <p className="text-gray-300 mb-5">
              {message}
            </p>

            {/* Capture Button */}

            <button
              onClick={capture}
              disabled={
                !modelsLoaded ||
                processing
              }
              className={`px-8 py-3 rounded text-white ${
                !modelsLoaded ||
                processing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >

              {processing
                ? "Recognizing..."
                : "Capture & Mark Attendance"}

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default FaceAttendance;
