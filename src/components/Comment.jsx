// CommentComponent.js
import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const Comment = ({ taskId, userId, userName }) => {
  const [comment, setComment] = useState('');

  const handleAddComment = async () => {
    const db = getFirestore();
    
    try {
      const commentRef = await addDoc(collection(db, 'comments'), {
        taskId,
        userId,
        userName,
        content: comment,
        timestamp: new Date(),
      });

      setComment(''); // Clear the comment input after submission
      console.log(commentRef);

    //   window.location.reload();

      // Optionally, you can trigger a notification to other collaborators using FCM

    } catch (error) {
      console.error('Error adding comment: ', error);
    }
  };

  return (
    <div className="comment-component p-4 border border-gray-300 rounded-md mt-4">
      <div className="font-bold text-lg mb-2">Add a Comment</div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Type your comment here..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <div className="mt-2">
        <button
          onClick={handleAddComment}
          className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded"
        >
          Add Comment
        </button>
      </div>
    </div>
  );
};

export default Comment;
