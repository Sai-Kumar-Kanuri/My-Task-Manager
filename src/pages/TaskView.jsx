// import React from 'react';
// import TaskComponent from '../components/TaskComponent';

// const TaskView = ({ user }) => {
//     return (
//         <div className='flex '>
//             {/* <h1 className='text-4xl font-bold m-4'>TaskView Page</h1> */}
//             {user ? (
//                 <TaskComponent user={user} />
//             ) : (
//                 <p>Please sign in to view and manage tasks.</p>
//             )}
//         </div>
//     );
// };

// export default TaskView;

import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const TaskView = ({ user }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                const db = getFirestore();
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
                            <Link
                                to={`/tasks/update/${task.id}`}
                                className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mr-2"
                            >
                                Update Task
                            </Link>
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
            <div className="mt-4">
                <Link to="/tasks/create" className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded mr-2">
                    Create Task
                </Link>
            </div>
        </div>
    );
};

export default TaskView;

