const express=require('express');
const userRoutes=require('./routes/userRoute');
const folderRoutes=require('./routes/folderRoute')
const app=express();
const port=3000;
require('dotenv/config'); 


app.use(express.json());


app.use('/api/v1/user',userRoutes);
app.use('/api/v1/folder',folderRoutes);

const start=async ()=>{
    try {
        app.listen(3000,console.log(`Server Listening To The Port ${3000}`));
    } catch (error) {
        console.log(error);
    }
}

start();