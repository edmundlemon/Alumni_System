import { useState, useEffect } from "react"
import Cookies from "js-cookie";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import { PiUploadThin } from "react-icons/pi";
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useMemo } from 'react';
import { comma } from "postcss/lib/list";
// Import profile images
import img from '../assets/profile/img_1.jpeg';
import img1 from '../assets/profile/img_2.jpeg';
import img2 from '../assets/profile/img_3.jpeg';
import img3 from '../assets/profile/img_4.jpeg';
import img4 from '../assets/profile/img_5.jpeg';
import img5 from '../assets/profile/img_6.jpeg';
import img6 from '../assets/profile/img_7.jpeg';
import img7 from '../assets/profile/img_8.jpeg';
import img8 from '../assets/profile/img_9.jpeg';
import img9 from '../assets/profile/img_10.jpeg';
import img10 from '../assets/profile/img_11.jpeg';
import img11 from '../assets/profile/img_12.jpeg';
import img12 from '../assets/profile/img_13.jpeg';
import img13 from '../assets/profile/img_14.jpeg';
import img14 from '../assets/profile/img_15.jpeg';


export default function ViewProfile() {
    const profileImages = [
    img, img1, img2, img3, img4, img5, img6, img7, img8, img9,
    img10, img11, img12, img13, img14
    ];
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
    const [showImagePicker, setShowImagePicker] = useState(false);

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
                    {(chnageUserData.image || user.image) ? (
                        <img
                        src={chnageUserData.image || user.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white bg-blue-400">
                        <FaUser size={100} />
                        </div>
                    )}
                    </div>
                <h1 className="text-4xl font-semibold absolute top-0 left-10 ">UPDATE PROFILE</h1>
            </div>
            <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-2 rounded border text-base border-gray-300 gap-2 flex items-center"><PiUploadThin size={20}/> Upload</button>
                <button
                className="px-8 py-2 rounded border text-base border-gray-300 gap-2 flex items-center"
                onClick={() => setShowImagePicker(prev => !prev)}
                >
                <PiUploadThin size={20} /> Pick
                </button>
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
            {showImagePicker && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-4xl w-full mx-4 relative">
                <h2 className="text-xl font-bold mb-4 text-center text-blue-900">Select a Profile Image</h2>
                <div className="grid grid-cols-3 m sm:grid-cols-4 md:grid-cols-5 gap-4 max-h-[400px] overflow-y-auto px-4">
                    {profileImages.map((image, index) => (
                    <div className="flex items-center justify-center" key={index}>
                        <img
                        src={image}
                        alt={`Profile ${index + 1}`}
                        className={`w-24 h-24 object-cover rounded-full border-4 cursor-pointer transition-all duration-200 ${
                        chnageUserData.image === image
                            ? "border-blue-600 ring-2 ring-blue-300"
                            : "border-gray-300 hover:border-blue-400"
                        }`}
                        onClick={() => setChangeUserData(prev => ({ ...prev, image }))}
                    />
                    </div>
                    ))}
                </div>
                <div className="flex justify-end gap-4 mt-6 px-4">
                    <button
                    className="px-6 py-2 rounded border border-gray-300 hover:bg-gray-100"
                    onClick={() => setShowImagePicker(false)}
                    >
                    Cancel
                    </button>
                    <button
                    className="px-6 py-2 rounded bg-denim text-white hover:bg-blue-700"
                    onClick={() => setShowImagePicker(false)}
                    >
                    Save & Change
                    </button>
                </div>
                </div>
            </div>
            )}


        </section>
    )
}