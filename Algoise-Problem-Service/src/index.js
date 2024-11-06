const express=require('express');
const bodyParser=require('body-parser');
const {PORT}=require('./config/server.config');
const apiRouter=require('./routes');

const errorHandler = require('./Utils/error.Handler');
const connectToDB = require('./config/db.config');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.text());

app.use('/api', apiRouter);
app.get('/ping', (req, res) => {
    return res.json({message: 'Problem Service is alive'});
});
app.use(errorHandler);
app.listen(PORT,async ()=>{
    console.log(`Problem service is running on port ${PORT}`);
    await connectToDB();
    console.log(" Successfully Connected to Database");
    
});
