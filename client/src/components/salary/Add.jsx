import React, { useEffect, useState } from 'react'
import { fetchDepartments, getEmployees } from '../../utils/EmployeeHelper'
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom"

const Add = () => {

  const [salary, setSalary] = useState({
    employeeId: null,
    basicSalary: 0,
    allowances: 0,
    deductions: 0,
    payDate: null,
  })
  const [departments, setDepartments] = useState(null)
  const [employees, setemployees] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments()
      setDepartments(departments)
      };
      getDepartments();
    }, []);

    const handleDepartment = async (e) => {
      const emps = await getEmployees(e.target.value)
      setemployees(emps)
    }
  
  const handleChange = (e) => {
    const {name, value} = e.target
    setSalary((prevData) => ({...prevData, [name]:value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      const response = await axios.post(`http://localhost:5000/api/salary/add`, salary, {
        headers: {
          "Authorization" : `Bearer ${localStorage.getItem("token")}`
        },
      })
      if(response.data.success) {
        navigate("/admin-dashboard/employees")
      }
    }catch(error) {
      if(error.response && !error.response.data.success){
        console.log(error.response.data.error)
      } 
    }
  }

  return (
    <>{departments ? (
    <div className='max-w-4xl mx-auto mt-10 bg-white p-8 rounded-md shadow-md'>
      <h2 className='text-2xl font-bold mb-6'>Add Salary</h2>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Department
            </label>
            <select name="department" onChange={handleDepartment} value={employees.department} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Department</option>
              {departments.map((dep) =>(
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Employee
            </label>
            <select name="employeeId" onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required>
              <option value="">Select Employee</option>
              {employees.map((emp) =>(
                <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
              ))}
            </select>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Basic Salary
            </label>
            <input type="number" name='basicSalary' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Allowances
            </label>
            <input type="number" name='allowances' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Deductions
            </label>
            <input type="number" name='deductions' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Paydate
            </label>
            <input type="date" name='payDate' onChange={handleChange} className='mt-1 p-2 block w-full border border-gray-300 rounded-md' required />
          </div>
          
        </div>
        <button type='submit' className='w-full px-5 py-2 mt-5 rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 text-white'>Add Salary</button>
      </form>
    </div>
    ) : <div>Loading...</div>}</>
  )
}

export default Add