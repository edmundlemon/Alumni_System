import { FaFacebookSquare } from 'react-icons/fa';
import { FiInstagram } from "react-icons/fi";
import { FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

export default function Footer() {
    const navigate = useNavigate();
    return(
        <section className="px-20 pt-10 border-t bg-gray-100 ">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10">
                <div className="flex flex-col items-start justify-start font-[1000] text-blue-900 text-3xl">
                    <h1>MMU ALUMNI</h1>
                    <div>
                        <p className="text-gray-500 text-base font-thin pt-1">Multimedia University Alumni</p>
                        <p className="text-gray-500 text-base font-thin">Connecting the Past, Inspiring the Future</p>
                    </div>
                    <div className="flex gap-5 mt-5 items-center">
                        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><FaFacebookSquare size={24}/></a>
                        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><FiInstagram size={24}/></a>
                        <a href="https://x.com/?lang=en" target="_blank" rel="noopener noreferrer"><FaXTwitter size={24}/></a>
                        <a href="https://www.youtube.com/watch?v=OjNyNFTsB68&t=117s" target="_blank" rel="noopener noreferrer"><FaYoutube size={28}/></a>
                    </div>
                </div>
                <ul className="space-y-2">
                    <li className="font-[1000] text-xl text-gray-500">About </li>
                    <li className="text-gray-500 text-base font-thin pt-1 cursor-pointer">About MMU</li>
                    <li className="text-gray-500 text-base font-thin cursor-pointer">Mission & Vision</li>
                    <li className="text-gray-500 text-base font-thin cursor-pointer">Alumni Association</li>
                    <li className="text-gray-500 text-base font-thin cursor-pointer">Leadership</li>
                </ul>
                <ul className="space-y-2">
                    <li className="font-[1000] text-xl text-gray-500">Quick Link</li>
                    <li onClick={()=> navigate("/userLogin")} className="text-gray-500 text-base font-thin pt-1 cursor-pointer">Login</li>
                    <li onClick={()=> navigate("/eventMainPage")} className="text-gray-500 text-base font-thin cursor-pointer">Event</li>
                    <li onClick={()=> navigate("/forumMainPage")} className="text-gray-500 text-base font-thin cursor-pointer">Forum</li>
                    <li onClick={()=> navigate("/donationMainPage")} className="text-gray-500 text-base font-thin cursor-pointer">Donation</li>
                </ul>
                <ul className="space-y-2">
                    <li className="font-[1000] text-xl text-gray-500 cursor-pointer">Term of Use</li>
                    <li onClick={()=> navigate("/policy")} className="text-gray-500 text-base font-thin pt-1 ">Privacy Policy</li>
                    <li onClick={()=> navigate("/termAndCondition")} className="text-gray-500 text-base font-thin cursor-pointer">Terms of Service</li>
                    <li onClick={()=> navigate("/contactUs")} className="text-gray-500 text-base font-thin cursor-pointer">Contact Us</li>
                    <li onClick={()=> navigate("/FAQ")} className="text-gray-500 text-base font-thin cursor-pointer">FAQ</li>
                </ul>
                <ul className="space-y-2">
                    <li className="font-[1000] text-xl text-gray-500">Contact Us</li>
                    <li className="text-gray-500 text-base font-thin pt-1">alumni@mmu.edu</li>
                    <li className="text-gray-500 text-base font-thin">+(60)123-789-7888</li>
                    <li className="text-gray-500 text-base font-thin">Multimedia University Jalan Multimedia, 63100
                Cyberjaya, Selangor, Malaysia</li>

                </ul>
            </div>
            <div className="flex flex-col items-center justify-center mt-20 border-t border-gray-300 -mx-20">
                <p className="text-center text-gray-500 text-base py-6">© 2023 MMU Alumni. All rights reserved.</p>
            </div>
        </section>
    )
}