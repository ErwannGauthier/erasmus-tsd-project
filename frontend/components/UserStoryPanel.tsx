'use client';

import React, { useEffect, useState } from 'react';
import { IoAddCircleOutline, IoArrowDown, IoArrowUp, IoPencil } from 'react-icons/io5';
import { UserStoryIncludes } from '../types/data/UserStoryIncludes';
import ModalUserStoryUpdate from '@/components/ModalUserStoryUpdate';
import ModalUserStoryCreate from '@/components/ModalUserStoryCreate';
import { Task } from '../types/data/Task';
import ModalTaskCreate from '@/components/ModalTaskCreate';
import TaskComponent from '@/components/TaskComponent';
import ModalTaskUpdate from '@/components/ModalTaskUpdate';

interface UserStoryPanelProps {
  roomId: string;
  roomUserStories: UserStoryIncludes[];
}

interface FormDataUpdate {
  userStoryId: string;
  name: string;
  description: string;
  finalVote: string;
}

const UserStoryPanel: React.FC<UserStoryPanelProps> = ({ roomId, roomUserStories }) => {
  const [userStories, setUserStories] = useState<UserStoryIncludes[]>(roomUserStories);
  const [userStoryIdToExpand, setUserStoryIdToExpand] = useState<string>('');
  const [userStoryUpdateFormData, setUserStoryUpdateFormData] = useState<FormDataUpdate>({
    userStoryId: '',
    name: '',
    description: '',
    finalVote: ''
  });
  const [taskUpdateFormData, setTaskUpdateFormData] = useState<Task>({
    taskId: '',
    name: '',
    description: '',
    userStoryId: ''
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState<boolean>(false);
  const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState<boolean>(false);

  useEffect(() => {
    setUserStories([...roomUserStories]);
  }, [roomUserStories]);

  const initializeUpdateData = (userStoryId: string): void => {
    const userStoriesFiltered: UserStoryIncludes[] = userStories.filter((userStory: UserStoryIncludes) => userStory.userStoryId === userStoryId);
    if (userStoriesFiltered.length === 0) return;

    const userStory: UserStoryIncludes = userStoriesFiltered[0];
    setUserStoryUpdateFormData({
      userStoryId: userStory.userStoryId,
      name: userStory.name,
      description: userStory.description,
      finalVote: userStory.finalVote
    });
    setIsUpdateModalOpen(true);
  };

  const initializeTaskUpdateData = (task: Task): void => {
    setTaskUpdateFormData(task);
    setIsUpdateTaskModalOpen(true);
  };

  const closeModalCreate = (): void => {
    setIsCreateModalOpen(false);
  };

  const closeModalUpdate = (): void => {
    setIsUpdateModalOpen(false);
  };

  const closeModalTaskCreate = (): void => {
    setIsCreateTaskModalOpen(false);
  };

  const closeModalTaskUpdate = (): void => {
    setIsUpdateTaskModalOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsCreateModalOpen(true)} className="ml-2 p-2 bg-blue-500 text-white rounded">
        <IoAddCircleOutline className="inline-block mr-2" /> Add User Story
      </button>
      <ul className="mt-4">
        {userStories.map((userStory: UserStoryIncludes) => (
          <li key={userStory.userStoryId} className="mb-4 border p-4 rounded">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">{userStory.name}</h2>
                <p className="text-sm font-light">{userStory.description}</p>
              </div>

              <div className="flex items-center">
                <button className="ml-2 p-2 bg-purple-500 text-white rounded"
                        onClick={() => initializeUpdateData(userStory.userStoryId)}>
                  <IoPencil />
                </button>

                <button className="ml-2 p-2 bg-gray-500 text-white rounded"
                        onClick={() => setUserStoryIdToExpand(userStoryIdToExpand === userStory.userStoryId ? '' : userStory.userStoryId)}>
                  {userStoryIdToExpand === userStory.userStoryId ? <IoArrowUp /> : <IoArrowDown />}
                </button>
              </div>
            </div>
            {userStoryIdToExpand === userStory.userStoryId && (
              <div>
                <button onClick={() => setIsCreateTaskModalOpen(true)}
                        className="mt-2 p-2 bg-green-500 text-white rounded">
                  <IoAddCircleOutline className="inline-block mr-2" /> Add Task
                </button>
                <ul className="mt-2">
                  {userStory.Task.map((task: Task) => <TaskComponent key={task.taskId} task={task}
                                                                     initializeData={initializeTaskUpdateData} />)}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>


      {isCreateModalOpen && <ModalUserStoryCreate roomId={roomId} closeModal={closeModalCreate} />}

      {isUpdateModalOpen &&
        <ModalUserStoryUpdate roomId={roomId} formDataProps={userStoryUpdateFormData} closeModal={closeModalUpdate} />}

      {isCreateTaskModalOpen &&
        <ModalTaskCreate roomId={roomId} userStoryIdProp={userStoryIdToExpand} closeModal={closeModalTaskCreate} />}

      {isUpdateTaskModalOpen &&
        <ModalTaskUpdate roomId={roomId} formDataProps={taskUpdateFormData} closeModal={closeModalTaskUpdate} />}
    </>
  );
};

export default UserStoryPanel;