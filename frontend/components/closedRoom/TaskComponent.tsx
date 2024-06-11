import React from 'react';
import { Task } from 'types/data/Task';


interface TaskProps {
  task: Task;
}

const TaskComponent: React.FC<TaskProps> = ({ task }) => {
  return (
    <li className="flex justify-between items-center mt-2 border-2 p-2 rounded">
      <div className="flex flex-row w-full items-center">
        <div className="flex flex-col w-full">
          <h3 className="font-semibold">{task.name}</h3>
          <p className="text-sm font-light">{task.description}</p>
        </div>
      </div>
    </li>
  );
};

export default TaskComponent;
