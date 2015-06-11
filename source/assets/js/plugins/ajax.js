/**
 *  @name plugin
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

  var pluginName = 'ajax',
      customSelectPluginName = Site.PluginName.customSelect,
      valueChangedEvtName = Site.EventName.valueChanged + '.' + customSelectPluginName,
      DataName = Site.DataName,
      CssClass = Site.CssClass,

  callAjax = function(url, htmlData, jCaller, jDes, handler) {
    if(!url || !handler) {
      return;
    }
    var that = this;

    if(htmlData) {
      handler.call(that, htmlData, jCaller, jDes);
    }
    else {
      $.ajax(url).done(function(data) {
        handler.call(that, data, jCaller, jDes);
      });
    }
  },

  customSelectAjaxHandler = function(data, jCaller,jDes) {
    var customSelectData = jCaller.data(customSelectPluginName),
        selectedOpt =  customSelectData.getSelectedOpt();

    jDes.empty().append(data);
    if(!selectedOpt.data(DataName.ajaxHtml)) {
      selectedOpt.data(DataName.ajaxHtml, data);
    }
    customSelectData.enableSelect();
    jDes.parent().find('.' + CssClass.loading).addClass(CssClass.hidden);
  },

  customSelectChangeHandler = function(customSelectEl) {
    var customSelectData = customSelectEl.data(customSelectPluginName),
        selectedOpt = customSelectData.getSelectedOpt(),
        jDes = $(selectedOpt.data(DataName.ajaxDes));
    jDes.parent().find('.' + CssClass.loading).removeClass(CssClass.hidden);
    customSelectData.disableSelect();
    callAjax(selectedOpt.data(DataName.ajaxUrl),
             selectedOpt.data(DataName.ajaxHtml),
             customSelectEl,
             jDes,
             customSelectAjaxHandler);
  },

  ajaxItemClickhandler = function(item, handler) {
    var jDes = $(item.data(DataName.ajaxDes));
    jDes.find('.' + CssClass.loading).removeClass(CssClass.hidden);
    jDes.parent().find('.' + CssClass.loading).removeClass(CssClass.hidden);
    callAjax(item.data(DataName.ajaxUrl),
             item.data(DataName.ajaxHtml),
             item,
             jDes,
             handler);
  },

  ajaxItemSuccessHandler = function(data, jCaller, jDes) {
    var slidePluginName = Site.PluginName.slide;

    jDes.empty().append(data);
    jDes.find('[data-' + slidePluginName + ']')[slidePluginName]();
    if(!jCaller.data(DataName.ajaxHtml)) {
      jCaller.data(DataName.ajaxHtml, data);
    }
    jDes.find('.' + CssClass.loading).addClass(CssClass.hidden);
  },

  loadmoreAjaxHandler = function(data, jCaller, jDes) {
    jDes.append(data);
    jDes.parent().find('.' + CssClass.loading).addClass(CssClass.hidden);
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this;

      this.element
        .off('click.' + pluginName)
        .on('click.' + pluginName, function() {
          var clickedItem = $(this);
          clickedItem.attr(that.options.loadMoreBtn) ?
                              ajaxItemClickhandler.call(that, clickedItem, loadmoreAjaxHandler) :
                              ajaxItemClickhandler.call(that, clickedItem, ajaxItemSuccessHandler);
        });
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
    loadMoreBtn: 'data-load-more'
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();

    $('[data-' + customSelectPluginName + ']')
      .off(valueChangedEvtName)
      .on(valueChangedEvtName, function() {
        customSelectChangeHandler($(this));
      });
  });

}(jQuery, window));
