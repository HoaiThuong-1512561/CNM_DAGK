var db = require('../fn/mysql-db');

exports.loadAll = () => {
    var sql = 'select * from request';
    return db.load(sql);
};
exports.loadAllRequestApp1=()=>{
    var sql = `select id_request,name,phone,address,note,status ,DATE_FORMAT(time, "%d/%m/%Y %H:%i:%s")AS time from request where status='${1}'`;
    // SELECT *, DATE_FORMAT(date,'%d/%m/%Y') AS niceDate
    // FROM
    console.log(sql)
    return db.load(sql);
}
exports.updateGeocoder=(id,lat,lng)=>{
    var sql = `update request set lat = '${lat}',
                                    lng = '${lng}',
    								status =  '${2}'
    								where id_request ='${id}'`;

    return db.insert(sql);
}