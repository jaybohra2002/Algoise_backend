const fastify= require('fastify')({logger:true });
const serverConfig=require('./config/serverConfig');
const connectDb=require('./config/dbConfig');
const app=require('./app');
const {errorHandler}=require('./utils');
const evaluationWorker=require('./workers/evaluationWorker');
fastify.register(app);
fastify.setErrorHandler(errorHandler);
fastify.listen({port:serverConfig.PORT},async (err)=>{
    if(err){
        fastify.log.error(err);
        process.exit(1);
    }
    await connectDb();
    //console.log(this);
    evaluationWorker("EvaluationQueue");

    console.log(`Server running on port ${serverConfig.PORT}`);
});

