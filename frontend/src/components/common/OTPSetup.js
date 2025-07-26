import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    FaCheckCircle,
    FaTimesCircle,
    FaGoogle,
    FaMicrosoft,
    FaApple,
} from "react-icons/fa";
import { SiAuthy, SiLastpass } from "react-icons/si";

const OTPSetup = () => {
    const [qrCode, setQrCode] = useState("");
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const storedId = localStorage.getItem("userId");
    const userId = storedId || crypto.randomUUID(); // or use uuid npm
    if (!storedId) localStorage.setItem("userId", userId);

    useEffect(() => {
        axios.get("http://localhost:4000/api/auth/generate2FA", {
            params: { userId },
        })
            .then((res) => {
                setQrCode(res.data.qrCode);
                setLoading(false);
            })
            .catch(() => {
                setErrorMessage("Failed to load QR Code");
                setLoading(false);
            });
    }, []);


    const handleVerify = async () => {
        setErrorMessage("");
        setSuccessMessage("");

        if (!token || token.length !== 6) {
            setErrorMessage("Please enter a valid 6-digit code.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/api/auth/verify2FA", {
                token,
                userId,
            });

            if (res.data.success) {
                setSuccessMessage("✅ Two-Factor Authentication enabled successfully!");
            } else {
                setErrorMessage("❌ Invalid code. Please try again.");
            }
        } catch (err) {
            setErrorMessage("❌ Server error. Please try again later.");
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                Two-Factor Authentication Setup
            </h2>

            {loading ? (
                <p className="text-center text-gray-500">Loading QR Code...</p>
            ) : (
                <>
                    {qrCode && (
                        <div className="flex justify-center mb-6 p-4 bg-gray-50 rounded-lg">
                            <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                        </div>
                    )}

                    <input
                        type="text"
                        value={token}
                        maxLength={6}
                        placeholder="Enter 6-digit code from app"
                        onChange={(e) => setToken(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all mb-3"
                    />
                    <button
                        onClick={handleVerify}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    >
                        Verify & Enable 2FA
                    </button>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mt-4 flex items-center text-green-600 text-sm">
                            <FaCheckCircle className="mr-2" />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="mt-4 flex items-center text-red-600 text-sm">
                            <FaTimesCircle className="mr-2" />
                            <span>{errorMessage}</span>
                        </div>
                    )}
                </>
            )}

            {/* Recommended Apps */}
            <div className="pt-10">
                <h3 className="text-md font-semibold mb-3 text-gray-700">
                    Install Authenticator Apps:
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                    Choose any app below and install it on your mobile device. Then scan the QR code above to set up Two-Factor Authentication (2FA).
                </p>

                <div className="grid grid-cols-2 gap-4">
                    <a
                        href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FaGoogle className="text-blue-500 mr-2" />
                        Google Authenticator
                    </a>
                    <a
                        href="https://www.microsoft.com/en-us/account/authenticator"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FaMicrosoft className="text-blue-500 mr-2" />
                        Microsoft Authenticator
                    </a>
                    <a
                        href="https://authy.com/download/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <SiAuthy className="text-red-500 mr-2" />
                        Authy
                    </a>
                    <a
                        href="https://lastpass.com/auth/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <SiLastpass className="text-red-500 mr-2" />
                        LastPass Authenticator
                    </a>
                </div>
            </div>
        </div>
    );
};

export default OTPSetup;
