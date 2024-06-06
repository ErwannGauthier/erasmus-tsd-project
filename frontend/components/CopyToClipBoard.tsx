import React, { useState } from 'react';
import { FiCopy } from 'react-icons/fi';


const CopyToClipBoard: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
    <div className="flex items-center justify-center m-2">
      <button onClick={copyToClipboard} className="mr-2 flex flex-row items-center">
        <FiCopy /> invite people
      </button>
      {copied && <span className="text-sm text-green-400">Link copied!</span>}
    </div>
  );
};

export default CopyToClipBoard;