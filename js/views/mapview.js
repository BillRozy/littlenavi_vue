var app = app || {}

var MapView = Backbone.View.extend({

  className: 'map-view',

  template: _.template( $('#map-view-template').html() ),

  // The DOM events specific to an item.
  events: {
    'focusin input': 'handleFocusIn',
    'focusout input': 'handleFocusOut',
    'input input': 'validateAndFly',
    'keyup input': 'callOnEnter',
    'click #apply-route-btn': 'applyRoute'
  },

  initialize: function() {
    // this.listenTo(this.model, 'change', this.render);

    _.extend(this, Backbone.Events);
    this.on("map:appear", this.renderMap);
    this.on("map:refresh", this.refreshMap);
    this.on("map:recreate", this.setMapRecreated);
    this.latlonRegExp = /^([-+]?[1-8]?\d(?:\.\d+)?|90(?:\.0+)?),\s*([-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?))$/;
    this.startmarker = {id: 'start-address', marker: null};
    this.finishmarker = {id: 'finish-address', marker: null};
    this.machineRoute = null;

  },


  render: function() {
    this.$el.html(this.template( this.model.attributes ));
    return this;
  },

  setMapRecreated: function() {
    this.isMapRecreated = true;
  },

  handleFocusIn: function(e) {
    let btn = $('#apply-route-btn');
    switch(e.currentTarget.id){
      case "start-address":
        btn.toggleClass('onStart', true);
        break;
      case "finish-address":
        btn.toggleClass('onFinish', true);
        break;
    }
    $(e.currentTarget).siblings().css({
      'height': 'auto'
    })
    app.littlenavi.trigger('map:defocus');
  },

  handleFocusOut: function(e) {
    let btn = $('#apply-route-btn');
    switch(e.currentTarget.id){
      case "start-address":
        btn.toggleClass('onStart', false);
        break;
      case "finish-address":
        btn.toggleClass('onFinish', false);
        break;
    }
    setTimeout(function(){
      $(e.currentTarget).siblings().css({
        'height': '0px'
      })
    } , 150);
  },

  setFieldErrored: function(el ,hasError){
    $(el).toggleClass('hasError', hasError);
  },

  waypointsToArray: function(waypoints){
    let array = [];
    if(waypoints && waypoints.length > 0){
      waypoints.forEach(function(obj, i, arr){
        array.push([obj.latLng.lat, obj.latLng.lng]);
      })
    }
    return array;
  },

  callOnEnter: function(e){
    if (e.keyCode == 13) {
      $(':focus').blur();
      this.applyRoute();
    }
  },

  showRoute: function(){
    let origin = this.model.get('origin');
    let dest = this.model.get('dest');
    if(this.machineRoute){
      this.machineRoute.remove();
    }
    this.machineRoute = L.Routing.control({
      waypoints: [
        L.latLng(origin[0], origin[1]),
        L.latLng(dest[0], dest[1])
      ],
      router: L.Routing.mapbox('pk.eyJ1IjoiYmlsbHJvenkiLCJhIjoiY2l4OG5zbWJ0MDA0bDJ0c2J1YzJid2FrNCJ9.0ouNSG8VeWn-H2qWV1Lf7A')
    });
    this.machineRoute.on('routesfound', () => {
      let waypoints = this.machineRoute.getWaypoints();
      this.map.fitBounds(this.waypointsToArray(waypoints));
    })
    this.machineRoute.addTo(this.map);
    this.map.fitBounds([origin, dest]);
  },

  refitRouteBounds: function() {
    this.map.fitBounds([this.model.get('origin'), this.model.get('dest')]);
  },

  checkIfCanShowRoute: function() {
    return this.startmarker.marker && this.finishmarker.marker;
  },

  validateAndFly: function(e) {
    let self = this;
    this.geocoder.geocode().text(e.currentTarget.value).run(function(err, results, response){
        console.log(results);
        self.fillGeoList(e.currentTarget.id, results.results);
    });
    let test = this.validateInput(e.currentTarget);
    if(test){
      this.flyTo(this.strLatLonToArray(test));
    }
  },

  fillGeoList: function(inputId, results) {

    let list = (inputId === "start-address") ? $('#start-address-list') : $('#finish-address-list');
    list.empty();
    let self = this;
    results.forEach(function(result, ind, arr){
      let li = $('<li>' + result.text  + '</li>');
      li.on('mouseover', function() {
        self.flyTo([result.latlng.lat, result.latlng.lng]);
      });
      li.on('click', function(e) {
          if(inputId === "start-address"){
            self.model.set({origin : [result.latlng.lat, result.latlng.lng]});
            self.model.set({originName: li.html()});
          }else{
            self.model.set({dest : [result.latlng.lat, result.latlng.lng]});
            self.model.set({destName: li.html()});
          }
          self.setFieldErrored(document.getElementById(inputId), false);
          $('#' + inputId).val(li.html());
      });
      list.append(li);
    })
  },

  validateInput: function(field){
    let val = field.value;
    if(this.checkIfIsLatLon(val)){
        this.setFieldErrored(field , false);
        return val;
    }else{
      this.setFieldErrored(field , true);
      return null;
    }
  },

  showHistoryRoute: function(id){

    let route = app.Recents.get(id);
    let startLatLng = route.get('origin');
    let finishLatLng = route.get('dest');
    this.model.set({origin: startLatLng, dest: finishLatLng});
    if(this.startmarker.marker != null){
      this.startmarker.marker.setLatLng(startLatLng);
    }else{
      this.startmarker.marker = L.marker(startLatLng);
      this.startmarker.marker.addTo(this.map);
    }
    if(this.finishmarker.marker != null){
      this.finishmarker.marker.setLatLng(finishLatLng);
    }else{
      this.finishmarker.marker = L.marker(finishLatLng);
      this.finishmarker.marker.addTo(this.map);
    }

    if(this.checkIfCanShowRoute()){
      app.littlenavi.trigger('map:focus');
      this.showRoute();
    }

  },

  applyRoute: function(){
    if(this.model.get('origin') && this.model.get('dest')){
       let startLatLng = this.model.get('origin');
       let finishLatLng = this.model.get('dest');
       if(this.startmarker.marker != null){
         this.startmarker.marker.setLatLng(startLatLng);
       }else{
         this.startmarker.marker = L.marker(startLatLng);
         this.startmarker.marker.addTo(this.map);
       }
       if(this.finishmarker.marker != null){
         this.finishmarker.marker.setLatLng(finishLatLng);
       }else{
         this.finishmarker.marker = L.marker(finishLatLng);
         this.finishmarker.marker.addTo(this.map);
       }

       var newModel = app.Recents.create({
         date: app.getFormattedDate(),
         origin: startLatLng,
         dest: finishLatLng,
         originName: this.model.get('originName'),
         destName: this.model.get('destName')
       });

       newModel.save();


       if(this.checkIfCanShowRoute()){
         app.router.navigate('#route/' + newModel.id);
         app.littlenavi.trigger('map:focus');
         this.showRoute();
       }

    }else{
      console.log("please, insert correct input data");
    }
  },

  enter: function(){
      alert('click');
  },

  strLatLonToArray: function(latlonStr){
    return latlonStr.split(',');
  },

  checkIfIsLatLon: function(value) {
    return this.latlonRegExp.test(value);
  },

  flyTo: function(latlonArr){
    this.map.panTo([latlonArr[0], latlonArr[1]])
  },

  hideItinerary: function() {
    this.machineRoute.hide();
  },

  showItinerary: function() {
    this.machineRoute.show();
  },

  refreshMap: function() {
    this.map.invalidateSize();
    this.refitRouteBounds();
    $('#mapid').css({
      'filter': ''
    });
  },

  renderMap: function() {
    if(this.isMapRecreated){
      this.map = L.map('mapid').setView(this.model.get('center'), this.model.get('zoom'));

      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  		maxZoom: 18,
  		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
  			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
  			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
  		id: 'mapbox.streets'
    }).addTo(this.map);
    this.geocoder = L.esri.Geocoding;
    this.isMapRecreated = false;
    }
  }
});
