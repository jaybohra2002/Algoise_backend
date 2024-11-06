const submissionProducer=require('../producers/submissionQueueProducer');
const SubmissionCreationError=require('../errors/submissionCreationError');
const fetchProblemDetails=require('../apis/problemAdminApi');
class SubmissionService{
    constructor(submissionRepository){
        this.submissionRepository=submissionRepository;

    }
    async  pingCheck(){
        return "pong";
    }
    async addSubmission(submissionPayload){
        const problemId=submissionPayload.problemId;
        const userId=submissionPayload.userId;
        const problemAdminApiResponse=fetchProblemDetails(problemId);
        if(!problemAdminApiResponse){
            throw new SubmissionCreationError("Failed to create a submission in repository");
        }
        const languageCodeStub=problemAdminApiResponse.data.codeStub.find(codeStub => codeStub.language.toLowerCase()===submissionPayload.language.toLowerCase());
        console.log(languageCodeStub);
        submissionPayload.code=languageCodeStub.startSnippet+"\n\n"+submissionPayload.code+"\n\n"+languageCodeStub.endSnippet;
        const submission=await this.submissionRepository.createSubmission(submissionPayload);
        if(!submission){
            throw new SubmissionCreationError("Failed to create a submission in repository");
        }
        const response = await submissionProducer({
            [submission._id]: {
                code: submission.code,
                language: submission.language,
                inputCase: problemAdminApiResponse.data.testCases[0].input,
                outputCase: problemAdminApiResponse.data.testCases[0].output,
                userId,
                submissionId:submission._id

            }
        });
        return {queueResponse:response,submission};
    }
    async updateSubmisssion(submissionId, submissionStatus){
        const data=await this.submissionRepository.updateSubmisssion(submissionId,submissionStatus);
        return data;
    }
}
module.exports={SubmissionService};
