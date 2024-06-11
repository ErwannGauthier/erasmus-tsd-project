import React from 'react';
import { useState, useRef, useEffect } from "react";

import { IUserStory } from "../app/room/[id]/page";

import { Dispatch, SetStateAction } from 'react';

import { MdOutlineHowToVote } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";

export interface ITask {
  id: number;
  name: string;
  description: string;
  value?: number;
}

interface CardProps {
  task:ITask;
  setUserStories: Dispatch<SetStateAction<IUserStory[]>>;
  userStoryId: number;
  deleteTask: (userStoryId: number, taskId: number, taskName: string) => void;
}

const OldTask: React.FC<CardProps> = ({ task, setUserStories, userStoryId, deleteTask}) => {
  
  const [isEditing, setIsEditing] = useState(false);
  const [isTaskHovered, setIsTaskHovered] = useState(false);
  const [newName, setNewName] = useState(task.name);
  const [newDescription, setNewDescription] = useState(task.description);

  const saveTaskEdit = () => {
    if (task.name.trim() === "") {
      alert("OldTask name cannot be empty");
      return;
    }
    task.name = newName;
    task.description = newDescription;

    // setUserStories((prevUserStories) =>
    //   prevUserStories.map((userStory) =>
    //     userStory.id === userStoryId
    //       ? {
    //           ...userStory,
    //           tasks: userStory.tasks.map((pTask) =>
    //             pTask.id === task.id
    //               ? { ...pTask, name: task.name, description: task.description }
    //               : pTask
    //           ),
    //         }
    //       : userStory
    //   )
    // );
    setIsEditing(false);
  };

      // Functions to handle hover state
      const handleMouseEnter = () => {
        setIsTaskHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsTaskHovered(false);
    };

    const startVote = () => {
      const taskValue = prompt("Enter the value for the task");
      if (taskValue) {
          setUserStories((prevUserStories) =>
          prevUserStories.map((userStory) => ({
              ...userStory,
              tasks: userStory.tasks.map((pTask) =>
              pTask.id === task.id ? { ...pTask, value: parseInt(taskValue) } : pTask
              ),
          }))
          );
      }
  };


  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return ( 
    <>
      <li key={task.id} className="flex justify-between items-center mt-2 border p-2 rounded">
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"  ref={menuRef}>
              <ul className="py-1">
                  <li>
                    <button
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                      onClick={() => {setIsEditing(true)
                        setShowMenu(false);
                      }}
                    >
                      Edit
                    </button>
                  </li>
                <li>
                  <button
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
                    onClick={() => deleteTask(userStoryId, task.id, task.name)}
                  >
                    Delete
                  </button>
                </li>
              </ul>
          </div>
        )}
                        {isEditing ? (
                            <div className="flex flex-col justify-between items-start w-full">
                            <label className="w-full">
                                <div className="flex-row w-full">
                                    Task Name:
                                    <input
                                    type="text"
                                    defaultValue={task.name}
                                    onChange={(e) =>
                                        setNewName(e.target.value)
                                    }
                                    className="ml-2 p-1 border rounded"
                                    />
                                </div>
                            </label>
                            <label className="w-full">
                                Task Description:
                                <textarea
                                    defaultValue={task.description}
                                    onChange={(e) =>
                                      setNewDescription(e.target.value)
                                  }
                                    className="ml-2 p-1 border rounded resize-y min-h-20 w-full"
                                />
                            </label>
                            <button 
                                onClick={() =>
                                saveTaskEdit()
                                }
                                className=" p-2 bg-green-500 text-white rounded ml-auto"
                            >
                                Save
                            </button>
                            </div>
                        ) : (
                            <div className="flex flex-row w-full items-center" 
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                >
                                <div className="flex flex-col w-full">
                                    <h3 className="self-center"><b>{task.name}</b></h3>
                                    <p className="break-all">{task.description}</p>
                                </div>
                                <div className="flex flex-row justify-center ml-auto">
                            {
                                task.value ? (
                                <span className="text-lg font-bold">{task.value}</span>
                                ) : (
                                    <>
                                        <MdOutlineHowToVote className="ml-2 w-8 h-8" onClick={startVote}></MdOutlineHowToVote>
                                        <button
                                            onClick={() => {
                                              handleMenuToggle();
                                            }}
                                            className="ml-4 p-2 bg-yellow-500 text-white rounded"
                                            style={{ visibility: isTaskHovered ? 'visible' : 'hidden'}}
                                        > 
                                           <HiDotsHorizontal/>
                                        </button>
                                    </>
                                )
                            }
                            </div>
                            
                            </div>
                        )}
                    </li>
    </>
  )
}

export default OldTask;
     