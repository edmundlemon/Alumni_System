import MMULOGO from '../assets/MMULOGO.png';

function Header() {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'About Us', path: '/about' },
        { name: 'Events', path: '/events' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'Alumni', path: '/alumni' },
    ];

    return (
        <nav className="flex items-center justify-between p-2 bg-slate-100 shadow-sm sticky top-0 z-50 px-20">
            {/* Logo and Branding Section */}
            <div className="flex items-center space-x-4">
                <img className="h-[71px] w-[72px]" src={MMULOGO} alt="MMU Logo" />
                <div className="bg-gradient-to-b from-gray-200 to-gray-300 w-px h-16"></div>
                <div className="text-center transform hover:scale-105 transition-transform duration-200">
                    <p className="text-2xl font-semibold leading-tight tracking-tight">MMU</p>
                    <p className="text-2xl font-semibold text-gray-800 tracking-wider">ALUMNI</p>
                </div>
            </div>

            {/* Navigation, Search & Login Section */}
            <div className="flex items-center space-x-10">
                <ul className="flex space-x-6">
                    {navItems.map((item) => (
                        <li key={item.name}>
                            <a 
                                href={item.path} 
                                className="relative text-gray-700 hover:text-blue-900 font-medium text-lg transition-colors duration-200
                                        after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-900 
                                        after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {item.name}
                            </a>
                        </li>
                    ))}
                </ul>

                {/* Login Button */}
                <button className="px-6 py-2.5 bg-blue-900 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors">
                    Login
                </button>
            </div>
        </nav>
    );
}

export default Header;
