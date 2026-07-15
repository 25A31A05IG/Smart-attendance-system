import { useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";


function Dashboard() {


  const [date, setDate] = useState("");

  const [data, setData] = useState(null);



  const getDashboard = async()=>{

    try{

      const response = await API.get(
        `/dashboard?date=${date}`
      );

      setData(response.data.data);


    }catch(error){

      console.log(error);

      alert("Failed to load dashboard");

    }

  };





  const chartData = data ? [

    {
      name:"Present",
      count:data.present
    },

    {
      name:"Absent",
      count:data.absent
    }

  ] : [];







return (

<div className="flex">


<Sidebar />



<div className="flex-1 p-8 bg-slate-900 min-h-screen text-white">



<h1 className="text-3xl font-bold mb-6 text-green-400">

Attendance Dashboard

</h1>






<div className="bg-slate-800 p-5 rounded-xl shadow mb-6 flex gap-4">


<input

type="date"

value={date}

onChange={(e)=>setDate(e.target.value)}

className="border border-slate-600 bg-slate-900 p-3 rounded text-white"

/>



<button

onClick={getDashboard}

className="bg-green-600 hover:bg-green-700 text-white px-6 rounded"

>

View Attendance

</button>



</div>









{
data && (

<>


<div className="grid grid-cols-4 gap-5 mb-6">





<div className="bg-slate-800 p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Total Students

</h3>


<p className="text-3xl font-bold text-green-400">

{data.totalStudents}

</p>


</div>








<div className="bg-slate-800 p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Present

</h3>


<p className="text-3xl font-bold text-green-400">

{data.present}

</p>


</div>








<div className="bg-slate-800 p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Absent

</h3>


<p className="text-3xl font-bold text-red-400">

{data.absent}

</p>


</div>








<div className="bg-slate-800 p-5 rounded-xl shadow">

<h3 className="text-gray-300">

Attendance %

</h3>


<p className="text-3xl font-bold text-blue-400">

{data.percentage}%

</p>


</div>





</div>









<div className="bg-slate-800 p-6 rounded-xl shadow mb-6">


<h2 className="text-xl font-bold mb-5 text-green-400">

Attendance Graph

</h2>




<ResponsiveContainer width="100%" height={300}>


<BarChart data={chartData}>


<XAxis dataKey="name" stroke="white"/>

<YAxis stroke="white"/>

<Tooltip/>


<Bar

dataKey="count"

fill="#22c55e"

/>



</BarChart>


</ResponsiveContainer>



</div>









<div className="bg-slate-800 p-6 rounded-xl shadow">


<h2 className="text-xl font-bold mb-5 text-green-400">

Attendance Details

</h2>




<table className="w-full">


<thead>

<tr className="border-b border-slate-600">


<th className="p-3">

Roll No

</th>


<th>

Name

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


{

data.records.map((item)=>(


<tr

key={item._id}

className="border-b border-slate-700"

>


<td className="p-3 text-center">

{item.student?.rollNumber}

</td>



<td className="text-center">

{item.student?.name}

</td>



<td className="text-center">


<span

className={
item.status==="Present"
?
"text-green-400 font-bold"
:
"text-red-400 font-bold"
}

>

{item.status}

</span>


</td>




<td className="text-center">

{item.method}

</td>



</tr>


))


}



</tbody>


</table>


</div>




</>

)

}




</div>


</div>

);


}


export default Dashboard;