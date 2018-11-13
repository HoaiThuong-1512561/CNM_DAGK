window.onload = function () {
    vm.setupSSE();
    //vm.initMap();
    // loadCategories();
};
var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password: '',
        loginVisible: true,
        requestsVisible: false,
        mapVisible: false,
        requests: [],
        token: "",
        refToken: "",

        address: "",
        idEdit: 0,
        msg: "",
        err: "",

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
                    self.requestsVisible = true;
                    self.loginVisible = false;
                    self.token = response.data.access_token;
                    self.refToken = response.data.refresh_token;
                })
                .catch(function (error) {
                    alert(error);
                }).then(function () {
                    self.getAllRequest();
                })
        },
        getAllRequest: function () {
            var self = this;
            axios.get('http://localhost:3000/api/request/getAllRequestApp2', {
                    headers: {
                        token: self.token
                    }
                })
                .then(function (response) {
                    self.requests = response.data;
                    self.refDataTable();
                })
                .catch(function (error) {
                    if (error.response.status === 401) {
                        new Promise(function (resolve) {
                            self.refreshToken();
                            resolve();
                        }).then(function () {
                            if (self.requestsVisible === true) {
                                self.getAllRequest();
                            }
                        })
                        return;
                    }
                }).then(function () {});
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
                }).then(function () {})
        },
        setupSSE: function () {
            var self = this;
            if (typeof (EventSource) === 'undefined') {
                console.log('not support');
                return;
            }

            var add = new EventSource('http://localhost:3000/requestAddedEvent');

            add.onerror = function (e) {
                console.log('error: ' + e);
            }
            add.addEventListener('REQUEST_ADDED', function (e) {
                var data = JSON.parse(e.data);
                self.requests.push(data);
                self.refDataTable();
                $('#tableDH tbody').on('click', 'tr', function () {
                    if ($(this).hasClass('selected')) {
                        $(this).removeClass('selected');
                    } else {
                        table.$('tr.selected').removeClass('selected');
                        $(this).addClass('selected');
                    }
                });
            }, false);
            var remove = new EventSource('http://localhost:3000/requestRemoveEvent');
            remove.onerror = function (e) {

                console.log('error: ' + e);
            }
            remove.addEventListener('REQUEST_REMOVE', function (e) {
                var data = JSON.parse(e.data);
                self.getAllRequest();
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
        initMap: function () {
            var options = {
                center: {
                    lat: 10.762622,
                    lng: 106.660172
                },
                zoom: 12

            }
            var map = new google.maps.Map(document.getElementById('map'), options);

            // Add marker
            var marker;

            function addMarker(props) {
                marker = new google.maps.Marker({
                    position: props.coords,
                    map: map
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

            var markers = [{
                coords: {
                    lat: 10.762418,
                    lng: 106.681197
                },
                contentString: '<p>Cho Ben Thanh</p>'
            }];

            // Loop through marker
            for (let i = 0; i < markers.length; i++) {
                addMarker(markers[i]);
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

                // 227 nguyen van cu, quan 5 (diem den)
                var lat2 = 10.762418;
                var lon2 = 106.681197;


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
                console.log(haversinFormula(event.latLng));
                console.log("lat and lng of my: ", event.latLng.lat(), event.latLng.lng());
                var distance = haversinFormula(event.latLng);
                console.log(distance);
                if (distance < 0.1) {
                    alert("Distance is under 100m, cannot update location!");
                    return;
                } else {

                    marker.setPosition(event.latLng);
                }
            })
        },
       
        closeMap: function () {
            var self = this;
            self.mapVisible = false;
            self.requestsVisible = true;
            self.getAllRequest();
            self.msg = "";
            self.err = ""
        }
    }
});








// login: function(){
//     alert("somejj");
//     var self=this;
//     axios.post("http://localhost:3000/app4/login",{
//         userName: self.userName,
//         password: self.password,
//     })
//     .then((response)=>{
//         self.requestsVisible=true;
//         self.loginVisible=false;
//         self.token= response.data.access_token;
//         self.refToken = response.data.refresh_token;
//     })
//     .catch((error)=>{
//         alert(error);

//     })
// }
// function initMap()
//         {
//             var options = {              
//                 center: {lat: 10.762622, lng: 106.660172},
//                 zoom: 12

//             }
//            var map = new google.maps.Map(document.getElementById('map'),options);           


//             // Add marker
//             var marker
//             function addMarker(props){
//                 marker = new google.maps.Marker({
//                  position: props.coords,
//                  map: map
//                 });

//                 if(props.iconImage)
//                 {
//                     marker.setIcon(props.iconImage);
//                 }

//                 if(props.contentString)
//                 {
//                     var infoWindow = new google.maps.InfoWindow({
//                         content: props.contentString
//                     })

//                       marker.addListener('click', function(){
//                         infoWindow.open(map, marker);
//                     });
//                 }
//             }




//             var markers =  [
//                  {
//                     coords:{lat: 10.762418,lng: 106.681197},
//                     contentString: '<p>Cho Ben Thanh</p>'
//                 }
//                ];

//                // Loop through marker
//                for(let i=0;i<markers.length;i++)
//                 {
//                     addMarker(markers[i]);
//                 }


//                 // Define toRad()
//                 Number.prototype.toRad = function() {
//                 return this * Math.PI / 180;
//                 }
//                 // Harvesin formula
//                 function haversinFormula(point1)
//                 {
//                     // Diem toa do cua tai xe
//                     var lon1 = point1.lng();
//                     var lat1= point1.lat();

//                     // 227 nguyen van cu, quan 5 (diem den)
//                     var lat2=  10.762418;
//                     var lon2=  106.681197;


//                     var dLon = (lon2- lon1).toRad();
//                     var dLat= (lat2-lat1).toRad();
//                     var R = 6371;
//                     var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
//                             Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
//                             Math.sin(dLon/2) * Math.sin(dLon/2);  
//                     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
//                     var d = R *c*1.609344; //km

//                     console.log("haversine distance is:",d);
//                     return d;
//                 }

//                 google.maps.event.addListener(map, 'click',function(event){                 
//                     console.log(haversinFormula(event.latLng));
//                     console.log("lat and lng of my: ",event.latLng.lat(), event.latLng.lng());
//                     var distance = haversinFormula(event.latLng);
//                     console.log(distance);
//                     if(distance<0.1)
//                     {
//                         alert("Distance is under 100m, cannot update location!");
//                         return;
//                     }
//                     else{

//                         marker.setPosition(event.latLng);
//                     }
//                 })
//         }