function initMap() {
    var mapOptions = {
        center: { lat: -34.397, lng: 150.644 }, // Set default location
        zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    // Example markers with custom icons
    var leaders = [
        {
            position: { lat: -34.397, lng: 150.644 },
            title: "JoeBiden",
                 icon: {
                url: 'https://ik.imagekit.io/iumcogm7nb/us-president-joe-biden-300x277.jpeg?updatedAt=1699680247965', // Replace with your custom icon URL
                scaledSize: new google.maps.Size(50, 50) // Scaling the icon size
            }
        },
        {
            position: { lat: -30.397, lng: 151.644 },
            title: "Putin",
            icon: {
                url: 'https://ik.imagekit.io/iumcogm7nb/us-president-joe-biden-300x277.jpeg?updatedAt=1699680247965', // Replace with your custom icon URL
                scaledSize: new google.maps.Size(50, 50) // Scaling the icon size
            }
        }
    ];

    leaders.forEach(function(leader) {
        var marker = new google.maps.Marker({
            position: leader.position,
            map: map,
            title: leader.title,
            icon: leader.icon // Setting custom icon
        });

        var infoWindow = new google.maps.InfoWindow({
            content: leader.title
        });

        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    });
}
