async function v1Route(fastify,options){
    fastify.register(require('./submissionRoutes'),{prefix:'/v1'});
    
}
module.exports=v1Route;