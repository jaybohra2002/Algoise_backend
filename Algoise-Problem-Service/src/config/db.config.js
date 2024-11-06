const mongoose=require('mongoose');
const {ATLAS_DB_URL,NODE_ENV}=require('./server.config');
async function connectToDB(){
    if(NODE_ENV=="development"){
        try {
            await mongoose.connect(ATLAS_DB_URL);
        } catch (error) {
            console.log("Unable to connect to database");
            console.log(error);
        }
    }
}
module.exports=connectToDB;