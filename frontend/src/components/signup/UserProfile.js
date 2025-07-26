import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from '../../store/actions/userActions'


const Userprofile = () => {
    const dispatch = useDispatch();
    const { user, success, message, error, isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="max-w-screen-xl py-20">
            <h1 className="text-xl text-gray-800 text-center py-5 font-bold ">User Information</h1>
            {isAuthenticated && user ? (
                <div className="max-w-sm flex justify-center bg-slate-50 shadow-lg rounded mx-auto p-6 mb-10">
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">User</p>
                            <p className="text-lg text-gray-800">{user.name}</p>
                            <p className="text-lg text-gray-800">{user.email}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Joined Date</p>
                            <p className="text-lg text-gray-800">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="max-w-sm flex flex-col items-center justify-center bg-slate-50 shadow-lg rounded  mx-auto p-6 mb-10">
                    No User Found
                    <br />
                    <br />
                    <Link className="max-w-sm bg-green-500 hover:bg-green-400 rounded  text-white px-4 py-1" to='/'>Home</Link>
                </div>
            )}
        </div>
    )
}

export default Userprofile