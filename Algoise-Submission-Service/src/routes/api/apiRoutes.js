async function apiRoute(fastify, options){
    fastify.register(require('./v1/v1Routes'),{prefix:'/api'});
}
module.exports=apiRoute;