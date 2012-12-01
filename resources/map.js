$(document).ready(function() {
	var self = this;

	fetchLayers();
	var map = L.map( 'map', {
		layers: [self.tileLayer, self.hospitalLayer]
	});

	// $('body').bind('hospitalsfetched', renderHospitalIcon);
	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	map.locate({setView: true, maxZoom: 16});

	function geojsonLayer() {
		converter = new op2geojson();
		data = converter.geojson();
		return L.geoJson(data);
	}

	function fetchLayers() {
		self.hospitalLayer = geojsonLayer();
		self.tileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
		});
	}

	function initLayerControl() {
		L.control.layers(null, {
			"Hospitals" : self.hospitalLayer
		}).addTo(map);
	}

	function onLocationFound(e) {
		self.currentLocation = e.latlng;
		var radius = e.accuracy / 2;
		L.marker(e.latlng).addTo(map)
		.bindPopup("You are within " + radius + " meters from this point").openPopup();
		$('body').trigger('hospitalsfetched');
	}

	function onLocationError(e) {
		alert(e.message);
	}

	function renderHospitalIcon() {
		var hospitalIcon = L.icon({
			iconUrl: 'img/hospital.png'
		});
		if (self.currentLocation) {
			debugger;
			L.marker([self.location.lat, self.location.lng], {icon: hospitalIcon}).addTo(map);
		}
	}
});
