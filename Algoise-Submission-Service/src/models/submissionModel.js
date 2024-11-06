
const mongoose=require('mongoose');
const submissionSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:[true,'UserId for the Submission is missing']
    },
    problemId:{
        type:String,
        required:[true,'ProblemId for the Submission is missing']
    },
    code:{
        type:String,
        required:[true,'Code for the Submission is missing']
    },
    language:{
        type:String,
        required:[true,'Code for the Submission is missing']
    },
    status:{
        type:String,
        enum:["Pending","TLE","MLE","WA","RE","Success"],
        default:"Pending"
    }

});
const Submission=new mongoose.model('Submission',submissionSchema);
module.exports=Submission;
