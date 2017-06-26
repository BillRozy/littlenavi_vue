var littlenavi = littlenavi || {}

Vue.component('home-screen', {

  template: `
    <div>
      <div class="message">{{message}} </div>
      <div class="go-button">Let's Ride</div>
    </div>
  `,

  data: function() {
    return littlenavi.state
  }

})

Vue.component('navigation-screen', {

  template: `
    <div>
      <geocoding-view></geocoding-view>
      <div id="mapid"></div>
    </div>
  `,

  data: function() {
    return {
      map: null,
      geocoder: null,
      center: [43, 88],
      zoom: 17
    }
  },

  mounted: function() {
    this.map = L.map('mapid').setView(this.center, this.zoom);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
    }).addTo(this.map);
    this.geocoder = L.esri.Geocoding;
  }

})

Vue.component('geocoding-view', {

  template: `
    <div class="geocoding-tools">
      <div style="position: relative">
        <input id="start-address" type="textbox" v-model="origin"  placeholder='Точка отправления' autofocus>
        <ul class="dropping-list" id="start-address-list">
        </ul>
      </div>
      <div id="apply-route-btn" class="round-button"></div>
      <div style="position: relative">
        <input id="finish-address" type="textbox" v-model="dest" placeholder='Точка назначения'>
        <ul class="dropping-list" id="finish-address-list">
        </ul>
      </div>
    </div>
  `,

  data: function() {
    return {
      origin: "Mosc",
      dest: "Some place"
    }
  }

})
