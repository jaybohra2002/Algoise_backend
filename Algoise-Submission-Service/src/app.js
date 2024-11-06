const fastifyPlugin=require('fastify-plugin');
const servicePlugin=require('./services/servicePlugin');
const repositoryPlugin=require('./repository/repositoryPlugin');

async function app(fastify,options){
    await fastify.register(require('@fastify/cors'));
    await fastify.register(repositoryPlugin);
    //fastify.register(require('./routes/testRoutes'),{prefix:'/test'});
    await fastify.register(servicePlugin);
    await fastify.register(require('./routes/api/apiRoutes'));
}
module.exports=fastifyPlugin(app);