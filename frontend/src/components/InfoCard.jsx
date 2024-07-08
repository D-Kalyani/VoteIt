import React from 'react';
import { Link } from 'react-router-dom';

function InfoCard({option}) {

  return (
    <div className="w-56 sm:max-w-md rounded overflow-hidden shadow-lg bg-white mx-4 my-4">
  <div className="px-6 py-4">
    <div className="font-bold text-xl mb-2 sm:mb-4">{option.name}</div>
    <p className="text-gray-700 text-base">{option.description}</p>
  </div>
</div>

  );
};

export default InfoCard;