import React from 'react';
import { Task } from '../types/data/Task';
import { IoPencil } from 'react-icons/io5';


interface TaskProps {
  task: Task;
  initializeData: (task: Task) => void;
}

const TaskComponent: React.FC<TaskProps> = ({ task, initializeData }) => {

  return (
    <li className="flex justify-between items-center mt-2 border-2 p-2 rounded">
      <div className="flex flex-row w-full items-center">
        <div className="flex flex-col w-full">
          <h3 className="font-semibold">{task.name}</h3>
          <p className="text-sm font-light">{task.description}</p>
        </div>

        <div className="flex items-center">
          <button className="ml-2 p-2 bg-purple-500 text-white rounded"
                  onClick={() => initializeData(task)}>
            <IoPencil />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskComponent;
