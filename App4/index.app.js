function initMap()
        {
            var options = {              
                center: {lat: 10.762622, lng: 106.660172},
                zoom: 12
           
            }
           var map = new google.maps.Map(document.getElementById('map'),options);           
            

            // Add marker
            function addMarker(props){
                var marker = new google.maps.Marker({
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
              

                google.maps.event.addListener(map, 'click',function(event){
                    addMarker({coords: event.latLng});
                    console.log(haversinFormula(event.latLng));
                    //console.log(haversinFormula());
                    console.log("lat and lng of my: ",event.latLng.lat(), event.latLng.lng());
                })
        }