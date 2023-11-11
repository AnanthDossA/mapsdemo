var map;
var directionsService;
var directionsRenderer;
var startPoint = { lat: -34.397, lng: 150.644 }; // Replace with your actual starting point
var currentInfoWindow;
var routeMarker; // Marker used for setting destination of the route


var leaders = [
    {
        position: { lat: -34.397, lng: 150.644 },
        data: {
            name: "Joe Biden",
            party: "Party1",
            age: 80,
            party: "Democratic Party"
        },
        icon: 'https://ik.imagekit.io/iumcogm7nb/us-president-joe-biden-300x277.jpeg?updatedAt=1699680247965'
    },
    {
        position: { lat: -35.397, lng: 151.644 },
        data: {
            name: "Trump",
            party: "Party2",
            age: 77,
            party: " Republican Party"
        },
        icon: 'https://ik.imagekit.io/iumcogm7nb/kr9u49fk_donald-trump-reuters_625x300_20_February_22%20(1).webp?updatedAt=1699680535523'
    }
    // Add more leaders as needed
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: startPoint,
        zoom: 8
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer({ preserveViewport: true });
    directionsRenderer.setMap(map);

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

        var infoWindow = new google.maps.InfoWindow();

        marker.addListener('click', function() {
            if (currentInfoWindow) {
                currentInfoWindow.close();
            }
            infoWindow.setContent(formatInfoWindowContent(leader.data, leader.position));
            infoWindow.open(map, marker);
            currentInfoWindow = infoWindow;
        });
    });
}

function filterMarkers() {
    var selectedParty = document.getElementById('partyFilter').value;

    markers.forEach(function(item) {
        if (selectedParty === 'all' || item.party === selectedParty) {
            item.marker.setMap(map);
        } else {
            item.marker.setMap(null);
        }
    });
}

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
                directionsRenderer.setOptions({ preserveViewport: true }); // Prevents zooming in
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        }
    );
}

function formatInfoWindowContent(data, position) {
    return `
        <div>
            <h3>${data.name}</h3>
            <p>Party: ${data.party}</p>
            <p>Age: ${data.age}</p>
            <p>Party: ${data.party}</p>
            <button onclick="createRouteMarkerAndShowRoute({lat: ${position.lat}, lng: ${position.lng}})">Show Route</button>
        </div>
    `;
}
function createRouteMarkerAndShowRoute(position) {
    var offsetPosition = {
        lat: position.lat,
        lng: position.lng - 0.05 // Adjust this value to control the distance left of the original position
    };

    if (routeMarker) {
        routeMarker.setMap(null);
    }
    routeMarker = new google.maps.Marker({
        position: offsetPosition, // Use the adjusted position
        map: map,
        draggable: true
    });

    google.maps.event.addListener(routeMarker, 'dragend', function() {
        calculateAndDisplayRoute(directionsService, directionsRenderer, startPoint, this.getPosition());
    });

    calculateAndDisplayRoute(directionsService, directionsRenderer, startPoint, offsetPosition);
}

