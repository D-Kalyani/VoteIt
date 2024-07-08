import {Router} from 'express';
import { createEvent,getEvents,getEventById } from '../controllers/events.controller.js';
import {verifyJwt} from '../middleware/verifyJwt.js'



const router = Router()

router.route("/create-event").post(verifyJwt , createEvent)
router.route("/get-events").get(verifyJwt , getEvents)
router.get('/:id', getEventById);



  


export default router