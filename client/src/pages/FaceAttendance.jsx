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
    useState(
      "Loading face recognition models..."
    );

  // ============================
  // Load Models + Students
  // ============================
  useEffect(() => {
    loadModels();
    fetchStudents();
  }, []);

  // ============================
  // Load Face Models
  // ============================
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
        "Model loading error:",
        error
      );

      setMessage(
        "Failed to load face recognition models."
      );
    }
  };

  // ============================
  // Fetch Students
  // ============================
  const fetchStudents = async () => {
    try {
      const response =
        await API.get("/students");

      setStudents(response.data.data);
    } catch (error) {
      console.error(
        "Student loading error:",
        error
      );

      setMessage(
        "Failed to load students."
      );
    }
  };

  // ============================
  // Euclidean Distance
  // ============================
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
        difference *
        difference;
    }

    return Math.sqrt(sum);
  };

  // ============================
  // Capture Face
  // ============================
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
        "No students found."
      );

      return;
    }

    setProcessing(true);

    setMessage(
      "Scanning face..."
    );

    try {
      // Capture screenshot
      const imageSrc =
        webcamRef.current.getScreenshot();

      if (!imageSrc) {
        alert(
          "Could not capture image."
        );

        setMessage(
          "Camera capture failed."
        );

        setProcessing(false);

        return;
      }

      // Convert screenshot into image
      const img =
        await faceapi.fetchImage(
          imageSrc
        );

      // Detect face
      const detection =
        await faceapi
          .detectSingleFace(
            img,
            new faceapi.TinyFaceDetectorOptions(
              {
                inputSize: 416,
                scoreThreshold: 0.5,
              }
            )
          )
          .withFaceLandmarks()
          .withFaceDescriptor();

      if (!detection) {
        alert(
          "No face detected. Please look at the camera."
        );

        setMessage(
          "No face detected."
        );

        setProcessing(false);

        return;
      }

      // Current face descriptor
      const currentDescriptor =
        Array.from(
          detection.descriptor
        );

      let bestMatch = null;
      let bestDistance = Infinity;

      // ============================
      // Compare With Registered Faces
      // ============================

      students.forEach(
        (student) => {
          if (
            !student.faceEmbedding ||
            student.faceEmbedding.length ===
              0
          ) {
            return;
          }

          // Make sure descriptor sizes match
          if (
            student.faceEmbedding.length !==
            currentDescriptor.length
          ) {
            return;
          }

          const distance =
            getDistance(
              currentDescriptor,
              student.faceEmbedding
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

      console.log(
        "Best match:",
        bestMatch
      );

      console.log(
        "Face distance:",
        bestDistance
      );

      // ============================
      // Recognition Threshold
      // ============================

      const MATCH_THRESHOLD =
        0.6;

      if (
        !bestMatch ||
        bestDistance >
          MATCH_THRESHOLD
      ) {
        alert(
          "Face not recognized."
        );

        setMessage(
          "Face not recognized."
        );

        setProcessing(false);

        return;
      }

      // ============================
      // Student Recognized
      // ============================

      setMessage(
        `Recognized: ${bestMatch.name}`
      );

      // ============================
      // Mark Attendance
      // ============================

      const response =
        await API.post(
          "/attendance/face",
          {
            student:
              bestMatch._id,
          }
        );

      alert(
        `${bestMatch.name} - Attendance marked successfully`
      );

      setMessage(
        `✅ ${bestMatch.name} marked Present`
      );

      console.log(
        response.data
      );

    } catch (error) {
      console.error(
        "Face recognition error:",
        error
      );

      const errorMessage =
        error.response?.data?.message ||
        "Face attendance failed";

      alert(errorMessage);

      setMessage(
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
