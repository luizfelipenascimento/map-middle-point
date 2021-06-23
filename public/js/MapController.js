class MapController {

    constructor(eventLog) {
        this.eventLog = eventLog
        this.map = null
        this.lat = 0
        this.lng = 0
        this.mapItems = new Array()
        this.isOnMapListener = null
        this.target = null
        this.drawGroupsYOffset = 85
        this.drawGroupsXOffset = 50
        this.initializeMap()
        this._getUserLocation()
    }

    setMapToLocation(lat, lng) {
        this.map.setCenter(new google.maps.LatLng(lat, lng))
    }

    _getUserLocation() {
        if ('geolocation' in navigator) {

            navigator.geolocation.getCurrentPosition(position => {
                const {latitude, longitude} = position.coords
                this.lat = latitude
                this.lng = longitude
                this.displayLocaltion(latitude, longitude, 'dec', 'latitude', 'longitude')
                this.map.setCenter(new google.maps.LatLng(latitude, longitude))
            })
        } else {
            console.error('navigator does not support geolocation')
            this.map.setCenter(new google.maps.LatLng(-23.55, -48.66))
        }
    }

    displayLocaltion(lat, lng, display, latElementId, lngElementId) {
        const longitudeElement = document.getElementById(lngElementId); 
        const latitudeElement = document.getElementById(latElementId);
        const latitude = lat.toFixed(7)
        const longitude = lng.toFixed(7)

        if (display === 'deg') {
            latitudeElement.textContent = this._getCoordinatesInDegrees(latitude)
            longitudeElement.textContent = this._getCoordinatesInDegrees(longitude)
        } else {
            latitudeElement.textContent = latitude
            longitudeElement.textContent = longitude
        }
    }

    _getCoordinatesInDegrees(coordinate) {
        const minutes = (Math.abs(coordinate) % 1.0) * 60
        const seconds = ((minutes % 1.0) * 60).toFixed(1)
        return parseInt(coordinate) + '°' + parseInt(minutes) + '\'' + seconds + '"'
    }

    _displayMousePosition(lat, lng) {
        document.getElementById('map-mouse-position').style.visibility = 'initial';
        this.displayLocaltion(lat, lng, 'dec', 'maps-mouse-latitude', 'maps-mouse-longitude')
    }

    _drawGroupDivisions() {
        if (this.target) {
            const {lat, lng} = this.target
            
            const xPoints = [{ lat, lng: -this.drawGroupsXOffset + lng  }, { lat, lng: lng + this.drawGroupsXOffset }]
            const yPoints = [{ lat: -this.drawGroupsYOffset, lng}, { lat: this.drawGroupsYOffset, lng}]
            
            const xLine = new google.maps.Polyline({
                path: xPoints,
                strokeColor: "#333333",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              });

              const yLine = new google.maps.Polyline({
                path: yPoints,
                strokeColor: "#333333",
                strokeOpacity: 1.0,
                strokeWeight: 2,
              }); 

              yLine.setMap(this.map)
              xLine.setMap(this.map)


        } else {
            this.eventLog.appendText('Não existe um alvo no mapa, por tanto não há grupos')
        }
        
    }

    drawGroupGrid() {
        if (this.target) {
            
            const {lat, lng} = this.target
            
            const yOffset = this.drawGroupsYOffset
            const xOffset = this.drawGroupsXOffset

            const group1Vertices = [
                {lat, lng}, 
                {lat: lat + (yOffset - lat), lng},
                {lat: lat + (yOffset -lat), lng:lng + xOffset},
                {lat, lng: lng + xOffset}
            ]

            //group1 lat > t.lat ; lng > t.lng
            this.group1Area = new google.maps.Polygon({
                path: group1Vertices,
                strokeColor: "#00ac00",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: "#00ac00",
                fillOpacity: 0.35,
                clickable: false

            })
            //group2 lat > t.lat; lng < t.lng
            const group2Vertices = [
                {lat, lng}, 
                {lat: lat + (yOffset - lat), lng},
                {lat: lat + (yOffset -lat), lng:lng - xOffset},
                {lat, lng: lng - xOffset}
            ]

            this.group2Area = new google.maps.Polygon({
                path: group2Vertices,
                strokeColor: "#ac0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: "#ac0000",
                fillOpacity: 0.35,
                clickable: false
            })

            //group3 lat < t.lat; lng < t.lng

            const group3Vertices = [
                {lat, lng}, 
                {lat: lat - (yOffset - lat), lng},
                {lat: lat - (yOffset -lat), lng:lng - xOffset},
                {lat: lat , lng: lng - xOffset}
            ]

            this.group3Area = new google.maps.Polygon({
                path: group3Vertices,
                strokeColor: "#0000ac",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: "#0000ac",
                fillOpacity: 0.35,
                clickable: false
            })

            //group4 lat < t.lat; lng > t.lng
            const group4Vertices = [
                {lat, lng}, 
                {lat: lat - (yOffset - lat), lng},
                {lat: lat - (yOffset -lat), lng:lng + xOffset},
                {lat, lng: lng + xOffset}
            ]

            this.group4Area = new google.maps.Polygon({
                path: group4Vertices,
                strokeColor: "#ac0022",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                fillColor: "#f4ab0b",
                fillOpacity: 0.35,
                clickable: false
            })

            this.group1Area.setMap(this.map)
            this.group2Area.setMap(this.map)
            this.group3Area.setMap(this.map)
            this.group4Area.setMap(this.map)

            google.maps.event.clearListeners(this.group1Area, 'click');
            google.maps.event.clearListeners(this.group2Area, 'click');
            google.maps.event.clearListeners(this.group3Area, 'click');
            google.maps.event.clearListeners(this.group4Area, 'click');            

        } else {
            this.eventLog.appendText('Não existe um alvo no mapa, por tanto não há grupos')
        }
        
    }

    removeGrid() {
        this.group1Area.setMap(null)
        this.group2Area.setMap(null)
        this.group3Area.setMap(null)
        this.group4Area.setMap(null)
    }

    initializeMap() {
        this.zoom = 15
        
        this.map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: this.lat, lng: this.lng },
            zoom: this.zoom
        });

        this.map.addListener("click", (mapsMouseEvent) => {
            let selectedTool = Array.from(document.getElementsByName('tool-item')).filter( x => x.checked )[0].value
            
            console.log('mouse', mapsMouseEvent)

            const latitude = mapsMouseEvent.latLng.lat()
            const longitude = mapsMouseEvent.latLng.lng()

            switch(selectedTool) {
                case 'controlMap': console.log('controlMap executed')
                break 
                
                case 'addTarget': console.log('addTarget executed')
                    if (this.target === null) { 
                        this.target = new TargetItem(latitude, longitude)
                        this.target.displayOnMap(this.map)
                        
                        this.eventLog.appendText('Alvo adicionado - Localização:' + latitude.toFixed(7) + ', ' + longitude.toFixed(7))
                        
                    } else {
                        this.eventLog.appendText('Já existe um alvo adicionado no mapa', 'danger')
                    }
                break
                
                case 'addComponent': console.log('addComponent executed')
                    let mapItem = new MapItem(mapsMouseEvent.latLng.lat(), mapsMouseEvent.latLng.lng())
                    mapItem.displayOnMap(this.map)
                    this.mapItems.push(mapItem)
                break
                default: console.log('option not available')
            }
        });

        this.map.addListener('mouseover', () => {
            this.isOnMapListener = google.maps.event.addListener(this.map, 'mousemove', (mapsMouseEvent) => {
                const lat = mapsMouseEvent.latLng.lat()
                const lng = mapsMouseEvent.latLng.lng()
                const zoom = this.map.getZoom()

                const scale = (1 << zoom)
                
                const coordPx_y = Math.floor(lat * scale)
                const coordPx_x = Math.floor(lng * scale)

                //console.log('zoom:', zoom, 'coordinatePixel_x:', coordPx_x, 'coordinatePixel_y:', coordPx_y)
                
                this._displayMousePosition(lat, lng)
            })
        })

        this.map.addListener('mouseout', () => {
            google.maps.event.removeListener(this.isOnMapListener)
        })
    }
}