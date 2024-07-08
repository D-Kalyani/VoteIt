import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {io} from 'socket.io-client';
import axios from 'axios';
import InfoCard from './InfoCard';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

  const socket = io("http://localhost:3000" , {
    withCredentials: true}); 

    const getCookieValue = (name) => {
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      if (match) return match[2];
      return null;
    };

function EventPage()  {
  const { id } = useParams();
  const [event, setEvent] = useState({ options: [] });
 const [hasVoted, setHasVoted] = useState(getCookieValue(`voted_${id}`) === 'true');
 const [currentTime, setCurrentTime] = useState(new Date());
 const navigate=useNavigate()

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/v1/event/${id}`);
        setEvent(response.data.data)

      } catch (error) {
        console.error('Error fetching event:', error);
        alert("Sorry! could not fetch the event")
        navigate('/')

      }
    };

    fetchEvent();


    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [id]);

  const handleVote = (optionIndex) => {
    if (!hasVoted && event) {
      socket.emit('vote', { eventId: id, optionIndex });
      document.cookie = `voted_${id}=true; path=/; max-age=${24 * 60 * 60}`;
      setHasVoted(true);
    }
  };

  useEffect(() => {
    socket.on('voteUpdate', ({eventId , options}) => {
      if (eventId === id) {
        setEvent((prevEvent) => ({
          ...prevEvent,
          options:options,
        }));
      }
    });

    socket.on('voteError', (error) => {
      alert(error.message);
    });

    return () => {
      socket.off('voteUpdate');
      socket.off('voteError');
    };
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const isVotingOpen = currentTime >= startTime && currentTime <= endTime;

  return (

    <div className="max-w-2xl sm:max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg">
  <h1 className="text-2xl sm:text-4xl font-bold text-center mb-4 sm:mb-6 text-sky-600">{event.name}</h1>
  <p className="text-base sm:text-lg text-center mb-4 sm:mb-6">{event.description}</p>

  <div className="space-y-4 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row items-start mb-4 sm:mb-6">
    {event.options.map((option, index) => (
      <InfoCard key={index} option={option} />
    ))}
  </div>

  <ul className="space-y-4">
    {event.options.map((option, index) => (
      <li key={index} className="flex flex-col sm:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg shadow-md">
        <span className="text-lg font-semibold text-sky-600 mb-2 sm:mb-0">{option.name}</span>

        <Button 
          children={isVotingOpen ? 'Vote' : 'Voting Closed'} 
          onClick={() => handleVote(index)}
          disabled={!isVotingOpen || hasVoted}
          className={`px-4 py-2 font-bold rounded mb-2 sm:mb-0 ${
            hasVoted || !isVotingOpen
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-sky-600 text-white hover:bg-sky-700'
          }`}
        />

        <span className="text-lg sm:text-xl font-semibold">{option.votes} votes</span>
      </li>
    ))}
  </ul>

  {!isVotingOpen && (
    <div className="mt-4 sm:mt-8 text-center">
      <h2 className="text-xl sm:text-2xl font-bold">
        {currentTime < startTime ? 'votes are not being accepted currently' : 'Voting has ended'}
      </h2>
      {currentTime > endTime && (
        <div className="mt-4">
          <h2 className="text-lg sm:text-xl font-semibold">Results</h2>
          <ul className="mt-2 space-y-2">
            {event.options.map((option, index) => (
              <li key={index} className="text-base sm:text-lg">
                {option.name}: {option.votes} votes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</div>

  );
};

export default EventPage;
