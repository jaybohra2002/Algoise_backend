const { createSubmission } = require("../../../controllers/submissionController");


async function submissionRoute(fastify, options){
    fastify.post('/submissions',createSubmission);
};
module.exports=submissionRoute;