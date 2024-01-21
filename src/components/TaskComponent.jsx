// TaskComponent.js
import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

// import { auth, db } from '../firebase';

const TaskComponent = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', collaborators: '' });


    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                const db = getFirestore();

                // Example query to fetch tasks where the user is the assignee
                const q = query(collection(db, 'tasks'), where('assignee', '==', user.uid));

                try {
                    const querySnapshot = await getDocs(q);
                    const tasksData = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setTasks(tasksData);
                } catch (error) {
                    console.error('Error getting tasks: ', error);
                }
            }
        };

        fetchTasks();
    }, [user]);

    const handleCreateTask = async () => {
        if (user) {
            const db = getFirestore();

            try {
                const newTaskRef = await addDoc(collection(db, 'tasks'), {
                    ...newTask,
                    assignee: user.uid,
                    collaborators: newTask.collaborators.split(',').map(email => email.trim()),
                    completed: false,
                });

                setTasks(prevTasks => [...prevTasks, { id: newTaskRef.id, ...newTask }]);
                setNewTask({
                    title: '',
                    description: '',
                    dueDate: '',
                    collaborators: '',
                });
            } catch (error) {
                console.error('Error creating task: ', error);
            }
        }
    };

    const handleUpdateTask = async (taskId, updates) => {
        if (user) {
            const db = getFirestore();
            const taskRef = doc(db, 'tasks', taskId);

            try {
                await updateDoc(taskRef, updates);

                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task.id === taskId ? { ...task, ...updates } : task
                    )
                );
            } catch (error) {
                console.error('Error updating task: ', error);
            }
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (user) {
            const db = getFirestore();
            const taskRef = doc(db, 'tasks', taskId);

            try {
                await deleteDoc(taskRef);

                setTasks(prevTasks =>
                    prevTasks.filter(task => task.id !== taskId)
                );
            } catch (error) {
                console.error('Error deleting task: ', error);
            }
        }
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Task Management</h2>
            <div className="mb-8">
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
            <div>
                <h3 className="text-2xl font-bold mb-2">Your Tasks</h3>
                <ul>
                    {tasks.map((task) => (
                        <li key={task.id} className="mb-4 p-4 border rounded">
                            <div className="font-bold">Title: {task.title}</div>
                            <div className="mb-2">Description: {task.description}</div>
                            <div className="mb-2">Due Date: {task.dueDate}</div>
                            <div className="mb-2">Collaborators: {Array.isArray(task.collaborators) ? task.collaborators.join(', ') : ''}</div>
                            <button
                                onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
                                className="bg-green-500 hover:bg-green-700 text-white p-2 rounded mr-2"
                            >
                                Toggle Completion
                            </button>
                            <button
                                onClick={() => handleDeleteTask(task.id)}
                                className="bg-red-500 hover:bg-red-700 text-white p-2 rounded"
                            >
                                Delete Task
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TaskComponent;
