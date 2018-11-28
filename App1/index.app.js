
var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password:'',
        loginVisible:true,
        requestsVisible:false,

        token:"",
        refToken:"",

        msg:"",
        err:"",

        name:"",
        phone:"",
        address:"",
        note:"",


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
                })
                .catch(function (error) {
                    if (error.response.status===403){
                        self.err="Bạn không có quyền sử dụng chức năng này"
                    }else if (error.response.status===401) {
                        self.err="Sai tên đăng nhập hoặc mật khẩu"
                    }
                })
        },
        addRequest:function(){
            var self = this;
            console.log(self.token);
            axios.post('http://localhost:3000/api/request/addRequest',{
                name: self.name,
                phone: self.phone,
                address:self.address,
                note:self.note,
            },{ headers: { token: self.token } })
                .then(function (response) {
                    self.msg="Thêm request thành công"
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            self.addRequest();
                            resolve();
                        }).then(function () {

                        })
                        return;
                    }
                }).then(function () {
            });
        },
        refreshToken:function () {
            var self = this;
            console.log("refeshToken");
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

                    }
                }).then(function () {
            })
        },

    }
});
