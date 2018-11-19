
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
        SDT: '',
        loginVisible: true,
        requestsVisible: false,
        mapVisible: false,
        dialogVisible: false,
        requests: [],
        token: "",
        refToken: "",
        userId:0,
        userStatus:"",

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
                    self.userId = response.data.user.ID;
                    self.userStatus = response.data.user.Status;
                    console.log( response.data.user.Status);
                    self.token = response.data.access_token;
                    self.refToken = response.data.refresh_token;
                    console.log(self.userName);
                    self.getUserInfo(self.userName);
                })
                .catch(function (error) {
                    alert(error);
                }).then(function () {
                    self.getAllRequest();
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
                    console.log("da vao day");
                    
                })
                .catch(function (error) {
                    alert(error);
                }).then(function () {
                    
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
                    console.log(self.requests);
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
        notifyRequestTimeout: function(){
            self=this;
            requestArr= self.requests;
            var index=0;
            if(self.userStatus==="BUSY")
            {
                alert("Khong the nhan request o trang thai BUSY");
                return;
            }
            $(document).ready(function(){
                $('#dialog').dialog({
                    height: 50,
                    width: 350,
                    modal: true,
                    resizable: true,
                    dialogClass: 'no-close success-dialog',
                    buttons: { 
                        "Từ chối": {
                        text: "Từ chối",
                        id:"cancel",
                    click:function() { $(this).dialog("close"); }},
                    "Chấp nhận":{ 
                    text:"Chấp nhận",
                    id:"accept" ,
                    click: function() { 
                      
                        self.requestsVisible=false;
                        dialogVisible=false;
                        setTimeout(() => {
                            self.mapVisible=true;
                        }, 2000);
                       
                      
                        self.updateUserStatus();
                        clearInterval(startInterval);  
                        $("#dialog").dialog('close');   
                       setTimeout(() => {
                            self.initMap(requestArr[index]); 
                           console.log("dia chi cua khach hang: ",self.requests[index].address);
                        }, 2000);
                           
                       
                    } }
                }
                });
               
            })
            var content=requestArr[index].name+ '</br>'+ requestArr[index].phone+'</br>'+requestArr[index].address;
            document.getElementById("dialog").innerHTML= content;
           
            var startInterval = setInterval(function(){
                if(index< requestArr.length)
                    {
                        index++;
                        $("#dialog").dialog();
                        var content=requestArr[index].name+ '</br>'+ requestArr[index].phone+'</br>'+requestArr[index].address;
                        document.getElementById("dialog").innerHTML= content;
                        //alert(requestArr[index].name);
                       
                    }
                    else
                    {
                        $("#dialog").dialog();
                        document.getElementById("dialog").innerHTML ="Khong co request nao!";                      
                        clearInterval(startInterval);  
                        $("#dialog").dialog('close');                      
                    }
            }, 10000);
                
           
               
        },
        updateUserStatus: function(){
            self=this;
            if(self.userStatus==="READY")
                self.userStatus="BUSY";
            else
                 self.userStatus="READY";
            axios.post('http://localhost:3000/api/request/updateUserStatus',{
                ID: self.userId,
                Status: self.userStatus
            },{
                  
                    headers: {
                        token: self.token
                    }
                    })
                    .then(function (response) {
                        console.log("da vao day");
                        
                    })
                    .catch(function (error) {
                        alert(error);
                    }).then(function () {
                        
                    
            })
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
        initMap: function (requestArr) {     
            self=this;
            var options = {
                center: {
                    lat: 10.762622,
                    lng: 106.660172
                },
                zoom: 12,
                mapTypeId:google.maps.MapTypeId.ROADMAP

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
                lat: 10.762418,
                lng: 106.681197
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
                    markers[1].coords.lat=event.latLng.lat();
                    markers[1].coords.lng= event.latLng.lng();
                    calculateAndDisplayRoute(directionsService, directionsDisplay);
                    console.log("marker khi thay doi la: ", markers[1].coords);
                }
            })
        },
       
        closeMap: function () {
            var self = this;
            self.updateUserStatus();
            self.mapVisible = false;
            self.requestsVisible = true;
            self.getAllRequest();
            self.msg = "";
            self.err = ""
        }
    }
});







