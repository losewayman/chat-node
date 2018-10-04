var express = require('express');
var cheerio = require('cheerio');
var superagent = require('superagent');
var charset = require('superagent-charset');
var eventproxy = require('eventproxy');

charset(superagent);

var ep = new eventproxy();
var router = express.Router();

router.post('/api/manhua', function(req, res, next) {
    var obj = '';

    superagent
        .get('https://sacg.dmzj.com/mh/index.php')
        .charset('utf-8')
        .set({
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Referer': 'https://manhua.dmzj.com/tags/category_search/0-0-0-all-0-0-0-1.shtml',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
            'Host': 'sacg.dmzj.com',
            'Cookie': 'show_tip_1=0; type=qq; my=102131983%7C%25E5%2596%25A7%25E5%259A%25A3%25E3%2581%25AE%25E9%25A3%258E%7C%7Cb586d8babec96d157bd9a3ad6b9bd740; love=5f92185ec120b4914fac806267faf464; show_tip=0; Hm_lvt_645dcc265dc58142b6dbfea748247f02=1514382995; UM_distinctid=16479085970859-0d381f2c591d9d-5e442e19-144000-164790859724b8; RORZ_7f25_ulastactivity=882da4JN36jBal7AGd4jZOAe8S0OmsanHCXUOPaiTbMEqcd6SSI%2F; RORZ_7f25_smile=87D1; pt_198bb240=uid=Up9KsSj1jJ/GZKHSZsD9sw&nid=0&vid=fzTa6dGOALiMMg9mZD7PAw&vn=6&pvn=1&sact=1534121083542&to_flag=0&pl=J8gHIAMoYA2Eg1lD2m4zWQ*pt*1534121083542; pt_s_198bb240=vt=1534121083542&cad='
        })
        .query({
            c: 'category',
            m: 'doSearch',
            initial: 'all',
            status: req.body.status,
            reader_group: req.body.reader_group,
            zone: req.body.zone,
            type: req.body.type,
            p: req.body.p,
            callback: 'search.renderResult'
        })
        .end((err, respon) => {
            if (err) {
                console.log(err);
            } else {
                obj=respon.text;
                obj = obj.substring(20);
                obj = obj.substring(0, obj.length - 2);
                res.send(obj);

            }

        })


});

router.post('/index/bqbsearch',(req,res,next)=>{
    superagent
    .get("https://www.doutula.com/api/search")
    .charset('utf-8')
    .set({

    })
    .query({
        keyword:req.body.keyword,
        mime:0,
        page:req.body.page
    })
    .end((err, respon) => {
        if (err) {
            console.log(err);
        } else {
            obj=respon.text;
            res.send(obj);

        }

    })
})

    //getmove();
    // ep.after('one_end', 165, function(data) {
    //     console.log(data);
    // });

// function getmove() {
//     var url = "http://www.dytt8.net/";
//     superagent.get(url).charset('gb2312').end((err, res) => {
//         if (err) {
//             throw err;
//             console.log(err);
//         }
//         var $ = cheerio.load(res.text);
//         lefturl($);
//         console.log($(".co_content2 ul a").text());
//     })
// }

// function lefturl($) {
//     var linklist = $(".co_content2 ul a");
//     var list = [];
//     for (var i = 2; i < 167; i++) {
//         var url = "http://www.dytt8.net/" + linklist.eq(i).attr('href');
//         list.push(url);
//     }
//     //forall(list);
// }

// function forall(list) {
//     for (var i = 0; i < list.length; i++) {
//         superagent.get(list[i]).charset('gb2312').end((err, res) => {
//             if (err) {
//                 throw err;
//                 console.log(err);
//             }
//             var $ = cheerio.load(res.text);
//             var onehref = $("#Zoom table tbody tr td a").eq(0).attr('href');
//             ep.emit('one_end', onehref);
//         })
//     }

// }

module.exports = router;