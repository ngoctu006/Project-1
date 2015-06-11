/**
 *  @name home-animation
 *  @description description
 *  @version 1.0
 *  @options
 *    option
 *  @events
 *    event
 *  @methods
 *    init
 *    publicMethod
 *    destroy
 */
;(function($, window, undefined) {
  'use strict';

  var pluginName = 'home-animation',
  setActiveClass = function() {
    var that = this,
        activeClass = this.options.activeClass;
    that.slideItems.filter('.' + activeClass).removeClass(activeClass);
    that.slideItems.eq(that.currentItem).addClass(activeClass);
    that.currentItem++;
    if(that.currentItem >= that.slideItems.length) {
      that.currentItem = 0;
    }
    setTimeout(function(){
      setActiveClass.call(that);
    }, this.options.timeout);
  };


  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;
      this.slideItems = this.element.find(this.options.itemClass);
      this.currentItem = 0;
      setActiveClass.call(this);
    },

    destroy: function() {
      $.removeData(this.element[0], pluginName);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    timeout: 3000,
    itemClass: '.item',
    activeClass: 'active'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
