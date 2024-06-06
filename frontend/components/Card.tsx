import React from 'react';

interface CardProps {
  value: number;
  isSelected?: boolean;
}

const Card: React.FC<CardProps> = ({ value, isSelected }) => {
  return (
    <div className={`relative m-1 w-12 h-20 bg-gray-400 border-4 bg-card-bg bg-cover ${isSelected? "border-green-600" :""}  rounded-xl overflow-hidden flex-shrink-0 hover:border-yellow-500`}>
      {/* <div className="absolute top-0 left-0 w-3 h-3 bg-black rounded-tl-full"></div>
      <div className="absolute top-0 right-0 w-3 h-3 bg-black rounded-tr-full"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 bg-black rounded-bl-full"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 bg-black rounded-br-full"></div> */}
      <div className="absolute inset-0 flex justify-center items-center font-bold text-white text-xl">
        {value}
      </div>
    </div>
  );
};

export default Card;