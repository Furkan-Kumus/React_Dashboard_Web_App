import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';

const API_URL = "http://localhost:5000/api/users";

const UsersTable = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [limit] = useState(10);

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    const fetchUsers = async (page) => {
        try {
            const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
            const data = await response.json();
            
            if (response.ok) {
                setUsers(data.empData);
                setFilteredUsers(data.empData);
                setTotalPages(data.totalPages);
                setTotalUsers(data.totalUsers);
                setCurrentPage(data.currentPage);
            } else {
                console.error('API Error:', data.message);
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users');
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(term) ||
                user.email.toLowerCase().includes(term)
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    await fetchUsers(currentPage);
                    toast.success("User deleted successfully");
                } else {
                    const data = await response.json();
                    toast.error(`Delete Error: ${data.message}`);
                }
            } catch (error) {
                toast.error(`Error deleting user: ${error}`);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (!Array.isArray(filteredUsers)) {
        return <div>Error: Unable to load user data.</div>;
    }

    return (
        <motion.div
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Users</h2>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-700">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <motion.tr
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                                    {user.name.charAt(0)}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-100">{user.name}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-300">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.role === "admin"
                                                    ? "bg-rose-700 text-rose-100"
                                                    : user.role === "viewer"
                                                        ? "bg-violet-600 text-violet-100"
                                                        : user.role === "editor"
                                                            ? "bg-pink-600 text-pink-100"
                                                            : ""
                                            }`}
                                        >
                                            {user.role}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                user.status === "active"
                                                    ? "bg-green-800 text-green-100"
                                                    : user.status === "inactive"
                                                        ? "bg-red-800 text-red-100"
                                                        : user.status === "pending"
                                                            ? "bg-blue-600 text-blue-100"
                                                            : ""
                                            }`}
                                        >
                                            {user.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-indigo-400 hover:text-indigo-300 mr-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </motion.tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-gray-400 py-4">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="mt-4 flex items-center justify-between px-4">
                <div className="text-sm text-gray-400">
                    Showing page {currentPage} of {totalPages} ({totalUsers} total users)
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg ${
                            currentPage === 1
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg ${
                            currentPage === totalPages
                                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                        }`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default UsersTable;