// UpdateTask.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';

const UpdateTask = ({ user }) => {
    const { taskId } = useParams();
    const [task, setTask] = useState({ title: '', description: '', dueDate: '', collaborators: '' });
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTask = async () => {
            if (user) {
                const db = getFirestore();
                const taskRef = doc(db, 'tasks', taskId);

                try {
                    const taskDoc = await getDoc(taskRef);
                    if (taskDoc.exists()) {
                        setTask(taskDoc.data());
                    } else {
                        console.error('Task not found.');
                    }
                } catch (error) {
                    console.error('Error fetching task: ', error);
                }
            }
        };

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


        fetchTask();
        fetchUsers()
    }, [user, taskId]);

    const handleUpdateTask = async () => {
        if (user) {
            const db = getFirestore();
            const taskRef = doc(db, 'tasks', taskId);

            try {
                await updateDoc(taskRef, task);
                console.log('Task updated successfully!');
                navigate("/tasks")
                // You may redirect the user to the task view page or perform any other action after updating the task.
            } catch (error) {
                console.error('Error updating task: ', error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setTask((prevTask) => ({
            ...prevTask,
            [name]: value,
        }));
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Update Task</h2>
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Description"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    name="dueDate"
                    value={task.dueDate}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                />
                <input
                    type="text"
                    placeholder="Collaborators (comma-separated emails)"
                    name="collaborators"
                    value={task.collaborators
                        ? users
                            .filter((user) => task.collaborators.includes(user.id))
                            .map((user) => user.email)
                            .join(', ')
                        : ''}
                    onChange={handleChange}
                    className="w-full p-2 mb-2 border rounded"
                    disabled={true}
                />
                <button
                    onClick={handleUpdateTask}
                    className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
                >
                    Update Task
                </button>
            </div>
        </div>
    );
};

export default UpdateTask;
