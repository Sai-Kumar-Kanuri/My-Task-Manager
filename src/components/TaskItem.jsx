import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DoneAllOutlinedIcon from '@mui/icons-material/DoneAllOutlined';
import Comment from './Comment';
import CommentsList from './CommentList';
import CommentIcon from '@mui/icons-material/Comment';

const TaskItem = ({ task, user, handleUpdateTask, handleDeleteTask }) => {

    const [showComments, setShowComments] = useState(false);

    return (
        <li key={task.id} className="mb-4 p-4 border rounded">
            <div className="font-bold">Title: {task.title}</div>
            <div className="mb-2">Description: {task.description}</div>
            <div className="mb-2">Due Date: {task.dueDate}</div>
            <div className="mb-2">Collaborators: {Array.isArray(task.collaboratorNames) ? task.collaboratorNames.join(', ') : ''}</div>
            <button
                onClick={() => handleUpdateTask(task.id, { completed: !task.completed })}
                className={`p-2 rounded mr-2 ${task.completed ? 'font-bold bg-green-500 hover:bg-green-700 '  : 'bg-green-500 hover:bg-green-700 text-white'}`}
            >
                {task.completed ? (
                    <DoneAllOutlinedIcon className='text-white rounded-md' />
                ) : 'Toggle Completion'}
            </button>
            <Link
                to={`/tasks/update/${task.id}`}
                className="bg-blue-500 hover:bg-blue-700 font-semibold text-white p-2 rounded mr-2"
            >
                Update Task
            </Link>
            <button
                onClick={() => handleDeleteTask(task.id)}
                className="bg-red-500 hover:bg-red-700 font-semibold text-white p-2 rounded"
            >
                Delete Task
            </button>
            <button className='ml-2 rounded-md p-2 bg-sky-500 hover:bg-sky-600' onClick={() => setShowComments(!showComments)}><CommentIcon/></button>
            {showComments && <CommentsList taskId={task.id} />}
            {showComments && <Comment taskId={task.id} userId={user.uid} userName={user.displayName} />}
        </li>
    );
};

export default TaskItem;
