'use client';

import React, { useState } from 'react';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import TaskComponent from '@/components/closedRoom/TaskComponent';
import { UserStoryIncludes } from 'types/data/UserStoryIncludes';
import { Task } from '../../types/data/Task';

interface UserStoryPanelProps {
  userStories: UserStoryIncludes[];
}

const UserStoryPanel: React.FC<UserStoryPanelProps> = ({ userStories }) => {
  const [userStoryIdToExpand, setUserStoryIdToExpand] = useState<string>('');

  return (
    <ul className="mt-4">
      {userStories.map((userStory: UserStoryIncludes) => (
        <li key={userStory.userStoryId} className="mb-4 border p-4 rounded">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{userStory.name}</h2>
              {userStory.finalVote.length > 0 && <p className="font-medium">Vote: {userStory.finalVote}</p>}
              <p className="text-sm font-light">{userStory.description}</p>
            </div>

            <div className="flex items-center">
              <button className="ml-2 p-2 bg-gray-500 text-white rounded"
                      onClick={() => setUserStoryIdToExpand(userStoryIdToExpand === userStory.userStoryId ? '' : userStory.userStoryId)}>
                {userStoryIdToExpand === userStory.userStoryId ? <IoArrowUp /> : <IoArrowDown />}
              </button>
            </div>
          </div>
          {userStoryIdToExpand === userStory.userStoryId && (
            <div>
              <ul className="mt-2">
                {userStory.Task.map((task: Task) => <TaskComponent key={task.taskId} task={task} />)}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default UserStoryPanel;