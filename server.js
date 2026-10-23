import config from './src/config/config.js'
import connectDB from './src/config/database.js'
import app from './src/app.js'
const startServer  = async () =>{
await connectDB()
app.listen(config.PORT,()=>{
    console.log("server is running on port", config.PORT)
})
}
startServer()