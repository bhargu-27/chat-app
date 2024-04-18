let express = require('express');
let router = express.Router();
let {
    getAllThreads,
    createThread,
    sendMessage
}=require('./controller');
router.get('/getThreadsMessages',getAllThreads);
router.post('/createThread',createThread);
router.post('/sendMessage',sendMessage);
module.exports=router;