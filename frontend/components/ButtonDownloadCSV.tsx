import React from 'react';
import { IoDownloadOutline } from 'react-icons/io5';

interface ButtonDownloadCsvProps {
  roomId: string;
}

const ButtonDownloadCsv = ({ roomId }: ButtonDownloadCsvProps) => {
  const downloadCsv = async () => {
    const response = await fetch(`http://localhost:3001/csv/download-room-csv/${roomId}`, {
      method: 'GET'
    });
    console.log(response);

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `room_${roomId}_data.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      console.error('Failed to download CSV');
    }
  };

  return (
    <button onClick={downloadCsv}
            className="flex align-middle items-center justify-between text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ml-2">
      <IoDownloadOutline className="inline-block mr-2" />
      Download CSV
    </button>
  );
};

export default ButtonDownloadCsv;
