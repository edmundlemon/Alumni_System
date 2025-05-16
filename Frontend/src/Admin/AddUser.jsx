import { MdClose } from "react-icons/md";
import axios from "axios";

import { useState, useEffect } from "react";

import Cookies from "js-cookie";

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


    const handleInput = (event) => {
        const { name, value } = event.target;
        setUserData({ ...userData, [name]: value });
    }

    const token = Cookies.get("adminToken");
    const [majors, setMajors] = useState([]);
    useEffect(() => {
        const fetchMajors = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/view_all_majors', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log(response.data);
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
    return(
        <div className="flex justify-center items-center h-screen ">
            <div className="w-[330px] max-w-md bg-white border rounded-xl p-6">
                <h2 className="text-base font-semibold mb-4 flex justify-between items-center">
                    Add User  
                    <MdClose className="text-lg cursor-pointer text-neutral-500" onClick={onClose}/>
                </h2>
                <div className="border-b mx-[-24px]"></div>
                <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="text" 
                            name="email" 
                            onChange={handleInput}
                            value={userData.email}
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input 
                            type="text" 
                            name="name" 
                            onChange={handleInput}
                            value={userData.name}
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                        />
                    </div>
                    <div className="mb-4">

                        <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">faculty</label>
                        <input 
                            type="text" 
                            name="faculty" 
                            onChange={handleInput}
                            value={userData.faculty}
                            required 
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-1"
                        />
                    </div>
                    <div>
                    <label htmlFor="major_id" className="block text-sm font-medium text-gray-700">Major</label>
                    <select
                        name="major_id"
                        value={userData.major_id}
                        onChange={(e) => {
                            const selectedMajor = majors.find(major => major.id === parseInt(e.target.value));
                            setUserData({
                                ...userData,
                                major_id: e.target.value,
                                major: selectedMajor ? selectedMajor.major_name : "",
                                faculty: selectedMajor ? selectedMajor.faculty_id.toString() : ""
                            });
                        }}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Select Major</option>
                        {majors.map(major => (
                            <option key={major.id} value={major.id}>
                                {major.major_name}
                            </option>
                        ))}
                    </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Role</label>
                        <select
                            name="role"
                            value={userData.role}
                            onChange={handleInput}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1  focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Role</option>
                            <option value="student">Student</option>
                            <option value="alumni">Alumni</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors">Add User</button>
                </form>
            </div>
        </div>
    )
}