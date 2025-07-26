import { useState, useEffect } from "react";
import { allUsers, deleteUser, updateUser } from '../../store/actions/userActions';
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import toast from 'react-hot-toast';
import { Loader2, Edit, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { DELETE_USER_RESET, UPDATE_USER_RESET } from "../../store/constants/userConstants";

const Users = () => {
    const { users, error, loading } = useSelector((state) => state.allUsers, shallowEqual);
    const { isUpdated, isDeleted, message } = useSelector((state) => state.updateUser);
    const dispatch = useDispatch();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({ email: '' });


    useEffect(() => {
        const isEmpty = !users || (Array.isArray(users) ? users.length === 0 : Object.keys(users).length === 0);

        if (isEmpty && !isUpdated && !isDeleted) {
            dispatch(allUsers());
        }
    }, [dispatch, users, isUpdated, isDeleted]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (isUpdated && message) {
            toast.success(message);
            dispatch(allUsers());
            dispatch({ type: UPDATE_USER_RESET });
        }
    }, [isUpdated, message, dispatch]);

    useEffect(() => {
        if (isDeleted && message) {
            toast.success(message);
            dispatch(allUsers());
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [isDeleted, message, dispatch]);




    const openDeleteModal = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (selectedUser) {
            dispatch(deleteUser(selectedUser._id));
        }
        setIsDeleteModalOpen(false);
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditData({ email: user.email });
        setIsEditModalOpen(true);
    };

    const handleSave = async (id, userData) => {
        dispatch(updateUser(id, userData));
        setIsEditModalOpen(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto  bg-gray-50 border rounded-lg  mt-10 px-4 sm:px-6 lg:px-8 py-12">
            <div className="sm:flex sm:items-center mb-6">
                <div className="sm:flex-auto">
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        List of all registered users in the system
                    </p>
                </div>
            </div>

            <div className="mt-8 flow-root ">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        {users?.length ? (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300 shadow-lg">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 border-r border-gray-200">
                                                ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                                                Email
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 border-r border-gray-200">
                                                Registration Date
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {/* Ensure 'user' is typed correctly from your API response, assuming it matches your `User` type */}
                                        {users.map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 border-r border-gray-200">
                                                    {user._id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-r border-gray-200">
                                                    {user.email}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 border-r border-gray-200">
                                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) : 'N/A'}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 flex space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                        title="Edit"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(user)}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow">
                                <p className="text-gray-500">No users found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>


            {/* Edit User Modal */}
            {isEditModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto"> {/* Main modal container, high z-index */}
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={() => setIsEditModalOpen(false)}></div>

                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* This span helps center content, keep it */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Actual Modal Content */}
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-800">Edit User</h2>
                                    <button
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {selectedUser && (
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                                            <p className="text-sm text-gray-500">{selectedUser._id}</p>
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                value={editData.email}
                                                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={() => {
                                        if (selectedUser) handleSave(selectedUser._id, editData);
                                    }}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </button>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed z-50 inset-0 overflow-y-auto"> {/* Main modal container, high z-index */}
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-gray-500 opacity-75" onClick={() => setIsDeleteModalOpen(false)}></div>

                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* This span helps center content, keep it */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Actual Modal Content */}
                        <div className="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full" onClick={(e) => e.stopPropagation()}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <AlertTriangle className="h-6 w-6 text-red-600" />
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Delete User
                                        </h3>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to delete this user? This action cannot be undone.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    onClick={handleDelete}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;