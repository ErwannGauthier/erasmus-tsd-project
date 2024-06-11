'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import socket from '../../../utils/socket';
import { useCookies } from 'react-cookie';
import { getAllTypesOfVotes, preventEnterSubmitting } from 'utils/functions';

interface FormData {
  name: string;
  maxUsers: number;
  isPrivate: boolean;
  typeOfVote: string;
}

export default function CreateRoomPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    maxUsers: 1,
    isPrivate: true,
    typeOfVote: 'fibonacci'
  });
  const [alertText, setAlertText] = useState<string>('');
  const router = useRouter();
  const [cookies] = useCookies(['user']);

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setAlertText('');

    if (!formData.name || formData.maxUsers < 1) {
      setAlertText('All fields must be filled correctly.');
      return;
    }

    socket.emit('createRoom', { ...formData, adminId: cookies.user.userId }, (isOk: boolean, response: string) => {
      if (!isOk) {
        setAlertText(response);
        return;
      }

      router.push('/room/' + response);
    });
  };


  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-1/2 m-6">
        <h1 className="text-2xl font-bold pb-4">Create room</h1>
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
        <form onSubmit={handleSubmit} id="formCreateRoom" className="flex flex-col text-black">
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="name">Name</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="text"
              id="name" name="name" placeholder="My super room" autoComplete="off" required
              value={formData.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="maxUsers">Max number of
              participants</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="number" min="1"
              id="maxUsers" name="maxUsers" autoComplete="off" required
              value={formData.maxUsers}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 ps-2 pe-6" htmlFor="typeOfVote">Select a
              type of vote</label>
            <select id="typeOfVote" name="typeOfVote"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={formData.typeOfVote}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) => setFormData((previousForm: FormData) => ({
                      ...previousForm,
                      [event.target.name]: event.target.value
                    }))}>
              {getAllTypesOfVotes().map((value: string, index: number) => <option key={index}
                                                                                  value={value}>{value}</option>)}
            </select>
          </div>
          <div className="pb-4">
            <div className="flex items-baseline align-bottom">
              <label className="block mb-1 text-base font-semibold text-gray-900 ps-2 pe-6" htmlFor="isPrivate">Private
                room</label>
              <label className="inline-flex items-center cursor-pointer">
                <span className="me-3 text-sm font-medium text-gray-900 dark:text-gray-300">No</span>
                <input id="isPrivate" name="isPrivate" type="checkbox" className="sr-only peer"
                       checked={formData.isPrivate}
                       onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                         ...previousForm,
                         [event.target.name]: event.target.checked
                       }))} />
                <div
                  className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Yes</span>
              </label>
            </div>
          </div>

          <button id="submitButton" type="submit" form="formCreateRoom"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Create
          </button>
        </form>
      </div>
    </div>
  );
}