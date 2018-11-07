function initMap()
        {
            var options = {              
                center: {lat: 10.762622, lng: 106.660172},
                zoom: 12
           
            }
           var map = new google.maps.Map(document.getElementById('map'),options);           
            

            // Add marker
            var marker
            function addMarker(props){
                marker = new google.maps.Marker({
                 position: props.coords,
                 map: map
                });

                if(props.iconImage)
                {
                    marker.setIcon(props.iconImage);
                }

                if(props.contentString)
                {
                    var infoWindow = new google.maps.InfoWindow({
                        content: props.contentString
                    })

                      marker.addListener('click', function(){
                        infoWindow.open(map, marker);
                    });
                }
            }
           
           

            
            var markers =  [
                 {
                    coords:{lat: 10.762418,lng: 106.681197},
                    contentString: '<p>Cho Ben Thanh</p>'
                }
               ];

               // Loop through marker
               for(let i=0;i<markers.length;i++)
                {
                    addMarker(markers[i]);
                }
                

                // Define toRad()
                Number.prototype.toRad = function() {
                return this * Math.PI / 180;
                }
                // Harvesin formula
                function haversinFormula(point1)
                {
                    // Diem toa do cua tai xe
                    var lon1 = point1.lng();
                    var lat1= point1.lat();

                    // 227 nguyen van cu, quan 5 (diem den)
                    var lat2=  10.762418;
                    var lon2=  106.681197;


                    var dLon = (lon2- lon1).toRad();
                    var dLat= (lat2-lat1).toRad();
                    var R = 6371;
                    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                            Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                            Math.sin(dLon/2) * Math.sin(dLon/2);  
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
                    var d = R *c*1.609344; //km

                    console.log("haversine distance is:",d);
                    return d;
                }

                google.maps.event.addListener(map, 'click',function(event){                 
                    console.log(haversinFormula(event.latLng));
                    console.log("lat and lng of my: ",event.latLng.lat(), event.latLng.lng());
                    var distance = haversinFormula(event.latLng);
                    console.log(distance);
                    if(distance<0.1)
                    {
                        alert("Distance is under 100m, cannot update location!");
                        return;
                    }
                    else{
                       
                        marker.setPosition(event.latLng);
                    }
                })
        }