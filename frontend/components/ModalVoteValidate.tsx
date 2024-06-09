'use client';

import React, { useState } from 'react';
import { UserStoryIncludes } from '../types/data/UserStoryIncludes';
import socket from 'utils/socket';

interface FormData {
  finalVote: string;
}

interface ModalProps {
  roomId: string;
  userStory: UserStoryIncludes;
  closeModal: (validate: boolean) => void;
}

const ModalVoteValidate: React.FC<ModalProps> = ({ roomId, userStory, closeModal }) => {
  const [formData, setFormData] = useState<FormData>({ finalVote: '' });

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    socket.emit('validateVote', { roomId: roomId, userStoryId: userStory.userStoryId, finalVote: formData.finalVote });
    closeModal(true);
  };

  const values: number[] = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Validate User Story vote</h2>
          <button onClick={() => closeModal(false)}
                  className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div>
          <form onSubmit={handleSubmit} id="formValidateVote" className="flex flex-col text-black">
            <div className="pb-4">
              <label htmlFor="finalVote" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                To validate the user story vote, please select the final vote.</label>
              <select id="finalVote" name="finalVote"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={formData.finalVote}
                      onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFormData((previousForm: FormData) => ({
                        ...previousForm,
                        [event.target.name]: event.target.value
                      }))}>
                <option value="">We will revote later</option>
                {values.map((value: number, index: number) => <option key={index} value={value}>{value}</option>)}
              </select>
            </div>
          </form>
          <div className="flex justify-end gap-2">
            <button id="submitButton" type="submit" form="formValidateVote"
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Vote
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

export default ModalVoteValidate;