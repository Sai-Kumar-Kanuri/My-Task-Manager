import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import TaskView from "./pages/TaskView";
import TaskCreate from "./pages/TaskCreate";
import UpdateTask from "./pages/updateTask";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <Navbar user={user} />
   
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/tasks/create" element={<TaskCreate user={user} />} />
        <Route path="/tasks" element={<TaskView user={user} />} />
        <Route path="/tasks/update/:taskId" element={<UpdateTask user={user} />} />

      </Routes>
    </>

  );
}

export default App;
