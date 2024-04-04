document.addEventListener("DOMContentLoaded", function () {
	// Get reference to table body
	var tableBody = document.getElementById("table-body");

	// Iterate over each restaurant data in the JSON array
	var i = 1;
	restaurants.forEach(function (restaurant) {
		// Create a new row
		var row = tableBody.insertRow();

		// Insert data into the row cells
		var indexCell = row.insertCell();
		indexCell.textContent = i;
		indexCell.style.textAlign = "center";

		var nameCell = row.insertCell();
		nameCell.textContent = restaurant.Name;
		nameCell.style.textAlign = "left";

		var descriptionCell = row.insertCell();
		descriptionCell.textContent = restaurant.Description;
		descriptionCell.style.textAlign = "left";

		var emailCell = row.insertCell();
		emailCell.textContent = restaurant.Email;
		emailCell.style.textAlign = "center";

		var phoneCell = row.insertCell();
		phoneCell.textContent = restaurant.Phone;
		phoneCell.style.textAlign = "center";

		var actionCell = row.insertCell();
		var button = document.createElement("button");
		button.innerHTML = '<span class="material-icons-sharp">edit</span>';
		button.classList.add("btn", "btn-add");
		actionCell.appendChild(button);

		i++;
	});
});

var restaurants = [
	{
		Latitude: -8.65,
		Longitude: 115.2167,
		Name: "Warung Sate",
		Description: "Serving delicious traditional Indonesian satay.",
		Email: "warungsate@example.com",
		Phone: "+62 812-3456-7890",
	},
	{
		Latitude: -8.7925,
		Longitude: 115.1682,
		Name: "Jimbaran Seafood",
		Description: "Fresh seafood served beachside with stunning sunset views.",
		Email: "jimbaranseafood@example.com",
		Phone: "+62 812-9876-5432",
	},
	{
		Latitude: -8.6525,
		Longitude: 115.1385,
		Name: "Nasi Goreng Express",
		Description: "Quick and tasty Indonesian fried rice.",
		Email: "nasigorengexpress@example.com",
		Phone: "+62 812-1234-5678",
	},
	{
		Latitude: -8.6705,
		Longitude: 115.2126,
		Name: "Cafe Ubud",
		Description: "Relaxing café with organic coffee and breakfast options.",
		Email: "cafeubud@example.com",
		Phone: "+62 812-4567-8901",
	},
	{
		Latitude: -8.7832,
		Longitude: 115.1683,
		Name: "Pizza Paradise",
		Description: "Authentic Italian pizza served in a cozy atmosphere.",
		Email: "pizzaparadise@example.com",
		Phone: "+62 812-3456-7890",
	},
];

// Menampilkan peta
var mymap = L.map("map_view").setView(
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

// Format popup content
formatContentRestauran = function (text, email, phone, lat, lng) {
	return `
	<div style="text-align: center"><b>${text}</b></div>
	<div>Email : ${email}</div>
	<div>Phone : ${phone}</div>
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

restaurants.forEach((restaurant) => {
	var marker = L.marker([restaurant.Latitude, restaurant.Longitude], {
		icon: myIcon,
		draggable: false,
	}).addTo(mymap);

	// Membuat popup baru
	var popup = L.popup({ offset: [0, -30] }).setLatLng([
		restaurant.Latitude,
		restaurant.Longitude,
	]);

	// Binding popup ke marker
	marker.bindPopup(popup);

	// Menambahkan event listener pada marker
	marker.on("click", function () {
		popup.setLatLng(marker.getLatLng()),
			popup.setContent(
				formatContentRestauran(
					restaurant.Name,
					restaurant.Email,
					restaurant.Phone,
					marker.getLatLng().lat,
					marker.getLatLng().lng
				)
			);
	});
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
