import { useState, useRef } from "react";
import Select from 'react-select';
import { RxImage } from "react-icons/rx";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function AddEvent() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        eventTitle: '',
        eventType: '',
        description: '',
        eventDate: '',
        startTime: '',
        endTime: '',
        registerCloseDate: '',
        maxAttendees: '',
        noLimit: false,
        location: '',
        image: null
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);

    const eventTypeOptions = [
        { value: "Hybrid", label: "Hybrid" },
        { value: "Online", label: "Online" },
        { value: "Offline", label: "Offline" },
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
            setFormData(prev => ({ ...prev, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate and submit logic here
        console.log('Form submitted:', formData);
        navigate('/events'); // Redirect after submission
    };

    return (
        <section className="min-h-screen mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-8 pt-6 border-gray-200">
                    <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
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
                                name="eventTitle"
                                id="eventTitle"
                                value={formData.eventTitle}
                                onChange={handleChange}
                                placeholder="Enter event title"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>

                        {/* Event Type */}
                        <div className="space-y-2">
                            <label htmlFor="eventType" className="block text-base font-medium text-gray-700">
                                Event Type <span className="text-red-500">*</span>
                            </label>
                            <Select
                                name="eventType"
                                options={eventTypeOptions}
                                placeholder="Select event type"
                                onChange={handleSelectChange}
                                className="basic-single"
                                classNamePrefix="select"
                                required
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="mt-6 space-y-2">
                        <label className="block text-base font-medium text-gray-700">
                            Event Image
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div 
                                className={`w-full h-52 sm:w-2/3 flex flex-col items-center justify-center rounded-lg border-2 border-dashed ${imagePreview ? 'border-gray-300' : 'border-gray-300'} p-6 text-center hover:border-blue-400 transition-colors cursor-pointer`}
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
                            rows={5}
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write a detailed description about your event..."
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                            required
                        />
                    </div>

                    {/* Event Date & Time */}
                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="eventDate" className="block text-base font-medium text-gray-700">
                                    Event Date <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    name="eventDate"
                                    id="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="startTime" className="block text-base font-medium text-gray-700">
                                    Start Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                            <div className="w-full sm:w-1/3 space-y-2">
                                <label htmlFor="endTime" className="block text-base font-medium text-gray-700">
                                    End Time <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    name="endTime"
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                    required
                                />
                            </div>
                        </div>
                <div className="flex w-full gap-4 mt-1">
                        {/* Registration Deadline */}
                        <div className="w-full space-y-2">
                            <label htmlFor="registerCloseDate" className="block text-base font-medium text-gray-700">
                                Registration Deadline <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="registerCloseDate"
                                id="registerCloseDate"
                                value={formData.registerCloseDate}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                                required
                            />
                        </div>

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
                        </div>
                    </div>
                        {/* Max Attendees */}
                        <div className="space-y-2 mt-1">
                            <label htmlFor="maxAttendees" className="block text-base font-medium text-gray-700">
                                Maximum Attendees
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="number"
                                    name="maxAttendees"
                                    id="maxAttendees"
                                    value={formData.maxAttendees}
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