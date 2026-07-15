import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";
import { QRCodeCanvas } from "qrcode.react";


function Attendance() {


const [students,setStudents]=useState([]);

const [attendance,setAttendance]=useState({});

const [method,setMethod]=useState("Manual");

const [qrUrl,setQrUrl]=useState("");

const [search,setSearch]=useState("");





const fetchStudents=async()=>{

try{

const response=await API.get("/students");

setStudents(response.data.data);


}catch(error){

console.log(error);

}

};




useEffect(()=>{

fetchStudents();

},[]);







const markStatus=(id,status)=>{

setAttendance(prev=>({

...prev,

[id]:status

}));

};







const markAllPresent=()=>{

const data={};

students.forEach(student=>{

data[student._id]="Present";

});

setAttendance(data);

};







const markAllAbsent=()=>{

const data={};

students.forEach(student=>{

data[student._id]="Absent";

});

setAttendance(data);

};








const presentCount=Object.values(attendance)
.filter(item=>item==="Present").length;



const absentCount=Object.values(attendance)
.filter(item=>item==="Absent").length;







const filteredStudents=students.filter(student=>

student.name.toLowerCase()
.includes(search.toLowerCase())

||

student.rollNumber.toLowerCase()
.includes(search.toLowerCase())

);









const saveAttendance=async()=>{


try{


if(Object.keys(attendance).length===0){

alert("Please mark attendance");

return;

}



for(const id in attendance){


await API.post("/attendance",{

student:id,

status:attendance[id],

method:"Manual"

});


}



alert("Attendance Saved Successfully");


setAttendance({});



}catch(error){

console.log(error);

alert("Failed to save attendance");


}


};









const generateQR=async()=>{


try{


const response=await API.post("/qr/generate");


const token=response.data.token;


const url=
`${window.location.origin}/student-attendance/${token}`;


setQrUrl(url);



}catch(error){

console.log(error);

alert("QR generation failed");

}


};







return (


<div className="flex">


<Sidebar />



<div className="flex-1 bg-slate-900 min-h-screen p-8 text-white">





<h1 className="text-3xl font-bold mb-6 text-green-400">

Mark Attendance

</h1>







<div className="bg-slate-800 p-6 rounded-xl shadow mb-6">


<h2 className="text-xl font-bold mb-5 text-green-400">

Select Attendance Method

</h2>



<div className="flex gap-10">


<label>

<input

type="radio"

checked={method==="Manual"}

onChange={()=>setMethod("Manual")}

/>

 Manual

</label>





<label>

<input

type="radio"

checked={method==="QR"}

onChange={()=>setMethod("QR")}

/>

 QR Code

</label>





<label>

<input

type="radio"

checked={method==="Face"}

onChange={()=>setMethod("Face")}

/>

 Face Recognition

</label>



</div>


</div>









{
method==="QR" &&

<div className="bg-slate-800 p-8 rounded-xl shadow text-center">


<button

onClick={generateQR}

className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded"

>

Generate QR Code

</button>



{

qrUrl &&

<div className="mt-6">


<QRCodeCanvas

value={qrUrl}

size={250}

/>



<p className="mt-4">

Scan QR to mark attendance

</p>



</div>


}



</div>

}









{
method==="Face" &&


<div className="bg-slate-800 p-10 rounded-xl shadow text-center">


<h2 className="text-2xl font-bold text-green-400">

Face Recognition Attendance

</h2>



<p className="mt-3 text-gray-300">

Open camera and verify student face

</p>



<button

onClick={()=>window.location.href="/face-attendance"}

className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded"

>

Start Face Recognition

</button>



</div>


}









{
method==="Manual" &&


<div className="bg-slate-800 p-6 rounded-xl shadow">






<div className="grid grid-cols-3 gap-5 mb-6">


<div className="bg-slate-700 p-5 rounded-xl">

<h3>

Total Students

</h3>

<p className="text-3xl font-bold text-green-400">

{students.length}

</p>

</div>





<div className="bg-slate-700 p-5 rounded-xl">

<h3>

Present

</h3>

<p className="text-3xl font-bold text-green-400">

{presentCount}

</p>

</div>





<div className="bg-slate-700 p-5 rounded-xl">

<h3>

Absent

</h3>

<p className="text-3xl font-bold text-red-400">

{absentCount}

</p>

</div>



</div>







<input

type="text"

placeholder="Search student name or roll number"

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full bg-slate-900 border border-slate-600 p-3 rounded mb-5"

/>







<div className="flex gap-4 mb-6">


<button

onClick={markAllPresent}

className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded"

>

Mark All Present

</button>





<button

onClick={markAllAbsent}

className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded"

>

Mark All Absent

</button>


</div>









<table className="w-full">


<thead>


<tr className="border-b border-slate-600">


<th className="p-3 text-left">

Name

</th>


<th>

Roll Number

</th>


<th>

Status

</th>


</tr>


</thead>






<tbody>


{

filteredStudents.map(student=>(


<tr

key={student._id}

className="border-b border-slate-700"


>


<td className="p-3">

{student.name}

</td>



<td className="text-center">

{student.rollNumber}

</td>





<td className="text-center">



<button

onClick={()=>markStatus(student._id,"Present")}

className={`px-4 py-2 rounded mr-3 text-white ${
attendance[student._id]==="Present"
?
"bg-green-700"
:
"bg-green-600"
}`}

>

Present

</button>






<button

onClick={()=>markStatus(student._id,"Absent")}

className={`px-4 py-2 rounded text-white ${
attendance[student._id]==="Absent"
?
"bg-red-700"
:
"bg-red-600"
}`}

>

Absent

</button>



</td>


</tr>


))


}



</tbody>


</table>







<button

onClick={saveAttendance}

className="mt-6 bg-green-600 hover:bg-green-700 px-8 py-3 rounded"

>

Save Attendance

</button>






</div>


}



</div>


</div>


);


}


export default Attendance;