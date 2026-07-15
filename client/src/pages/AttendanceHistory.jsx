import { useEffect, useState } from "react";
import API from "../api/axios";
import Sidebar from "../components/Sidebar";


function AttendanceHistory() {


const [history,setHistory]=useState([]);

const [details,setDetails]=useState([]);

const [selectedDate,setSelectedDate]=useState("");

const [showModal,setShowModal]=useState(false);

const [search,setSearch]=useState("");





const fetchHistory=async()=>{


try{


const response=await API.get("/attendance/history");


setHistory(response.data.data);



}catch(error){

console.log(error);

}


};





useEffect(()=>{

fetchHistory();

},[]);







const viewAttendance=async(date)=>{


try{


const response=await API.get(
`/attendance/history/${date}`
);


setDetails(response.data.data);

setSelectedDate(date);

setShowModal(true);



}catch(error){

console.log(error);

}


};







const filteredHistory=history.filter(item=>

item.date.includes(search)

);






const calculatePercentage=(present,total)=>{


if(total===0)

return 0;


return ((present/total)*100).toFixed(2);


};







return (


<div className="flex">


<Sidebar />



<div className="flex-1 bg-slate-900 min-h-screen p-8 text-white">





<h1 className="text-3xl font-bold mb-6 text-green-400">

Attendance History

</h1>








<div className="bg-slate-800 p-6 rounded-xl shadow">






<input


type="text"

placeholder="Search date (YYYY-MM-DD)"

value={search}

onChange={(e)=>setSearch(e.target.value)}

className="w-full bg-slate-900 border border-slate-600 p-3 rounded mb-6"

/>









<table className="w-full">



<thead>


<tr className="border-b border-slate-600">



<th className="p-3 text-left">

Date

</th>



<th>

Present

</th>



<th>

Absent

</th>



<th>

Total

</th>



<th>

Percentage

</th>



<th>

Action

</th>



</tr>


</thead>









<tbody>


{

filteredHistory.map(item=>(



<tr

key={item.date}

className="border-b border-slate-700"


>



<td className="p-3">

{item.date}

</td>





<td className="text-center text-green-400 font-bold">

{item.present}

</td>






<td className="text-center text-red-400 font-bold">

{item.absent}

</td>






<td className="text-center">

{item.total}

</td>







<td className="text-center font-bold text-green-400">

{

calculatePercentage(
item.present,
item.total
)

} %

</td>







<td className="text-center">


<button

onClick={()=>viewAttendance(item.date)}

className="bg-green-600 hover:bg-green-700 px-5 py-2 rounded"

>

👁 View

</button>


</td>





</tr>



))


}



</tbody>




</table>






</div>









{
showModal &&



<div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">





<div className="bg-slate-800 rounded-xl p-8 w-3/4 max-h-[80vh] overflow-auto">






<div className="flex justify-between mb-6">





<h2 className="text-2xl font-bold text-green-400">

Attendance Details - {selectedDate}

</h2>






<button

onClick={()=>setShowModal(false)}

className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"

>

Close

</button>





</div>









<table className="w-full">





<thead>


<tr className="border-b border-slate-600">


<th className="p-3 text-left">

Roll Number

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

details.map(record=>(


<tr

key={record._id}

className="border-b border-slate-700"

>




<td className="p-3 text-center">

{record.student?.rollNumber}

</td>







<td className="text-center">

{record.student?.name}

</td>








<td className="text-center">


<span

className={

record.status==="Present"

?

"text-green-400 font-bold"

:

"text-red-400 font-bold"

}

>


{

record.status==="Present"

?

"✅ Present"

:

"❌ Absent"

}


</span>



</td>







<td className="text-center">

{record.method}

</td>





</tr>



))


}



</tbody>




</table>





</div>




</div>



}



</div>


</div>


);


}


export default AttendanceHistory;