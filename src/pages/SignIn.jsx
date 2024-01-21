import React, { useState } from 'react';
import { signInWithEmailAndPassword, getIdToken } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';



const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            getIdToken(auth.currentUser)
                .then((idToken) => {
                    localStorage.setItem('accessToken', idToken);
                })
                .catch((error) => {
                    console.error('Error getting ID token:', error);
                });
            if (userCredential) {
                navigate('/');
            }
        } catch (error) {
            alert("Enter Valid Credentials");
            navigate('/signin')
            console.log(error);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 border border-sky-500 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6">Sign In</h2>
                {/* Increased text size with text-lg class */}
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
                <button onClick={handleSignIn} className="w-full bg-blue-500 hover:bg-blue-800 text-white p-2 rounded text-lg">
                    Sign In
                </button>
                <div className='flex justify-center items-center mt-2'>
                    <p className=' text-sm'>Haven't Registered? <a href='/signup' className='text-blue-400 font-bold'>Sign Up</a> and Register now.</p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
