var app = app || {}

var NaviRouter = Backbone.Router.extend({
    /* define the route and function maps for this router */
    routes: {

        "buildroute" : "showStartRouting",

        "route/:id" : "showRoute",

        "": 'showStarterPage'

    },

    initialize: function(){
      this.route('#');
    },

    showStarterPage: function(){
      app.littlenavi.$el.fadeOut(500, () => {
        app.littlenavi.model.set({state: 'init', message: 'Hello'});
        app.littlenavi.render();
        app.littlenavi.$el.fadeIn(500, () => {
          app.littlenavi.resetFocus();
        });
      });

      app.RecentsView.$el.fadeOut(500, () => {
        app.RecentsView.$el.fadeIn(500);
      })
    },

    showStartRouting: function(){
      if(app.littlenavi.model.get('state') === 'ride'){
        app.littlenavi.model.set({message: 'Choose your route now'});
        app.map.trigger('map:appear');
      }else{
        app.littlenavi.$el.fadeOut(500, () => {
          app.littlenavi.model.set({state: 'ride', message: 'Choose your route now'});
          app.littlenavi.render();
          app.littlenavi.$el.fadeIn(500, () => {
            app.map.trigger('map:appear');
          });
        });
        app.RecentsView.$el.fadeOut(500, () => {
          app.RecentsView.$el.fadeIn(500);
        })
      }
    },

    showRoute: function(id){
      if(app.littlenavi.model.get('state') === 'ride'){
        app.littlenavi.model.set({message: 'History route'});
        app.map.trigger('map:appear');
        app.map.showHistoryRoute(id);
      }else{
        app.littlenavi.$el.fadeOut(500, () => {
          app.littlenavi.model.set({state: 'ride', message: 'History route'});
          app.littlenavi.render();
          app.littlenavi.$el.fadeIn(500, () => {
            app.map.trigger('map:appear');
            app.map.showHistoryRoute(id);
          });
        });
        app.RecentsView.$el.fadeOut(500, () => {
          app.RecentsView.$el.fadeIn(500);
        })
      }
    }
});
