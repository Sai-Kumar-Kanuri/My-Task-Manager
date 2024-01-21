import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Link, Navigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';

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

    if (!user) {
        return <Navigate to="/signin" />;
    }

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
                        <TaskItem
                            key={task.id}
                            task={task}
                            user={user}
                            handleUpdateTask={handleUpdateTask}
                            handleDeleteTask={handleDeleteTask}
                        />
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

