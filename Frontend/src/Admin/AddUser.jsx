import { MdClose } from "react-icons/md";
import axios from "axios";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Select from 'react-select';

export default function AddUser({onClose}) {
    const [userData, setUserData] = useState({
        email: "",
        role: "",
        name: "",
        major: "",
        major_id: "",
        faculty: "",
    });
    const [majors, setMajors] = useState([]);

   

    const majorOptions = majors.map(major => ({
        value: major.id,
        label: major.major_name,
        faculty_id: major.faculty_id
    }));

    const roleOptions = [
        { value: "student", label: "Student" },
        { value: "alumni", label: "Alumni" }
    ];
    

     const handleInput = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }

const handleMajorChange = (selectedOption) => {
  setUserData({
    ...userData,
    major_id: selectedOption.value,
    major: selectedOption.label,
    faculty: selectedOption.faculty_id.toString()
  });
};

    const token = Cookies.get("adminToken");
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/view_all_majors', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                // console.log(response.data);
                setMajors(response.data);
                console.log(majors);
            } catch (error) {
                console.error("Error fetching majors:", error);
            }
        };

        fetchMajors();
    }, [token]);

    useEffect(() => {
    axios.get('http://localhost:8000/api/view_all_majors', {
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => {
      console.log(response.data);
        setMajors(response.data);
    })
    .catch(error => {
        console.error(error);
    });
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();

        axios.post('http://localhost:8000/api/register_user', userData, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.error(error);
                alert("An error occurred while adding the user.");
            });
    };
    return (
  <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Add User</h2>
        <MdClose className="text-2xl text-gray-500 cursor-pointer hover:text-gray-700" onClick={onClose} />
      </div>

      <div className="border-b mb-4"></div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            name="email" 
            value={userData.email}
            onChange={handleInput}
            required 
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input 
            type="text" 
            name="name" 
            value={userData.name}
            onChange={handleInput}
            required 
            className="mt-1 w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="major_id" className="block text-sm font-medium text-gray-700">Major</label>
          <Select
            inputId="major_id"
            options={majorOptions}
            onChange={handleMajorChange}
            value={majorOptions.find(option => option.value === parseInt(userData.major_id)) || null}
            placeholder="Select Major"
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">Faculty</label>
          <input 
            type="text" 
            name="faculty" 
            value={userData.faculty}
            onChange={handleInput}
            disabled
            className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-600"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <Select
            name="role"
            options={roleOptions}
            value={roleOptions.find(option => option.value === userData.role) || null}
            onChange={(selectedOption) =>
              setUserData({ ...userData, role: selectedOption.value })
            }
            placeholder="Select Role"
            className="mt-1"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  </div>
);

}