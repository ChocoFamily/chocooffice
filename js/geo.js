function GeolocationService() {
	this._location = new ymaps.util.Promise();
};
GeolocationService.prototype = {
	constructor: GeolocationService,
	getLocation: function (options) {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(ymaps.util.bind(this._onGeolocationSuccess, this), ymaps.util.bind(this._onGeolocationError, this), options);
		} else {
			this._location.resolve(this.getLocationByIP() || this.getDefaults());
		}
		return this._sync();
	},
	_sync: function (p) {
		var promise = new ymaps.util.Promise();
		this._location.then(function (res) {
			promise.resolve(res);
		}, function (err) {
			promise.reject(err);
		});
		return promise;
	},
	_onGeolocationSuccess: function (position) {
		var coords = [position.coords.latitude, position.coords.longitude],
			location = this._location,
			locationData = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
				accuracy: position.coords.accuracy,
				altitude: position.coords.altitude,
				altitudeAccuracy: position.coords.altitudeAccuracy,
				speed: position.coords.speed,
				heading: position.coords.heading
			};
		this.getLocationData(coords).then(function (data) {
			location.resolve(ymaps.util.extend({
				isHighAccuracy: true
			}, locationData, data));
		}, function (err) {
			location.resolve(ymaps.util.extend({}, ymaps.geolocation, locationData, {
				isHighAccuracy: true
			}));
		});
	},
	_onGeolocationError: function (error) {
		if (window.console) {
			console.log(error.message || this.constructor.GEOLOCATION_ERRORS[error + 1]);
		}
		this._location.resolve(this.getLocationByIP() || this.getDefaults());
	},
	getLocationByIP: function () {
		return ymaps.geolocation;
	},
	getLocationData: function (coords) {
		var promise = new ymaps.util.Promise(),
			mapSize = this.getMapSize(),
			search = ymaps.geocode(coords, {
				results: 1,
				kind: 'locality'
			});
		search.then(function (res) {
			var result = res.geoObjects.get(0),
				props = result.properties;
			if (result) {
				promise.resolve({
					zoom: ymaps.util.bounds.getCenterAndZoom(props.get('boundedBy'), mapSize, ymaps.projection.wgs84Mercator).zoom,
					city: props.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.Locality.LocalityName', props.get('name')),
					country: props.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.CountryName', props.get('description')),
					region: props.get('metaDataProperty.GeocoderMetaData.AddressDetails.Country.AdministrativeArea.AdministrativeAreaName', props.get('metaDataProperty.GeocoderMetaData.text'))
				});
			} else {
				promise.reject('Not found');
			}
		}, function (err) {
			promise.reject(err);
		});
		return promise;
	},
	getDefaults: function () {
		return {
			latitude: 43.262734,
			longitude: 76.927462,
			zoom: 9,
			city: "Алматы",
			country: "Казахстан",
			region: "Алматы",
			isHighAccuracy: false
		};
	},
	getMapSize: function () {
		return [800, 600];
	}
};

GeolocationService.GEOLOCATION_ERRORS = ['permission denied', 'position unavailable', 'timeout'];