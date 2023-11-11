function initMap() {
    var mapOptions = {
        center: { lat: -34.397, lng: 150.644 }, // Set default location
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Example markers
    var leaders = [
        { position: { lat: -34.397, lng: 150.644 }, title: "Leader 1" },
        { position: { lat: -35.397, lng: 151.644 }, title: "Leader 2" }
        // Add more leaders as needed
    ];

    leaders.forEach(function(leader) {
        var marker = new google.maps.Marker({
            position: leader.position,
            map: map,
            title: leader.title
        });

        var infoWindow = new google.maps.InfoWindow({
            content: leader.title
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}

