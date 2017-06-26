var app = app || {}

var LittleNavi = Backbone.View.extend({

  className: 'littlenavi-display',

  template: _.template( $('#display-view-template').html() ),

  // The DOM events specific to an item.
  events: {
    'click .go-button' : 'changeStateToRide'
  },

  initialize: function() {
    this.listenTo(this.model.state, 'change', this.render);
    _.extend(this, Backbone.Events);
    this.on("map:focus", this.focusOnMap);
    this.on("map:defocus", this.resetFocus);
    this.isMapFocused = false;

  },


  render: function() {

    var $temp = $('<div class="littlenavi-wrapper"></div>').html(this.template( this.model.attributes ));
    var $goBtn = $temp.find('.go-button');
    switch(this.model.get('state')){
      case 'ride':
        $goBtn.toggleClass('displayed', false);
        $temp.append(app.map.render().el);
        app.map.trigger('map:recreate')
        break;
      case 'init':
        $goBtn.toggleClass('displayed', true);
        app.map.$el.remove();
        app.map.trigger('map:recreate')
        break;
    }
    this.$el.empty().append($temp);
    app.map.delegateEvents();
    return this;
  },

  changeStateToRide: function() {
    app.router.navigate('#buildroute', {trigger: true});
  },


  focusOnMap: function() {
    if(!this.isMapFocused){
      var self = this;
      this.isMapFocused = true;
      this.$el.find('.message').css({
        'height': '0px',
        'opacity': '0'
      });
      this.$el.find('.geocoding-tools').css({
        'opacity':'0'
      });
      setTimeout(function(){
        self.$el.find('#mapid').css({
          'width':'100%',
          'height':'100%',
          'min-height': '400px',
          'min-width': '400px',
          'filter': 'blur(5px)'
        });
        self.$el.find('.geocoding-tools').css({
          'position':'absolute',
          'opacity':'1',
          'left': 'calc(50% - 335px)'
        });
        setTimeout(function(){ app.map.trigger('map:refresh');}, 300);
      }, 300);
    }
  },

  resetFocus: function() {
    if(this.isMapFocused){
      let self = this;
      this.isMapFocused = false;
      app.map.hideItinerary();
      this.$el.find('#mapid').css({
        'width':'80%',
        'height':'400px',
        'min-height': '',
        'min-width': '',
        'filter': 'blur(5px)'
      });
      this.$el.find('.geocoding-tools').css({
        'opacity':'0'
      });
      setTimeout(function(){
        self.$el.find('.message').css({
          'height': '200px',
          'opacity': '1'
        });
        self.$el.find('.geocoding-tools').css({
          'position' : '',
          'opacity':'1',
          'left': ''
        });
        setTimeout(function(){ app.map.trigger('map:refresh');}, 300);
      }, 300);

    }
  }

});
