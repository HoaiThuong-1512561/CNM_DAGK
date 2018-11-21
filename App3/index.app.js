window.onload = function() {
    vm.setupSSE();
    //vm.initMap();
    // loadCategories();
};
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
        driverName:'caothien',
        refToken:"",
        geocoder : {lat: 10.7623314, lng: 106.6820053},
        address:"",
        idEdit:0,
        msg:"",
        err:"",
        geocoderSrc:{lat: 10.7624229, lng: 106.6776543},
        geocoderDes:{lat: 10.7624229, lng: 106.6790081},
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
            axios.post('http://localhost:3000/app3/login', {
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
        getAllRequest:function(){
            var self = this;
            axios.get('http://localhost:3000/api/request/getAll',{ headers: { token: self.token } })
                .then(function (response) {
                    self.requests=response.data;
                    self.refDataTable();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
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
        setupSSE : function() {
            var self = this;
            if (typeof(EventSource) === 'undefined') {
                console.log('not support');
                return;
            }

            var add = new EventSource('http://localhost:3000/requestAddedEvent');

            add.onerror = function(e) {
                console.log('error: ' + e);
            }
            add.addEventListener('REQUEST_ADDED', function(e) {
                var data = JSON.parse(e.data);
                self.requests.push(data);
                self.refDataTable();
                $('#tableDH tbody').on( 'click', 'tr', function () {
                    if ( $(this).hasClass('selected') ) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                } );
            }, false);
            var remove = new EventSource('http://localhost:3000/requestRemoveEvent');
            remove.onerror = function(e) {
                console.log('error: ' + e);
            }
            remove.addEventListener('REQUEST_REMOVE', function(e) {
                var data = JSON.parse(e.data);
                self.getAllRequest();
                self.refDataTable();
            }, false);

            var updateLocale = new EventSource('http://localhost:3000/driverLocale');
            updateLocale.onerror = function(e) {

                console.log('error: ' + e);
            }
            updateLocale.addEventListener('DRIVER_LOCALE', function(e) {
                var data = JSON.parse(e.data);
                console.log(data);
                self.getUserInfo(self.driverName);
            }, false);


        },
        refDataTable:function () {
            new Promise(function (resolve,reject) {
                $('#tableDH').DataTable().destroy();
                resolve();
            }).then(function () {
                var table = $('#tableDH').DataTable({
                    "order": [[ 0, "desc" ]]
                } );
                $('#tableDH tbody').on( 'click', 'tr', function () {
                    if ( $(this).hasClass('selected') ) {
                        $(this).removeClass('selected');
                    }
                    else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                } );
            })
        },
        initMap:function() {

            var self=this;
            var myOptions={
                zoom:16,
                center: self.geocoderSrc,
                mapTypeId:google.maps.MapTypeId.ROADMAP
            }
            var map = new google.maps.Map(document.getElementById('map'),myOptions);
            directionsService = new google.maps.DirectionsService();    // Khởi tạo DirectionsService - thằng này có nhiệm vụ tính toán chỉ đường cho chúng ta.
            directionsDisplay = new google.maps.DirectionsRenderer({map: map});    // Khởi tạo DirectionsRenderer - thằng này có nhiệm vụ hiển thị chỉ đường trên bản đồ sau khi đã tính toán.

            directionsService.route({    // hàm route của DirectionsService sẽ thực hiện tính toán với các tham số truyền vào
                origin: self.geocoderSrc,
                destination: self.geocoderDes,    // điểm đích
                travelMode: "DRIVING"   // phương tiện di chuyển
            }, function(response, status) {    // response trả về bao gồm tất cả các thông tin về chỉ đường
                if (status === google.maps.DirectionsStatus.OK) {
                    directionsDisplay.setDirections(response); // hiển thị chỉ đường trên bản đồ (nét màu đỏ từ A-B)
                } else {
                    window.alert('Request for getting direction is failed due to ' + status);    // Hiển thị lỗi
                }
            });


        },
        getUserInfo: function(userName){
            var self = this;
            console.log(userName);
            axios.post('http://localhost:3000/api/request/getUserInfo',{userName:userName},{ headers: { token: self.token }})
                .then(function (response) {
                    self.geocoderSrc.lat=parseFloat(response.data[0].lat);
                    self.geocoderSrc.lng=parseFloat(response.data[0].lng);
                    console.log(response.data[0].lat);
                }).catch(function (error) {
                if (error.response.status===401){
                    new Promise(function (resolve) {
                        self.refreshToken();
                        resolve();
                    }).then(function () {
                        self.getUserInfo(userName);
                    })
                    return;
                }else {

                }
            }).then(function () {
                if (self.mapVisible===true){
                    self.initMap();
                }
            });
        },
        editGeocoder:function () {
            if ($('#tableDH').DataTable().row('.selected').data()[6]==="Đang di chuyển"){
                var self=this;
                self.idEdit=parseInt($('#tableDH').DataTable().row('.selected').data()[0]);
                self.mapVisible=true;
                self.requestsVisible=false;

                new Promise(function (resolve,reject) {

                    var i;
                    for (i=0;i<self.requests.length;i++){
                        if (self.requests[i].id_request===parseInt($('#tableDH').DataTable().row('.selected').data()[0])){
                            self.driverName=self.requests[i].username;
                            self.getUserInfo(self.requests[i].username);
                            self.geocoderDes.lat=self.requests[i].lat;
                            self.geocoderDes.lng=self.requests[i].lng;
                            self.address=self.requests[i].address;
                            resolve();
                        }
                    }
                }).then(function () {
                    setTimeout(() => {
                        self.initMap();
                    }, 1000);
                })
            }else {
                console.log($('#tableDH').DataTable().row('.selected').data()[6]);
            }
        },
        transition:function (result) {
            var self=this;
            self.i = 0;
            self.deltaLat = (result[0] - self.geocoder.lat)/self.numDeltas;
            self.deltaLng = (result[1] - self.geocoder.lng)/self.numDeltas;
            self.moveMarker();
        },
        moveMarker:function () {
            var self=this;
            self.msg="";
            self.err=""
            self.geocoder.lat += self.deltaLat;
            self.geocoder.lng += self.deltaLng;
            var latlng = new google.maps.LatLng(self.geocoder.lat, self.geocoder.lng);
            marker.setTitle("Latitude:"+self.geocoder.lat+" | Longitude:"+self.geocoder.lng);
            marker.setPosition(latlng);
            if(self.i!=self.numDeltas){
                self.i++;
                setTimeout(self.moveMarker, self.delay);
            }
        },
        updateGeocoder:function () {
            var self=this;
            axios.post('http://localhost:3000/api/request/updateGeocoderRequest', {
                id: self.idEdit,
                lat: self.geocoder.lat,
                lng: self.geocoder.lng,
            },{ headers: { token: self.token } })
                .then(function (response) {
                    self.msg="Cập nhật thành công";
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            resolve();
                        }).then(function () {
                            if (self.mapVisible===true){
                                self.updateGeocoder();
                            }
                        })
                        return;
                    }else {
                        self.err="Không thể cập nhật";
                    }
                }).then(function () {

            });
        }
        ,
        closeMap:function () {
            var self=this;
            self.mapVisible=false;
            self.requestsVisible=true;
            self.getAllRequest();
            self.msg="";
            self.err=""
        }
    }
});



