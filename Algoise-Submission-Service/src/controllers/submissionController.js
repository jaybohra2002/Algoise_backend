const { tryCatch } = require("bullmq");
const InternalServerError = require("../errors/internalServer.error");

async function pingRequest (req,res){
    console.log(this.testService);
    const response=await this.TestService.pingCheck();
    res.send({data:response});
}
async function createSubmission(req,res){
    try {
        const response=await this.SubmissionService.addSubmission(req.body);
        return res.status(201).send({
            error:{},
            data:response,
            success:true,
            message:"Created Submission Successfully"
        });
    } catch (error) {
        throw new InternalServerError(error.message);

    }
    
}
module.exports={
    pingRequest,
    createSubmission


};