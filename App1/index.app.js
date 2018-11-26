
// $("#btnSubmit").click(function() {
//     var name = $('#name').val();
//     var phone = $('#phone').val();
//     var address = $('#address').val();
//     var note = $('#note').val();

//     axios.post('http://localhost:3000/app1/request', {
//         name: name,
//         phone: phone,
//         address:address,
//         note:note,
//     })
//         .then(function (response) {
//             alert("thành công");
//         })
//         .catch(function (error) {
//             alert("lỗi");
//         });
    
// });
var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password:'',
        loginVisible:true,
        requestsVisible:false,
        mapVisible:false,
        requests: [],
        token:"",
        refToken:"",
        geocoder : {lat: 10.7623314, lng: 106.6820053},
        address:"",
        idEdit:0,
        msg:"",
        err:"",

        refname:"",
        name:"",
        phone:"",
        address:"",
        note:"",

        numDeltas : 100,
        delay : 10,
        i : 0,
        deltaLat:0,
        deltaLng:0
    },
    methods: {
        login: function() {
            var self = this;
            self.err="";
            axios.post('http://localhost:3000/app1/login', {
                userName: self.userName,
                password: self.password,
            })
                .then(function (response) {
                    self.requestsVisible=true;
                    self.loginVisible=false;
                    self.token=response.data.access_token;
                    self.refToken=response.data.refresh_token;
                    self.refname=response.data.r
                    self.getAllRequest();
                })
                .catch(function (error) {
                    if (error.response.status===403){
                        self.err="Bạn không có quyền sử dụng chức năng này"
                    }else if (error.response.status===401) {
                        self.err="Sai tên đăng nhập hoặc mật khẩu"
                    }
                })
        },
        getAllRequest:function(){
            var self = this;
            axios.get('http://localhost:3000/api/request/getAllRequestApp1',{ headers: { token: self.token } })
                .then(function (response) {
                    self.requests=response.data;
                    self.refDataTable();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            self.getUserInfo();
                            resolve();
                        }).then(function () {
                            if (self.requestsVisible===true){
                                self.getAllRequest();
                            }
                        })
                        return;
                    }
                }).then(function () {
            });
        },
        refreshToken:function () {
            var self = this;
            console.log("ref");
            axios.post('http://localhost:3000/api/users/refreshToken', {
                refToken: self.refToken,
            })
                .then(function (response) {
                    self.token=response.data.access_token;
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.loginVisible=true;
                        self.requestsVisible=false;
                        self.mapVisible=false;
                    }
                }).then(function () {
            })
        },
        getUserInfo:function(){
            var self = this;
            console.log("ref");
            axios.post('http://localhost:3000/api/request/getUserInfo', {
                refname: self.userName,
            })
                .then(function (response) {
                    self.name=response.data.userName;
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.loginVisible=true;
                        self.requestsVisible=false;
                        // self.mapVisible=false;
                    }
                }).then(function () {
            })
        }
        
    }        
})