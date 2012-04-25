# jQuery touchMeUp #

An attempt at making a robust and easy to use touch plugin for jQuery.

### Dependancies ###

Just [jQuery](http://jquery.com/).

### Usage ###

Make sure jquery.touchmeup.js is included after the jQuery library:

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
	<script src="jquery.touchmeup.js"></script>

To add or remove touch listeners on an element:

	$("#touchTarget").touchMeUp("add", "LEFT", function() {
		/* code triggered by swipe left */
	});

The first argument can be `"add"` or `"remove"` to (you guessed it) add or remove the touch listener to the element.
The second argument can be `"LEFT"`, `"RIGHT"`, `"UP"` or `"DOWN"` to determine the direction of the swipe event to listen for.
The third argument is the function that is called on completion of the swipe event.

All arguments are required.

The plugin also has some configuration options that can be set at any time using the `"config"` function:

	var configObject = {
		dataPrefix: "swipeListenerId_",
		dragThreshold: 20,
		errorFn: alert,
		errorMessages: {invalidAction:'Action must be either LEFT, RIGHT, UP or DOWN.'}
	}
	$.fn.touchMeUp("config", configObject);

`dataPrefix` is used as a prefix to data that is saved on the jQuery objects that listeners are attached to. If there is a possibility of a conflict with other data values, this can be changed to something unique.  
`dragThreshold` is a distance within which the direction of a swipe event is determined.  
`errorFn` is a a function that is called when an error is detected in the usage of the plugin.  
`errorMessages` is an object containing the error messages passed to the error function.  

These defaults should not have to be changed, but the option is there if needed.

Have a look at the index.html file for usage examples.

### TODO ###

Currently only swipes are supported, I plan on implementing events for taps, pinches, drags and multitouch. Also the event data that is passed to the listener function needs a lot of work to be useful, currently it is just a collection of all of the default event data in one object.

##### acknowledgements #####

Thanks to [Charlie Gleason](https://github.com/superhighfives) for your support.