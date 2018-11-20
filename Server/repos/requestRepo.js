var db = require('../fn/mysql-db');
var userRepo= require("./userRepo");
exports.loadAll = () => {
    var sql = 'select * from request order by time desc';
    return db.load(sql);
};
exports.loadAllRequestApp1=()=>{
    var sql = `select id_request,name,phone,address,note,status ,DATE_FORMAT(time, "%d/%m/%Y %H:%i:%s")AS time from request where status='${1}'`;
    // SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS niceDate
    // FROM
    //console.log(sql)
    return db.load(sql);
}

exports.loadAllRequestApp2=()=>{
    var sql = `select id_request,name,phone,address,note,status ,DATE_FORMAT(time, "%d/%m/%Y %H:%i:%s")AS time,lat,lng from request where status='${2}'`;
    //onsole.log(sql);
    return db.load(sql);
}

exports.loadUserInfo=(userName)=>{
    var sql = `select * from users where username = '${"caothang3"}'`;
    //console.log(sql);
    return db.load(sql);
}
exports.updateGeocoder=(id,lat,lng)=>{
    var sql = `update request set lat = '${lat}',
                                    lng = '${lng}',
    								status =  '${2}'
    								where id_request ='${id}'`;

    return db.insert(sql);
}

exports.updateDriverLocation=(id,lat,lng)=>{
   var sql =`update users set lat = '${lat}',
                             lng='${lng}'
                              where ID='${id}'`;

   return db.insert(sql);
}
exports.updateUserStatus = (id,status)=>{
    console.log("---------------------sdsadsads---------------------------------");
     var sql = `update users set status = '${status}'
                where id = '${id}'`;

     console.log(sql);
     return db.insert(sql);
}
exports.updateRequestStatus = (id,status)=>{
    if (status===3){
        var sql = `update request set status = '${status}'
                where id_request = '${id}' and status='2'`;
    }
    if (status===4){
        var sql = `update request set status = '${status}'
                where id_request = '${id}' and status='3'`;
    }
    return db.insert(sql);
}
