window.onload = function() {
    vm.setupSSE();
    vm.initMap();
    // loadCategories();
};


var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password:'',
        loginVisible:true,
        requestsVisible:false,
        requests: [],
        token:"",
        refToken:"",
        geocoder : {lat: 10.7623314, lng: 106.6820053}
    },
    methods: {
        login: function() {
            var self = this;
            axios.post('http://localhost:3000/app2/login', {
                userName: self.userName,
                password: self.password,
            })
                .then(function (response) {

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
            axios.get('http://localhost:3000/api/request/getAll',{ headers: { token: self.token } })
                .then(function (response) {
                    self.requests=response.data;
                    self.requestsVisible=true;
                    self.loginVisible=false;
                    $('#tableDH').DataTable().destroy();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.refreshToken();
                        return;
                    }

                }).then(function () {

                $('#tableDH').DataTable();
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
                    self.getAllRequest();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.loginVisible=true;
                        self.requestsVisible=false;
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

            var src = new EventSource('http://localhost:3000/requestAddedEvent');

            src.onerror = function(e) {
                console.log('error: ' + e);
            }

            src.addEventListener('REQUEST_ADDED', function(e) {
                var data = JSON.parse(e.data);
                self.requests.push(data);
                self.refDataTable();

            }, false);
        },
        refDataTable:function () {
            new Promise(function (resolve,reject) {
                $('#tableDH').DataTable().destroy();
                resolve();
            }).then(function () {
                $('#tableDH').DataTable();
            })
        },
        initMap:function() {
            var self=this;
            var address = "18/13 Trần Văn Thành";
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode( { 'address': address}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    self.geocoder.lat = results[0].geometry.location.lat();
                    self.geocoder.lng = results[0].geometry.location.lng();

                    var map = new google.maps.Map(
                        document.getElementById('map'), {zoom: 18, center: self.geocoder});
                    var marker = new google.maps.Marker({position: self.geocoder, map: map});



                }else {
                    alert("false");
                }
            });




}

    }

});


