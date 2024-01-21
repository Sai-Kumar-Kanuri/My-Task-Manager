import React, { useState } from 'react';
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            if (userCredential) {
                await updateProfile(userCredential.user, { displayName });
                await auth.signOut();
                navigate('/signin');
            }
        } catch (error) {
            alert("User Already Registered");
            navigate('/signin')
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 border border-sky-500 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Sign Up and Register</h2>
                {/* Increased text size with text-lg class */}
                <label className="block mb-2 text-lg">Name:</label>
                <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2 text-lg">Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                {/* Increased text size with text-lg class */}
                <label className="block mb-2 text-lg">Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 mb-4 border rounded"
                />
                {/* Increased text size with text-lg class */}
                <button onClick={handleSignUp} className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded text-lg">
                    Register
                </button>
                <div className='flex justify-center items-center mt-2'>
                    <p>Already Registered? <a href='/signin' className='text-blue-400 font-bold'>Sign In</a></p>
                </div>
            </div>

        </div>
    );
};

export default SignUp;
