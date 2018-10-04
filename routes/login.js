var express = require('express');
var db = require('../database/db.js');
var router = express.Router();
 
router.post('/sign',function(req,res,next){    //注册
    var where={
        user:req.body.user,
        name:req.body.name,
    }
    // db.update('website','login',{name:'222'},{pass:'98852'},function(err,result){
    //     console.log(err,result);
    //     res.send(result);
    // });

    db.find('website','login',where,function(err,result){    //查找账号，用户名重复
        if(err){
            var obj = {
                'status': '0',
                'msg': "注册失败",
                'err': err
            }
            res.send(obj);
        }
        else{
            if(result.result.length!=0){
                var obj = {
                    'status': '0',
                    'msg': "账号或昵称已存在"
                }
                res.send(obj);
            }
            else{
                db.insert('website','login',req.body,function(err,result){    //账号不存在，存入新账号
                    if(err){
                        var obj = {
                            'status': '0',
                            'msg': "注册失败",
                            'err': err
                        }
                        res.send(obj);
                    }else{
                        res.send(result);
                    }
                })
                db.find('website','groups',{'room':req.body.grouplist[0]},(err,res)=>{   //查找该群组
                    console.log(res,res.result.length);
                    if(err){
                        console.log(error);
                    }else{ 
                        if(res.result.length!=0){   //此群组已存在，更新用户表
                            var d=res.result[0].userlist;
                            d.push(req.body.name);
                            db.update('website','groups',{room:req.body.grouplist[0]},{userlist:d},(error,result)=>{
                                if(error){
                                    console.log(error);
                                }
                            })
                        }else{   //此群组不存在，插入新用户
                            var d=[];
                            d.push(req.body.name);
                            db.insert('website','groups',{room:req.body.grouplist[0],userlist:d},(error,result)=>{
                                if(error){
                                    console.log(error);
                                }
                            })
                        }
                    }
                })
            }
        }
    })
    
})

router.post('/log',function(req,res,next){
    db.find('website','login',req.body,function(err,result){
        if(err){
            var obj = {
                'status': '0',
                'msg': "登录失败",
                'err': err
            }
            res.send(obj);
        }else{
            req.session.user = result.result[0].user;
            req.session.name = result.result[0].name;
            var obj={
                name:result.result[0].name,
                user:result.result[0].user,
            }
            res.send(obj);
        }
    })
})


router.post('/loginout',function(req,res,next){
    req.session.destroy(function(err) {
        if(err){
          console.log(err);
        }
        res.clearCookie('ljhwebsite');
        var obj={
            'msg':"退出登陆成功",
            'status':'1'
        }
        res.send(obj);
      });
        
})


router.post('/islogin',function(req,res,next){
    if(req.session.user || req.session.user===''){
        var obj={
            'status':'yes',
            'user':req.session.user,
            'name':req.session.name
        }
        res.send(obj);
    }else{
        var obj = {
            status:'no'
        }
        res.send(obj);
    }
})
module.exports = router;