import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";


function Login() {


  const navigate = useNavigate();


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");



  // Clear previous user session when login page opens
  useEffect(()=>{

    localStorage.removeItem("token");

    localStorage.removeItem("user");

  },[]);





  const handleLogin = async (e) => {

    e.preventDefault();


    try {


      const response = await API.post("/auth/login", {

        email,

        password

      });



      console.log(response.data);



      // Save current user token

      localStorage.setItem(

        "token",

        response.data.token

      );



      // Save current user details

      localStorage.setItem(

        "user",

        JSON.stringify(response.data.user)

      );



      navigate("/dashboard");



    } catch (error) {


      console.log(

        error.response?.data || error.message

      );


      alert("Login Failed");


    }

  };





  return (


    <div className="min-h-screen flex items-center justify-center bg-gray-100">


      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">



        <h1 className="text-3xl font-bold text-center text-green-600">

          Smart Attendance

        </h1>




        <p className="text-center text-gray-500 mt-2">

          Teacher / Admin Login

        </p>





        <form

          onSubmit={handleLogin}

          className="mt-8"

        >



          <input

            type="email"

            placeholder="Email"

            className="w-full border p-3 rounded-lg mb-5"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

          />





          <input

            type="password"

            placeholder="Password"

            className="w-full border p-3 rounded-lg mb-6"

            value={password}

            onChange={(e)=>setPassword(e.target.value)}

          />






          <button

            type="submit"

            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"

          >

            Login

          </button>




        </form>







        <p className="text-center mt-5 text-gray-600">


          Don't have an account?{" "}



          <Link

            to="/register"

            className="text-green-600 font-semibold hover:underline"

          >

            Create Account

          </Link>



        </p>




      </div>



    </div>


  );


}


export default Login;