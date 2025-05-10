export default function AddUser() {
    return(
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-blue-100 to-cyan-100">
            <div className="w-[350px] max-w-md bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Add User</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" id="name" name="name" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" id="email" name="email" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"/>
                    </div>
                    <button type="submit" className="w-full bg-blue-900 text-white font-semibold py-2 rounded-lg hover:bg-blue-800 transition-colors">Add User</button>
                </form>
            </div>
        </div>
    )
}