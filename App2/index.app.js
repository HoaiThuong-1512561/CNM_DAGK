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
            axios.post('http://localhost:3000/app2/login', {
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
                    alert(error);
                }).then(function () {
                    self.getAllRequest();
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
            }, false);
        },
        refDataTable:function () {
            new Promise(function (resolve,reject) {
                $('#tableDH').DataTable().destroy();
                resolve();
            }).then(function () {
                var table = $('#tableDH').DataTable();
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
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': self.address}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    self.geocoder.lat = results[0].geometry.location.lat();
                    self.geocoder.lng = results[0].geometry.location.lng();
                    var myOptions={
                        zoom:16,
                        center: self.geocoder,
                        mapTypeId:google.maps.MapTypeId.ROADMAP
                    }
                    var map = new google.maps.Map(document.getElementById('map'),myOptions);
                    marker = new google.maps.Marker({
                        position: self.geocoder,
                        map: map,
                        title: "Latitude:"+geocoder.lat+" | Longitude:"+geocoder.lng
                    });
                    google.maps.event.addListener(map, 'click', function(event) {
                        var result = [event.latLng.lat(), event.latLng.lng()];
                        self.transition(result);
                    });
                }else {
                    alert("Không tìm thấy địa chỉ");
                    self.address="18/13 Trần Văn Thành"
                }
            });
        },
        editGeocoder:function () {
            // $('#tableDH').DataTable().row().select();
            if ($('#tableDH').DataTable().row('.selected').data()===undefined){
                return
            }else {
                var self=this;
                self.idEdit=parseInt($('#tableDH').DataTable().row('.selected').data()[0]);
                self.mapVisible=true;
                self.requestsVisible=false;
                new Promise(function (resolve,reject) {

                    var i;
                    for (i=0;i<self.requests.length;i++){
                        if (self.requests[i].id_request===parseInt($('#tableDH').DataTable().row('.selected').data()[0])){
                            self.address=self.requests[i].address;

                            resolve();
                        }
                    }
                }).then(function () {
                    self.initMap();
                })
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



