import { useState, useRef } from "react";
import Select from 'react-select';
import { RxImage } from "react-icons/rx";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { BsInfoSquareFill } from "react-icons/bs";

export default function AddEvent() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const user_id = Cookies.get("userId");
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        event_title: '',
        event_mode: '',
        description: '',
        event_date: '',
        event_time: '',
        registration_close_date: '',
        max_participants: '',
        location: '',
        noLimit: false,
        photo: null
    });
    const token = Cookies.get("token");
    const [imagePreview, setImagePreview] = useState(null);

    const eventTypeOptions = [
        { value: "Hybrid", label: "Hybrid" },
        { value: "Online", label: "Online" },
        { value: "Physical", label: "Physical" },
    ];

     const [showTooltip, setShowTooltip] = useState(false);

    // Success tips content
    const successTips = [
    "Keep the title concise and eye-catching to attract participants",
    "Choose the correct event type based on the nature of the activity (Online/Offline/Hybrid)",
    "Upload clear and high-quality event images (recommended size: 1200x600 pixels)",
    "Include key details in the event description such as time, topic, agenda, and target audience",
    "Ensure the event date and registration deadline are properly spaced; it's recommended to close registration at least 3 days in advance",
    "For offline events, provide a detailed address including floor, unit number, and nearby landmarks",
    "For online events, include the platform name (e.g., Zoom, Teams) and the meeting link",
    "If there’s no participant limit, check 'Unlimited'; otherwise, specify the maximum number of attendees",
    "Enter accurate event time, avoiding dates earlier than today or conflicting times",
    "Double-check all entered information to ensure nothing is missing or incorrect"
    ];


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectChange = (selectedOption, { name }) => {
        setFormData(prev => ({
            ...prev,
            [name]: selectedOption.value
        }));
    };

   const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({ ...prev, photo: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  }
};


    const removeImage = () => {
        setFormData(prev => ({ ...prev, photo: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = new FormData();
        payload.append("event_title", formData.event_title);
        payload.append("event_mode", formData.event_mode);
        payload.append("description", formData.description);
        payload.append("event_date", formData.event_date);
        payload.append("event_time", formData.event_time);
        payload.append("registration_close_date", formData.registration_close_date);
        payload.append("max_participants", formData.noLimit ? '' : formData.max_participants);
        payload.append("location", formData.location);
        payload.append("user_id", user_id);
        if (formData.photo) {
            payload.append("photo", formData.photo);
        }

        // ✅ Debug FormData
        console.log("FormData Payload:");
        for (let [key, value] of payload.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/create_event",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log("Event created successfully:", response.data);
            alert("Event created successfully!");
            navigate("/user/event");
        } catch (error) {
            console.error("Full error:", error);

            if (error.response?.status === 422) {
                console.log("Validation Errors:", error.response.data.errors);
                alert("Validation failed. Check console for details.");
            } else if (error.response?.data?.message) {
                alert(`Error: ${error.response.data.message}`);
            } else {
                alert("An unexpected error occurred. Check the console.");
            }
        }
    };



    return (
        <section className="min-h-screen  px-4 sm:px-6 lg:px-8 py-10 bg-[#f7f9f9]">
            <div className="bg-white mx-10 rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                <div className="px-8 pt-6 border-gray-200">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
                                <div 
                                    className="relative group"
                                    onMouseEnter={() => setShowTooltip(true)}
                                    onMouseLeave={() => setShowTooltip(false)}
                                    >
                                    <BsInfoSquareFill 
                                        className="text-blue-900 cursor-pointer hover:text-blue-700 transition-colors" 
                                        size={29} 
                                    />
                                    {/* Tooltip */}
                                    {showTooltip && (
                                        <div className="absolute top-0 left-full ml-2 w-[750px] p-4 bg-white border border-blue-200 rounded-lg shadow-xl z-50">
                                        <h3 className="font-bold text-blue-800 mb-2">Profile Success Tips:</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                                            {successTips.map((tip, index) => (
                                            <li key={index}>{tip}</li>
                                            ))}
                                        </ul>
                                        </div>
                                    )}
                                </div>
                        </div>
                    <p className="mt-1 text-gray-600">Fill in the details below to create your event</p>
                </div>

                <form onSubmit={handleSubmit} className="px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Event Title */}
                        <div className="space-y-2">
                            <label htmlFor="eventTitle" className="block text-base font-medium text-gray-700">
                                Event Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="event_title"
                                value={formData.event_title}
                                onChange={handleChange}
                                placeholder="Enter event title"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                            <p className="text-red-600 text-xs">{errors.event_title}</p>
                        </div>

                        {/* Event Type */}
                        <div className="space-y-2">
                            <label htmlFor="event_mode" className="block text-base font-medium text-gray-700">
                                Event Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="event_mode"
                                options={eventTypeOptions}
                                placeholder="Select event type"
                                onChange={handleSelectChange}
                                className="basic-single"
                                classNamePrefix="select"
                                required
                            />
                            <p className="text-red-600 text-xs">{errors.event_mode}</p>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mt-6 space-y-2">
                        <label className="block text-base font-medium text-gray-700">
                            Event Image
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div 
                                className={`w-full h-60 sm:w-2/3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${imagePreview ? 'border-gray-300' : 'border-gray-300'} p-6 text-center hover:border-blue-400 transition-colors cursor-pointer`}
                                onClick={() => fileInputRef.current.click()}
                            >
                                {imagePreview ? (
                                    <div className="relative w-full h-48">
                                        <img 
                                            src={imagePreview} 
                                            alt="Event preview" 
                                            className="w-full h-full object-cover rounded-md"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); removeImage(); }}
                                            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                                        >
                                            <IoMdClose className="text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <RxImage className="mx-auto h-12 w-12 text-gray-400" />
                                        <p className="mt-2 text-sm text-gray-600">
                                            Drag and drop your image here, or click to browse
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            PNG, JPG up to 5MB
                                        </p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            <div className="w-full sm:w-1/3 flex flex-col justify-center">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <IoMdAdd className="mr-2" />
                                    Upload Image
                                </button>
                                <p className="mt-2 text-xs text-gray-500">
                                    Recommended size: 1200x600 pixels
                                </p>
                                <p className="text-red-600 text-xs">{errors.image}</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mt-6 space-y-2">
                        <label htmlFor="description" className="block text-base font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            name="description"
                            id="description"
                            rows={6}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write a detailed description about your event..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            required
                        />
                        <p className="text-red-600 text-xs">{errors.description}</p>
                    </div>

                    {/* Event Date & Time */}
                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="event_date" className="block text-base font-medium text-gray-700">
                                    Event Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="event_date"
                                    value={formData.event_date}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                                <p className="text-red-600 text-xs">{errors.event_date}</p>
                            </div>
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="event_time" className="block text-base font-medium text-gray-700">
                                    Event Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="event_time"
                                    value={formData.event_time}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                                <p className="text-red-600 text-xs">{errors.event_time}</p>
                            </div>
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="registration_close_date" className="block text-base font-medium text-gray-700">
                                Registration Deadline <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="registration_close_date"
                                        value={formData.registration_close_date}
                                        onChange={handleChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                        required
                                    />
                                    <p className="text-red-600 text-xs">{errors.registration_close_date}</p>
                            </div>
                        </div>
                <div className="flex w-full gap-4 mt-1">

                        {/* Location */}
                        <div className=" w-full space-y-2">
                            <label htmlFor="location" className="block text-base font-medium text-gray-700">
                                Location <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                id="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="Enter event location or online meeting link"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                            <p className="text-red-600 text-xs">{errors.location}</p>
                        </div>

                          {/* Max Attendees */}
                        <div className="w-full space-y-2 mt-1">
                            <label htmlFor="max_participants" className="block text-base font-medium text-gray-700">
                                Maximum Attendees
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    name="max_participants"
                                    value={formData.max_participants}
                                    onChange={handleChange}
                                    disabled={formData.noLimit}
                                    placeholder="Enter maximum number of attendees"
                                    className="block w-72 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border disabled:bg-gray-100 disabled:text-gray-500"
                                    min="1"
                                />
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="noLimit"
                                        id="noLimit"
                                        checked={formData.noLimit}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="noLimit" className="ml-2 block text-sm text-gray-700">
                                        No limit on the number of participants
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                        
                    </div>

                    {/* Form Actions */}
                    <div className="mt-5 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-denim hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}