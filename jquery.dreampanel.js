;
(function($) {
	$.widget("ui.dreampanel", {

		VERSION: '1.0',

		options: {
			renderExpanded:  $.noop,
			renderCollapsed: $.noop,
			persist:         $.noop,
			collapsedWidth:  30,
			expandedWidth:   200,
			dockText:        'Dock',
			undockText:      'Undock',
			dockTitle:       'Dock the panel so it can always be seen',
			undockTitle:     'Undock the panel so it is hidden when not in focus'},

		CLASS_NAMES: {
			dreampanel:  'dreampanel',
			placeholder: 'dreampanel-placeholder',
			detached:    'dreampanel-detached',
			expanding:   'dreampanel-expanding',
			expanded:    'dreampanel-expanded',
			collapsed:   'dreampanel-collapsed',
			collapsing:  'dreampanel-collapsing'
		},

		_create:                  function() {
			_.bindAll(this);

			if (!this.element.data("dream.panel")) {
				this.element.data("dream.panel", true);
				this.element.bind("updateOffsets.popout", this.updateOffsets);
				this.element.bind("updateOffsets.reset", this.reset);

				this.element.delegate(".ui-dock", "click", _.bind(function(b) {
					$(b.currentTarget).tipsy("hide").removeData("tipsy");
					this.dock(true);
					b.preventDefault()
				}, this));

				this.element.delegate(".ui-undock", "click", _.bind(function(b) {
					$(b.currentTarget).tipsy("hide").removeData("tipsy");
					this.undock(true);
					b.preventDefault()
				}, this));
				this.isDocked = this.options.isDocked;
				this.useTransitions = !jQuery.browser.msie || parseInt(jQuery.browser.version, 10) > 8;
				if (this.options.isDocked) {
					this._renderUnDock()
				} else {
					this._enableUndockedMode()
				}
				this.updateOffsets()
			}
		}, _getUndockedClasses:   function() {
			return[this.CLASS_NAMES.detached].join(" ")
		}, _getUndockedStates:    function() {
			return[this.CLASS_NAMES.collapsed, this.CLASS_NAMES.collapsing, this.CLASS_NAMES.expanding, this.CLASS_NAMES.expanded].join(" ")
		}, _setUndockedState:     function(b) {
			this.element.removeClass(this._getUndockedStates());
			this.element.addClass(b)
		}, unbindHoverIntent:     function() {
			this.element.off("mouseleave mouseenter mousemove");
			this.element[0].hoverIntent_s = 0
		}, bindHoverIntent:       function() {
			this.element.hoverIntent({interval: 40, over: this.expand, out: this.collapse, sensitivity: 8})
		}, _unbindUnDockedEvents: function() {
			this.unbindHoverIntent();
			$(window).unbind("scroll", this.updateOffsets)
		}, _bindUnDockedEvents:   function(b) {
			this.bindHoverIntent();
			$(window).scroll(this.updateOffsets);
			this.element[0].hoverIntent_s = b ? 1 : 0
		}, isUndocked:            function() {
			return this.element.hasClass(this.CLASS_NAMES.detached)
		}, _registerMousePos:     function(b) {
			this._clientX = b.clientX;
			this._clientY = b.clientY
		}, _handleDropdown:       function() {
			$(document).mousemove(this._registerMousePos);
			if (this.isUndocked() && AJS.InlineLayer.current.offsetTarget().closest(this.element).size()) {
				this.unbindHoverIntent();
				JIRA.one(AJS.InlineLayer.EVENTS.hide, _.bind(function() {
					_.defer(_.bind(function() {
						if (!AJS.InlineLayer.current) {
							if (JIRA.Dialog.current || this._clientX > this.element.offset().left + this.element.outerWidth()) {
								this.collapse(JIRA.Dialog.current ? false : true);
								this.bindHoverIntent()
							} else {
								this.bindHoverIntent();
								this.element[0].hoverIntent_s = 1
							}
							$(document).unbind("mousemove", this._registerMousePos)
						}
					}, this))
				}, this))
			}
		}, updateOffsets:         function(f) {
			if (this.element.is(":visible")) {
				var d = $("body").height() > $(window).height();
				if (d) {
					this.element.addClass("ui-sidebar-scrollable")
				} else {
					this.element.removeClass("ui-sidebar-scrollable")
				}
				if (this.isUndocked()) {
					var c = this._getPlaceholder().offset().top;
					var g = jQuery(window).scrollTop();
					var h = Math.max(c - g, 0);
					var b = d ? $(window).height() - h : Math.min(this._getPlaceholder().outerHeight(),
						$(window).height() - this._getPlaceholder().offset().top);
					var e = {top: h, height: b};
					if (f) {
						e.width = f
					}
					this.element.css(e)
				}
			}
		}, _renderUnDock:         function() {
			if (this.isDocked && !this.element.find(".ui-undock").size()) {
				this.element.find(".ui-dock").remove();
				this._renderDockingLink(this.options.undockText, this.options.undockTitle, "ui-undock")
			}
		}, _renderDock:           function() {
			if (this.isUndocked() && !this.element.find(".ui-dock").size()) {
				this.element.find(".ui-undock").remove();
				this._renderDockingLink(this.options.dockText, this.options.dockTitle, "ui-dock")
			}
		}, _renderDockingLink:    function(e, d, b) {
			var c = $("<a class='aui-button aui-button-subtle' href='#'/>").addClass(b).append($("<span class='icon'/>").text(e)).attr("title", d);
			c.tipsy({trigger: "manual"}).hoverIntent({interval: 200, over: function() {
				AJS.$(this).tipsy("show")
			}, out:                                             function() {
				AJS.$(this).tipsy("hide")
			}});
			this._getContents().find(this.options.toggleTarget).append(c)
		}, renderDockState:       function() {
			if (this.isDocked) {
				this._renderUnDock()
			} else {
				this._renderDock()
			}
		}, _enableUndockedMode:   function(b) {
			this.element.addClass(this.CLASS_NAMES.dreampanel);
			if (!this.isUndocked()) {
				this._getPlaceholder().insertBefore(this.element);
				this.element.addClass(this.CLASS_NAMES.detached).addClass(this.CLASS_NAMES.collapsed).appendTo("body")
			}
			this.updateOffsets();
			this._bindUnDockedEvents(b);
			JIRA.bind(AJS.InlineLayer.EVENTS.show, this._handleDropdown)
		}, _getPlaceholder:       function() {
			if (!this.placeholder) {
				this.placeholder = $("<div class='navigator-sidebar collapsed' />")
			}
			return this.placeholder
		}, toggle:                function() {
			if (!this.isExpanding() && !this.isCollapsing()) {
				if (this.isDocked) {
					this.element.find(".ui-undock").tipsy("hide").removeData("tipsy");
					this.undock(false)
				} else {
					this.element.find(".ui-dock").tipsy("hide").removeData("tipsy");
					this.dock(false)
				}
			}
		}, undock:                function(b) {
			if (!this.isUndocked()) {
				this.isDocked = false;
				this.options.persist(false);
				this._getPlaceholder().insertBefore(this.element);
				this.element.addClass(this._getUndockedClasses() + " " + this.CLASS_NAMES.expanded).appendTo("body");
				if (b !== false && this.useTransitions) {
					this._getPlaceholder().width(this.options.expandedWidth).animate({width: this.options.collapsedWidth}, 200)
				} else {
					this._getPlaceholder().width(this.options.collapsedWidth)
				}
				this.updateOffsets(this.options.expandedWidth);
				this.collapse(b, _.bind(function() {
					this._enableUndockedMode(false)
				}, this))
			}
		}, dock:                  function(b) {
			if (this.isUndocked()) {
				this.isDocked = true;
				this._unbindUnDockedEvents();
				this.options.persist(true);
				if (b !== false && this.useTransitions) {
					this._getPlaceholder().animate({width: this.options.expandedWidth}, 200, _.bind(this._dockingComplete, this))
				} else {
					this._dockingComplete()
				}
			}
		}, _dockingComplete:      function() {
			this.element.removeClass(this._getUndockedClasses());
			this.element.removeClass(this._getUndockedStates());
			this.element.css({height: "", width: "", top: ""}).insertBefore(this._getPlaceholder());
			this._getPlaceholder().remove();
			this.options.renderExpanded(this.element);
			this._renderUnDock();
			JIRA.Issues.triggerHorizontalResize()
		}, _getContents:          function() {
			if (!this.element.find(".ui-sidebar-content").size()) {
				this.element.wrapInner("<div class='ui-sidebar-content' />")
			}
			return this.element.find(".ui-sidebar-content")
		}, expand:                function(b) {
			if (this.isCollapsed()) {
				this.updateOffsets();
				if (b !== false && this.useTransitions) {
					this._setUndockedState(this.CLASS_NAMES.expanding);
					this.element.animate({width: this.options.expandedWidth}, 150, _.bind(function() {
						this._setUndockedState(this.CLASS_NAMES.expanded);
						this.options.renderExpanded(this.element);
						this._renderDock();
						this._getContents().css("opacity", 0).animate({opacity: 1}, 200, _.bind(this._expandingComplete, this))
					}, this))
				} else {
					this.options.renderExpanded(this.element);
					this._renderDock();
					this._expandingComplete()
				}
			} else {
				if (this.isCollapsing()) {
					this.activityAfterTransition = "expand"
				} else {
					if (this.isExpanding()) {
						this.activityAfterTransition = null
					}
				}
			}
		}, _expandingComplete:    function() {
			JIRA.Issues.triggerHorizontalResize();
			this._bindUnDockedEvents(true);
			this._setUndockedState(this.CLASS_NAMES.expanded);
			if (this.activityAfterTransition === "collapse") {
				this.activityAfterTransition = null;
				this.collapse(true)
			}
		}, collapse:              function(b, c) {
			if (this.isExpanded()) {
				if (b !== false && this.useTransitions) {
					this._setUndockedState(this.CLASS_NAMES.collapsing);
					this._getContents().animate({opacity: 0}, 150, _.bind(function() {
						this.options.renderCollapsed(this.element);
						this.element.width(this.options.expandedWidth);
						this.element.animate({width: this.options.collapsedWidth}, 150, _.bind(function() {
							this._collapsingComplete(c)
						}, this))
					}, this))
				} else {
					this.options.renderCollapsed(this.element);
					this.element.width("");
					this._collapsingComplete(c)
				}
			} else {
				if (this.isExpanding()) {
					this.activityAfterTransition = "collapse"
				} else {
					if (this.isCollapsing()) {
						this.activityAfterTransition = null
					}
				}
			}
		}, _collapsingComplete:   function(b) {
			this._setUndockedState(this.CLASS_NAMES.collapsed);
			JIRA.Issues.triggerHorizontalResize();
			this._bindUnDockedEvents(false);
			if (this.activityAfterTransition === "expand") {
				this.activityAfterTransition = null;
				this.expand(true)
			}
			if (typeof b === "function") {
				b()
			}
		}, isCollapsed:           function() {
			return this.element.hasClass(this.CLASS_NAMES.collapsed)
		}, isCollapsing:          function() {
			return this.element.hasClass(this.CLASS_NAMES.collapsing)
		}, isExpanded:            function() {
			return this.element.hasClass(this.CLASS_NAMES.expanded)
		}, isExpanding:           function() {
			return this.element.hasClass(this.CLASS_NAMES.expanding)
		}})
}(jQuery));
