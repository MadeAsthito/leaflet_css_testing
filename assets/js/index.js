// Javascript for dashboard

document.addEventListener("DOMContentLoaded", async function () {
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
	formatContentRestaurant = function (text, email, phone, lat, lng) {
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

	var api_url = localStorage.getItem("api_url");
	api_url += "/restaurants";

	const headers = {
		Authorization: "Bearer " + token,
	};
	var restaurants = await axios
		.get(api_url, { headers: headers })
		.then((response) => {
			return response.data;
		})
		.catch((error) => {
			// Handle error
			console.error("API call failed:", error);
		});

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
		nameCell.textContent = restaurant.name;
		nameCell.style.textAlign = "left";

		var descriptionCell = row.insertCell();
		descriptionCell.textContent = restaurant.description;
		descriptionCell.style.textAlign = "left";

		var emailCell = row.insertCell();
		emailCell.textContent = restaurant.email;
		emailCell.style.textAlign = "center";

		var phoneCell = row.insertCell();
		phoneCell.textContent = restaurant.phone;
		phoneCell.style.textAlign = "center";

		// Update :
		var actionCell = row.insertCell();
		var editButton = document.createElement("button");
		editButton.innerHTML = '<span class="material-icons-sharp">edit</span>';
		editButton.classList.add("btn", "btn-add");
		editButton.onclick = function () {
			window.location.href = "./edit_location.html?id=" + restaurant.id;
		};
		actionCell.appendChild(editButton);

		var deleteButton = document.createElement("button");
		deleteButton.innerHTML = '<span class="material-icons-sharp">delete</span>';
		deleteButton.classList.add("btn", "btn-danger");
		actionCell.appendChild(deleteButton);

		i++;
	});

	restaurants.forEach((restaurant) => {
		var marker = L.marker([restaurant.latitude, restaurant.longitude], {
			icon: myIcon,
			draggable: false,
		}).addTo(mymap);

		// Membuat popup baru
		var popup = L.popup({ offset: [0, -30] }).setLatLng([
			restaurant.latitude,
			restaurant.longitude,
		]);

		// Binding popup ke marker
		marker.bindPopup(popup);

		// Menambahkan event listener pada marker
		marker.on("click", function () {
			popup.setLatLng(marker.getLatLng()),
				popup.setContent(
					formatContentRestaurant(
						restaurant.name,
						restaurant.email,
						restaurant.phone,
						marker.getLatLng().lat,
						marker.getLatLng().lng
					)
				);
		});
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
