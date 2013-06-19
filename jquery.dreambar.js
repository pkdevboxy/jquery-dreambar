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
			selector:                'header',
			clientContainerSelector: '#client-container',
			crumbs:                  [],
			titleText:               'DreamBar',
			titleIcon:               'img/icon-32x32.png',
			arrowLeft:               'icon-chevron-left',
			arrowRight:              'icon-chevron-right',
			statusText:              null,
			statusFadeDelay:         5000,
			$_bar:                   null,
			onResize:                function(height) {
			},
			handlers:                {
				signIn:   null,
				signOut:  null,
				settings: null
			}
		},

		/**
		 * Sets the title
		 * @param title
		 * @returns {*}
		 */
		setTitle: function(title) {
			$('.dreambar-app-title', this.options.$_bar).html(title);
			return this;
		},

		/**
		 * Sets the status
		 * @param status
		 * @param delay
		 * @returns {*}
		 */
		setStatus: function(status, delay) {
			delay = delay || this.options.statusFadeDelay;
			$('.dreambar-status', this.options.$_bar).stop().html(status).delay(delay).animate({opacity: 0});
			return this;
		},

		/**
		 * Set the auth flag
		 * @param how
		 */
		setAuth: function(how) {
			if (how) {
				$('.dreambar-controls').addClass('auth');
			}
			else {
				$('.dreambar-controls').removeClass('auth');
			}
		},

		/**
		 * Add an item to the menu
		 * @param href
		 * @param title
		 * @param active
		 * @param attributes
		 */
		addMenuItem: function(href, title, active, attributes) {
			attributes = attributes || '';
			if (active) active = 'active';
			$('.dreambar-app-menu ul.nav').append('<li class="' + active + '"><a href="' + href + '" ' + attributes + '>' + title + '</a></li>');
		},

		/**
		 * Remove all items from the menu
		 */
		clearMenu: function() {
			$('.dreambar-app-menu ul.nav').empty();
			return this;
		},

		/**
		 * Set icon event handler
		 * @param which
		 * @param handler
		 * @returns {*}
		 */
		setHandler: function(which, handler) {
			if (!this.handlers[which]) throw new EventException('Invalid handler name');

			this.handlers[which] = handler;
			return this;
		},

		/**
		 * Set up the bar...
		 */
		init: function() {
			var _self = this;
			var $_bar = $(this.options.selector);

			//  Build the header structure
			$_bar.append('	<div class="dreambar-hot-spot span6 pull-left">' +
				'		<span class="dreambar-menu-icon"></span>' +
				'		<span class="dreambar-app-icon loading-indicator spinning"><i class="icon-spinner icon-spin"></i></span>' +
				'		<span class="dreambar-app-title"></span>' +
				'		<div class="dreambar-divider"></div>' +
				'	</div>' +
				'	<div class="dreambar-controls span6 pull-right">' +
				'	  <div class="dreambar-status"></div>' +
				'		<div class="dreambar-divider"></div>' +
				'		<a href="#" onClick="Actions.showApp(\'admin\',\'/public/admin/#/app\',\'0\')" id="dreambar-controls-settings"><i class="icon-cog"></i></a>' +
				'		<a href="#" onClick="Actions.doSignInDialog()" id="dreambar-controls-signin"><i class="icon-signin"></i></a>' +
				'		<a href="#" onClick="Actions.doSignOutDialog()" id="dreambar-controls-signout"><i class="icon-signout"></i></a>' +
				'		<a href="#" class="dreambar-toggle-fullscreen"><i class="icon-fullscreen"></i></a>' +
				'	</div>'
			).addClass('dreambar container-fluid');

			//  Append the app menu
			$('body').append('<div class="dreambar-app-menu"><ul class="nav"><li><a href="#">Option 1</a></li><li><a href="#">Option 2</a></li><li><a href="#">Option 3</a></li><li><a href="#">Option 4</a></li><li><a href="#">Option 5</a></li></ul></div>');

			//  Save some junk
			this.options.$_bar = $_bar;

			var $_menu = $('.dreambar-app-menu');
			var $_icon = $('.dreambar-app-icon');
			var $_fsToggle = $('.dreambar-toggle-fullscreen');

			//  Hotspot toggler
			$('.dreambar-hot-spot', $_bar).on('click', function(e) {
				_toggleAppMenu(this, e);
			});

			/**
			 * App menu toggler
			 * @param element
			 * @param event
			 * @private
			 */
			var _toggleAppMenu = function(element, event) {
				var $_this = element ? $(element) : $('.dreambar-hot-spot', $_bar);
				if ($_this.hasClass('open')) {
					$_menu.animate({left: '-500px'}, 'fast');
					$_this.removeClass('open');
				}
				else {
					if (event) {
						$_menu.animate({left: 0}, 'fast');
						$_this.addClass('open');
					}
				}
			};

			/**
			 * Shows me
			 * @private
			 */
			var _show = function() {
				if ($_fsToggle && $_fsToggle.length) {
					$('i', $_fsToggle).addClass('icon-fullscreen').removeClass('icon-resize-full');

					_self.options.$_bar.animate({height: '40px'}, 'fast',function() {
						$(this).css({height: '40px', display: 'block'});
						$_fsToggle.removeClass('toggled');
						_self.options.$_bar.removeClass('toggled');
						_self.options._fullScreen = false;
					}).css({cursor: 'normal'});
					$(_self.options.clientContainerSelector).animate({'margin-top': '40px', 'height': ($(this).outerHeight() - 40) + 'px'}, 'fast', function() {
						_onResize(window, _self);
					});
				}
			};

			/**
			 * Hides me
			 * @private
			 */
			var _hide = function() {
				if ($_fsToggle && $_fsToggle.length) {
					//  Hide the app menu
					_toggleAppMenu();

					_self.options.$_bar.animate({height: '5px'}, 'fast',function() {
//            $(this).css({height: '5px', display: 'block'});
						$_fsToggle.addClass('toggled');
						_self.options.$_bar.addClass('toggled');
						_self.options._fullScreen = true;

						$('i', $_fsToggle).addClass('icon-resize-full').removeClass('icon-fullscreen');
					}).css({cursor: 'pointer'});

					$(_self.options.clientContainerSelector).animate({'margin-top': '5px', 'height': ($(this).outerHeight() + 40) + 'px'}, 'fast', function() {
						_onResize(window, _self);
					});
				}
			};

			/**
			 * Full screen toggle
			 */
			_self.options.$_bar.on('click', function(e) {
				if (_self.options._fullScreen) {
					e.preventDefault();
					_show();
				}
			});

			/**
			 * Screen size toggle
			 */
			$_fsToggle.on('click', function(e) {
				e.preventDefault();

				var $_link = $(this);

				if ($_link.length && $_link.hasClass('toggled')) {
					_show();
				}
				else {
					_hide();
				}

				e.stopPropagation();
			});

			/**
			 * Shows the ajax spinner
			 * @private
			 */
			var _showSpinner = function() {
				if (!$_icon.hasClass('spinning')) {
					$_icon.addClass('spinning');
				}
			};

			/**
			 * Hides the ajax spinner
			 * @private
			 */
			var _hideSpinner = function() {
				if ($_icon.hasClass('spinning')) {
					$_icon.removeClass('spinning');
				}
			};

			/**
			 * Internal resize method
			 * @private
			 */
			var _onResize = function(viewport, dreambar) {
				//  Calculate height less size of header...
				var _height = $(viewport).height();
				$('.dreambar-app-menu').height(_height - dreambar.options.$_bar.height());

				var $_client = $(dreambar.options.clientContainerSelector);

				if ($_client && $_client.length) {
					var _space = $('header').outerHeight() + $('footer').outerHeight() + ( $_client.outerHeight() - $_client.height());
					$_client.height(_height - _space);
				}

				dreambar.options.onResize(_height);
			};

			//  Create a resize hook and fire it
			$(window).on('resize',function() {
				_onResize(this, _self);
			}).trigger('resize');

			/**
			 * Ajax start
			 */
			$(document).ajaxStart(function() {
				_showSpinner();
			});

			/**
			 * Ajax stop
			 */
			$(document).ajaxStop(function() {
				_hideSpinner();
			});

			_hideSpinner();

			//	Icon event dispatcher
			$('a[id^="dreambar-controls-"]').on('click', function(e) {
				e.preventDefault();

				var _handler = this.handlers[$(this).attr('id').replace('dreambar-controls-', '')];

				if (_handler && $.isFunction(_handler)) {
					return _handler(e);
				}

				return true;
			});

			return _self;
		}
	}
})(jQuery, window, document);
