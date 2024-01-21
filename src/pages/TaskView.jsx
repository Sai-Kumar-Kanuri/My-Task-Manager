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
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
const TaskView = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [filterCompleted, setFilterCompleted] = useState(false);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [sortByDueDate, setSortByDueDate] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            if (user) {
                const db = getFirestore();
                const assigneeQuery = query(collection(db, 'tasks'), where('assignee', '==', user.uid));
                const collaboratorQuery = query(collection(db, 'tasks'), where('collaborators', 'array-contains', user.uid));
                // const q = query(collection(db, 'tasks'), where('assignee', '==', user.uid));

                // try {
                //     const querySnapshot = await getDocs(q);
                //     const tasksData = querySnapshot.docs.map((doc) => ({
                //         id: doc.id,
                //         ...doc.data(),
                //     }));
                //     setTasks(tasksData);
                // } catch (error) {
                //     console.error('Error getting tasks: ', error);
                // }

                try {
                    const assigneeSnapshot = await getDocs(assigneeQuery);
                    const collaboratorSnapshot = await getDocs(collaboratorQuery);
                    const assigneeTasks = assigneeSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    const collaboratorTasks = collaboratorSnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    // Combine assignee tasks and collaborator tasks
                    const allTasks = [...assigneeTasks, ...collaboratorTasks];

                    // Remove duplicates by ID (tasks can be both assigned and collaborated)
                    const uniqueTasks = allTasks.filter((task, index, self) =>
                        index === self.findIndex((t) => t.id === task.id)
                    );

                    setTasks(uniqueTasks);
                } catch (error) {
                    console.error('Error getting tasks: ', error);
                }
            }
        };

        fetchTasks();
    }, [user]);

    useEffect(() => {
        // Apply filters whenever tasks or filterCompleted changes
        const filterTasks = async () => {
            let filtered = tasks.slice(); // Create a copy of tasks to avoid modifying the original array

            if (filterCompleted) {
                filtered = filtered.filter(task => task.completed);
            }

            if (sortByDueDate) {
                filtered.sort((a, b) => {
                    const dateA = new Date(a.dueDate);
                    const dateB = new Date(b.dueDate);
                    return dateA - dateB;
                });
            }

            for (const task of filtered) {
                const collaboratorNames = await fetchCollaboratorNames(task.collaborators);
                task.collaboratorNames = collaboratorNames;
            }

            // console.log(filtered);

            setFilteredTasks(filtered);
        };
        filterTasks();
    }, [tasks, filterCompleted, sortByDueDate]);

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

    const fetchCollaboratorNames = async (collaboratorIds) => {
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
        const collaboratorDocs = await getDocs(query(usersCollection, where('id', 'in', collaboratorIds)));

        const collaboratorNames = collaboratorDocs.docs.map(doc => doc.data().name);
        return collaboratorNames;
    };



    return (

        <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Task Management</h2>

            <div className="mb-4">
                <label className="mr-2">Filter Completed Tasks:</label>
                <input
                    type="checkbox"
                    checked={filterCompleted}
                    onChange={() => setFilterCompleted(!filterCompleted)}
                />
                <label className="ml-4 mr-2">Sort by Due Date:</label>
                <input
                    type="checkbox"
                    checked={sortByDueDate}
                    onChange={() => setSortByDueDate(!sortByDueDate)}
                />
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-2">Your Tasks</h3>

                <ul>
                    {filteredTasks.map((task) => (
                        <li key={task.id} className="mb-4 p-4 border rounded">
                            <div className="font-bold">Title: {task.title}</div>
                            <div className="mb-2">Description: {task.description}</div>
                            <div className="mb-2">Due Date: {task.dueDate}</div>
                            <div className="mb-2">Collaborators: {Array.isArray(task.collaboratorNames) ? task.collaboratorNames.join(', ') : ''}</div>
                            <button
                                onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
                                className={`p-2 rounded mr-2 ${task.completed ? 'bg-green-500' : 'bg-green-500 hover:bg-green-700 text-white'}`}
                            >
                                {task.completed ? (
                                    <DoneAllOutlinedIcon className='text-white rounded-md' />
                                ) : 'Toggle Completion'}
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

