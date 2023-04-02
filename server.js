require('dotenv').config();
const { main } = require('./src/services/mongoose');

const express = require('express');
const app = express();
const  userRoutes  = require('./src/routes/routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');



const port = process.env.PORT || 3005;
main().catch(err => console.log(err));

app.use(cookieParser());
app.use(cors({
    credentials: true ,
    origin : ['http://localhost:3000','http://localhost:4200','http://localhost:8080'] 
}));





app.use(express.json()); // recep des données 

app.use('/api',userRoutes);


app.listen(port,()=>{
    console.log(`your server is running on http//:localhost:${port}`)
});
