import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const Navbar = ({ user }) => {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSignout = async () => {
        try {
            await auth.signOut();
            navigate("/signin");
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <nav className='bg-blue-600 p-4 text-white font-semibold text-lg'>
            <div className='container mx-auto flex justify-between items-center'>
                <div>
                    <Link to='/' className='font-semibold font-serif'>
                        MyTask
                    </Link>
                </div>
                {/* Responsive menu button for smaller devices */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-white focus:outline-none "
                    >
                        {/* Add your responsive menu icon, for example, a burger icon */}
                        {/* &#9776; */}
                        <MenuOutlinedIcon/>
                    </button>
                </div>
                {/* Responsive menu for smaller devices */}
                {menuOpen && (
                    <div className="md:hidden absolute top-16 right-4 bg-blue-600 p-4 rounded">
                        <div className="flex flex-col items-end">
                            {user ? (
                                <>
                                    <Link
                                        to="/tasks"
                                        className="text-white hover:bg-blue-400 p-2 rounded my-1"
                                    >
                                        My Tasks
                                    </Link>
                                    <Link
                                        to="/tasks/create"
                                        className="text-white hover:bg-blue-400 p-2 rounded my-1"
                                    >
                                        Create Tasks
                                    </Link>
                                    <button
                                        className="text-white hover:bg-blue-400 p-2 rounded my-1"
                                        onClick={handleSignout}
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        className="text-white hover:bg-blue-400 p-2 rounded my-1"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="text-white hover:bg-blue-400 p-2 rounded my-1"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
                {/* Regular menu for larger devices */}
                <div className='hidden md:flex justify-evenly'>
                    {user ? (
                        <>
                            <div className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white">
                                <Link to="/tasks">My Tasks</Link>
                            </div>
                            <div className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white">
                                <Link to="/tasks/create">Create Tasks</Link>
                            </div>
                            <div>
                                <button
                                    className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white"
                                    onClick={handleSignout}
                                >
                                    Log Out
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <Link
                                    className="m-2 p-2 rounded-md bg-blue-800 hover:bg-blue-400"
                                    to="/signin"
                                >
                                    Sign In
                                </Link>
                            </div>
                            <div>
                                <Link
                                    className="m-2 bg-blue-400 text-white p-2 rounded-md hover:bg-blue-800 hover:text-white"
                                    to="/signup"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
