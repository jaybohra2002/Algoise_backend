const {Worker}=require('bullmq');
const redisConnection=require('../config/redisConfig');
const axios=require('axios');
function evaluationWorker(queueName){
    new Worker(queueName,async job=>{
        try {
            const response=await axios.post(process.env.SOCKET_URI,{
                userId:job.data.userId,
                payload:job.data.data
            });
            const submissionId=job.data.submissionId;
            const subStatus=job.data.response.status;
            const statusUpdate=await  this.SubmissionService.updateSubmisssion(submissionId,subStatus);
            console.log(statusUpdate);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    },{
        connection:redisConnection
    })
}
module.exports=evaluationWorker;
