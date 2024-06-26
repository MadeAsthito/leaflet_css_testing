

// Menampilkan peta
var mymap = L.map("map_add").setView(
    [-8.795279032677602, 115.17553347766035],
    12
);

// Format popup content
formatContent = function (text, lat, lng) {
    return `
	<div style="text-align: center"><b>${text}</b></div>
	<div>Lat : ${lat}</div>
	<div>Lng : ${lng}</div>
`;
};

// Menambahkan layer peta
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18,
}).addTo(mymap);

// Membuat icon dari gambar PNG
var myIcon = L.icon({
    iconUrl: "https://gis.manpits.xyz/icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

// Marker Lokasi Anda
addMarker = function (latlng) {
    // Menambahkan marker
    var marker = L.marker(latlng, {
        icon: myIcon,
        draggable: true,
    }).addTo(mymap);

    // Membuat popup baru
    var popup = L.popup({ offset: [0, -30] }).setLatLng(latlng);

    // Binding popup ke marker
    marker.bindPopup(popup);

    // Menambahkan event listener pada marker
    marker.on("click", function () {
        popup.setLatLng(marker.getLatLng()),
            popup.setContent(
                formatContent(
                    "Marker",
                    marker.getLatLng().lat,
                    marker.getLatLng().lng
                )
            );
    });

    marker.on("dragstart", function (event) {
        isOnDrag = true;
    });

    // Menambahkan event listener pada marker
    marker.on("drag", function (event) {
        popup.setLatLng(marker.getLatLng()),
            popup.setContent(
                formatContent(
                    "Marker",
                    marker.getLatLng().lat,
                    marker.getLatLng().lng
                )
            );
        marker.openPopup();
    });

    marker.on("dragend", function (event) {
        setTimeout(function () {
            isOnDrag = false;
        }, 500);
    });

    // Return marker
    return marker;
};

var newMarker;
mymap.on("click", function (e) {
    // Buat marker baru
    if (!newMarker || !mymap.hasLayer(newMarker)) {
        newMarker = addMarker(e.latlng);
    }
});
