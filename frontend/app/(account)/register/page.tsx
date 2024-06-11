'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface FormData {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [alertText, setAlertText] = useState<string>('');
  const router = useRouter();

  const preventEnterSubmitting = (event: React.KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();
    setAlertText('');

    if (!formData.name || !formData.surname || !formData.email || !formData.password || !formData.confirmPassword) {
      setAlertText('All fields are required.');
      return;
    } else if (formData.password !== formData.confirmPassword) {
      setAlertText('Passwords do not match.');
      return;
    }

    const response = await fetch('http://127.0.0.1:3001/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...formData
      })
    });

    const responseData = await response.json();
    if (!response.ok) {
      setAlertText(responseData.error);
      return;
    }

    router.push('/login');
  };


  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-1/2 m-6">
        <h1 className="text-2xl font-bold pb-4">Register</h1>
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
        <form onSubmit={handleSubmit} id="formRegister" className="flex flex-col text-black">
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="name">Name</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="text"
              id="name" name="name" placeholder="John" autoComplete="off" required
              value={formData.name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="surname">Surname</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="text"
              id="surname" name="surname" placeholder="Doe" autoComplete="off" required
              value={formData.surname}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="email">Email</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="email"
              id="email" name="email" placeholder="john.doe@email.com" autoComplete="off" required
              value={formData.email}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>
          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="password">Password</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="password"
              id="password" name="password" placeholder="*********" autoComplete="off" required
              value={formData.password}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>

          <div className="pb-4">
            <label className="block mb-1 text-base font-semibold text-gray-900 px-2" htmlFor="confirmPassword">Confirm
              Password</label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onKeyDown={preventEnterSubmitting} type="password"
              id="confirmPassword" name="confirmPassword" placeholder="*********" autoComplete="off" required
              value={formData.confirmPassword}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setFormData((previousForm: FormData) => ({
                ...previousForm,
                [event.target.name]: event.target.value
              }))}
            />
          </div>

          <button id="submitButton" type="submit" form="formRegister"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Register
          </button>
        </form>
        <p className="font-normal pt-2">You already have an account ? <Link href={'/login'}
                                                                          className="text-blue-500">Log in</Link></p>
      </div>
    </div>
  );
}