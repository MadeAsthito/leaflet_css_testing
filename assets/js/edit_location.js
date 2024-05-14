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
				formatContent("Marker", marker.getLatLng().lat, marker.getLatLng().lng)
			);
	});

	marker.on("dragstart", function (event) {
		isOnDrag = true;
	});

	// Menambahkan event listener pada marker
	marker.on("drag", function (event) {
		popup.setLatLng(marker.getLatLng()),
			popup.setContent(
				formatContent("Marker", marker.getLatLng().lat, marker.getLatLng().lng)
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

async function initMarker() {
	var api_url = localStorage.getItem("api_url");

	var url = window.location.href;
	var param = url.split("?")[1];
	var id_restaurant = param.split("=")[1];

	var headers = {
		Authorization: `Bearer ${token}`, // Include the token in the Authorization header
		"Content-Type": "application/json", // Specify the content type as JSON
	};
	var full_url = api_url + "/restaurants/" + id_restaurant;
	await axios
		.get(full_url, {
			headers,
		})
		.then((response) => {
			// Handle successful call
			console.log(response.data); // Assuming the API returns a token

			// DATA JSON

			// Populate the input field for input with id :
			// name
			// description
			// email
			// phoneNumber
			document.getElementById("name").value = response.data.name;
			document.getElementById("description").value = response.data.description;
			document.getElementById("email").value = response.data.email;
			document.getElementById("phoneNumber").value = response.data.phone;

			newMarker = addMarker([response.data.latitude, response.data.longitude]);
		})
		.catch((error) => {
			// Handle error
			console.error("Data failed uploaded:", error);
			alert("Data failed uploaded. Please check your data and credentials.");
		});
}

initMarker();
