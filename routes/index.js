var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');


// ==================================
// DB接続
// ==================================
mongoose.connect('mongodb://localhost/todo', (err) => {
  if (err) {
    console.log(`失敗 ${err}`);
  } else {
    console.log('成功');
  }
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', {title: 'Express'});
});

// ==================================
// 初回読み込み
// ==================================
router.get('/firstload', (req, res, next) => {
  const TodoData = mongoose.model('TodoSchema');
  const todoData = new TodoData();
  todoData.taskID = req.body.taskID; 
  console.log(req.body.taskID);

  TodoData.find({taskID:{$exists:true}},(err, dbData) =>{
    if(err){
      console.log(err);
    }
    res.send(dbData);
  });
});

// ==================================
// 初回読み込み時にtaskIDを再割り振り
// ==================================
router.put('/firstupdate', (req, res, next) => {
  const TodoData = mongoose.model('TodoSchema');
  const todoData = new TodoData();
  todoData.taskID = req.body.taskID; 
  const _id = req.body._id;

  console.log('==============================');
  console.log('[FIRST_LOAD]:' + _id);
  TodoData.update( { _id: _id}, { $set:{ taskID: todoData.taskID } }, (err, data) => {});
});

// ==================================
// task 登録
// ==================================
router.post('/', (req, res, next) => {
  console.log('++++++++++++++++++++++++++++++');

  const TodoData = mongoose.model('TodoSchema');
  const todoData = new TodoData();
  todoData.task = req.body.task;
  todoData.progress = req.body.progress;
  todoData.taskID = req.body.taskID;

  console.log('[INSERT] => ' + todoData.task);

  todoData.save((err) => {
    if (err) {
      console.log(`Insert Fail!! ${err}`);
    }
  });
  res.status(200).send({msg: todoData.task});
});

// ==================================
// task 更新
// ==================================
router.put('/update', (req, res) => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  
  const TodoData = mongoose.model('TodoSchema');
  const todoData = new TodoData();
  todoData.task = req.body.task;
  todoData.progress = req.body.progress;
  todoData.taskID = req.body.taskID;

  TodoData.update(
    {taskID: todoData.taskID},
    {$set:{
      task: todoData.task,
      progress: todoData.progress
      }
    },(err, data) => {
        console.log('[UPDATE] => ' + todoData.task );
      });
});

// ==================================
// task 削除
// ==================================
router.delete('/del', (req, res) => {
  console.log('------------------------------');

  const TodoData = mongoose.model('TodoSchema');
  const taskID = req.body.taskID;
  console.log('[DEL_ID] => ' + taskID);
  
  TodoData.remove({ taskID: taskID }, (err) => {});
});


router.put('/updateProgress', (req, res) => {
  const TodoData = mongoose.model('TodoSchema');
  const todoData = new TodoData();
  todoData.progress = req.body.progress;

  console.log('=>=>=>=>=>=>=>=>=>=>=>=>=>=>=>');
  console.log('[CHANGE_TO] => ' + todoData.progress);

  TodoData.update(
    {$set:{
      progress: todoData.progress
      }
    },(err, data) => {
        console.log(req.body);
      });

});

module.exports = router;