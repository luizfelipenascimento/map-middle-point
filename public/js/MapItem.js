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

    calculateGroup(target) {
        if (this.lat >= target.lat && this.lng >= target.lng) 
            this.group = 1
        else if (this.lat >= target.lat && this.lng <= target.lng) {
            this.group = 2
        } else if (this.lat <= target.lat && this.lng <= target.lng) {
            this.group = 3 
        } else {
            this.group = 4
        }
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