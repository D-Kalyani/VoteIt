import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import {Event} from '../models/event.model.js'
import { io } from '../app.js'
import {User} from '../models/user.model.js'

const createEvent = asyncHandler( async (req, res) => {

  
  if(!req.user._id)
  {
    throw new ApiError(404 , "please Signin")
  }
  const owner = req.user._id
    const {eventName,
        eventDescription,
        options,
        startTime,
        endTime,
} = req.body

        if(!(eventName || eventDescription || options || startTime ||endTime||owner))
        {
            throw new ApiError(400 , "Fill all the fields")
        }
  
  
      const newEvent = await Event.create({
        name:eventName , description:eventDescription  , options:options , startTime:startTime , endTime:endTime, owner:owner
      })
      
      const createdEvent = await Event.findById(newEvent._id)


      if(!createdEvent)
      {
        throw new ApiError(400 , "could not save the event")
      }
      await User.findByIdAndUpdate(owner , {

        $push: { Events : createdEvent } },
        {new:true},
      )
      // Emit event details to clients
      io.emit('newEvent',createdEvent);

      res
      .status(201)
      .json(
        new ApiResponse(200 , createdEvent , "event created successfully")
      );
    } 
  );
  

  const getEvents = asyncHandler(async(req,res) =>
  {
    if(!req.user._id)
    {
      throw new ApiError(404 , "user not found")
    }

    const events =   await Event.aggregate([
      {
      $match: {
          owner: req.user._id
      }
  }
])



    res.status(200)
    .json(
      new ApiResponse(200 , events , "events fetched successfully")
    )
  })


  const vote = asyncHandler(async() =>
  {
    const { eventId, optionIndex } = req.body;

    const hasVoted = req.cookies[`voted_${eventId}`];
    if (hasVoted) {
      throw new ApiError(403 , "You have already voted")
    }


    
    const event = await Event.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'Event not found');
    }
  
    const option = event.options.id(optionIndex);

    if (optionIndex < 0 || optionIndex >= event.options.length) {
      throw new ApiError(404, 'Option not found');
    }
  
     event.options[optionIndex].votes += 1;
     await event.save({ validateBeforeSave: false });

     io.emit('voteUpdate', event.options);
  
    // Set a cookie to prevent further voting
    res.cookie(`voted_${eventId}`, 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
  
    res.status(200).json(new ApiResponse (200 , "vote casted successfully"));

  })

  const getEventById = asyncHandler(async(req,res) =>
  {

      const { id } = req.params;
      console.log(id)
      const event = await Event.findById(id);
      console.log(event)
      if (!event) {
        throw new ApiError(404, 'Event not found');
      }

      res.status(200).json(new ApiResponse(200 ,event, "Event fetched successfully"));
   
  })

  
export {createEvent , getEvents , vote , getEventById}