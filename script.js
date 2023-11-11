async function initMap() {
    const { Map, InfoWindow } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const map = new Map(document.getElementById('map'), {
        center: { lat: 37.39094933041195, lng: -122.02503913145092 },
        zoom: 14,
        mapId: '4504f8b37365c3d0'
    });

    const infoWindow = new InfoWindow();
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({ preserveViewport: true });
    directionsRenderer.setMap(map);

    const startPoint = { lat: 37.392391, lng: -122.037836 }; // A nearby starting point
    const leaders = [
        {
            position: { lat: 37.390349, lng: -122.026437 },
        data: {
            name: "Joe Biden",
            age: 80,
            party: "Democratic Party"
        },
        icon: 'https://ik.imagekit.io/iumcogm7nb/us-president-joe-biden-300x277.jpeg?updatedAt=1699680247965'
    },
        {
            position: { lat: 40.388951, lng: -123.030495 },
        data: {
            name: "Trump",
            age: 77,
            party: " Republican Party"
        },
        icon: 'https://ik.imagekit.io/iumcogm7nb/kr9u49fk_donald-trump-reuters_625x300_20_February_22%20(1).webp?updatedAt=1699680535523'
    }
        // Add more leaders as needed
    ];
    var markers = [];

    function formatInfoWindowContent(data, position) {
        return `
            <div>
                <h3>${data.name}</h3>
                <p>Age: ${data.age}</p>
                <p>Party: ${data.party}</p>
            </div>
        `;
    }

    window.createRouteMarkerAndShowRoute = (position) => {
        infoWindow.close();
        if (window.routeMarker) {
            window.routeMarker.setMap(null);
        }

        window.routeMarker = new AdvancedMarkerElement({
            map: map,
            position: position,
            gmpDraggable: true,
            title: "Drag me to set the route destination."
        });
    window.routeMarker.addListener('dragend', function(event) {
        var newPosition = event.latLng;  // Get the new position from the event object
        if (newPosition.lat().toFixed(5) !== position.lat.toFixed(3) ||
            newPosition.lng().toFixed(5) !== position.lng.toFixed(3)) {
            console.log("Marker moved to a new position:", newPosition);
            calculateAndDisplayRoute(directionsService, directionsRenderer, startPoint, newPosition);
        }
    });
    };

    function calculateAndDisplayRoute(directionsService, directionsRenderer, origin, destination) {
        directionsService.route(
            {
                origin: origin,
                destination: destination,
                travelMode: google.maps.TravelMode.DRIVING
            },
            function(response, status) {
                if (status === 'OK') {
                    directionsRenderer.setDirections(response);
                } else {
                    window.alert('Directions request failed due to ' + status);
                }
            }
        );
    }

    window.filterMarkers = (party) => {
        markers.forEach(function(item) {
            if (party === 'all' || item.party === party) {
                item.marker.setMap(map);
            } else {
                item.marker.setMap(null);
            }
        });
    };

        leaders.forEach(function(leader) {
                var offsetPosition = {
            lat: leader.position.lat,
            lng: leader.position.lng - 0.20 // Adjust the marker slightly to the left
        };
        var marker = new google.maps.Marker({
            position: offsetPosition,
            map: map,
            title: leader.data.name,
            icon: {
                url: leader.icon,
                scaledSize: new google.maps.Size(50, 50)
            }
        });

        markers.push({ marker: marker, party: leader.data.party });

        marker.addListener('click', function() {
            infoWindow.setContent(formatInfoWindowContent(leader.data, leader.position));
            infoWindow.open(map, marker);
            window.createRouteMarkerAndShowRoute({lat: leader.position.lat, lng: leader.position.lng});
        });
    });
}

initMap();

