import { useState, useEffect } from "react"
import Cookies from "js-cookie";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { PiUploadThin } from "react-icons/pi";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { comma } from "postcss/lib/list";

export default function ViewProfile() {
    const [user, setUser] = useState([]);
    const [chnageUserData, setChangeUserData] = useState({
        image: "",
        bio: "",
        phone: "",
        home_country: "",
        internationality: "",
        educationLevel: "",
        company:"",
        position: "",
        job_title: "",
    });
    const token = Cookies.get('token');
    const userId = Cookies.get('userId');
    const getInitial = (name = "") => name.charAt(0).toUpperCase();
    const educationLevel =[
        { value: "undergraduate", label: "Undergraduate" },
        { value: "postgraduate", label: "Postgraduate" },
        { value: "phd", label: "PhD" }
    ];
    const internationality = [
        { value: "malaysia", label: "malaysia" },
        { value: "non malaysia", label: "non malaysia" }
    ];
    const countryOptions = useMemo(() => countryList().getData(), []);



    useEffect(()=>{
        const fetchProfile = async() =>{
            try {
                const response = await axios.get(`http://localhost:8000/api/view_user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });
                console.log(response.data);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching alumni data:', error);
            }
        }

        if (token) {
            fetchProfile();
        }
        else{
            console.error('Token not found');
        }
    },[])

    return(
        <section className="mx-20 my-10 min-h-screen border py-7">
            <div className="relative flex w-full items-center justify-center pb-6">
                 <div className="w-44 h-44 rounded-full bg-blue-100 overflow-hidden border-4 border-blue-300 shadow">
                    {user.image ? (
                        <img
                        src={user.image}
                        alt="Profile"
                        className="w-44 h-44 object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white bg-blue-400">
                        <FaUser size={100} />
                        </div>
                    )}
                </div>
                <h1 className="text-4xl font-semibold absolute top-0 left-10 ">USER PROFILE</h1>
            </div>
            <div className="flex items-center justify-center">
                <button className="px-8 py-2 rounded border text-base border-gray-300 gap-2 flex items-center"><PiUploadThin size={20}/> Upload</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 px-10">
                <div className="flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Full Name</label>
                    <input 
                        type="text" 
                        value={user.name || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Email Address</label>
                    <input 
                        type="text" 
                        value={user.email || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Phone Number</label>
                    <input 
                        type="text" 
                        value={user.phone || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Role</label>
                    <input 
                        type="text" 
                        value={user.role || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0">Internationality</label>
                    <Select
                        options={internationality}
                        value={internationality.find(opt => opt.value === chnageUserData.internationality)}
                        onChange={(selected) => {
                        setChangeUserData(prev => ({
                            ...prev,
                            internationality: selected.value,
                            home_country: selected.value === 'malaysia' ? 'Malaysia' : ''
                        }));
                        }}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="py-0">Home Country</label>
                    {chnageUserData.internationality === 'malaysia' ? (
                        <input
                        type="text"
                        value="Malaysia"
                        readOnly
                        className="border border-gray-300 rounded px-4 py-2 bg-gray-100"
                        />
                    ) : (
                        <Select
                        options={countryOptions}
                        value={countryOptions.find(c => c.value === chnageUserData.home_country)}
                        onChange={(selected) =>
                            setChangeUserData(prev => ({ ...prev, home_country: selected.value }))
                        }
                        />
                    )}
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0">Education Level</label>
                    <Select
                        options={educationLevel}
                        value={educationLevel.find(opt => opt.value === chnageUserData.educationLevel)}
                        onChange={(selected) => {
                        setChangeUserData(prev => ({
                            ...prev,
                            educationLevel: selected.value,
                            home_country: selected.value === 'malaysia' ? 'Malaysia' : ''
                        }));
                        }}
                    />
                </div>
                <div className="flex gap-4 w-full">
                    <div className="flex-1 flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Major</label>
                    <input 
                        type="text" 
                        value={user.major_name || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="py-0" htmlFor="Name">Faculty</label>
                        <input 
                            type="text" 
                            value={user.faculty || ""} 
                            onChange={() => {}} readOnly 
                            className="border border-gray-300 rounded px-4 py-2"
                            />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Company Name</label>
                    <input 
                        type="text" 
                        value={user.role || ""} 
                        onChange={() => {}} readOnly 
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                </div>
                <div className="flex gap-4 w-full">
                    <div className="flex-1 flex flex-col gap-2">
                    <label className="py-0" htmlFor="Name">Position</label>
                    <input 
                        type="text" 
                        value={user.position || ""} 
                        onChange={() => {}}
                        className="border border-gray-300 rounded px-4 py-2"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <label className="py-0" htmlFor="Name">Job Tittle</label>
                        <input 
                            type="text" 
                            value={user.job_title || ""} 
                            onChange={() => {}}  
                            className="border border-gray-300 rounded px-4 py-2"
                            />
                    </div>
                </div>             
            </div>
            <div className="flex gap-6 justify-end w-full font-semibold px-10 mt-7">
                    <button className="px-6 py-2 rounded border border-gray-300">Cancel</button>
                    <button className="bg-denim text-white font-semibold px-6 py-[6px] rounded">Save & Change</button>
            </div>
        </section>
    )
}