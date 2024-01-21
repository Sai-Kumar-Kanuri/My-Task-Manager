import React from 'react';

const Home = ({ user }) => {

    return (
        <div>
            { !user ? 
                (<div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Welcome to Task Manager App</h2>
                        <p className="text-gray-600 mb-8">Sign in or sign up to get started.</p>
                    </div>
                </div>) : (<div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">Welcome {user.displayName}</h2>
                        <p className="text-gray-600 mb-8 font-semibold">Create Your <a href='/tasks/create' className='font-bold text-blue-600'>Tasks</a>...</p>
                    </div>
                </div>)
            }
        </div>
    );
};

export default Home;
