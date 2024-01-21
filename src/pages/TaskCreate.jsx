import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { Navigate, useNavigate } from 'react-router-dom';


const TaskCreate = ({ user }) => {
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', collaborators: '' });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersCollection = collection(db, 'users');

      try {
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error getting users: ', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateTask = async () => {
    if (user) {
      const db = getFirestore();
      //   console.log("Hello");
      try {
        const collaboratorsArray = newTask.collaborators
          .split(',')
          .map((email) => email.trim());

        const collaboratorUIDs = users
          .filter((user) => collaboratorsArray.includes(user.email))
          .map((user) => user.id);

        const newTaskRef = await addDoc(collection(db, 'tasks'), {
          ...newTask,
          assignee: user.uid,
          // collaborators: newTask.collaborators.split(',').map(email => email.trim()),
          collaborators: collaboratorUIDs,
          completed: false,
        });

        setNewTask({
          title: '',
          description: '',
          dueDate: '',
          collaborators: '',
        });
        console.log(newTaskRef);

        navigate("/tasks")

      } catch (error) {
        console.error('Error creating task: ', error);
      }
    }
  };

  if (!user) {
    return <Navigate to="/signin" />;
  }


  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-3xl font-bold mb-4">Task Creation</h2>
      <div className="mb-8 p-10 rounded-md bg-blue-300 border border-gray-950">
        <h3 className="text-2xl font-bold mb-2">Create New Task</h3>
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="date"
          placeholder="Due Date"
          value={newTask.dueDate}
          onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="text"
          placeholder="Collaborators (comma-separated emails)"
          value={newTask.collaborators}
          onChange={(e) => setNewTask({ ...newTask, collaborators: e.target.value })}
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleCreateTask}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Create Task
        </button>
      </div>
    </div>
  );
};

export default TaskCreate;
