import React from 'react';
import { Link } from 'react-router-dom';

function Card({event}) {

  const date1 = new Date(event.endTime);
  const localEndTime = date1.toLocaleTimeString('en-IN',
    {timeZone:'IST',hour12:true,hour:'numeric',minute:'numeric'}
  );
  const localEndDate = date1.toLocaleDateString('en-IN', {
    timeZone: 'IST',year: 'numeric',month: 'long',day: 'numeric'
  });
  
  const date2 = new Date(event.startTime);
  const localStartTime = date2.toLocaleTimeString('en-IN',
    {timeZone:'IST',hour12:true,hour:'numeric',minute:'numeric'});
  const localStartDate = date2.toLocaleDateString('en-IN', {
      timeZone: 'IST',year: 'numeric',month: 'long',day: 'numeric'
    });

  const currentDate = new Date();
  currentDate.setTime(currentDate.getTime() + 5.5 * 60 * 60 * 1000); // Adjust for IST timezone

  // Compare current time with event start and end times
  const eventStartTime = new Date(event.startTime);
  const eventEndTime = new Date(event.endTime);
  const isActive = currentDate >= eventStartTime && currentDate <= eventEndTime;


  return (
    <div className="w-full sm:w-64 rounded overflow-hidden shadow-lg bg-white mx-auto my-4">
  <div className="px-4 py-4 sm:px-6 sm:py-4">
    <div className="font-medium text-lg sm:text-xl mb-2 sm:mb-4">{event.name}</div>
    <p className="text-gray-700 text-sm sm:text-base font-medium">{localStartDate} {localStartTime}</p>
    <p className="text-gray-700 text-sm sm:text-base font-normal">To</p>
    <p className="text-gray-700 text-sm sm:text-base font-medium">{localEndDate} {localEndTime}</p>
  </div>
  {isActive && (
    <p className="text-green-500 font-normal text-xs sm:text-sm mt-2">Active</p>
  )}
  <div className="px-4 py-4 sm:px-6 sm:py-4">
    <Link
      to={`/event/${event._id}`} 
      className="inline-block bg-sky-600 hover:bg-sky-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 transition duration-300"
    >
      View Event
    </Link>
  </div>
</div>

  );
};

export default Card;
