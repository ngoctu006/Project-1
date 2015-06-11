/**
 * @name Site
 * @description Define global variables and functions
 * @version 1.0
 */
var Site = (function($, window, undefined) {

  return {
    CssClass: {
      hidden: 'hidden',
      selected: 'selected',
      loading: 'loading'
    },
    PluginName: {
      customSelect: 'custom-select',
      ajax: 'ajax',
      slide: 'slideshow'
    },
    DataName: {
      ajaxUrl: 'ajaxUrl',
      ajaxDes: 'ajaxDes',
      ajaxHtml: 'ajaxHtml'
    },
    Data: {
      none: 'none'
    },
    EventName: {
      valueChanged: 'valueChanged',
      ajaxSuccess: 'ajaxSuccess'
    }
  };

})(jQuery, window);
