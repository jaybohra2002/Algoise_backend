const Submission =require('../models/submissionModel');
class SubmissionRepository{
    constructor(){
        this.submissionModel=Submission;

    }
    async createSubmission(submissionPayload){
        try {
            const response=await this.submissionModel.create(submissionPayload);
            return response;
        } catch (error) {
            throw error;
        }
        
    }
    async updateSubmission(submissionId,submissionStatus){
        try {
            const response=await this.submissionModel.findByIDAndUpdate(submissionId,{
                status:submissionStatus
            },{ new: true, runValidators: true });
            return response;
        } catch (error) {
            throw error;
        }
        
    }

}
module.exports={SubmissionRepository};