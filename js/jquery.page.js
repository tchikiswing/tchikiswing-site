(function(window, undefined) {
				
	var Page	= (function() {
	
		var $container			= $( '#container' ),
			// the scroll container that wraps the articles
			$scroller			= $container.find( 'div.content-scroller' ),
			$menu				= $container.find( 'aside' ),
			// menu links
			$links				= $menu.find( 'nav > a' ),
			$articles			= $container.find( 'div.content-wrapper > section' ),
			// button to scroll to the top of the page
			// only shown when screen size < 715
			$toTop				= $container.find( 'a.totop-link' ),
			// the browser nhistory object
			History 			= window.History,
			// animation options
			animation			= { speed : 800, easing : 'easeInOutExpo' },
			// jScrollPane options
			scrollOptions		= { verticalGutter : 0, hideFocus : true },
			// init function
			init				= function() {
				
				// initialize the jScrollPane on both the menu and articles
				_initCustomScroll();
				// initialize some events
				_initEvents();
				// sets some css properties 
				_layout();
				// jumps to the respective chapter
				// according to the url
				_goto();
				
			},
			_initCustomScroll	= function() {
				
				// Only add custom scroll to articles if screen size > 715.
				// If not the articles will be expanded
				if( $(window).width() > 715 ) {
				
					$articles.jScrollPane( scrollOptions );
				
				}
				// add custom scroll to menu
				$menu.children( 'nav' ).jScrollPane( scrollOptions );
			
			},
			_goto				= function( chapter ) {
					// get the url from history state (e.g. chapter=3) and extract the chapter number
				var chapter 	= chapter || History.getState().url.queryStringToJSON().section,
					isHome		= ( chapter === undefined ),
					
					
					// we will jump to the introduction chapter if theres no chapter
					$article 	= $( chapter ? '#' + 'section_' + chapter : '#' + 'section_home' );
				if( $article.length ) {
				
						// left / top of the element
					var left		= $article.position().left,
						top			= $article.position().top,
						// check if we are scrolling down or left
						// is_v will be true when the screen size < 715
						is_v		= ( $(document).height() - $(window).height() > 0 ),
						// animation parameters:
						// if vertically scrolling then the body will animate the scrollTop,
						// otherwise the scroller (div.content-scroller) will animate the scrollLeft
						param		= ( is_v ) ? { scrollTop : (isHome) ? top : top + $menu.outerHeight( true ) } : { scrollLeft : left },
						$elScroller	= ( is_v ) ? $( 'html, body' ) : $scroller;
					
					$elScroller.stop().animate( param, animation.speed, animation.easing, function() {
						
						// active class for selected chapter
						$articles.removeClass( 'content-active' );
						$article.addClass( 'content-active' );
						
					} );
				
				}
			
			},
			_saveState			= function( chapter ) {
			
				// adds a new state to the history object
				// this will trigger the statechange on the window
				if( History.getState().url.queryStringToJSON().chapter !== chapter ) {
						
					History.pushState( null, null, '?section=' + chapter );
				}
			
			},
			_layout				= function() {
			
				// control the overflow property of the scroller (div.content-scroller)
				var windowWidth	= $(window).width();
				switch( true ) {
				
					case ( windowWidth <= 750 ) : $scroller.scrollLeft( 0 ).css( 'overflow', 'visible' ); break;
					case ( windowWidth <= 1024 ): $scroller.css( 'overflow-x', 'scroll' ); break;
					case ( windowWidth > 1024 ) : $scroller.css( 'overflow', 'hidden' ); break;
				
				};
			
			},
			_initEvents			= function() {
				
				_initWindowEvents();
				_initMenuEvents();
				_initArticleEvents();
				
			},
			_initWindowEvents	= function() {
			
				$(window).on({
					// when resizing the window we need to reinitialize or destroy the jScrollPanes
					// depending on the screen size
					'smartresize' : function( event ) {
						
						_layout();
						
						$('section.content').each( function() {
							
							var $article 	= $(this),
								aJSP		= $article.data( 'jsp' );
							
							if( $(window).width() > 715 ) {
								
								( aJSP === undefined ) ? $article.jScrollPane( scrollOptions ) : aJSP.reinitialise();
								
								_initArticleEvents();
								
							}	
							else {
								
								// destroy article's custom scroll if screen size <= 715px
								if( aJSP !== undefined )
									aJSP.destroy();
								
								$container.off( 'click', 'section.content' );
								
							}
							
						});
						
						var nJSP = $menu.children( 'nav' ).data( 'jsp' );
						nJSP.reinitialise();
						
						// jumps to the current chapter
						_goto();
					
					},
					// triggered when the history state changes - jumps to the respective chapter
					'statechange' : function( event ) {
						
						_goto();
					
					}
				});
			
			},
			_initMenuEvents		= function() {
			
				// when we click a menu link we check which chapter the link refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				$links.on( 'click', function( event ) {
					
					var href		= $(this).attr('href'),
						chapter		= ( href.search(/section_/) !== -1 ) ? href.substring(9) : 0;
					
					_saveState( chapter );
					
					return false;
				
				});
			
				// scrolls to the top of the page.
				// this button will only be visible for screen size < 715
				$toTop.on( 'click', function( event ) {
					
					$( 'html, body' ).stop().animate( { scrollTop : 0 }, animation.speed, animation.easing );
					
					return false;
				
				});
			
			},
			_initArticleEvents	= function() {
			
				// when we click on an article we check which chapter the article refers to,
				// and we save the state on the history obj.
				// the statechange of the window is then triggered and the page/scroller scrolls to the 
				// respective chapter's position
				
				/*$container.on( 'click', 'section.content', function( event ) {
					
					var id			= $(this).attr('id'),
						chapter		= ( id.search(/chapter/) !== -1 ) ? id.substring(7) : 0;
					
					_saveState( chapter );
					
					return false;
				
				});*/
			
			};
			
			
			
			
			//
			//
			// ADDITIONAL SCRIPTS
			//
			//
			
			
			
			
			
			// Menu
			$(document).ready(function() {
				var section = window.location.href.queryStringToJSON().section;
				
				if (section === undefined) {
					$("a.nav_home").addClass('active');
				}
				else {
					$("a.nav_"+section).addClass('active');
				}
				
				$("a.nav").click(function(){
					$("a.nav").each(function(){
						$(this).removeClass('active');
					});
					
					$(this).addClass('active');
				});
			}); // End Menu
			
			
			
			
			
			
			
			
			
			
			// Flipclock (http://flipclockjs.com/)
			var clock;
			
			$(document).ready(function() {
				// Set dates.
				var futureDate  = new Date("December 31, 2016 12:00 PM EDT");
				var currentDate = new Date();

				// Calculate the difference in seconds between the future and current date
				var diff = futureDate.getTime() / 1000 - currentDate.getTime() / 1000;

				// Calculate day difference and apply class to .clock for extra digit styling.
				function dayDiff(first, second) {
					return (second-first)/(1000*60*60*24);
				}

				if (dayDiff(currentDate, futureDate) < 100) {
					$('.clock').addClass('twoDayDigits');
				} else {
					$('.clock').addClass('threeDayDigits');
				}

				if(diff < 0) {
					diff = 0;
				}

				// Instantiate a coutdown FlipClock
				clock = $('.clock').FlipClock(diff, {
					clockFace: 'DailyCounter',
					countdown: true
				});
			});
			
			$(window).on("load", function() {
				$(".clock").css('display', 'block');
			});
			// End Flipclock
			
			
			
			
			
			
			
			
			
			
			// Amplitude - SoundCloud Player
			Amplitude.init({
				"songs": [
					{
						"name": "Song 1",
						"artist": "Artist 1",
						"album": "Album Name 1",
						"url": "https://soundcloud.com/artist-1-song-1-url",
						"cover_art_url": "img/audio/album_1.jpg"
					},
					{
						"name": "Song 2",
						"artist": "Artist 2",
						"album": "Album Name 2",
						"url": "https://soundcloud.com/artist-2-song-2-url",
						"cover_art_url": "img/audio/album_2.jpg"
					},
					{
						"name": "Song 3",
						"artist": "Artist 3",
						"album": "Album Name 3",
						"url": "https://soundcloud.com/artist-3-song-3-url",
						"cover_art_url": "img/audio/album_3.jpg"
					}
				],
				"soundcloud_client": 'YOUR SOUNDCLOUD API KEY'
			});

			var expanded = true;
			var playlistEpxanded = true;			
			
			// Set fully expanded defaults
			$('.hidden-on-collapse').show();
			$('.hidden-on-expanded').hide();
			$('#small-player-playlist').show();			
			// End Amplitude - SoundCloud Player
			
			
			
			
			
			
			
			
			
			
			// Photo - Image Lightbox
			$( function(){
				// ACTIVITY INDICATOR

				var activityIndicatorOn = function()
					{
						$( '<div id="imagelightbox-loading"><div></div></div>' ).appendTo( 'body' );
					},
					activityIndicatorOff = function()
					{
						$( '#imagelightbox-loading' ).remove();
					},


					// OVERLAY

					overlayOn = function()
					{
						$( '<div id="imagelightbox-overlay"></div>' ).appendTo( 'body' );
					},
					overlayOff = function()
					{
						$( '#imagelightbox-overlay' ).remove();
					}


				//	WITH OVERLAY & ACTIVITY INDICATION

				$( 'a[data-imagelightbox="gal_1"]').imageLightbox(
				{
					onStart: 	 function() { overlayOn(); },
					onEnd:	 	 function() { overlayOff(); activityIndicatorOff(); },
					onLoadStart: function() { activityIndicatorOn(); },
					onLoadEnd:	 function() { activityIndicatorOff(); }
				});

				$( 'a[data-imagelightbox="gal_2"]').imageLightbox(
				{
					onStart: 	 function() { overlayOn(); },
					onEnd:	 	 function() { overlayOff(); activityIndicatorOff(); },
					onLoadStart: function() { activityIndicatorOn(); },
					onLoadEnd:	 function() { activityIndicatorOff(); }
				});

				$( 'a[data-imagelightbox="gal_3"]').imageLightbox(
				{
					onStart: 	 function() { overlayOn(); },
					onEnd:	 	 function() { overlayOff(); activityIndicatorOff(); },
					onLoadStart: function() { activityIndicatorOn(); },
					onLoadEnd:	 function() { activityIndicatorOff(); }
				});

			});
			// End Photo - Image Lightbox
			
			
			
			
			
			
			
			
			
			
			// Slider
			$(document).ready(function() {
				$(".contact_slider").responsiveSlides();
			});
			
			$(window).on("load", function() {
				$(".contact_slider").css('visibility', 'visible');
			});
			// End Slider
			
			
			
			
		return { init : init };	
	
	})();
	
	Page.init();
	
})(window);