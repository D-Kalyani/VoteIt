import mongoose from 'mongoose'

const connectdb = async() =>
    {
        try{
            const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
             console.log("Database connected successfully, Host : ", connectionInstance.connection.host )
            }
            catch(error)
            {
                console.log("could not connect to database ",error)
                process.exit(1);
            }
    }

    export default connectdb