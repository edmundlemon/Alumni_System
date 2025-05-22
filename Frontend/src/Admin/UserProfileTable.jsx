import { FaUserCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { useMemo } from 'react';

export default function UserProfile({user,onClose}) {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'];
    const randomColor = useMemo(() => {
        const index = Math.floor(Math.random() * colors.length);
        return colors[index];
    }, []);


    // Mock data - replace with your actual data
    const careerHistory = [
        {
            title: "Software Engineer",
            companyName: "Tech Corp",
            jobType: "Full-time",
            startDate: "Jan 2020",
            endDate: "Present",
            location: "San Francisco",
            locationType: "On-site",
            description: "Developed web applications using React and Node.js"
        }
    ];

    const education = [
        {
            school: "University of Example",
            degree: "Bachelor of Science in Computer Science",
            startDate: "Sep 2015",
            endDate: "May 2019",
            grade: "3.8 GPA",
            description: "Graduated with honors"
        }
    ]
    

    const accountFields = [
        { label: 'Role', type: 'select', defaultValue: 'Alumni' },
        {label: 'Last Active',type: 'text',defaultValue: '2 hours ago',disabled: true},
        {label: 'Graduation Year',type: 'text',defaultValue: '15 Jan 2023',disabled: true},
        {label: 'Account Created',type: 'text',defaultValue: '18 Jan 2023',disabled: true},
    ];

    const profileFields = [
        { label: 'Full Name', type: 'text', defaultValue: 'Admin User' },
        { label: 'Phone Number', type: 'text', defaultValue: 'Admin User' },
        { label: 'Country', type: 'text', defaultValue: 'Admin User' },
        { label: 'Faculty', type: 'text', defaultValue: 'Admin User' },
        {label: 'Email',type: 'email',defaultValue: user?.email || 'No email provided',disabled: false},
        { label: 'Major', type: 'text', defaultValue: 'Admin User' },
    ];

    return(
        <section className="flex h-screen w-full justify-end">

                <div className="max-w-3xl  w-full">
                    {/* User Profile Section */}
                    <div className="bg-white rounded-tl-xl rounded-bl-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="flex flex-col lg:flex-row">
                            {/* Account Management Section */}
                            <div className="w-1.8/4 border-r border-gray-200 p-6 bg-white">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Management</h2>
                                
                                <div className={`w-full h-48 rounded-lg flex items-center justify-center text-white ${randomColor} mb-4`}>
                                    <FaUserCircle className="text-8xl opacity-80" />
                                </div>
                                <div className="space-y-4">
                                    {accountFields.map((field, idx) => (
                                        <div key={idx}>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                        <input
                                            type={field.type}
                                            defaultValue={field.defaultValue}
                                            disabled={field.disabled}
                                            className={`w-full px-4 py-2 border border-gray-300 rounded-lg text-sm ${
                                            field.disabled ? 'bg-gray-50' : ''
                                            } focus:ring-blue-500 focus:border-blue-500`}
                                        />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Profile Information Section */}
                            <div className="w-3/4 p-6 ">
                                <div className="flex items-center mb-4 justify-between pr-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                                    <MdClose className="text-xl cursor-pointer" onClick={onClose}/>
                                </div>
                                <div className="space-y-6 pr-6 mr-[-24px] overflow-y-auto h-[600px] ">
                                    <div className="grid grid-cols-2 gap-4">
                                        {profileFields.map((field, idx) => (
                                        <div key={idx}>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                                            <input
                                            type={field.type}
                                            defaultValue={field.defaultValue}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        ))}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                        <textarea
                                        rows={3}
                                        defaultValue="System administrator with full privileges"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    {/* Career History Section */}
                                    <div className="mt-8">
                                        <h3 className="font-bold text-xl text-gray-800 mb-4">Career History</h3>
                                        {careerHistory.length > 0 ? (
                                            <div className="space-y-4">
                                                {careerHistory.map((job, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{job.title}</h4>
                                                            <p className="text-sm text-gray-600">
                                                                {job.companyName} • {job.jobType}
                                                            </p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {job.startDate} - {job.endDate} • {job.location} • {job.locationType}
                                                            </p>
                                                            {job.description && (
                                                                <p className="text-sm text-gray-700 mt-2">{job.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">This user hasn't added any career history yet.</p>
                                        )}
                                    </div>

                                    {/* Education Section */}
                                    <div className="mt-8">
                                        <h3 className="font-bold text-xl text-gray-800 mb-4">Education</h3>
                                        {education && education.length > 0 ? (
                                            <div className="space-y-4">
                                                {education.map((edu, index) => (
                                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">{edu.school}</h4>
                                                            <p className="text-sm text-gray-600">{edu.degree}</p>
                                                            <p className="text-sm text-gray-500 mt-1">
                                                                {edu.startDate} - {edu.endDate}
                                                            </p>
                                                            {edu.grade && (
                                                                <p className="text-sm text-gray-700 mt-2">Grade: {edu.grade}</p>
                                                            )}
                                                            {edu.description && (
                                                                <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">This user hasn't added any education information yet.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    )
}