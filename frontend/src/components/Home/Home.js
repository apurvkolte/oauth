"use client";
import React, { useEffect, useState } from "react";
import { login, loadUser, logout, authRegister, authLinkedInRegister, authGoogleRegister, authGithubRegister, authFacebookRegister, authTwitterRegister, authInstagramRegister } from '../../store/actions/userActions'
import { useDispatch, useSelector } from "react-redux";
import toast from 'react-hot-toast';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Link, useNavigate } from "react-router-dom";
import { FaGoogle, FaGithub, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { useForm } from 'react-hook-form';
import { CLEAR_ERRORS, RESET_SUCCESS } from "../../store/constants/userConstants";

import { useLinkedIn } from "react-linkedin-login-oauth2";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';


export default function Home() {
    const { register, handleSubmit, formState: { errors }, reset, } = useForm();
    const { user, success, message, error, isAuthenticated } = useSelector((state) => state.auth);

    const MySwal = withReactContent(Swal);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (success && message) {
            MySwal.fire({
                title: "Login Successful!",
                text: message || "You will be redirected to the home page shortly.",
                icon: "success",
                timer: 3000,
                showConfirmButton: true,
            });
            dispatch({ type: RESET_SUCCESS });
        }
    }, [success, message]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: CLEAR_ERRORS });
        }
    }, [error, dispatch]);


    const loginUser = async (data) => {
        dispatch(login({
            email: data.email,
            password: data.password,
        }));
    };

    const logoutUser = async () => {
        try {
            // Firebase signout
            dispatch(logout());  // Redux + JWT token cleanup
            //  localStorage.removeItem("token");
            toast.success("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("Logout failed");
        }
    };


    const handleSuccess = (credentialResponse) => {
        const token = credentialResponse.credential;
        dispatch(authGoogleRegister(token));
    };


    const handleGitHubLogin = () => {
        window.location.href = 'http://localhost:4000/api/auth/github';
    };


    const handleFacebookLogin = () => {
        const clientId = process.env.REACT_APP_FACEBOOK_CLIENT_ID;
        const redirectUri = 'http://localhost:4000/api/auth/facebook/callback';
        window.location.href = `https://www.facebook.com/v17.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=email,public_profile`;
    };


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // maybe navigate to dashboard or user page
            navigate('/');
        }
    }, []);


    const { linkedInLogin } = useLinkedIn({
        clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
        redirectUri: `${window.location.origin}/linkedin`,
        scope: "openid profile email",
        // onSuccess: async (code) => {
        //     console.log("Auth code:", code);

        //     dispatch(authLinkedInRegister(code));
        // },
        onError: (error) => {
            console.log("Error:", error);
        },
    });

    const handleTwitterLogin = async () => {
        const clientId = process.env.REACT_APP_TWITTER_CLIENT_ID;
        const redirectUri = 'http://localhost:4000/api/auth/twitter/callback';
        const scope = 'tweet.read users.read offline.access';
        const state = crypto.randomUUID();

        // ✅ Step 1: Create secure code_verifier
        const codeVerifier = crypto.randomUUID();

        // ✅ Step 2: Create S256 code_challenge from code_verifier
        const encoder = new TextEncoder();
        const data = encoder.encode(codeVerifier);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const base64 = btoa(String.fromCharCode(...hashArray));
        const codeChallenge = base64
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");

        // ✅ Step 3: Save code_verifier in cookie (to read it later in backend)
        document.cookie = `twitter_code_verifier=${codeVerifier}; path=/; max-age=600`;

        // ✅ Step 4: Redirect to Twitter
        const twitterUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

        window.location.href = twitterUrl;
    };

    const handleInstagramLogin = () => {
        const clientId = "1268885354815805";
        const redirectUri = 'http://localhost:4000/api/auth/instagram/callback';
        const scope = 'user_profile,user_media'; // Basic scopes for Instagram Basic Display API
        const state = crypto.randomUUID(); // Optional but recommended

        const instagramUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;

        window.location.href = instagramUrl;
    };


    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;

            const { type, code, error } = event.data;

            if (type === "LINKEDIN_AUTH_SUCCESS" && code) {
                console.log("Got LinkedIn code from popup:", code);
                dispatch(authLinkedInRegister(code));
            }

            if (type === "LINKEDIN_AUTH_ERROR") {
                console.error("LinkedIn error:", error);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [dispatch]);


    return (
        <div className="min-h-screen flex flex-col gap-20">
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 sm:mx-auto sm:w-full sm:max-w-sm border border-gray-200 shadow-lg mt-20 bg-gray-50 ">
                <div >
                    <img className="mx-auto h-10 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        {user ? "Welcome Back" : "Sign in to your account"}
                    </h2>
                </div>

                {!isAuthenticated ? (
                    <div className="mt-10 ">
                        <form className="space-y-6" onSubmit={handleSubmit(loginUser)}>
                            <div>
                                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input
                                        type="email"
                                        id="email"
                                        autoComplete="email"
                                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900  border-0 outline outline-1 outline-offset-1 ${errors.email ? 'outline-red-500' : 'outline-gray-300'
                                            } placeholder:text-gray-400 focus:outline-2  focus:outline-offset-2 focus:outline-indigo-600`}
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email format",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{String(errors.email.message)}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">Password</label>
                                    <div className="text-sm">
                                        <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        type="password"
                                        id="password"
                                        autoComplete="current-password"
                                        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-0 outline outline-1 outline-offset-1 ${errors.password ? 'outline-red-500' : 'outline-gray-300'
                                            } placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600`}
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: {
                                                value: 6,
                                                message: "Password must be at least 6 characters",
                                            },
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{String(errors.password.message)}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 cursor-pointer focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Sign in
                                </button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm/6 text-gray-500">
                            Not a member?
                            <a href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-500"> Sign up</a>
                        </p>

                        <div className="space-y-4 mt-5">
                            <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                                <GoogleLogin
                                    onSuccess={handleSuccess}
                                    onError={() => console.log('Login Failed')}
                                />
                            </GoogleOAuthProvider>


                            <button
                                onClick={handleGitHubLogin}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 transition-colors duration-200 focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-gray-800"
                            >
                                <FaGithub className="w-5 h-5 mr-3" />
                                Continue with GitHub
                            </button>

                            <button
                                onClick={handleFacebookLogin}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-600"
                            >
                                <FaFacebook className="w-5 h-5 mr-3" />
                                Continue with Facebook
                            </button>


                            <button
                                onClick={linkedInLogin}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 transition-colors duration-200 focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-700"
                            >
                                <FaLinkedin className="w-5 h-5 mr-3" />
                                Continue with LinkedIn
                            </button>

                            <button
                                onClick={handleTwitterLogin}
                                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-400 rounded-lg hover:bg-blue-500 transition-colors duration-200 focus:outline-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-blue-400"
                            >
                                <FaXTwitter className="w-5 h-5 mr-3" />
                                Continue with Twitter
                            </button>

                            <button
                                onClick={handleInstagramLogin}
                                className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition mt-3"
                            >
                                <FaInstagram className="w-5 h-5 mr-3" />
                                Continue with Instagram
                            </button>

                            {/* <button type="button" onClick={logoutUser} className="w-[50%] py-2 mt-5 mx-auto px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full cursor-pointer border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logout</button> */}

                        </div>
                    </div>
                ) : (
                    <button type="button" onClick={logoutUser} className="w-[50%] py-2 mt-5 mx-auto px-5 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full cursor-pointer border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Logout</button>
                )}
            </div>

            <div className="mt-auto mb-10 ">
                <div className="flex flex-col justify-center items-center py-8 bg-slate-50 border border-gray-200 shadow-lg rounded mx-auto max-w-md">
                    {isAuthenticated ? <h1 className="text-lg py-3 ">
                        {isAuthenticated && user.email}
                    </h1> : <h1 className="text-lg py-3">No Login User</h1>}

                    <div className="flex gap-3 py-3  justify-center items-center px-6">
                        <Link
                            to='/user-profile'
                            className="w-full md:w-auto inline-flex items-center justify-center text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium cursor-pointer rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            User Profiles
                        </Link>
                        {isAuthenticated && user?.role === 'admin' ? (
                            <Link
                                to='/users'
                                className="w-full md:w-auto inline-flex items-center justify-center text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium cursor-pointer rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-200"
                            >
                                Users
                            </Link>
                        ) : (
                            <Link
                                to='/users'
                                className="w-full md:w-auto inline-flex items-center justify-center text-white bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium cursor-pointer rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 transition-all duration-200"
                            >
                                All Users
                            </Link>
                        )}

                        <Link
                            to='/auth-app'
                            className="w-full md:w-auto inline-flex items-center justify-center text-white bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 shadow-lg shadow-cyan-500/50 dark:shadow-lg dark:shadow-cyan-800/80 font-medium cursor-pointer rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                        >
                            2FA
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
