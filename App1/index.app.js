
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
    }        
})