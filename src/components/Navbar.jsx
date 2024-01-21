import React from 'react'
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
// import { useNavigate } from 'react-router-dom';



// const Navbar = () => {

//     const [isLoggedIn, setIsLoggedIn] = useState(false);
//     const navigate = useNavigate();
//     // const accessToken = localStorage.getItem('accessToken');
//     // useEffect(() => {
//     //     // Check if there's an access token in local storage


//     //     // Update the isLoggedIn state based on the presence of the access token
//     //     setIsLoggedIn(!!accessToken);
//     // }, [accessToken]);

// const handleLogout = async () => {
//     try {
//         // Add Firebase sign-out logic here
//         await auth.signOut();

//         localStorage.removeItem('accessToken');


//         // // Update the local state to reflect the user's authentication status
//         setIsLoggedIn(false);

//         // Redirect or perform additional actions after logout
//         navigate('/signin');
//     } catch (error) {
//         console.error('Error logging out:', error);
//     }
// }

//     // useEffect(() => {

//     // })

//     const [user, setUser] = useState(null);

//     const handleSignOut = async () => {
//         try {
//             await auth.signOut();
//             setIsLoggedIn(false);
//             navigate('/');
//         } catch (error) {
//             console.error(error.message);
//         }
//     };

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged((user) => {
//             setUser(user)
//             setIsLoggedIn(!!user); // Set isLoggedIn to true if the user is logged in, false otherwise
//         });

//         return () => unsubscribe();
//     }, []);

//     return (
//         <nav className='bg-blue-600 p-4 text-white text-lg'>
//             <div className='flex justify-between'>
//                 <div className='flex items-center'>
//                     <img
//                         src='https://preview.redd.it/hi-this-is-a-logo-for-the-task-manager-application-called-v0-si3hzlaglc7b1.png?width=640&crop=smart&auto=webp&s=04d231d246026a59f988ac183a82e0ea2ca8ef4e'
//                         alt='Logo'
//                         className='mr-2 w-10 h-10 rounded-full'
//                     />

//                     <Link to="/">
//                         Home
//                     </Link>
//                 </div>
//                 {!isLoggedIn ? (
//                     <div className='flex justify-evenly'>
//                         <div>
//                             <Link className="m-2 p-2 rounded-md bg-blue-800 hover:bg-blue-400" to="/signin">
//                                 Sign In
//                             </Link>
//                         </div>
//                         <div>
//                             <Link className="m-2 bg-blue-400 text-white p-2 rounded-md hover:bg-blue-800 hover:text-white" to="/signUp">
//                                 Sign Up
//                             </Link>
//                         </div>
//                     </div>
//                 ) : (
//                     <div>
//                         <button
//                             onClick={handleSignOut}
//                             className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white"
//                         >
//                             Log Out
//                         </button>
//                     </div>
//                 )}

//             </div>
//         </nav>
//     )
// }

const Navbar = ({ user }) => {
    // console.log(user);
    const handleSignout = async () => {
        try {
            // Add Firebase sign-out logic here
            await auth.signOut();
            localStorage.removeItem('accessToken');

        } catch (error) {
            console.error('Error logging out:', error);
        }
    }
    return (
        <nav className='bg-blue-600 p-4 text-white font-semibold text-lg'>
            <div className='flex justify-between'>
                <div className='flex items-center'>
                    <Link to='/' className='font-semibold font-serif'>
                        MyTask
                    </Link>
                </div>
                {user ? (
                    <div className='flex justify-evenly'>
                        <div className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white">
                            <Link  to="/tasks">
                                My Tasks
                            </Link>
                        </div>
                        <div className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white">
                            <Link  to="/tasks/create">
                                Create Tasks
                            </Link>
                        </div>
                        <div>
                            <button className="m-1 p-2 rounded-md bg-blue-800 hover:bg-blue-400 text-white" onClick={handleSignout}>
                                Log Out
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='flex justify-evenly'>
                        <div>
                            <Link className="m-2 p-2 rounded-md bg-blue-800 hover:bg-blue-400" to="/signin">
                                Sign In
                            </Link>
                        </div>
                        <div>
                            <Link className="m-2 bg-blue-400 text-white p-2 rounded-md hover:bg-blue-800 hover:text-white" to="/signup">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
