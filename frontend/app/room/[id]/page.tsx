"use client"

import { useParams } from "next/navigation";
import { useState } from "react";
import { IoArrowDown, IoAddCircleOutline, IoPencil, IoArrowUp } from "react-icons/io5";
import EllipseNames ,{Name} from "@/components/EllipseNames";
import Card from "@/components/Card";
import { FiCopy } from 'react-icons/fi';
import { ITask} from "@/components/Task";
import Task from "@/components/Task";




export  interface IUserStory {
  id: number;
  name: string;
  tasks: ITask[];
}

export default function Room() {

  const params = useParams();
  const { id } = params;

  const values:number[] = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  const [userStories, setUserStories] = useState<IUserStory[]>([]);
  const [newUserStoryName, setNewUserStoryName] = useState("");
  const [expandedUserStory, setExpandedUserStory] = useState<number | null>(null);
  const [editingUserStory, setEditingUserStory] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<{ userStoryId: number, taskId: number } | null>(null);
  const [newTask, setNewTask] = useState<{ userStoryId: number, name: string, description: string | undefined }>({ userStoryId: 0, name: '', description: '' });
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [isUserStoryModalOpen, setIsUserStoryModalOpen] = useState<boolean>(false);

  const addUserStory = () => {
    if (newUserStoryName.trim() === "") {
      alert("User story name cannot be empty");
      return;
    }

    const newUserStory: IUserStory = {
      id: Date.now(),
      name: newUserStoryName,
      tasks: [],
    };
    setUserStories([...userStories, newUserStory]);
    setNewUserStoryName("");
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
    if (newTask.name.trim() === "") {
      alert("Task name cannot be empty");
      return;
    }

    const newTaskItem: ITask = {
      id: Date.now(),
      name: newTask.name,
      description: newTask.description || "",
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
    if (userStoryName.trim() === "") {
      alert("User story name cannot be empty");
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

  const [names, setNames] = useState<Name[]>([
    {name:'Alice', hasValidated: true}, 
    {name:'Bob', hasValidated: false}, 
    {name:'Charlie', hasValidated: false}, 
    {name:'Dave', hasValidated: false}, 
    {name:'Eve', hasValidated: true}, 
    {name:'Lucas', hasValidated: false}
  ]);

  const addRandomName = () => {
    const randomName = `Name${names.length + 1}`;
    setNames([...names, {name:randomName, hasValidated: false}]);
  };

    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
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
    <div className="flex flex-row w-full">
        <div className="flex flex-col bg-gray-100" style={{ minWidth: '300px', maxWidth: '70%' }}>
            <div className="flex flex-col items-center justify-center bg-gray-100">
                <h1 className="text-2xl font-bold mb-4">Ellipse Names Example</h1>
                <EllipseNames names={names} width={220}/>
                <button
                    onClick={addRandomName}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Add Random Name
                </button>
            </div>
            <div className="flex flex-wrap w-full p-4">
                {values.map((value) => (
                    <Card value={value} isSelected={value === 5} key={value}/>
                ))}
            </div>
        </div>
        <div className="flex-1">
        <div className="flex items-center justify-center m-2">
      <button onClick={copyToClipboard} className="mr-2 flex flex-row items-center">
        <FiCopy /> invite people 
      </button>
      {copied && <span className="text-sm text-green-400">Link copied!</span>}
    </div>

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
                        <Task task={task} setUserStories={setUserStories} userStoryId={userStory.id} deleteTask={deleteTask}></Task>
                        
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
                <button onClick={closeTaskModal} className="text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                </div>
                <div>
                <label className="block mb-2">
                  User Story Name:
                    <input
                    type="text"
                    value={newUserStoryName}
                    onChange={(e) => setNewUserStoryName(e.target.value)}
                    className="block w-full p-2 border rounded mt-1"
                    />
                </label>
                <button
                    onClick={addUserStory}
                    className="mt-4 p-2 bg-blue-500 text-white rounded"
                >
                    Add User Story
                </button>
                </div>
            </div>
            </div>
        )}
        </div>
    </div>
  );
}
