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
 * DreamPanel jQuery plugin
 * @param defaults
 * @param $
 * @param window
 * @param [document]
 * @param [undefined]
 */
;
(function(defaults, $, window, document, undefined) {

	$.extend({
		// Function to change the default properties of the plugin
		// Usage: jQuery.dreamPanelSetup({prop:val,...});
		dreamPanelSetup: function(options) {
			return $.extend(defaults, options);
		}
	}).fn.extend({

			/**
			 * Constructor: jQuery(selector).dreamPanel({property:'value'});
			 * @param [options]
			 * @returns {*}
			 */
			dreamPanel: function(options) {
				var _options = $.extend({}, defaults, options || {});

				return $(this).each(function() {
					var _self = this, $_self = $(this);

					//	Store some refs
					_options.$_buddy = $(_options.rightBorder);

					//	Add the collapsed title container if not there
					_options.$_title = $('.dreampanel-collapsed-title', $_self);
					_options.$_panelContent = $('.dreampanel .dreampanel-content');

					if (!_options.$_title.length) {
						$_self.append('<div class="dreampanel-collapsed-title">' + _options.collapsedTitle + '</div>');
						_options.$_title = $('.dreampanel-collapsed-title', $_self);
					}

					//	Click event triggers panel open/close
					$('.dreampanel .dreampanel-collapse i').on('click', function(e) {
						e.preventDefault();

						console.clear();

						var _promises = [$_self, _options.$_title, _options.$_buddy];

						if ($(this).hasClass('icon-flip-horizontal')) {
							//	Close the panel...
							$(this).removeClass('icon-flip-horizontal');

							//	Stop anything going on now...
							$([$_self, _options.$_title, _options.$_panelContent, _options.$_buddy]).clearQueue();

							//	Hide the panel content, show the sideways thingy
							_options.$_panelContent.hide();
							_options.$_title.text(_options.collapsedTitle).animate({opacity: 1, duration: _options.showTitleSpeed});

							//	Collapse the panel
							$_self.animate({width: _options.collapsedWidth}, _options.collapseSpeed);

							//	Slide the right side too
							_options.$_buddy.animate({
								width:    '+=' + ($(window).outerWidth() - _options.collapsedWidth) - _options.rightBorderWidth,
								duration: _options.collapseSpeed
							});
						} else {
							//	Open the panel
							$(this).addClass('icon-flip-horizontal');

							//	Only show content and title when complete...
							_options.$_title.animate({opacity: 0, duration: _options.hideTitleSpeed});

							$_self.stop().animate({
								width:    _options.initialWidth,
								duration: _options.openSpeed
							}, function() {
								_options.$_panelContent.show();
							});

							//	Shrink the right side dude too
							_options.$_buddy.animate({width: _options.$_buddy.outerWidth() + _options.initialWidth}, _options.openSpeed);
						}

						//	Throw a resize when all animations are done...
						$.when.apply($, _promises).done(function() {
							console.info(arguments);

							console.log('--------------------');
							console.log('           [PROMISE]');
							console.log('cWidth: ' + _options.currentWidth + ', cHeight: ' + _options.currentHeight + ', rightBorderWidth: ' + _options.rightBorderWidth);
							console.log('--------------------');

							$(window).trigger('resize');
						});
					});

					//  Catch resize events
					$(window).on('resize', function() {

						_options.currentWidth = $_self.outerWidth();
						_options.currentHeight = ( $(this).outerHeight() - _options.heightOffset);
						_options.rightBorderWidth = $(this).outerWidth() - _options.initialWidth;

						$_self.height(_options.currentHeight);
						$(_self.rightBorder).width(_options.rightBorderWidth);

						console.log('---------------------');
						console.log('           [RESIZE]');
						console.log('w.width: ' + $(window).outerWidth() + ', left.width: ' + $_self.outerWidth() + ', b.width: ' + _options.$_buddy.outerWidth());
						console.info(arguments);
						console.log('---------------------');
						console.info(_options);

					});

					$(window).trigger('resize');
				});
			},

			otherMethod: function(options) {
				// Some logic
				// Calling the function:
				// jQuery(selector).otherMethod(options);
			}
		});
})({
	//	Default options
	initialWidth:           200,
	collapsedWidth:         20,
	collapsedTitle:         'DreamPanel',
	currentWidth:           200,
	currentHeight:          0,
	rightBorder:            '.dreampanel-right-border',
	rightBorderWidth:       0,
	rightBorderWidthOffset: 12,
	heightOffset:           8,
	showTitleSpeed:         300,
	hideTitleSpeed:         300,
	collapseSpeed:          300,
	openSpeed:              300

}, jQuery, window, document);
