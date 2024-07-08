import mongoose,{Schema} from 'mongoose'

const eventSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
    },
    name:{
        type:String,
        required:true,
    },
    description:
    {
        type:String,
        required:true,
    },
    options:[{ 
        name: String, 
        description: String, 
        votes: { type: Number, default: 0 } 
    }],
    startTime: Date,
    endTime:Date,
},
{timestamps:true})

export const Event = mongoose.model("Event" , eventSchema)