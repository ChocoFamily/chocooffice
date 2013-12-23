var init = {
		map: function (e) {
			var myCoords;
			ymaps.ready(function () {
				var myMap, myMapContainer = document.getElementById('YMapsID'),
					service = new GeolocationService(),
					myLocation = service.getLocation({
						enableHighAccuracy: true,
						timeout: 10000,
						maximumAge: 1000
					});
				myMap = new ymaps.Map('YMapsID', {
					center: [43.263060, 76.927571],
					zoom: 17
				});
				navigator.geolocation.getCurrentPosition(function (position) {});
				ourOffice = new ymaps.Placemark([43.263060, 76.927571], {
					iconContent: 'Офис ChocoFamily'
				}, {
					preset: 'twirl#redStretchyIcon',
					balloonCloseButton: false,
					hideIconOnBalloonOpen: false
				});
				myMap.geoObjects.add(ourOffice);
				myMap.controls.add(new ymaps.control.SmallZoomControl());
				document.getElementById('route').style.display = 'block';
				document.getElementById('route').onclick = function () {
					myLocation.then(function (loc) {
						myCoords = [loc.latitude, loc.longitude];
						ymaps.route([myCoords, [43.263060, 76.927571]], {
							mapStateAutoApply: true,
							avoidTrafficJams: true
						}).then(function (route) {
							route.getPaths().options.set({
								balloonContenBodyLayout: ymaps.templateLayoutFactory.createClass('$[properties.humanJamsTime]'),
								strokeColor: 'C0392B',
								opacity: 0.9
							});
							myMap.geoObjects.add(route);
						});
					});
				};
			});
		}
	};
init.map();