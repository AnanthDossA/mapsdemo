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

    leaders.forEach(function(leader) {
        var marker = new google.maps.Marker({
            position: leader.position,
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
        });
    });

    function formatInfoWindowContent(data, position) {
        return `
            <div>
                <h3>${data.name}</h3>
                <p>Age: ${data.age}</p>
                <p>Party: ${data.party}</p>
                <button onclick="createRouteMarkerAndShowRoute({lat: ${position.lat}, lng: ${position.lng}})">Show Route</button>
            </div>
        `;
    }

    window.createRouteMarkerAndShowRoute = (position) => {
        infoWindow.close();
        if (window.routeMarker) {
            window.routeMarker.setMap(null);
        }

        var offsetPosition = {
            lat: position.lat,
            lng: position.lng - 0.0005 // Adjust the marker slightly to the left
        };

        window.routeMarker = new AdvancedMarkerElement({
            map: map,
            position: offsetPosition,
            gmpDraggable: true,
            title: "Drag me to set the route destination."
        });

    window.routeMarker.addListener('dragend', function(event) {
        var newPosition = event.latLng;  // Get the new position from the event object
        console.log("Marker dragged to:", newPosition);  // Debug log
        calculateAndDisplayRoute(directionsService, directionsRenderer, position, newPosition);
    });
        calculateAndDisplayRoute(directionsService, directionsRenderer, position, startPoint);
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
}

initMap();

