import { FaUserCircle, FaGraduationCap, FaBriefcase } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useMemo } from 'react';

export default function UserProfile({ user, onClose, height }) {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = useMemo(() => {
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }, []);

    const accountFields = [
        { label: 'Role', value: 'Alumni' },
        { label: 'Last Active', value: '2 hours ago' },
        { label: 'Account Created', value: '18 Jan 2023' },
    ];

    const profileFields = [
        { label: 'Full Name', value: user?.name || 'No name provided' },
        { label: 'Phone Number', value: user?.phone || 'Not provided' },
        { label: 'Country', value: user?.country || 'Not specified' },
        { label: 'Email', value: user?.email || 'No email provided' },
    ];

    const educationFields = [
        { label: 'Education Level', value: user?.educationLevel || 'Bachelor' },
        { label: 'Major', type: 'text', defaultValue: user?.major?.major_name || 'Not specified' },
        { label: 'Faculty', value: user?.faculty || 'Not specified' },
        { label: 'Graduation Year', value: user?.graduationYear || 'Not specified' },
    ];

    const employmentFields = [
        { label: 'Company Name', value: user?.company || 'Not specified' },
        { label: 'Position', value: user?.position || 'Not specified' },
        { label: 'Job Title', value: user?.jobTitle || 'Not specified' },
        { label: 'Industry', value: user?.industry || 'Not specified' },
    ];

    return (
        <section className="fixed inset-0 bg-black bg-opacity-50 items-center p-4 flex justify-end z-50">
            <div style={{ height: `${height - 30}px` }} className="bg-white w-full rounded-lg max-w-3xl overflow-y-auto">
                <div className="flex flex-col lg:flex-row h-full">
                    {/* Account Management Section */}
                    <div className="w-full lg:w-2/5 border-r border-gray-200 p-6 bg-white">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-800">Account Management</h2>
                            
                        </div>
                        
                        <div className={`w-full h-48 rounded-lg flex items-center justify-center text-white ${randomColor} mb-6`}>
                            <FaUserCircle className="text-8xl opacity-80" />
                        </div>
                        
                        <div className="space-y-4">
                            {accountFields.map((field, idx) => (
                                <div key={idx}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {field.label}
                                    </label>
                                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800">
                                        {field.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Profile Information Section */}
                    <div className="w-full lg:w-3/5 p-6 overflow-y-auto">
                        <div className="space-y-8">
                            {/* Personal Info */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaUserCircle className="text-xl text-gray-600 mr-2" />
                                    <div className="flex justify-between items-center w-full">
                                        <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                                        <MdClose 
                                            className="text-2xl cursor-pointer text-gray-500 hover:text-gray-700" 
                                            onClick={onClose}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profileFields.map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800">
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaGraduationCap className="text-xl text-gray-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-800">Education</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {educationFields.map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800">
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Employment */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <FaBriefcase className="text-xl text-gray-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-gray-800">Employment</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {employmentFields.map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800">
                                                {field.value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-800">
                                    {user?.bio || 'Tell us about yourself...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
