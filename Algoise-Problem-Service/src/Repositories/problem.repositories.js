const NotFound = require('../errors/notfound.error');
const { Problem } = require('../models');
//const logger=require('../config/logger.config');
class ProblemRepository {

    async createProblem(problemData) {
        try {

            const problem = await Problem.create({
                title: problemData.title,
                description: problemData.description,
                codeStubs: problemData.codeStubs,
                testCases: (problemData.testCases) ? problemData.testCases : []
            });

            return problem;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getAllProblems() {
        try {
            const problems = await Problem.find({});
            return problems;
        } catch(error) {
            console.log(error);
            throw error;
        }
    }

    async getProblem(id) {
        try {
            const problem = await Problem.findById(id);
            if(!problem) {
                throw new NotFound("Problem", id);
            }
            return problem;
        } catch (error) {
            console.log(error);
            throw error;
        }
    } 

    async deleteProblem(id) {
        try {
            const deletedProblem = await Problem.findByIdAndDelete(id);
            if(!deletedProblem) {
                //logger.error(`Problem.Repository: Problem with id: ${id} not found in the db`);
                throw new NotFound("problem", id);
                
            }
            return deletedProblem;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    async updateProblem(id, problemData) {
        try {
            const updatedProblem = await Problem.findByIdAndUpdate(
                id,
                {
                    title: problemData.title,
                    description: problemData.description,
                    difficulty: problemData.difficulty,
                    testCases: (problemData.testCases) ? problemData.testCases : [],
                    editorial: problemData.editorial
                },
                { new: true, runValidators: true }
            );
    
            if (!updatedProblem) {
                console.log(`Problem.Repository: Problem with id: ${id} not found in the db`);
                throw new NotFound("problem", id);
            }
            return updatedProblem;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    


}

module.exports = ProblemRepository;