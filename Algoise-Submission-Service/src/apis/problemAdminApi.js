const {PROBLEM_ADMIN_SERVICE_URL}=require('../config/serverConfig');
const axiosInstance=require('../config/axiosInstance');
const PROBLEM_ADMIN_URL=`${PROBLEM_ADMIN_SERVICE_URL}/api/v1`;
async function fetchProblemDetails(problemId){
    try {
        const uri=`${PROBLEM_ADMIN_URL}/problem/${problemId}`;
        const response =await axiosInstance.get(uri);
        console.log("Api response: ",response);
        return response.data;
    } catch (error) {
        console.log("Something went wrong when fetchng the problem details");
        console.log(error);
    }
    
}
module.exports=fetchProblemDetails;