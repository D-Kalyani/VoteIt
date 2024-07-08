import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";
import Hero from '../components/Hero';

function Home() {
  const [events, setEvents] = useState([]);
  const authStatus = useSelector((state) => state.user.status)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        await axios.get('http://localhost:3000/api/v1/event/get-events')
        .then((response) =>{
          setEvents(response.data.data)
        }
        )
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);
  return authStatus ? (
    <div className="container mx-auto px-4 py-8  bg-gray-100">
     <Link to={"/add-event"} className='text-3xl font-bold mb-4'>
            Add Event +
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {events.slice().reverse().map((event) => (
          <Card key={event._id} event={event} />
        ))
        }
      </div>
    </div>
  ) : 
  <Hero />
};

export default Home;
