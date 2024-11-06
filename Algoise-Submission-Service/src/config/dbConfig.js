const mongoose=require('mongoose');
const {ATLAS_DB_URL,NODE_ENV}=require('./serverConfig');
async function connectToDB(){
    if(NODE_ENV=="development"){
        try {
            await mongoose.connect(ATLAS_DB_URL);
            console.log("Successfully Connected to Db");
        } catch (error) {
            console.log("Unable to connect to database");
            console.log(error);
        }
    }
}
module.exports=connectToDB;