import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import Sidebar from "../components/Sidebar";

function FaceAttendance() {

  const webcamRef = useRef(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {

    loadModels();

  }, []);

  const loadModels = async () => {

    const MODEL_URL = "/face-models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

    setModelsLoaded(true);

  };

  const capture = async () => {

    if (!modelsLoaded) {

      alert("Models are still loading...");

      return;

    }

    const imageSrc = webcamRef.current.getScreenshot();

    const img = await faceapi.fetchImage(imageSrc);

    const detection = await faceapi
      .detectSingleFace(
        img,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {

      alert("No face detected");

      return;

    }

    alert("Face Detected Successfully");

    console.log(detection.descriptor);

  };

  return (

    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-3xl font-bold mb-6">

          Face Recognition Attendance

        </h1>

        <div className="bg-white p-8 rounded-xl shadow">

          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
          />

          <button
            onClick={capture}
            className="mt-6 bg-green-600 text-white px-8 py-3 rounded"
          >
            Capture & Mark Attendance
          </button>

          <p className="mt-5">

            {modelsLoaded
              ? "✅ Models Loaded"
              : "Loading AI Models..."}

          </p>

        </div>

      </div>

    </div>

  );

}

export default FaceAttendance;