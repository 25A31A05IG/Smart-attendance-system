import { useEffect, useState, useRef } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";


function Students() {


  const [students, setStudents] = useState([]);

  const [uploadStudentId, setUploadStudentId] = useState(null);

  const fileRef = useRef(null);



  const [student, setStudent] = useState({

    name:"",
    rollNumber:"",
    email:"",
    department:"",
    year:"",
    section:""

  });





  const fetchStudents = async()=>{


    try{

      const response = await API.get("/students");

      setStudents(response.data.data);


    }catch(error){

      console.log(error);

    }

  };





  useEffect(()=>{

    fetchStudents();

  },[]);







  const handleChange=(e)=>{

    setStudent({

      ...student,

      [e.target.name]:e.target.value

    });

  };







  const addStudent=async(e)=>{

    e.preventDefault();


    try{


      await API.post("/students",{

        ...student,

        year:Number(student.year)

      });



      alert("Student Added Successfully");



      setStudent({

        name:"",
        rollNumber:"",
        email:"",
        department:"",
        year:"",
        section:""

      });



      fetchStudents();



    }catch(error){

      console.log(error);

      alert("Failed to add student");

    }


  };









  const deleteStudent=async(id)=>{


    try{


      await API.delete(`/students/${id}`);


      alert("Student Deleted Successfully");


      fetchStudents();



    }catch(error){

      console.log(error);

      alert("Delete Failed");

    }


  };









  const openUpload=(id)=>{

    setUploadStudentId(id);

    fileRef.current.click();

  };









  const handleUpload=async(e)=>{


    const file=e.target.files[0];


    if(!file) return;



    const formData=new FormData();


    formData.append(
      "faceImage",
      file
    );



    try{


      await API.post(

        `/students/upload/${uploadStudentId}`,

        formData,

        {

          headers:{

            "Content-Type":"multipart/form-data"

          }

        }

      );



      alert("Face image uploaded successfully");


      fetchStudents();



    }catch(error){

      console.log(error);

      alert("Upload Failed");

    }


  };








return (

<div className="flex">


<Sidebar />



<div className="flex-1 p-8 bg-slate-900 min-h-screen text-white">



<h1 className="text-3xl font-bold mb-6 text-green-400">

Students

</h1>







<form

onSubmit={addStudent}

className="bg-slate-800 p-6 rounded-xl shadow mb-8"


>



<h2 className="text-xl font-bold mb-4 text-green-400">

Add Student

</h2>






<div className="grid grid-cols-2 gap-4">


{

[
"name",
"rollNumber",
"email",
"department",
"year",
"section"
]

.map((field)=>(


<input


key={field}

name={field}

placeholder={field}

value={student[field]}

onChange={handleChange}


className="bg-slate-900 border border-slate-600 p-3 rounded text-white"


/>


))


}


</div>






<button

className="mt-5 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded"

>

Add Student

</button>



</form>









<div className="bg-slate-800 p-6 rounded-xl shadow">



<h2 className="text-xl font-bold mb-4 text-green-400">

Student List

</h2>






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


{

students.map((s)=>(



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



{

s.faceImage ? (


<img

src={`http://localhost:5000/uploads/${s.faceImage}`}

alt="student"

className="w-16 h-16 rounded-full object-cover mx-auto mb-2"

/>


)

:

(

<p className="text-gray-400 mb-2">

No Photo

</p>


)


}





<button

onClick={()=>openUpload(s._id)}

className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"

>

📷 Upload Photo

</button>



</td>









<td className="text-center">


<button

onClick={()=>deleteStudent(s._id)}

className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"

>

Delete

</button>



</td>






</tr>



))


}




</tbody>




</table>




</div>





</div>


</div>


);


}


export default Students;