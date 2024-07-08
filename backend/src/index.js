import 'dotenv/config'
import connectdb from '../src/db/index.js'
import {app , server} from './app.js'

connectdb()
.then(
    () => {
            server.listen(process.env.PORT , () =>{
                console.log("listening on port ",`${process.env.PORT}`)})
            })
.catch((error) =>
        {
            console.log("could not connect!",error)
        })

                

                        
         
