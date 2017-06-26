var app = app || {};


var Recents = Backbone.Collection.extend({
  // Reference to this collection's model.
model: app.Recent,

localStorage: new Backbone.LocalStorage('littlenavi:recents')


})
