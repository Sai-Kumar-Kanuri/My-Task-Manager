import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

const CommentsList = ({ taskId }) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchComments = async () => {
            const db = getFirestore();
            const commentsCollection = collection(db, 'comments');
            const q = query(commentsCollection, where('taskId', '==', taskId));

            try {
                const querySnapshot = await getDocs(q);
                const commentsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setComments(commentsData.reverse());
            } catch (error) {
                console.error('Error getting comments: ', error);
            }
        };

        fetchComments();
    }, [taskId]);

    return (
        <div>
            <h3 className="font-bold text-lg mb-2">Comments:</h3>
            <div className="overflow-y-auto border border-gray-300 rounded p-2 max-h-40">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex items-center justify-between border-b pb-2 mb-2">
                        <span className="font-bold mr-2">{comment.userName}:</span>
                        <span className="flex-grow">{comment.content}</span>
                        <span className="text-gray-500 text-sm">{formatTimestamp(comment.timestamp)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};



export default CommentsList;
