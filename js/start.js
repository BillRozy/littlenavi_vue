var littlenavi = littlenavi || {}

littlenavi.vueRoot = new Vue({
  el: '#naviapp',
  data: littlenavi.state
});
//
// app.getFormattedDate = function getFormattedDate() {
//     var date = new Date();
//     var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
//
//     return str;
// }
// app.appModel = new Application();
// app.littlenavi = new LittleNavi({model: app.appModel});
// app.router = new NaviRouter();
// app.mapModel = new MapLayer();
// app.map = new MapView({model: app.mapModel});
// app.Recents = new Recents();
// app.Recents.fetch();
// app.RecentsView  = new RecentsView({collection: app.Recents});
// if(!$.contains($('#content'), app.littlenavi.el)){
//   app.littlenavi.render().$el.hide();
//   $('#content').append(app.littlenavi.render().$el);
// }
//
// if(!$.contains($('#menu'), app.RecentsView.el)){
//   app.RecentsView.render().$el.hide();
//   $('#menu').append(app.RecentsView.$el);
// }
// Backbone.history.start();
// // $('#naviapp').append(app.littlenavi.render().el);
