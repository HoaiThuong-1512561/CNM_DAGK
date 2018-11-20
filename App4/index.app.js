
window.onload = function () {
    //vm.setupSSE();
    //vm.initMap();
    // loadCategories();
};
var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password: '',
        SDT: '',  
        loginVisible: true,
        requestsVisible: false,
        mapVisible: false,
        dialogVisible: false,
        //endTripVisible: false,
        request: {},
        token: "",
        refToken: "",
        userId:0,
        userStatus:"",
        driverLocation : {lat: 10.762418,lng: 106.681197},
        address: "",
        idEdit: 0,
        msg: "",
        err: "",

        request2:{},
        numDeltas: 100,
        delay: 10,
        i: 0,

    },
    methods: {
        login: function () {
            var self = this;
            axios.post('http://localhost:3000/app4/login', {
                    userName: self.userName,
                    password: self.password,
                })
                .then(function (response) {
                    self.requestsVisible = false;
                    self.loginVisible = false;
                    //self.endTripVisible=false;
                    self.mapVisible=true;                
                    self.userId = response.data.user.ID;
                    self.userStatus = response.data.user.Status;
                    self.token = response.data.access_token;
                    self.refToken = response.data.refresh_token;
                    requestArr = self.request;
                    setTimeout(() => {
                        self.initMap(requestArr);
                    }, 1000);
                    //self.getUserInfo(self.userName);

                })
                .catch(function (error) {
                    alert(error);
                })
        },
        getUserInfo: function(userName){
            var self = this;
            axios.get('http://localhost:3000/api/request/getUserInfo', {

                headers: {
                    token: self.token
                }
                })
                .then(function (response) {
                    self.SDT= response.data[0].SDT;
                    self.setupSSE();
                })
                .catch(function (error) {
                    alert(error);
                }).then(function () {

                })
        },
        notifyRequestTimeout: function(){
            self=this;
            requestArr= self.request;
            self.request2=self.request;
            self.updateRequestStatus(3);
            if (self.err===''){
                self.mapVisible=true;
                self.requestsVisible=false;
                self.dialogVisible=false;
                setTimeout(() => {
                    self.initMap(requestArr);
                }, 1000);
            }




        },
        updateUserStatus: function(){
            var self=this;
            let status;
            self.dialogVisible=false;

            if(self.userStatus==="READY")
                status="BUSY";
            else
                status="READY";

            axios.post('http://localhost:3000/api/request/updateUserStatus', {
                ID: self.userId,
                Status: status,
            },{ headers: { token: self.token } })
                .then(function (response) {
                    self.userStatus=status;
                    self.msg="Đổi trạng thái thành công";
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            resolve();
                        }).then(function () {
                            self.updateUserStatus();
                        })
                        return;
                    }else {
                            self.err="Đã xảy ra lỗi khi update trạng thái";
                    }
                }).then(function () {

            });
        },
        updateRequestStatus:function (status) {
            var self=this;
            axios.post('http://localhost:3000/api/request/updateRequestStatus', {
                id: self.request2.id_request,
                status: status,
            },{ headers: { token: self.token } })
                .then(function (response) {
                    if (status===3){
                        self.msg="Nhận request thành công";
                    }
                    if (status===4){
                        self.msg="Hoàn thành request";
                    }
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        new Promise(function (resolve) {
                            self.refreshToken();
                            resolve();
                        }).then(function () {
                            self.updateRequestStatus(status);
                        })
                        return;
                    }else if (error.response.status===406) {
                        if (status===3){
                            self.err="Đã có người nhận vui lòng đợi request khác";
                        }
                    }
                }).then(function () {

            });
        },
        updateDriverLocation: function(){
            var self=this;
            axios.post('http://localhost:3000/api/request/updateDriverLocationRequest', {
                ID: self.userId,
                lat: self.driverLocation.lat,
                lng: self.driverLocation.lng,
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
                                self.updateDriverLocation();
                            }
                        })
                        return;
                    }else {
                        self.err="Không thể cập nhật";
                    }
                }).then(function () {

            });
        },
        refreshToken: function () {
            var self = this;
            console.log("ref");
            axios.post('http://localhost:3000/api/users/refreshToken', {
                    refToken: self.refToken,
                })
                .then(function (response) {
                    self.token = response.data.access_token;
                })
                .catch(function (error) {
                    if (error.response.status === 401) {
                        self.loginVisible = true;
                        self.requestsVisible = false;
                        self.mapVisible = false;
                    }
                })
        },
        setupSSE: function () {
            var self = this;
            if (typeof (EventSource) === 'undefined') {
                console.log('not support');
                return;
            }

            var add = new EventSource('http://localhost:3000/driverReceive?userName='+self.userName);

            add.onerror = function (e) {
                console.log('error: ' + e);
            }
            add.addEventListener('DRIVER_RECEIVE', function (e) {
                var data = JSON.parse(e.data);
                self.request=data;
                if (self.mapVisible===false){
                    self.dialogVisible=true;
                }
                //self.notifyRequestTimeout();
                console.log(data);
            }, false);
        },
        refDataTable: function () {
            new Promise(function (resolve, reject) {
                $('#tableDH').DataTable().destroy();
                resolve();
            }).then(function () {
                var table = $('#tableDH').DataTable();
                $('#tableDH tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            })
        },
        initMap: function (requestArr) {
            self=this;
            console.log(self.mapVisible);
            var latlng = new google.maps.LatLng(10.762622, 106.660172);
            var options = {
                center:latlng,
                zoom: 12,
            }
            console.log(self.userStatus);
            var map = new google.maps.Map(document.getElementById("map"),options);

            // Add marker
            var marker;

            function addMarker(props) {
                marker = new google.maps.Marker({
                    position: props.coords,
                    map: map,

                });

                if (props.iconImage) {
                    marker.setIcon(props.iconImage);
                }

                if (props.contentString) {
                    var infoWindow = new google.maps.InfoWindow({
                        content: props.contentString
                    })

                    marker.addListener('click', function () {
                        infoWindow.open(map, marker);
                    });
                }
            }

            var markers = [
           {
               // Passenger location
               coords:{
                lat: requestArr.lat,
                lng: requestArr.lng
               },
               iconImage: "http://maps.google.com/mapfiles/kml/shapes/man.png",
               contentString: requestArr.address
           },

           {
            // Driver location
            coords: {
                lat: self.driverLocation.lat,
                lng: self.driverLocation.lng
            }
        }
        ];


            console.log("passenger lat address: ", requestArr.lat);
            console.log("passenger lng address: ", requestArr.lng);
            console.log("dia chi khach hang: ", requestArr.address);
            // Loop through marker
            for (let i = 0; i < markers.length; i++) {
                addMarker(markers[i]);
            }

            // Show shortest route from driver to passenger
            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer;
            directionsDisplay.setMap(map);

              calculateAndDisplayRoute(directionsService, directionsDisplay);


            function calculateAndDisplayRoute(directionsService, directionsDisplay) {
                directionsService.route({
                  origin: markers[1].coords,
                  destination: markers[0].coords,
                  travelMode: 'DRIVING'
                }, function(response, status) {
                  if (status === 'OK') {
                    directionsDisplay.setDirections(response);
                  } else {
                    window.alert('Directions request failed due to ' + status);
                  }
                });
              }

            // Define toRad()
            Number.prototype.toRad = function () {
                return this * Math.PI / 180;
            }
            // Harvesin formula
            function haversinFormula(point1) {
                // Diem toa do cua tai xe
                var lon1 = point1.lng();
                var lat1 = point1.lat();

                // 227 nguyen van cu, quan 5 (diem co dinh cua tai xe)
                var lat2 = markers[1].coords.lat;
                var lon2 = markers[1].coords.lng;
                console.log("marker 1 la: ", markers[1].coords);

                var dLon = (lon2 - lon1).toRad();
                var dLat = (lat2 - lat1).toRad();
                var R = 6371;
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c * 1.609344; //km

                console.log("haversine distance is:", d);
                return d;
            }

            google.maps.event.addListener(map, 'click', function (event) {

                var distance = haversinFormula(event.latLng);

                console.log(distance);
                if (distance > 0.1) {
                    alert("Distance is greater than 100m, cannot update location!");
                    return;
                } else {

                    marker.setPosition(event.latLng);
                    self.driverLocation.lat=event.latLng.lat();
                    self.driverLocation.lng= event.latLng.lng();
                    calculateAndDisplayRoute(directionsService, directionsDisplay);
                    console.log("marker khi thay doi la: ", markers[1].coords);
                }
            })
        },

        closeMap: function () {
            var self = this;
            self.mapVisible = false;
            self.requestsVisible = true;
            self.dialogVisible=false;
            self.getUserInfo();
            self.msg = "";
            self.err = "";
            self.request={},
            self.request2={},
            self.updateRequestStatus(4);
        }
    }
});







