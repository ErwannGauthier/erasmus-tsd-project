'use client';

import React, { useState } from 'react';
import { IoAddCircleOutline, IoArrowDown, IoArrowUp, IoPencil } from 'react-icons/io5';
import Task, { ITask } from '@/components/Task';
import { IUserStory } from '../app/room/[id]/page';
import { preventEnterSubmitting } from 'utils/functions';
import socket from '../utils/socket';
import { CommonResponse } from '../types/socket/CommonResponse';

interface UserStoryPanelProps {
  roomId: string;
}

interface UserStoryFormData {
  name: string;
  description: string;
}

const UserStoryPanel: React.FC<UserStoryPanelProps> = ({ roomId }) => {
  const [userStories, setUserStories] = useState<IUserStory[]>([]);
  const [newUserStoryName, setNewUserStoryName] = useState('');
  const [expandedUserStory, setExpandedUserStory] = useState<number | null>(null);
  const [editingUserStory, setEditingUserStory] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<{ userStoryId: number, taskId: number } | null>(null);
  const [newTask, setNewTask] = useState<{
    userStoryId: number,
    name: string,
    description: string | undefined
  }>({ userStoryId: 0, name: '', description: '' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isUserStoryModalOpen, setIsUserStoryModalOpen] = useState<boolean>(false);

  const [userStoryFormData, setUserStoryFormData] = useState<UserStoryFormData>({
    name: '',
    description: ''
  });
  const [alertText, setAlertText] = useState<string>('');

  const handleUserStorySubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setAlertText('');

    if (!userStoryFormData.name) {
      setAlertText('Name must be specified.');
      return;
    }

    socket.emit('createUserStory', {
      ...userStoryFormData, roomId: roomId
    }, (isOk: boolean, response: CommonResponse) => {
      if (!isOk) {
        setAlertText(response.error || '');
      }
      isOk && closeUserStoryModal();
    });
  };

  const addUserStory = () => {
    if (newUserStoryName.trim() === '') {
      alert('User story name cannot be empty');
      return;
    }

    const newUserStory: IUserStory = {
      id: Date.now(),
      name: newUserStoryName,
      tasks: []
    };
    setUserStories([...userStories, newUserStory]);
    setNewUserStoryName('');
    closeUserStoryModal();
  };

  const openTaskModal = (userStoryId: number) => {
    setNewTask({ userStoryId, name: '', description: '' });
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
  };

  const openUserStoryModal = () => {
    setIsUserStoryModalOpen(true);
  };

  const closeUserStoryModal = () => {
    setIsUserStoryModalOpen(false);
  };

  const addTaskToUserStory = () => {
    if (newTask.name.trim() === '') {
      alert('Task name cannot be empty');
      return;
    }

    const newTaskItem: ITask = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description || ''
    };

    setUserStories((prevUserStories) =>
      prevUserStories.map((userStory) =>
        userStory.id === newTask.userStoryId
          ? { ...userStory, tasks: [...userStory.tasks, newTaskItem] }
          : userStory
      )
    );
    closeTaskModal();
  };

  const saveUserStoryEdit = (userStoryId: number, userStoryName: string) => {
    if (userStoryName.trim() === '') {
      alert('User story name cannot be empty');
      return;
    }

    setUserStories((prevUserStories) =>
      prevUserStories.map((userStory) =>
        userStory.id === userStoryId
          ? { ...userStory, name: userStoryName }
          : userStory
      )
    );
    setEditingUserStory(null);
  };

  const deleteTask = (userStoryId: number, taskId: number, taskName: string) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete the task: ${taskName}?`);

    if (isConfirmed) {
      setUserStories((prevUserStories) =>
        prevUserStories.map((userStory) =>
          userStory.id === userStoryId
            ? { ...userStory, tasks: userStory.tasks.filter((task) => task.id !== taskId) }
            : userStory
        )
      );
    }
  };

  return (
    <>
      <button onClick={openUserStoryModal} className="ml-2 p-2 bg-blue-500 text-white rounded">
        <IoAddCircleOutline className="inline-block mr-2" /> Add User Story
      </button>
      <ul className="mt-4">
        {userStories.map((userStory) => (
          <li key={userStory.id} className="mb-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              {editingUserStory === userStory.id ? (
                <div>
                  <input
                    type="text"
                    value={userStory.name}
                    onChange={(e) =>
                      setUserStories((prevUserStories) =>
                        prevUserStories.map((story) =>
                          story.id === userStory.id ? { ...story, name: e.target.value } : story
                        )
                      )
                    }
                  />
                  <button
                    onClick={() => saveUserStoryEdit(userStory.id, userStory.name)}
                    className="ml-2 p-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h2>{userStory.name}</h2>
              )}
              <div className="flex items-center">
                <button
                  onClick={() => setEditingUserStory(editingUserStory === userStory.id ? null : userStory.id)}
                  className="ml-2 p-2 bg-purple-500 text-white rounded"
                >
                  <IoPencil />
                </button>
                <button
                  onClick={() => setExpandedUserStory(expandedUserStory === userStory.id ? null : userStory.id)}
                  className="ml-2 p-2 bg-gray-500 text-white rounded"
                >
                  {expandedUserStory === userStory.id ? (
                    <IoArrowUp />
                  ) : (
                    <IoArrowDown />
                  )}
                </button>
              </div>
            </div>
            {expandedUserStory === userStory.id && (
              <>
                <button
                  onClick={() => openTaskModal(userStory.id)}
                  className="mt-2 p-2 bg-green-500 text-white rounded"
                >
                  <IoAddCircleOutline className="inline-block mr-2" /> Add Task
                </button>
                <ul className="mt-2">
                  {userStory.tasks.map((task) => (
                    <Task task={task} setUserStories={setUserStories} userStoryId={userStory.id}
                          deleteTask={deleteTask}></Task>

                  ))}
                </ul>
              </>
            )}
          </li>
        ))}
      </ul>

      {isTaskModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Add Task</h2>
              <button onClick={closeTaskModal} className="text-gray-500 hover:text-gray-700">
                &times;
              </button>
            </div>
            <div>
              <label className="block mb-2">
                Task Name:
                <input
                  type="text"
                  value={newTask.name}
                  onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                  className="block w-full p-2 border rounded mt-1"
                />
              </label>
              <label className="block mb-2">
                Task Description:
                <input
                  type="text"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="block w-full p-2 border rounded mt-1"
                />
              </label>
              <button
                onClick={addTaskToUserStory}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {isUserStoryModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl">Add a new User Story</h2>
              <button onClick={closeUserStoryModal} className="text-gray-500 hover:text-gray-700">
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
              <form onSubmit={handleUserStorySubmit} id="formCreateUserStory" className="flex flex-col text-black">
                <div className="pb-4">
                  <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="name">Name</label>
                  <input
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    onKeyDown={preventEnterSubmitting} type="text"
                    id="name" name="name" placeholder="Super user story" autoComplete="off" required
                    value={userStoryFormData.name}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setUserStoryFormData((previousForm: UserStoryFormData) => ({
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
                    value={userStoryFormData.description}
                    onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setUserStoryFormData((previousForm: UserStoryFormData) => ({
                      ...previousForm,
                      [event.target.name]: event.target.value
                    }))}
                  ></textarea>
                </div>
                <button id="submitButton" type="submit" form="formCreateUserStory"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                  Add
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserStoryPanel;