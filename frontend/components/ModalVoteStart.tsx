'use client';

import React from 'react';
import { UserStoryIncludes } from '../types/data/UserStoryIncludes';
import socket from 'utils/socket';

interface ModalProps {
  roomId: string;
  userStory: UserStoryIncludes;
  closeModal: (start: boolean) => void;
}

const ModalVoteStart: React.FC<ModalProps> = ({ roomId, userStory, closeModal }) => {
  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    socket.emit('startVote', { roomId: roomId, userStoryId: userStory.userStoryId });
    closeModal(true);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Start User Story vote</h2>
          <button onClick={() => closeModal(false)}
                  className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div>
          <p className="text-lg pb-2">Do you want to start the vote for the user story: {userStory.name} ?</p>
          {userStory.finalVote.length > 0 &&
            <p className="font-light pb-4">This user story has already been voted, restarting a vote will delete the previous
              votes of this one.</p>}
          <form onSubmit={handleSubmit} id="formStartVote" className="flex flex-col text-black">
          </form>
          <div className="flex justify-end gap-2">
            <button id="submitButton" type="submit" form="formStartVote"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Start
            </button>
            <button id="cancelButton" onClick={() => closeModal(false)}
                    className="text-black bg-gray-300 hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVoteStart;