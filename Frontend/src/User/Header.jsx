import { useNavigate, Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import MMULOGO from '../assets/MMULOGO.png';

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = Cookies.get('token');
    const [logInOut, setLogInOut] = useState('Login');
    const [menuOpen, setMenuOpen] = useState(false);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [clickedMobileItem, setClickedMobileItem] = useState(null);
    const userRole = Cookies.get('userRole');

    const navItems = [
        { name: 'Home', path: '/mainPage' },
        { name: 'Profile', path: '/viewProfile' },
        { name: 'Donation', path: '/donationMainPage' },
        { 
            name: 'Events', 
            path: '/eventMainPage',
            dropdown: [
                { name: 'Register Events', path: '/events/upcoming' },
                ...(userRole === 'alumni' ? [{ name: 'Create Events', path: '/events/past' }] : [])
            ]
        },
        { name: 'Forum', path: '/forumMainPage' },
        { name: 'Alumni', path: '/alumniMainPage' },
    ];

    useEffect(() => {
        setLogInOut(token ? 'Log Out' : 'Login');
    }, [token]);

    const handleLoginLogout = () => {
        if (token) {
            axios.post('http://localhost:8000/api/user_logout', null, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                },
            })
            .then(() => {
                Cookies.remove('token');
                navigate('/userLogin');
            })
            .catch(error => {
                console.error('Logout error:', error);
            });
        } else {
            navigate('/userLogin');
        }
    };

    return (
        <nav className="bg-slate-100/80 backdrop-blur-md shadow-md sticky top-0 z-50 px-4 lg:px-20">
            <div className="flex items-center justify-between py-3">
                {/* Logo Section */}
                <div 
                    className="flex items-center space-x-4 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img className="h-[65px] w-[65px] hover:shadow-lg rounded-full transition duration-300" src={MMULOGO} alt="MMU Logo" />
                    <div className="bg-gray-300 w-px h-14"></div>
                    <div className="text-center transform hover:scale-105 transition-transform duration-200">
                        <p className="text-2xl font-semibold leading-tight tracking-tight">MMU</p>
                        <p className="text-2xl font-semibold tracking-wider">ALUMNI</p>
                    </div>
                </div>

                {/* Hamburger Toggle */}
                <button 
                    className="lg:hidden text-gray-700 focus:outline-none" 
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center space-x-10">
                    <ul className="flex space-x-8">
                        {navItems.map((item) => (
                            <li 
                                key={item.name} 
                                className="relative"
                                onMouseEnter={() => item.dropdown && setHoveredItem(item.name)}
                                onMouseLeave={() => setHoveredItem(null)}
                            >
                                <div className="flex flex-col items-center">
                                    <button
                                        onClick={() => navigate(item.path)}
                                        className={`relative flex items-center gap-1 font-medium text-lg transition-colors duration-200
                                            ${location.pathname.startsWith(item.path) ? 'text-blue-900 after:w-full' : 'hover:text-blue-900 text-gray-800'}
                                            after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-900 
                                            after:transition-all after:duration-300 hover:after:w-full`}
                                    >
                                        {item.name}
                                        {item.dropdown && (
                                            <FiChevronDown className={`transition-transform duration-200 ${hoveredItem === item.name ? 'transform rotate-180' : ''}`} />
                                        )}
                                    </button>

                                    {/* Dropdown Menu */}
                                    {item.dropdown && hoveredItem === item.name && (
                                        <div 
                                            className="absolute top-full left-0 pt-2"
                                            onMouseEnter={() => setHoveredItem(item.name)}
                                            onMouseLeave={() => setHoveredItem(null)}
                                        >
                                            <ul className="bg-white shadow-lg rounded-md py-1 w-48 animate-fade-in">
                                                {item.dropdown.map((drop) => (
                                                    <li key={drop.name}>
                                                        <Link
                                                            to={drop.path}
                                                            className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                                            onClick={() => setHoveredItem(null)}
                                                        >
                                                            {drop.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={handleLoginLogout}
                        className="px-6 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 shadow-md hover:shadow-lg"
                    >
                        {logInOut}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="lg:hidden pb-4 animate-slide-down">
                    <ul className="flex flex-col space-y-3">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                {!item.dropdown ? (
                                    <Link
                                        to={item.path}
                                        className="block px-3 py-2 text-gray-700 font-medium text-lg hover:bg-blue-50 rounded-lg"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ) : (
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => {
                                                if (clickedMobileItem === item.name) {
                                                    navigate(item.path);
                                                    setClickedMobileItem(null);
                                                    setMenuOpen(false);
                                                } else {
                                                    setClickedMobileItem(item.name);
                                                }
                                            }}
                                            className="flex items-center justify-between w-full px-3 py-2 text-gray-700 font-medium text-lg hover:bg-blue-50 rounded-lg"
                                        >
                                            <span>{item.name}</span>
                                            <FiChevronDown className={`transition-transform duration-200 ${clickedMobileItem === item.name ? 'transform rotate-180' : ''}`} />
                                        </button>
                                        {clickedMobileItem === item.name && (
                                            <ul className="ml-4 space-y-1">
                                                {item.dropdown.map((drop) => (
                                                    <li key={drop.name}>
                                                        <Link
                                                            to={drop.path}
                                                            className="block px-3 py-2 text-gray-600 hover:bg-blue-50 rounded-lg"
                                                            onClick={() => {
                                                                setMenuOpen(false);
                                                                setClickedMobileItem(null);
                                                            }}
                                                        >
                                                            {drop.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </li>
                        ))}
                        <li>
                            <button
                                onClick={() => {
                                    handleLoginLogout();
                                    setMenuOpen(false);
                                }}
                                className="w-full px-4 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition duration-300 shadow-md"
                            >
                                {logInOut}
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Header;