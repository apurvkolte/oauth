// src/components/NotFound.tsx

import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
            <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
            <p className="text-xl text-gray-700 mb-6">Oops! Page not found.</p>
            <Link
                to="/"
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500 transition"
            >
                Go Home
            </Link>
        </div>
    );
}
