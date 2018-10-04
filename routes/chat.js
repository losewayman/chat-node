var express = require('express');
var router = express.Router();
var socket_io = require('socket.io');
var db = require('../database/db.js');

router.socket = function(server) {
  var io = socket_io(server);
  var roomlist={};
  var room='';
  io.on('connection', function(socket) {  
    // if (!roomInfo[roomID]) {
    //     roomInfo[roomID] = [];
    //   }
    //   roomInfo[roomID].push(user);
    
    socket.on('join',function(room){  //页面初始化加入房间
        socket.join(room);
    })

    socket.on('leave',function(leave){
        socket.leave(leave.room);
        socket.broadcast.to(leave.room).emit('leaveroom',leave.name);
    })

    socket.on('newjoin',function(obj){   //新建房间
        socket.join(obj.room);
        socket.broadcast.to(obj.room).emit('newname',obj.name);
        db.update('website','login',{'user':obj.user},{'grouplist':obj.grouplist},(error,result)=>{   //更新用户群组列表
            if(error){
                console.log(error);
            }
        })
        db.find('website','groups',{'room':obj.room},(err,res)=>{
            if(err){
                console.log(error);
            }else{
                
                if(res.result.length!=0){   //此群组已存在，更新用户表
                    var d=res.result[0].userlist;
                    d.push(obj.name);
                    db.update('website','groups',{room:obj.room},{userlist:d},(error,result)=>{
                        if(error){
                            console.log(error);
                        }
                    })
                }else{   //此群组不存在，插入新用户
                    var d=[];
                    d.push(obj.name);
                    db.insert('website','groups',{'room':obj.room,'userlist':d},(error,result)=>{
                        if(error){
                            console.log(error);
                        }
                    })
                }
            }
        })
        // db.upsert('website','group',{'groupname':obj.roomname,'userlist':obj.user},(error,result)=>{
        //     console.log(result);
        //     if(error){
        //         console.log(error);
        //     }
        // })
    });
    socket.on('message', function (msg) {
        // 验证如果用户不在房间内则不给发送
        io.sockets.in(msg.room).emit('msg', msg);
        db.insert('website','message',msg,(err,result)=>{
            if(err){
                console.log(err);
            }
        })
      });

    //   num++;    //每有一个连接，人数+1
    //   socket.on('come',function(data){    //监听聊天室页面
    //       io.sockets.emit('number',num);   //人数更新，向全体广播
    //       socket.emit("room",socket.id);   //向连接者发送id
    //   })
    //   socket.on("sendmsg", function(data) { //监听前端发送消息事件，data是发送的信息
    //       // 使用 emit 发送消息，broadcast 表示 除自己以外的所有已连接的socket客户端。
    //       console.log(data);
    //       socket.broadcast.emit("receivemsg", data); //向前端页面除了连接者发送消息
    //   });
    //   socket.on("disconnect", function(socket) {
    //       num--;
    //       io.sockets.emit('number',num);
    //       console.log(num);
    //   });
    //   socket.on('room',function(data){
    //     socket.join('o');
    //       socket.join(data); console.log(socket);
    //   })
  });
}

router.post('/grouplist',function(req,res,next){
    if(req.session.user){
        var us={'user':req.session.user}
        db.find('website','login',us,function(error,result){
        if(error){
            var obj = {
                'status': 'no',
                'msg': "查询失败",
                'err': err
            }
            res.send(obj);
        }else{
            var obj={
                'status':'yes',
                'user':result.result[0].user,
                'name':result.result[0].name,
                'grouplist':result.result[0].grouplist,
            }
            res.send(obj);
        }
    })
    }
    else{
        var obj={
            'status':'no'
        }
        res.send(obj);
    }
    
})


router.post('/roommes',function(req,res,next){
    db.findlimit('website','message',{'room':req.body.room},30,(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.send(data.result.reverse());
        }
    })
})

router.post('/roomuser',function(req,res,next){
    db.find('website','groups',{'room':req.body.room},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            res.send(data.result[0].userlist);
        }
    })
})


router.post('/groupout',function(req,res,next){
    db.update('website','login',{'user':req.body.user},{'grouplist':req.body.grouplist},(error,result)=>{
        if(error){
            console.log(error);
        }
    })
    db.update('website','groups',{'room':req.body.nowroom},{'userlist':req.body.userlist},(error,result)=>{
        if(error){
            console.log(error);
        }
    })
})


module.exports = router;
