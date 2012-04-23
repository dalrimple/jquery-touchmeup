/*
/ General touchSwipe manager
*/
(function($){
	//////////////////////////////////
	// PRIVATE PROPERTIES & METHODS //
	//////////////////////////////////

	var config = {
		dataPrefix: "swipeListenerId_",
		dragThreshold: 20,
		errorFn: alert,
		errorMessages: {invalidAction:'Action must be either LEFT, RIGHT, UP or DOWN.'}
	}

	var listenerLookup = new Object();
	var unqId = 0;

	function validateAction(action) {
		return action == 'LEFT' || action == 'RIGHT' || action == 'UP' || action == 'DOWN';
	}

	function touchStartListener(e, action, callback) {
		//trace("touchStartListener", action, callback);
		//return;
		
		//TODO This return object is too blunt. Make a friendly return object that optionaly 
		//     contains the original event based on a config parameter. At least x & y coords and
		//     context of x & y position. Maybe also delta from touch event.
		var r = new Object();
		r.touchstartEvent = e;
		r.touchmoveEvents = new Array();

		var touch = e.touches[0];
		var pageXStart = touch.pageX;
		var pageYStart = touch.pageY;
		var deltaX, deltaY;
		var isSwipe = false;
		function touchDrag(e) {
			r.touchmoveEvents.push = e;	
			var touch = e.touches[0];
			deltaX = touch.pageX - pageXStart;
			deltaY = touch.pageY - pageYStart;
			//enable scrolling in directions the swipe is not listening to.
			if (e.touches.length == 1 && (Math.abs(deltaX) < config.dragThreshold || Math.abs(deltaY) < config.dragThreshold)) {
				if (deltaX < 0 && Math.abs(deltaX) > Math.abs(deltaY) && action == "LEFT") {
					isSwipe = true;
				} else if(deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY) && action == "RIGHT") {
					isSwipe = true;
				} else if(deltaY < 0 && Math.abs(deltaX) < Math.abs(deltaY) && action == "UP") {
					isSwipe = true;
				} else if(deltaY > 0 && Math.abs(deltaX) < Math.abs(deltaY) && action == "DOWN") {
					isSwipe = true;
				}
			}
			if (isSwipe) e.preventDefault();
		}
		document.addEventListener('touchmove', touchDrag, false);
		function touchCleanup(e) {
			//run any callbacks
			if (isSwipe) {
				var swipedEnough = false;
				if (-deltaX > config.dragThreshold && action == "LEFT") {
					swipedEnough = true;
				} else if (deltaX > config.dragThreshold && action == "RIGHT") {
					swipedEnough = true;
				} else if (-deltaY > config.dragThreshold && action == "UP") {
					swipedEnough = true;
				} else if (deltaY > config.dragThreshold && action == "DOWN") {
					swipedEnough = true;
				}
				if (swipedEnough) {
					//e.preventDefault();
					r.touchendEvent = e;
					callback(r);
				}
			}

			document.removeEventListener('touchmove', touchDrag, false);
			document.removeEventListener('touchend', touchCleanup, false);
		}
		document.addEventListener('touchend', touchCleanup, false);
	}

	function pushListener($el, action, callback) {
		var o = new Object();
		o.listener = function(e) {
			touchStartListener(e, action, callback);
		};
		o.callback = callback;
		var lookupId = config.dataPrefix + unqId++;
		listenerLookup[lookupId] = o;
		if (!$el.data(config.dataPrefix + action)) $el.data(config.dataPrefix + action, new Array());
		$el.data(config.dataPrefix + action).push(lookupId);
		return o;
	}

	////////////////////
	// PUBLIC METHODS //
	////////////////////
	var methods = {
		add:function(action, callback) {
			if (!validateAction(action)) {
				config.errorFn(config.errorMessages.invalidAction);
				return this;
			}
			var listenerData = pushListener(this, action, callback);

			var el = this[0];
			if (el.addEventListener) el.addEventListener('touchstart', listenerData.listener, false);
			return this;
		},

		remove:function(action, callback) {
			if (!validateAction(action)) {
				config.errorFn(config.errorMessages.invalidAction);
				return this;
			}
			var dataList = this.data(config.dataPrefix + action);
			var listenerData;

			for (var i = 0, l = dataList.length; i < l; i++) {
				if (listenerLookup[dataList[i]].callback == callback) {
					listenerData = listenerLookup[dataList[i]];
					break;	
				}
			}
			var el = this[0];
			if (el.removeEventListener && !!listenerData) el.removeEventListener('touchstart', listenerData.listener, false);
			return this;
		},
		config:function(options) {
			$.extend(config, options);
		}
	}

	//Manage method calling and initiation (standard jQuery plugin pattern)
	$.fn.touchMeUP = function(method) {
		// Method calling logic
		if ( methods[method] ) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if ( typeof method === 'object' || !method ) {
			return methods.init.apply( this, arguments );
		} else {
			//trace( 'Method ' +  method + ' does not exist on jQuery.touchmeup' );
		}
	};
})(jQuery);