import { FaUserGroup} from "react-icons/fa6";
import { IoMdAddCircle } from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";

export default function UserProfile() {
    return(
        <section className="w-auto h-auto border-2 border-gray-300 rounded-md m-4 bg-white shadow-xl">
            {/* Header Section */}
            <div className="flex justify-between border-b-2 border-gray-300 px-3 py-3">
                <div className="flex items-center gap-3">
                    <p className="text-gray-700 border-2 border-gray-300 h-8 w-8 flex justify-center items-center rounded-md">
                        <FaUserGroup className="text-gray-400" />
                    </p>
                    <p className="font-bold text-md">Users Managment Table</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <input type="text" placeholder="Search" className="border-2 border-gray-300 rounded-md px-2 py-1 text-xs h-full w-64" />
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-900">
                           <IoSearchOutline />
                        </button>
                    </div>
                    <button className="px-1 py-2 rounded-md border-2 border-gray-200 text-xs">All User</button>
                    <button className="bg-blue-800 text-white rounded-md px-2 py-2 h-8 text-xs flex items-center gap-1"> 
                        <IoMdAddCircle  className="text-lg"/>
                        Add New User
                    </button>
                </div>
            </div>
            {/* Table Section */}
            <div className="flex">
                <div className="border-r-2 w-1/4 border-gray-300 h-[500px] px-3 py-4">
                    <p className="font-semibold">Account Managment</p>
                </div>
                <div className="w-3/4 px-3 py-4">
                    <p className="font-semibold">Profile Information</p>
                </div>
            </div>
        </section>
    )
}