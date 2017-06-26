var app = app || {}

var MapLayer = Backbone.Model.extend({

  defaults:{
    center: [51.505, -0.09],
    zoom: 13,
    origin: '',
    dest: ''
  }

})
