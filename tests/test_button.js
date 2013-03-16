function createButton(node, actionHandler, imageURL) {
		var sm = new StateMachine();
		
		// treat states and events as bitmasks
		sm.bitMode(true, true);
		
		// states
		var STATE_INIT		= 1 << 1,
			STATE_IDLE		= 1 << 2,
			STATE_HOVER		= 1 << 3,
			STATE_PRESSED	= 1 << 4,
			STATE_PRESSED_OUT	= 1 << 5;
			
		// events
		var	KEYDOWN		= 1 << 1,
			KEYUP		= 1 << 2,
			MOUSE_OVER	= 1 << 3,
			MOUSE_OUT	= 1 << 4,
			MOUSE_DOWN	= 1 << 5,
			MOUSE_UP	= 1 << 6,
			READY		= 1 << 7;	
		
		// feed the machine!
		sm.feed(STATE_INIT, 	READY,		STATE_IDLE);
		sm.feed(STATE_IDLE,		MOUSE_OVER,	STATE_HOVER, function() {
			node.style.border = '1px solid red';
		});
		sm.feed(STATE_HOVER,	MOUSE_OUT,	STATE_IDLE, function() {
			node.style.border = '1px solid green';
		});
		sm.feed(STATE_HOVER|
				STATE_IDLE, 	MOUSE_DOWN,		STATE_PRESSED, function() {
			node.style.opacity = '0.5';
		});
		sm.feed(STATE_PRESSED, 	MOUSE_UP,	STATE_HOVER, function() {
			node.style.opacity = null;
		});		
		sm.feed(STATE_PRESSED, 	MOUSE_OUT,	STATE_PRESSED_OUT);
		sm.feed(STATE_PRESSED_OUT, 	
								MOUSE_OVER,	STATE_PRESSED);
		sm.feed(STATE_PRESSED_OUT, 	
								MOUSE_UP,	STATE_IDLE, function() {
			node.style.border = '1px solid green';
			node.style.opacity = null;
		});
		
		// init machine
		sm.init(STATE_INIT);
		
		// load icon and create button
		var icon = new Image();
		icon.addEventListener("load", function() {
			sm.event(READY);
						
			node.style.width = '100px';
			node.style.height = '100px';
			node.style.border = '1px solid green';
			node.style.background = 'url('+imageURL+')';
			
			node.addEventListener('mouseover',	sm.delegate(MOUSE_OVER));
			node.addEventListener('mouseout',	sm.delegate(MOUSE_OUT));
			node.addEventListener('mousedown',	sm.delegate(MOUSE_DOWN));
			window.addEventListener('mouseup',	sm.delegate(MOUSE_UP));
			node.addEventListener('keydown',	sm.delegate(KEYDOWN),
				function(event) {
					if(event.keyCode == 13)
						return true;
				});			
		});
		icon.src = imageURL;
		
		return sm;
}