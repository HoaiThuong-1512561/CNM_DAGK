var md5 = require('crypto-js/md5');

var db = require('../fn/mysql-db');

exports.add = userEntity => {
    var md5_pwd = md5(userEntity.password);
    var sql = `insert into users(username, password,permission, SDT) values('${userEntity.username}', '${md5_pwd}', ${userEntity.permission},'${userEntity.SDT}')`;
    return db.insert(sql);
}
exports.addRequest = userEntity => {
    var sql = `insert into request(name, phone, address, note,time,status) values('${userEntity.name}', '${userEntity.phone}', '${userEntity.address}', '${userEntity.note}','${userEntity.time}','${userEntity.status}')`;
    return db.insert(sql);
}
exports.login = loginEntity => {
    var md5_pwd = md5(loginEntity.password);
	var sql = `select * from users where username = '${loginEntity.userName}' and password = '${md5_pwd}'`;
	return db.load(sql);
};
exports.checkUserName=userName=>{
    var sql = `select * from users where username = '${userName}'`;
    return db.load(sql);
}
exports.getUserInfo=userId=>{
    var sql = `select * from users where ID = '${userId}'`;
    return db.load(sql);
}

exports.getUserStatus=userName=>{
    var sql = `select * from users where username = '${userName}'`;
    return db.load(sql);
}







