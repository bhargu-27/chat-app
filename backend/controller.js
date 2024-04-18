const threadModel = require('./models/threadModel')
const messageModel = require('./models/messageModel')
const createThread=async(req,res)=>{
    try{
        let users=[
            "patient",
            "doctor"
        ]
        let {subject}=req.body;
        let thread= new threadModel({
            users,
            subject
        })
        await thread.save();
        return res.status(200).send({
            isSuccess:true,
            mess:"Thread created!",
            thread
        })
    } catch(err){
        return res.status(500).send({
            isSuccess:false,
            message:err.message
        })
    }
}
const getAllThreads = async (req, res) => {
    try {
        let threads = await threadModel.find({});
        let threadMessages = [];

        await Promise.all(threads.map(async (thread) => {
            let messages = await messageModel.find({ threadId: thread._id });
            let threadMsgObj = {
                threadId: thread._id,
                subject:thread.subject,
                messages
            };
            threadMessages.push(threadMsgObj);
        }));

        return res.status(200).send({
            isSuccess: true,
            threadMessages
        });
    } catch (err) {
        return res.status(500).send({
            isSuccess: false,
            message: err.message
        });
    }
};

const sendMessage=async(req,res)=>{
    try{
        let {message,user,threadId}=req.body;
        let messageObj= new messageModel({
            message,
            time:new Date(),
            threadId,
            user
        })
        await messageObj.save();
        return res.status(201).send({
            isSuccess:true,
            message:'Message sent'
        })
    }catch(err){
        return res.status(500).send({
            isSuccess:false,
            message:err.message
        })
    }
}
module.exports={
    getAllThreads,
    createThread,
    sendMessage
}
