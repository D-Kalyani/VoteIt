import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';


function AddEventForm()  {
  const [eventName, setEventName] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [options, setOptions] = useState([{ name: '', description: '' }]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate= useNavigate()
  const[msg , setMsg] = useState('')



  const handleOptionChange = (index, key, value) => {
    const newOptions = [...options];
    newOptions[index][key] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { name: '', description: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventDetails = {
      eventName,
      eventDescription,
      options,
      startTime,
      endTime,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/v1/event/create-event', eventDetails);
      console.log('Event added:', response.data);
      navigate('/')
      
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message);
    } else {
        setMsg('An unexpected error occurred');
    } 
    }
  };


  return (
    <div className="max-w-xl sm:max-w-2xl mx-auto mt-8 p-4 sm:p-6 bg-white rounded shadow-lg">
  <form onSubmit={handleSubmit} className="space-y-4">

    <Input 
      label="Name" 
      placeholder="Event name" 
      value={eventName}
      onChange={(e) => setEventName(e.target.value)} 
      className="focus:outline-none focus:ring-sky-600 focus:border-sky-600" 
      required 
    />

    <div>
      <label htmlFor="eventDescription" className="block text-gray-700">
        Event Description:
      </label>
      <textarea
        id="eventDescription"
        value={eventDescription}
        onChange={(e) => setEventDescription(e.target.value)}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
        rows="3"
        required
      ></textarea>
    </div>

    <div>
      {options.map((option, index) => (
        <div key={index} className="space-y-2">
          <Input 
            label="Options" 
            value={option.name} 
            onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
            placeholder={`Option ${index + 1} Name`} 
            className="focus:outline-none focus:ring-sky-600 focus:border-sky-600"
            required 
          />
          <textarea
            value={option.description}
            onChange={(e) => handleOptionChange(index, 'description', e.target.value)}
            placeholder={`Option ${index + 1} Description`}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-600 focus:border-sky-600 sm:text-sm"
            rows="2"
          ></textarea>
        </div>
      ))}
      <Button 
        children="Add Options" 
        onClick={handleAddOption} 
        className="bg-sky-600 hover:bg-sky-700 text-white mt-4"
      />   
    </div>

    <Input 
      label="Voting begins" 
      type="datetime-local"  
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)} 
      required 
      className="focus:outline-none focus:ring-sky-600 focus:border-sky-600"
    />
    <Input 
      label="Ends" 
      type="datetime-local"  
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)} 
      required 
      className="focus:outline-none focus:ring-sky-600 focus:border-sky-600"
    />
     
    <Button 
      children="Submit" 
      className="bg-sky-600 hover:bg-sky-700 text-white mt-4" 
    />
    <p className="text-lg text-red-500 flex justify-center">{msg}</p>
  </form>
</div>

  );
};

export default AddEventForm;
