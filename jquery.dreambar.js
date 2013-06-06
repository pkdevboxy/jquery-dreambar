/**
 * Copyright 2013 DreamFactory Software, Inc. <support@dreamfactory.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Initialize namespace
 */
;
var DreamFactory = DreamFactory || {};
DreamFactory.Platform = DreamFactory.Platform || {};
DreamFactory.Platform.UI = DreamFactory.Platform.UI || {};

(function($, window, document, undefined) {
  /**
   * @param options
   * @constructor
   */
  DreamFactory.Platform.UI.DreamBar = function DreamFactory_Platform_UI_DreamBar(options) {
    this.options = $.extend({}, this.defaults, options);

    return this.init();
  };

  /**
   * DreamBar
   */
  DreamFactory.Platform.UI.DreamBar.prototype = {

    /**
     * Default options
     */
    defaults: {
      selector:        'header',
      crumbs:          [],
      titleText:       'DreamBar',
      titleIcon:       'img/icon-32x32.png',
      arrowLeft:       'icon-chevron-left',
      arrowRight:      'icon-chevron-right',
      statusText:      null,
      statusFadeDelay: 5000,
      $_bar:           null
    },

    /**
     * Set up the bar...
     */
    init: function() {
      $('body').append('<div class="dreambar-app-menu"><ul class="nav"><li><a href="#">Option 1</a></li><li><a href="#">Option 2</a></li><li><a href="#">Option 3</a></li><li><a href="#">Option 4</a></li><li><a href="#">Option 5</a></li></ul></div>');
      this.options.$_bar = $(this.options.selector);
      this.options.$_bar.append('<div class="dreambar-hot-spot span4  pull-left"><span class="dreambar-menu-icon"></span><span class="dreambar-app-icon"></span><div class="dreambar-app-title">My App</div><div class="dreambar-divider"></div></div>');
      this.options.$_bar.append('<div class="dreambar-status span4">I am status</div>');
      this.options.$_bar.append('<div class="dreambar-controls span4 pull-right"><div class="dreambar-divider"></div><a href="#"><i class="icon-signout"></i></a><a href="#"><i class="icon-signin"></i></a></div>');
      this.options.$_bar.addClass('dreambar container-fluid');
      var $_menu = $('.dreambar-app-menu');

      $('.dreambar-hot-spot', this.options.$_bar).on('click', function(e) {
        var $_this = $(this);
        if ($_this.hasClass('open')) {
          $_menu.animate({left: '-500px'}, 'fast');
          $_this.removeClass('open');
        }
        else {
          $_menu.animate({left: 0}, 'fast');
          $_this.addClass('open');
        }

      });

      $(window).on('resize', function() {
        $_menu.height($(this).height() - 40);
      });

      return this;
    }

  }

})(jQuery, window, document);
