class MapItem {

    constructor(lat, lng) {
        this.id = "#" + new Date().getTime() 
        this.lat = lat
        this.lng = lng
        this._marker = new google.maps.Marker({ 
            position: new google.maps.LatLng(this.lat, this.lng),
            title: this.id
        })
        this._marker.setLabel('I')
        this.group = 0
        this.address = ''
    }

    hide() {
        this._marker.setMap(null)
    }

    displayOnMap(map) {
        this._marker.setMap(map)
    }

    _drawMakerImage() {

    }   

    setGroup(group) {
        this.group = group
    }

    scale(zoom) {

    }

    setPathTo(target) {
        
    }
}