/**
 *  @name custom-select
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
  var pluginName = 'custom-select',

  createFakeSelect = function() {
    var selectItem = '<li value="{value}" class="{class}" data-ajax-url="{url}" data-ajax-des="{des}">' +
                        '<a href="javascript:;" title="{value}">{text}</a>' +
                      '</li>',
        selectItems =  '',
        selectTag = this.vars.selectTag,
        selectOpts = selectTag.find('option'),
        vars = this.vars,
        DataName = Site.DataName,
        noData = Site.Data.none;

    for(var i = 0, len = selectOpts.length - 1; i < len; i++ ) {
      var selectOptAtI = selectOpts.eq(i);

      selectItems += selectItem
                      .replace(/\{value\}/g, selectOptAtI.val())
                      .replace('{text}', $.trim(selectOptAtI.text()))
                      .replace('{class}', selectOptAtI.is(':selected') ? vars.selectedClass : '')
                      .replace('{url}', selectOptAtI.data(DataName.ajaxUrl))
                      .replace('{des}', selectOptAtI.data(DataName.ajaxDes));
    }
    selectTag.hide();
    this.element.append('<span class="selected">' + $.trim(selectTag.find(':selected').text()) + '</span>' +
                        '<a href="javascript:;" title="arrow" class="wi-icon icon-arrow">arrow</a>' +
                        '<ul>' +
                          selectItems +
                        '</ul>');
    vars.fakeSelectDropDown = this.element.find('ul');
    vars.fakeSelectOpts = vars.fakeSelectDropDown.find('li');
    vars.fakeSelectLabel = this.element.find('span');
    getFakeSelectDropDownSize.call(this);
  },

  getFakeSelectDropDownSize = function() {
    var vars = this.vars,
        fakeSelectDropDown = vars.fakeSelectDropDown,
        maxWidth = this.options.maxWidth,
        fakeSelectOpts = vars.fakeSelectOpts,
        max = fakeSelectOpts.eq(0).width();
    fakeSelectDropDown.css({
      'opacity': 0,
      'display': 'block'
    });
    for(var i = 1, len = fakeSelectOpts.length; i < len; i++) {
      var fakeSelectOptsI = fakeSelectOpts.eq(i);
      if(fakeSelectOptsI > max) {
        max = fakeSelectOptsI.width();
      }
    }
    max = Math.min(max, this.options.maxWidth);
    vars.fakeSelectLabel.css('width', max);
    vars.fakeSelectDropDownH = fakeSelectDropDown.height();
    fakeSelectDropDown.css({
      'opacity': '',
      'height': 0,
    });
  },

  resetSelectedClass = function(el) {
    var vars = this.vars,
        selectedClass = vars.selectedClass;
    vars.fakeSelectOpts.filter('.' + selectedClass).removeClass(selectedClass);
    if(el && el.length) {
      el.addClass(selectedClass);
    }
  },

  showSelect = function() {
    var vars = this.vars;
    vars.fakeSelectDropDown.stop().animate({
      height: vars.fakeSelectDropDownH
    },this.options.Animation.slideDuration);
    vars.isShowing = true;
  },

  hideSelect = function() {
    var vars = this.vars;
    vars.fakeSelectDropDown.stop().animate({
      height: 0
    },this.options.Animation.slideDuration);
    vars.isShowing = false;
  },

  setText = function(text) {
    this.vars.fakeSelectLabel.html(text);
  },

  moveOneItem = function(direction) {
    var vars = this.vars,
        selectedClass = vars.selectedClass,
        fakeSelectOpts = vars.fakeSelectOpts,
        targetItem = null;
    switch(direction) {
      case this.options.Direction.next:
        targetItem = fakeSelectOpts.filter('.' + selectedClass).next('li');
        targetItem = targetItem.length ? targetItem : fakeSelectOpts.eq(0);
        break;
      default:
        targetItem = fakeSelectOpts.filter('.' + selectedClass).prev('li');
        targetItem = targetItem.length ? targetItem : fakeSelectOpts.eq(fakeSelectOpts.length-1);
    }
    this.setVal(targetItem.attr('value'));
  },

  fakeSelectClickHandler = function() {
    if(this.vars.isDisable) {
      return;
    }
    this.vars.isShowing ? hideSelect.call(this) : showSelect.call(this);
  },

  fakeSelectDropDownMouseEnterHandler = function() {
    if(this.vars.isDisable) {
      return;
    }
    var vars = this.vars,
        selectedClass = vars.selectedClass;
    resetSelectedClass.call(this);
  },

  fakeSelectDropDownMouseLeaveHandler = function() {
    if(this.vars.isDisable) {
      return;
    }
    var vars = this.vars,
        selectTarget = vars.fakeSelectOpts.filter('[value="' + vars.selectTag.val() + '"]');
    resetSelectedClass.call(this, selectTarget);
    setText.call(this, selectTarget.text());
  },

  fakeSelectOptsHoverHandler = function(optEl) {
    if(this.vars.isDisable) {
      return;
    }
    var vars = this.vars,
        selectedClass = this.vars.selectedClass;
    if(!optEl.hasClass(selectedClass)) {
      resetSelectedClass.call(this, optEl);
    }
  },

  fakeSelectOptsClickHandler = function(optEl) {
    if(this.vars.isDisable) {
      return;
    }
    this.setVal(optEl.attr('value'));
    hideSelect.call(this);
  },

  fakeSelectKeyDownHandler = function(e) {
    if(this.vars.isDisable) {
      return;
    }
    var opts = this.options,
        Keys = opts.Keys,
        Direction = opts.Direction;
    e.preventDefault();
    switch(e.which) {
      case Keys.ENTER:
        showSelect.call(this);
        break;
      case Keys.ESC:
        hideSelect.call(this);
        break;
      case Keys.LEFT:
      case Keys.UP:
        moveOneItem.call(this, Direction.prev);
        break;
      case Keys.RIGHT:
      case Keys.DOWN:
        moveOneItem.call(this, Direction.next);
        break;
      default:
        return;
    }
  },

  fakeSelectFocusOutHandler = function() {
    if(this.vars.isDisable) {
      return;
    }
    hideSelect.call(this);
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      this.vars = {
        isShowing: false,
        isDisable: false,
        selectTag: this.element.find('select'),
        selectedClass: Site.CssClass.selected
      };
      var that = this,
          thisEl = this.element,
          vars = this.vars;
      thisEl.attr('tabindex', 1);
      createFakeSelect.call(this);

      thisEl
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.stopPropagation();
          fakeSelectClickHandler.call(that);
        })
        .off('keydown.' + pluginName)
        .on('keydown.' + pluginName, function(e) {
          fakeSelectKeyDownHandler.call(that, e);
        });

      $(document)
        .off('click.' + pluginName)
        .on('click.' + pluginName, function() {
          fakeSelectFocusOutHandler.call(that);
        });

      vars.fakeSelectOpts
        .off('mouseover.' + pluginName)
        .on('mouseover.' + pluginName, function() {
          fakeSelectOptsHoverHandler.call(that, $(this));
        })
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          fakeSelectOptsClickHandler.call(that, $(this));
          e.stopPropagation();
        });

      vars.fakeSelectDropDown
        .off('mouseleave.' + pluginName)
        .on('mouseleave.' + pluginName, function() {
          fakeSelectDropDownMouseLeaveHandler.call(that);
        })
        .off('mouseenter.' + pluginName)
        .on('mouseenter.' + pluginName, function() {
          fakeSelectDropDownMouseEnterHandler.call(that);
        });

    },

    disableSelect: function() {
      this.vars.isDisable = true;
    },

    enableSelect: function() {
      this.vars.isDisable = false;
    },

    setVal: function(val) {
      var vars = this.vars,
          selectedClass = vars.selectedClass,
          selectTarget = vars.fakeSelectOpts.filter('[value="' + val + '"]');

      if(selectTarget.length) {
        resetSelectedClass.call(this, selectTarget);
        setText.call(this, selectTarget.text());
        vars.selectTag.val(val);
        this.element.trigger('valueChanged.' + pluginName);
      }
    },

    getSelectedOpt: function() {
      return this.vars.fakeSelectOpts.filter('.' + Site.CssClass.selected);
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
    Animation: {
      slideDuration: 300
    },
    Keys: {
      ENTER: 13,
      ESC: 27,
      UP: 38,
      DOWN: 40,
      LEFT: 37,
      RIGHT: 39
    },
    Direction: {
      next: 'next',
      prev: 'prev'
    },
    maxWidth: 296
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
