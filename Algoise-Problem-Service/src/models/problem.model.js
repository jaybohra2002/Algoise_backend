const mongoose=require('mongoose');
const problemSchema=new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Title cannot be empty']
    },
    description:{
        type : String ,
        required : [true,'Description cannot be empty']
    },
    difficulty : {
        type : String,
        enum : ['easy','medium','hard'],
        default : 'easy'
    },
    testCases : [
        {
            input : {
                type : String ,
                required : true
            },
            output : {
                type : String ,
                required : true
            }
        }
    ],
    codeStubs:[{
        language:{
            type:String,
            required:true,
            enum:["CPP","JAVA","PYTHON"]
        },
        startSnippet:{
            type:String,
            required:true
        },
        endSnippet:{
            type:String,
            required:true
        },
        userSnippet:{
            type:String,
            required:true
        }
        
    }],

    editorial : {
        type : String
    }

});
const Problem =mongoose.model('problems',problemSchema);
module.exports=Problem;