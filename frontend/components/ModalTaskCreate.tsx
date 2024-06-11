'use client';

import React, { useEffect, useState } from 'react';
import { preventEnterSubmitting } from '../utils/functions';
import socket from '../utils/socket';
import { CommonResponse } from '../types/socket/CommonResponse';

interface FormData {
  userStoryId: string;
  name: string;
  description: string;
}

interface ModalProps {
  roomId: string;
  userStoryIdProp: string;
  closeModal: () => void;
}

const ModalTaskCreate: React.FC<ModalProps> = ({ roomId, userStoryIdProp, closeModal }) => {
  const [formData, setFormData] = useState<FormData>({
    userStoryId: userStoryIdProp,
    name: '',
    description: ''
  });
  const [alertText, setAlertText] = useState('');

  useEffect(() => {
    setFormData({ ...formData, userStoryId: userStoryIdProp });
  }, [userStoryIdProp]);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setAlertText('');

    if (!formData.name) {
      setAlertText('Name must be specified.');
      return;
    }

    socket.emit('createTask', {
      ...formData, roomId: roomId
    }, (response: CommonResponse) => {
      if (!response.isOk) {
        setAlertText(response.error || '');
      }
      response.isOk && closeModal();
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Add a new Task</h2>
          <button onClick={() => closeModal()} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div>
          {alertText &&
            <div
              className="w-full flex items-center p-4 mb-4 text-sm rounded-lg border-b-2 border-r-2 bg-rose-500 border-rose-700 text-white"
              role="alert">
              <div role="status">
                <svg className="w-6 h-6 mr-2 text-white" aria-hidden={true}
                     xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"
                    fill="" />
                </svg>
                <span className="sr-only">Error</span>
              </div>
              <div className="px-4">
                <p className="text-sm">{alertText}</p>
              </div>
            </div>
          }
          <form onSubmit={handleSubmit} id="formCreate" className="flex flex-col text-black">
            <div className="pb-4">
              <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="name">Name</label>
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onKeyDown={preventEnterSubmitting} type="text"
                id="name" name="name" placeholder="Special task" autoComplete="off" required
                value={formData.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                  ...previousForm,
                  [event.target.name]: event.target.value
                }))}
              />
            </div>
            <div className="pb-4">
              <label className="block mb-1 text-base font-semibold text-gray-900 px-2"
                     htmlFor="description">Description</label>
              <textarea
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                onKeyDown={preventEnterSubmitting} placeholder="Usefull description"
                id="description" name="description" autoComplete="off"
                value={formData.description}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setFormData((previousForm: FormData) => ({
                  ...previousForm,
                  [event.target.name]: event.target.value
                }))}
              ></textarea>
            </div>
            <button id="submitButton" type="submit" form="formCreate"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalTaskCreate;