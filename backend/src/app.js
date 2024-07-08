import cors from 'cors'
import cookieParser from "cookie-parser"
import ApiError from './utils/ApiError.js';
import { Server } from 'socket.io';
import express from 'express';
import { createServer } from 'http';
import 'dotenv/config'
import {Event} from './models/event.model.js'
import cookie from 'cookie'

const app = express(); 
const server = createServer(app); 
const io = new Server(server , {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

io.attach(server);

const corsOptions = {
  origin: 'http://localhost:5173', 
  credentials: true
};

app.use(cors(corsOptions))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('vote', async ({eventId , optionIndex}) => {
    try {
  
      const cookies = socket.request.headers.cookie ? cookie.parse(socket.request.headers.cookie) : {};

      const hasVoted = cookies[`voted_${eventId}`];
      if (hasVoted) {
        socket.emit('voteError', { message: 'You have already voted' });
        return;
      }

      // Find the event and update the vote count
      const event = await Event.findById(eventId);
      if (!event) {
        throw new ApiError(404, 'Event not found');
      }

      const currentTime = new Date();
      const startTime = new Date(event.startTime);
      const endTime = new Date(event.endTime);

      if (currentTime < startTime) {
        socket.emit('voteError', { message: 'Voting has not started yet' });
        return;
      }
      if (currentTime > endTime) {
        socket.emit('voteError', { message: 'Voting has ended' });
        return;
      }

      if (optionIndex < 0 || optionIndex >= event.options.length) {
        throw new ApiError(404, 'Option not found');
      }

      event.options[optionIndex].votes += 1;
      await event.save();

      // Set a cookie to prevent further voting
    

      // Emit event to all connected clients to update vote counts
      io.emit('voteUpdate', { eventId, options: event.options });
  

    } 
    
    catch (error) {
      console.error('Error processing vote:', error);
      socket.emit('voteError', { message: 'Error processing vote' });
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

//routes
import userRouter from "../src/routes/user.routes.js"
import eventRouter from './routes/event.route.js'

app.use("/api/v1/user" , userRouter)
app.use("/api/v1/event" , eventRouter)

app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
      return res.status(err.status).json({ message: err.message });
  }
  res.status(500).json({ message: 'Something went wrong' });
});

export {app , io ,server}