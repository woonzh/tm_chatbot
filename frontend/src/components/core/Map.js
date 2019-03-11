import React from "react";

import Component from "./Component";

const { google, alert } = global;

export class Map extends Component {
  state = {
    id: this.props.id || "map",
    zoom: this.props.zoom || 15,
    center: this.props.center || [0, 0],
    map: null,
    markers: []
  };
  get id() {
    return this.state.id;
  }
  hideAllMarkers() {
    const marker = this.state.markers.pop();
    marker.marker.setMap(null);
    return this;
  }
  showMarker(loc) {
    if (!loc) return;
    const { geocoder, map, infowindow } = this.state;
    const [lat, lng] = loc;
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          let marker = new google.maps.Marker({
            position: { lat, lng },
            map
          });
          const location = results.map(o => o.formatted_address);
          infowindow.setContent(location.join("<br/>"));
          infowindow.open(map, marker);
          this.state.markers.push({ loc, marker });
          if (this.props.onShowMarker) this.props.onShowMarker(results, loc);
        } else {
          alert("No results found");
        }
      } else {
        alert("Geocoder failed due to: " + status);
      }
    });
    return this;
  }
  initMap() {
    const { dom, center } = this.state;
    const [lat, lng] = center;
    this.setState(state => ({
      map: new google.maps.Map(dom, {
        center: { lat, lng },
        zoom: this.state.zoom
      }),
      geocoder: new google.maps.Geocoder(),
      infowindow: new google.maps.InfoWindow(),
      service: new google.maps.places.PlacesService(this.state.map)
    }));

    this.showMarker(center);
  }

  componentDidMount() {
    this.initMap();
  }

  renderComponent() {
    return <div ref={e => (this.state.dom = e)} id={this.id} className="map" />;
  }
}

export default Map;
