import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { FaPlus } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";

export default function UserManageTable() {
    const [users, setUsers] = useState<{ id: number; email: string; name: string; location: string; category: string }[]>([]);
    const [selectUser, setSelectUser] = useState<number[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState({ key: '', order: 'asc' });
    const itemsPerPage = 10;
    const token = Cookies.get('adminToken');

    const mockUsers = [
        { id: 1, email: "employer1@example.com", name: "Tech Solutions Inc.", location: "San Francisco, CA", category: "Information Technology" },
        { id: 2, email: "employer2@example.com", name: "Green Energy Partners", location: "Austin, TX", category: "Renewable Energy" },
        { id: 3, email: "employer3@example.com", name: "Global Finance Corp", location: "New York, NY", category: "Financial Services" },
        { id: 4, email: "employer4@example.com", name: "HealthPlus Systems", location: "Boston, MA", category: "Healthcare" },
        { id: 5, email: "employer5@example.com", name: "EduFuture Academy", location: "Chicago, IL", category: "Education" },
        { id: 6, email: "employer6@example.com", name: "Retail Masters", location: "Seattle, WA", category: "E-commerce" },
        { id: 7, email: "employer7@example.com", name: "Creative Designs LLC", location: "Portland, OR", category: "Marketing" },
        { id: 8, email: "employer8@example.com", name: "Logistics Nation", location: "Dallas, TX", category: "Transportation" },
        { id: 9, email: "employer9@example.com", name: "Food Innovations", location: "Los Angeles, CA", category: "Food & Beverage" },
        { id: 10, email: "employer10@example.com", name: "Construction Pros", location: "Denver, CO", category: "Construction" },
        { id: 11, email: "employer11@example.com", name: "Legal Associates", location: "Washington, DC", category: "Legal Services" },
        { id: 12, email: "employer12@example.com", name: "Media Productions", location: "Atlanta, GA", category: "Entertainment" }
    ];

    useEffect(() => {
        setUsers(mockUsers);
    }, []);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleSelectAll = (isChecked: boolean) => {
        setSelectUser(isChecked ? displayUsers.map(u => u.id) : []);
    };

    const handleSelectOne = (id: number, isChecked: boolean) => {
        setSelectUser(prev => isChecked ? [...prev, id] : prev.filter(i => i !== id));
    };

    const handleSort = (key: string) => {
        setSortCriteria(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleChangePage = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleViewUser = (id) => {
        setSelectedRole(id);
        setShowAddRole(true);
      };

    return (
        <div className="p-4 rounded-lg bg-white" style={{ boxShadow: '0 4px 6px rgba(0,0,0,0.1), 0 -4px 8px rgba(0,0,0,0.1), 4px 0 8px rgba(0,0,0,0.1), -4px 0 8px rgba(0,0,0,0.1)' }}>
            {error && <div className="text-red-500 p-2">{error}</div>}
            <div className='flex justify-between items-center pb-4'>
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
                        <IoIosSearch className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer' />
                    </div>
                    <button className="flex items-center gap-1 border-2 border-gray-100 px-2 py-2 rounded text-xs">
                        <MdDeleteOutline size={16} />
                        Delete
                    </button>
                    <button className="flex items-center gap-1 bg-violet-600 text-white px-6 py-2 rounded text-xs">
                        <FaPlus size={10} />
                        <span>Add User</span>
                    </button>
                </div>
            </div>

            <table className="min-w-full bg-white rounded-t-md shadow">
                <thead className='bg-violet-100 '>
                    <tr>
                        <th className="p-2 text-center rounded-tl-md">
                            <input
                                type="checkbox"
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                checked={displayUsers.length > 0 && displayUsers.every(user => selectUser.includes(user.id))}
                            />
                        </th>
                        {['id', 'email', 'name', 'location', 'category'].map((key) => (
                            <th key={key} className={`p-2 border-b text-left cursor-pointer ${key === 'category' ? 'rounded-tr-md' : ''}`} onClick={() => handleSort(key)}>
                                <p className='flex items-center gap-2 capitalize'>
                                    {key} <BiSortAlt2 size={20} />
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
                            <td className="border-b-2 border-gray-100 px-2 py-3 text-left">{user.id}</td>
                            <td className="border-b-2 border-gray-100 px-2 py-3 text-left">{user.email}</td>
                            <td className="border-b-2 border-gray-100 px-2 py-3 text-left">{user.name}</td>
                            <td className="border-b-2 border-gray-100 px-2 py-3 text-left">{user.location}</td>
                            <td className="border-b-2 border-gray-100 px-2 py-3 text-left">{user.category}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
                            className={`px-3 py-1 rounded-md text-sm border ${
                                currentPage === i + 1 ? 'bg-violet-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                            }`}
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
        </div>
    );
}
