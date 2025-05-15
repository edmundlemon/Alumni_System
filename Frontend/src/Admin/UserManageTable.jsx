import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoSearchSharp } from "react-icons/io5";
import { BiExport } from "react-icons/bi";
import { BiSortAlt2 } from "react-icons/bi";
import UserProfile from './UserProfile';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import AddUser from './AddUser';

export default function UserManageTable() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [selectUser, setSelectUser] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState({ key: '', order: 'asc' });
    const itemsPerPage = 10;
    const token = Cookies.get('adminToken');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showAddUser, setShowAddUser] = useState(false);
    const printRef = useRef();

    useEffect(() => {
        const getUsers = async () => {
            try {
                console.log('Token:', token);
                const response = await axios.get('http://localhost:8000/api/view_all_users', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                console.log(response.data);
                setUsers(response.data);
            } catch (error) {
                console.error('Error Response:', error.response);
                setError(error.response?.data?.message || 'An error occurred');
                console.error('There was an error!', error.message);
            } 
        };

        if (token) {
            getUsers();
        } else {
            console.error('No token found, user might not be authenticated');
            setError('User not authenticated');
            navigate('/403');
        }
    }, [token, navigate]);

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortCriteria.key];
        const bValue = b[sortCriteria.key];

        if (aValue < bValue) return sortCriteria.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortCriteria.order === 'asc' ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const displayUsers = sortedUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectAll = (isChecked) => {
        setSelectUser(isChecked ? displayUsers.map(u => u.id) : []);
    };

    const handleSelectOne = (id, isChecked) => {
        setSelectUser(prev => isChecked ? [...prev, id] : prev.filter(i => i !== id));
    };

    const handleSort = (key) => {
        setSortCriteria(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleViewUser = (user) => {
        setSelectedUserId(user);
        setShowUserProfile(true);
    }

    const handleExport = async () => {
    
            const element = printRef.current;
            if (!element) return;

            const canvas = await html2canvas(element)
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('users_report.pdf');
    }

    return (
        <div className="h-full p-4 rounded-lg bg-white" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)' }}>
            {error && <div className="text-red-500 p-2">{error}</div>}
            <div className='flex justify-between items-center pb-4 '>
                <p className='font-bold text-xl'>Users Management Table</p>
                <div className='flex h-9 gap-2'>
                    <div className='relative'>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search alumni..."
                            className="w-[300px] h-9 pl-4 pr-10 py-2 border-2 border-gray-100 rounded-md text-sm"
                        />
                        <IoSearchSharp className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer' />
                    </div>
                    <button className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
                        <MdDeleteOutline size={16} />
                        Delete
                    </button>
                    <button className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs" onClick={handleExport}>
                        <BiExport size={16} />
                        Export
                    </button>
                    <button className="flex items-center gap-1 bg-[#1560bd] text-white px-6 py-2 rounded text-xs" onClick={() => setShowAddUser(true)}>
                        <FaPlus size={10} />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <div ref={printRef}>
                <table className="min-w-full bg-white rounded-t-md shadow">
                    <thead className='bg-blue-100'>
                        <tr>
                            <th className="p-2 text-center rounded-tl-md">
                                <input
                                    type="checkbox"
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    checked={displayUsers.length > 0 && displayUsers.every(user => selectUser.includes(user.id))}
                                />
                            </th>
                            {['id', 'email', 'name', 'role', 'status', 'created_at'].map((key) => (
                                <th
                                    key={key}
                                    className={`p-2 border-b text-left cursor-pointer ${
                                    key === 'created_at' ? 'rounded-tr-md' : ''
                                    }`}
                                    onClick={() => handleSort(key)}
                                >
                                    <p className="flex items-center gap-2 capitalize">
                                    {key.replace('_', ' ')} <BiSortAlt2 size={20} />
                                    </p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {displayUsers.map((user) => (
                            <tr key={user.id} className="border-b-2 border-gray-100 hover:bg-gray-50">
                                <td className="border-b border-gray-300 p-2 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleSelectOne(user.id, e.target.checked)}
                                        checked={selectUser.includes(user.id)}
                                    />
                                </td>
                                <td className="px-2 py-3 text-left">
                                    <button onClick={() => handleViewUser(user)} >
                                        {user.id}
                                    </button>
                                </td>
                                <td className="px-2 py-3 text-left">{user.email}</td>
                                <td className="px-2 py-3 text-left">{user.name}</td>
                                <td className="px-2 py-3 text-left">{user.role}</td>
                                <td className="px-2 py-3 text-left">{user.account_status}</td>
                                <td className="px-2 py-3 text-left">{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-between items-center bg-white rounded-b-md shadow px-4 py-2 ">
                <p className="text-sm text-gray-500">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} entries
                </p>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleChangePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handleChangePage(i + 1)}
                            className={`px-3 py-1 rounded-md text-sm border ${currentPage === i + 1 ? 'bg-[#1560bd] text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handleChangePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded-md border text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>

            {showUserProfile && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-70 z-40"
                        onClick={() => setShowUserProfile(false)}
                    ></div>
                    <div
                        className={`fixed top-0 right-0 h-screen w-[50%] z-50 bg-white shadow-lg rounded-l-xl transform transition-transform duration-100 ease-in-out translate-x-0`}
                    >
                        <UserProfile user={selectedUserId} onClose={() => setShowUserProfile(false)} />
                    </div>
                </>
            )}
            {showAddUser && (
                <div className='fixed z-50 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50'>
                    <AddUser onClose={() => setShowAddUser(false)} />
                </div>
            )}
        </div>
    );
}