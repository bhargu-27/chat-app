import Link from 'next/link';
import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const Login = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('patient');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1 className="text-center text-3xl font-bold mb-4">Patient-Doctor Chat App</h1>

            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <h3 className="mt-6 mb-4 text-center text-3xl font-bold text-gray-900">Sign in to your account</h3> 
                    <form className="space-y-6" action="#" method="POST">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                autoComplete="role"
                                required
                                value={role}
                                onChange={handleRoleChange}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            >
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                            </select>
                        </div>

                        <div>
                            <Link href={{ pathname: '/chat', query: {  role } }}>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Start Chat
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default Login;
