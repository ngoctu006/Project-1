/**
 *  @name slideshow
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
  var pluginName = 'slideshow',

  cloneSlide = function() {
    var slideItems = this.slideItems;
    this.slideContainer
      .prepend(slideItems.eq(slideItems.length - 1).clone())
      .append(slideItems.eq(0).clone());
    this.slideItems = this.element.find(this.options.Selector.slideItems);
  },

  setSlidePos = function() {
    this.slideContainer.css({
      'width': this.slideW * this.slideItems.length,
      'margin-left': -this.slideW
    });

    this.slideItems.css('width', this.slideW);
  },

  initSlide = function() {
    var hiddenClass = Site.CssClass.hidden;
    if(undefined !== typeof this.element.attr('data-thumbnails')) {
      createThumb.call(this);
      cloneThumb.call(this);
    }
    if(this.len > 1) {
      cloneSlide.call(this);
      setSlidePos.call(this);
    }
    else {
      this.slideNext.addClass(hiddenClass);
      this.slidePrev.addClass(hiddenClass);
    }
  },

  nextSlide = function() {
    var next = this.currentSlide + 1;
    return next >= this.len ? 0 : next;
  },

  prevSlide = function() {
    var prev = this.currentSlide - 1;
    return prev < 0 ? this.len - 1 : prev;
  },

  slideAnimate = function(newPos) {
    this.isAnimating = true;
    var that = this,
        animateOpts = this.options.Animation,
        effect = this.slideContainer.animate({
          'margin-left': newPos
        }, animateOpts.duration, animateOpts.easing);

    $.when(effect).done(function() {
      animationEndHandler.call(that);
    });
  },

  animationEndHandler = function() {
    this.isAnimating = false;
    if(this.currentSlide === 0) {
      this.slideContainer.css('margin-left', -this.slideW);
    }
    else if(this.currentSlide === this.len - 1) {
      this.slideContainer.css('margin-left', -this.slideW * this.len);
    }
  },


  createThumb = function() {
    var that = this,
        thisEl = this.element,
        opts = this.options,
        selector = opts.Selector,
        classOpts = opts.Class,
        thumbItem = '<div class="{class}" data-idx={idx}> <img alt="" src="{src}"/> </div>',
        thumbItems = '',
        image = null;

    for(var i = 0, len = this.slideItems.length; i < len; i++) {
      thumbItems += thumbItem
                      .replace('{class}', classOpts.thumbItem)
                      .replace('{idx}', i)
                      .replace('{src}', this.slideItems.eq(i).data('thumbnailsUrl'));
    }
    this.thumbItems = $(thumbItems);
    this.thumbLen = this.thumbItems.length;
    this.thumbList = thisEl.find(selector.thumbList);
    if(!this.thumbList.length) {
      this.thumbList = $('<div class="' + classOpts.thumbList + '"></div>');
    }
    this.thumbWrap = thisEl.find(selector.thumbWrap);
    if(!this.thumbWrap.length) {
      this.thumbWrap = $('<div class="' + classOpts.thumbWrap + '"></div>');
    }
    this.thumbContainer = thisEl.find(selector.thumbContainer);
    if(!this.thumbContainer.length) {
      this.thumbContainer = $('<div class="' + classOpts.thumbContainer + '"></div>');
    }
    this.thumbList.append(this.thumbItems);
    this.thumbWrap.append(this.thumbList);
    this.thumbContainer.append(this.thumbWrap);
    if(this.thumbLen > this.options.Animation.thumbStep) {
      this.thumbContainer.append('<a href="#" class="wi-icon wi-icon-prev-small">prev</a>' +
              '<a href="#" class="wi-icon wi-icon-next-small">next</a>');
    }
    thisEl.append(this.thumbContainer);
    this.totalThumbPage = Math.ceil(this.thumbLen / this.options.Animation.thumbStep);
    image = new Image();
    image.onload = image.onerror = function() {
      checkImageLoaded.call(that);
    };
    image.src = this.thumbItems.eq(0).find('img').attr('src');
  },

  checkImageLoaded = function() {
    var step = this.options.Animation.thumbStep;
    this.thumbW = this.thumbItems.width() +
                  parseInt(this.thumbItems.css('margin-right')) +
                  parseInt(this.thumbItems.css('margin-left'));
    if(this.thumbLen > step) {
      setThumbPos.call(this);
    }
  },

  cloneThumb = function() {
    var step = this.options.Animation.thumbStep;
    if(this.thumbLen <= step) {
      return;
    }
    for(var i = 0; i < step; i++) {
      this.thumbList
        .append(this.thumbItems.eq(i).clone())
        .prepend(this.thumbItems.eq(this.thumbLen - 1 - i).clone());
    }
    this.thumbItems = this.element.find(this.options.Selector.thumbItems);
  },

  setThumbPos = function() {
    this.thumbList.css({
      'width': this.thumbW * this.thumbItems.length,
      'margin-left': -this.thumbW * this.options.Animation.thumbStep
    });

    this.thumbListW = this.thumbList.width();
  },

  nextThumbPage = function() {
    var nextPage = this.currentThumbPage + 1;
    return nextPage >= this.totalThumbPage ? 0 : nextPage;
  },

  prevThumbPage = function() {
    var prevPage = this.currentThumbPage - 1;
    return prevPage < 0 ? this.totalThumbPage - 1 : prevPage;
  },

  setActiveThumb = function(idx) {
    var classOpts = this.options.Class;
    this.thumbItems.filter('.' + classOpts.active).removeClass(classOpts.active);
    this.thumbItems.filter('[data-idx="' + idx + '"]').addClass(classOpts.active);
  },

  thumbSlideAnimate = function(newPos, direction) {
    this.isThumbAnimating = true;
    var that = this,
        animateOpts = this.options.Animation,
        effect = this.thumbList.animate({
          'margin-left': newPos
        }, animateOpts.duration, animateOpts.easing);

    $.when(effect).done(function() {
      thumbAnimationEndHandler.call(that, direction);
    });
  },

  thumbAnimationEndHandler = function(direction) {
    this.isThumbAnimating = false;
    var animationOpts = this.options.Animation;
        step = animationOpts.thumbStep;
    if(direction === animationOpts.directionNext) {
      if(this.currentThumbPage === 0) {
        this.thumbList.css('margin-left', -this.thumbW * step);
      }
    }
    else {
      if(this.currentThumbPage === this.totalThumbPage - 1){
        this.thumbList.css('margin-left', -(this.thumbListW - (this.thumbLen % step + step) * this.thumbW));
      }
    }
  },

  thumbClickHandler = function(clickedThumb) {
    var clickedIdx = clickedThumb.data('idx'),
        opts = this.options;
        animationOpts = opts.Animation,
        direction = clickedIdx > this.currentSlide ?
                    animationOpts.directionNext : animationOpts.directionPrev;
    this.goTo(clickedIdx, direction);
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {

    init: function() {
      var that = this,
          thisEl = this.element,
          opts = this.options,
          selector = opts.Selector;
      this.slideContainer = thisEl.find(selector.slideContainer);
      this.slideItems = thisEl.find(selector.slideItems);
      this.len = this.slideItems.length;
      this.preview = thisEl.find(selector.preview);
      this.slideW = this.preview.width();
      this.slideNext = thisEl.find(selector.slideNext);
      this.slidePrev = thisEl.find(selector.slidePrev);
      this.currentSlide = 0;
      this.currentThumbPage = 0;
      this.isAnimating = false;
      this.isThumbAnimating = false;

      initSlide.call(this);

      this.slideNext
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.goNext();
        });

      this.slidePrev
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.goPrev();
        });
      thisEl.find(selector.thumbNext)
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.goNextThumb();
        });

      thisEl.find(selector.thumbPrev)
        .off('click.' + pluginName)
        .on('click.' + pluginName, function(e) {
          e.preventDefault();
          that.goPrevThumb();
        });

      this.thumbItems
        .off('click.' + pluginName)
        .on('click.' + pluginName, function() {
          thumbClickHandler.call(that, $(this));
        });
    },

    goNext: function() {
      this.goTo(nextSlide.call(this), this.options.Animation.directionNext);
    },

    goPrev: function() {
      this.goTo(prevSlide.call(this), this.options.Animation.directionPrev);
    },

    goTo: function(slideNumber, direction) {
      var animationOpts = this.options.Animation,
          newPos = 0;
      if(this.isAnimating || this.currentSlide === slideNumber) {
        return;
      }

      slideNumber = Math.min(this.len - 1, Math.max(slideNumber, 0));

      if(direction === animationOpts.directionNext) {
        newPos = slideNumber === 0 ?
                 -(this.slideItems.length - 1) * this.slideW : -(slideNumber + 1) * this.slideW;
      }
      else {
        newPos = slideNumber === this.len - 1 ? 0 : -(slideNumber + 1) * this.slideW;
      }

      this.currentSlide = slideNumber;
      setActiveThumb.call(this, slideNumber);
      this.goToThumb(Math.floor(slideNumber / animationOpts.thumbStep), animationOpts.directionNext);
      slideAnimate.call(this, newPos, direction);
    },

    goNextThumb: function() {
      this.goToThumb(nextThumbPage.call(this), this.options.Animation.directionNext);
    },

    goPrevThumb: function() {
      this.goToThumb(prevThumbPage.call(this), this.options.Animation.directionPrev);
    },

    goToThumb: function(pageNumber, direction) {
      if(this.isThumbAnimating || this.currentThumbPage === pageNumber) {
        return;
      }
      var newPos = 0,
          step = this.options.Animation.thumbStep,
          currentThumbItem = (pageNumber + 1) * step;

      pageNumber = Math.min(this.totalThumbPage - 1, Math.max(0, pageNumber));

      if(direction === this.options.Animation.directionNext) {
        newPos = pageNumber === 0 ?
                 -(this.thumbListW - (this.thumbW * step)) : -currentThumbItem * this.thumbW;
      }
      else {
        newPos = pageNumber === this.totalThumbPage - 1 ?
                 -(step - this.thumbLen % step) * this.thumbW  : -currentThumbItem * this.thumbW;
      }
      this.currentThumbPage = pageNumber;
      thumbSlideAnimate.call(this, newPos, direction);
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
    Selector: {
      slideContainer: '.slides',
      slideItems: '.slides .item',
      preview: '.preview',
      thumbContainer: '.thumbnails',
      thumbList: '.list-thumb',
      thumbWrap: '.thumbnails .wrap',
      thumbItems: '.thumbnails .item',
      slideNext: '.preview .wi-icon.wi-icon-next-big',
      slidePrev: '.preview .wi-icon.wi-icon-prev-big',
      thumbNext: '.thumbnails .wi-icon.wi-icon-next-small',
      thumbPrev: '.thumbnails .wi-icon.wi-icon-prev-small',
    },
    Animation: {
      duration: 500,
      easing: 'swing',
      thumbStep: 5,
      directionNext: 'next',
      directionPrev: 'prev'
    },
    Class: {
      thumbContainer: 'thumbnails',
      thumbList: 'list-thumb',
      thumbItem: 'item',
      thumbWrap: 'wrap',
      active: 'active'
    }
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]();
  });

}(jQuery, window));
