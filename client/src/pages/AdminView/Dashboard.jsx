import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(7);
  const [selectedRole, setSelectedRole] = useState("");
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_DEALBABA_URL;
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/getAllUser`);
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Please try again later.");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/users/${userId}`);
      console.log("User deleted:", response.data.message);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user.userId !== userId)
      );
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Failed to delete user.");
    }
  };

  const updateUser = (userId) => {
    navigate(`/admin/updateUser/${userId}`);
  };

  const filterByRole = (role) => {
    setSelectedRole(role);
    if (role) {
      setFilteredUsers(users.filter((user) => user.role === role));
    } else {
      setFilteredUsers(users);
    }
    setCurrentPage(1);
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div>
      <div className="flex h-screen pt-14 bg-gray-200">
        <div className="w-full flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto md:pl-32">
            <div className="md:ml-6 mt-2">
              <div className="w-full h-12 flex justify-between md:pr-3 pr-3 mt-7">
                <select
                  value={selectedRole}
                  onChange={(e) => filterByRole(e.target.value)}
                  className="h-10 px-4 border rounded-md text-sm"
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="user">User</option>
                  {/* Add more roles here */}
                </select>
                <Link to="/admin/addUser">
                  <button className="w-[200px] h-10 bg-rose-600 font-semibold text-sm text-white hover:bg-rose-500 rounded-md md:mr-10">
                    Add Student
                  </button>
                </Link>
              </div>

              {/* User Table */}
              <div className="md:w-11/12 w-full md:relative absolute overflow-x-auto shadow-md shadow-slate-700 sm:rounded-lg mt-2">
                {loading ? (
                  <p className="text-center text-blue-500 font-semibold">
                    Loading...
                  </p>
                ) : error ? (
                  <p className="text-center text-red-500 font-semibold">
                    {error}
                  </p>
                ) : (
                  <table className="md:w-full w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 overflow-hidden ">
                    <thead className="text-md font-bold text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th className="px-8 py-3">Student Name</th>
                        <th className="px-6 py-3">Email Address</th>
                        <th className="px-6 py-3">Phone Number</th>
                        <th className="px-6 py-3">Gender</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map((user) => (
                        <tr
                          key={user.userId}
                          className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-black hover:translate-x-2 transform transition-transform duration-300 hover:bg-gray-200"
                        >
                          <td className="px-6 py-4">{user.name}</td>
                          <td className="px-6 py-4">{user.email}</td>
                          <td className="px-6 py-4">{user.phoneNumber}</td>
                          <td className="px-6 py-4">{user.gender}</td>
                          <td className="px-6 py-4">{user.role}</td>
                          <td className="px-6 py-4 space-x-2 flex">
                            <button
                              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                              onClick={() => updateUser(user.userId)}
                            >
                              Edit
                            </button>
                            <button
                              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 "
                              onClick={() => deleteUser(user.userId)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-5 items-center space-x-4">
                <button
                  onClick={prevPage}
                  className={`px-4 py-2 border rounded-md text-sm ${
                    currentPage === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-red-500"
                  } hover:bg-red-500 hover:text-white transition-colors`}
                  disabled={currentPage === 1}
                >
                  &lt; Prev
                </button>

                <ul className="flex space-x-3">
                  {Array.from({ length: totalPages }).map((_, index) => (
                    <li key={index + 1}>
                      <button
                        onClick={() => paginate(index + 1)}
                        className={`px-4 py-2 border rounded-md text-sm ${
                          currentPage === index + 1
                            ? "bg-red-500 text-white"
                            : "bg-white text-red-500"
                        } hover:bg-red-500 hover:text-white transition-colors`}
                      >
                        {index + 1}/{totalPages}
                      </button>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={nextPage}
                  className={`px-4 py-2 border rounded-md text-sm ${
                    currentPage === totalPages
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-white text-red-500"
                  } hover:bg-red-500 hover:text-white transition-colors`}
                  disabled={currentPage === totalPages}
                >
                  Next &gt;
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
