import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { columns, AttendanceHelper } from '../../utils/AttendanceHelper'
import DataTable from "react-data-table-component"
import axios from 'axios'

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [filteredAttendance, setFilteredAttendance] = useState([])

  const statusChange = () => {
    fetchAttendance();
  }

  const fetchAttendance = async () => {
    setLoading(true)
    try{
      const response = await axios.get('http://localhost:5000/api/attendance',{
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
      })
      console.log(response)
      if(response.data.success){
        let sno = 1;
        const data = response.data.attendance.map((att) => (
          {
            employeeId : att.employeeId.employeeId,
            sno: sno++,
            department: att.employeeId.department.dep_name,
            name: att.employeeId.userId.name,
            action: <AttendanceHelper status={att.status} employeeId={att.employeeId.employeeId} statusChange ={statusChange} />
          }
        ));
        setAttendance(data)
        setFilteredAttendance(data)
      }
    } catch(error) {
      if(error.response && !error.response.data.success){
        console.error(error.response.data.error)
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
   fetchAttendance();
  },[])

  const handleFilter = (e) => {
    const records = attendance.filter((emp) => 
      emp.employeeId.toLowerCase().includes(e.target.value.toLowerCase())
    )
    setFilteredAttendance(records)
  }

  return (
    <div className='p-6'>
      <div className='text-center'>
        <h3 className='text-2xl font-bold mb-4'>Manage Attendance</h3>
      </div>
      <div className='flex justify-between items-center mt-4'>
        <input type="text" placeholder='Search' className='px-3 py-0.5 border' onChange={handleFilter}/>
        <p className='-ml-10'>
          Mark Attendance for <span className='font-bold underline'>{new Date().toISOString().split('T')[0]}{" "}</span>
        </p>
        <Link  to="/admin-dashboard/attendance-report" className='px-4 py-1 bg-blue-500 hover:bg-blue-400 text-white rounded'>
        Attendance Report
        </Link>
      </div>
      <div>
        <DataTable columns={columns} data={filteredAttendance} pagination/>
      </div>
    </div>
  )
}

export default Attendance