/*
	Exhibition Gallery
	Parallelism by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

var parallelism = (function($) { var _ = {

	/******************************/
	/* Properties                 */
	/******************************/

		// Settings
			settings: {

				// Mobile only.

					// If true, mobile mode will get some automatic styling.
						autoStyleMobile: true,

				// Desktop only.

					// If true, reel will be vertically centered.
						centerVertically: true,

					// Delay (in ms) before showing the reel.
						introDelay: 600,

					// Speed (in ms) at which to fade in reel.
						introSpeed: 750,

					// Height (in px) of items.
						itemHeight: 230,

					// Default width (in px) of width.
						itemWidth: 300,

					// Margin (in px) to preserve at the bottom of the viewport.
						marginBottom: 0,

					// Margin (in px) to preserve at the top of the viewport.
						marginTop: 0,

					// Nudge the reel by this value (in px) after it's been vertically centered.
						verticalNudge: -50,

					// Maximum number of rows.
						maxRows: 3,

					// Minimum number of rows.
						minRows: 1,

					// Padding (in px) between items (0 = no padding).
						padding: 5,

					// Padding color.
						paddingColor: '#808080',

					// If true, reel scroll will reset on page refresh.
						resetScroll: true,

					// Scales the scroll delta (1 = normal, 2 = double, 0.5 = half, etc.).
						scrollFactor: 1,

					// Scroll amount when using keys.
						scrollKeyAmount: 50,

					// Determines where scrollwheel events should be captured ('window' or 'reel').
						scrollWheelTarget: 'reel',

					// Scroll amount when using scroll zones.
						scrollZoneAmount: 10,

					// Time (in ms) to wait between scrolls when the cursor is in a scroll zone.
						scrollZoneDelay: 20,

					// Width of scroll zones.
						scrollZoneWidth: 40,

					// Delay (in ms) before showing thumbnails.
						thumbDelay: 1200,

					// Spread (in ms) to randomly stagger thumbnails (0 = don't stagger).
						thumbDelaySpread: 1500,

					// Speed (in ms) at which to fade in thumbnails.
						thumbSpeed: 750,

					// If true, page will blur slightly when the popup is displayed.
						useBlurFilter: true,

					// If true, the left/right arrow keys will scroll the reel.
						useScrollKeys: true,

					// If true, moving the cursor to the leftmost/rightmost edges of the reel will scroll it.
						useScrollZones: true

			},

		// Touch device?
			isTouch: false,

		// IE version.
			IEVersion: 99,

		// Object cache.
			objects: {},

	/******************************/
	/* Methods                    */
	/******************************/

		// Initializes desktop mode.
			initDesktop: function() {

				var $SZ = $(''), $SZLeft, $SZRight;

				var	windowHeight = _.objects.window.height() - _.settings.marginTop - _.settings.marginBottom,
					windowWidth = _.objects.window.width(),
					itemHeight = _.settings.itemHeight,
					itemCount = _.objects.items.length,
					itemsWidth = 0,
					rows = 0,
					rowWidth,
					SZIntervalId;

				// Window.
					_.objects.window._parallelism_update = function() {
						var i, j, x, y, t;

						// Calculate number of rows we can fit on the screen.
							rows = Math.min(Math.max(Math.floor(windowHeight / itemHeight) - 1, 1), _.settings.maxRows);

						// Reduce row count if we have more than we need.
							while ( rows > _.settings.minRows && (itemsWidth / rows) < windowWidth )
								rows--;

						// Get average row width.
							rowWidth = Math.ceil( (itemsWidth / rows) * 1.1 );

						// Resize items.
							var w = 0, iw;
							var rowStart = 0, rowPos = 0, rowEnded = false;

							_.objects.items.each(function(i) {
								var $item = $(this);

								iw = $item.data('width');

								// Determine end row conditions.

									// Current item would push us past the row width.
										if (w + iw >= rowWidth) {

											rowEnded = true;
											rowEnd = i - 1;

										}

									// Current item is the last item.
										else if (i + 1 >= itemCount) {

											w += iw;
											rowEnded = true;
											rowEnd = i;

										}

								// Did the row end?
									if (rowEnded) {

										var pt = 0;

										// Rescale the row's items.
											_.objects.items.slice(rowStart, rowEnd + 1).each(function(j) {
												var $item = $(this);
												var p = (($item.data('width') / w) * 100.00);

												if (pt + p > 100.00
												||	( (rowStart + j) == rowEnd && pt + p < 100.00))
													 p = 100.00 - pt;

												$item.css('width', p + '%');
												pt += p;

											});

										w = 0;
										rowStart = i;
										rowPos++;
										rowEnded = false;

									}

								w += iw;

							});

						// Resize reel.
							_.objects.reel
								.css('height', (itemHeight * rows) + (_.settings.padding * 2))
								.css('width', rowWidth);

						// Reposition main (if applicable).
							_.objects.main
								.css('height', (itemHeight * rows) + (_.settings.padding * 2));

							if (_.settings.centerVertically)
								_.objects.main
									.css('top', '65%')
									.css('margin-top', (-1 * (_.objects.main.outerHeight() / 2)) + _.settings.verticalNudge);

						// Resize/reposition SZs.
							window.setTimeout(function() {

								$SZ
									.css('height', _.objects.main.outerHeight())
									.css('top', _.objects.main.offset().top);

							}, _.settings.introDelay);

					};

					_.objects.window.resize(function() {

						// Update window dimensions.
							windowWidth = _.objects.window.width();
							windowHeight = _.objects.window.height() - _.settings.marginTop - _.settings.marginBottom;

						// Row count changed? Re-update.
							if (Math.max(Math.floor(windowHeight / itemHeight) - 1, 1) != rows)
								_.objects.window._parallelism_update();

						// Update scroll zones.
							$SZ._parallelism_update();

					});

				// Reel.
					_.objects.reel
						.css('overflow-y', 'hidden')
						.css('margin', '0 auto')
						.css('border', 'solid ' + _.settings.padding + 'px ' + _.settings.paddingColor)
						.css('box-shadow', '0 0 0 ' + _.settings.padding + 'px ' + _.settings.paddingColor);

					if (_.IEVersion < 9)
						_.objects.reel.show();
					else if (_.IEVersion < 10) {

						_.objects.reel.fadeTo(0,0.0001);

						window.setTimeout(function() {
							_.objects.reel.fadeTo(_.settings.introSpeed, 1);
						}, _.settings.introDelay);

					}
					else {

						_.objects.reel.css('opacity', 0);

						window.setTimeout(function() {
							_.objects.reel
								.h5u_xcss('transition', 'opacity ' + (_.settings.introSpeed / 1000.00) + 's ease-in-out')
								.css('opacity', 1);
						}, _.settings.introDelay);

					}

				// Items.
					_.objects.items
						.css('box-shadow', '0px 0px 0px ' + _.settings.padding + 'px ' + _.settings.paddingColor)
						.css('border', 'solid ' + _.settings.padding + 'px ' + _.settings.paddingColor);

					_.objects.items.each(function(i) {

						var	$item = $(this), $img = $item.find('img');
						var w, h;

						w = parseInt($item.data('width'));

						if (!w)
							w = _.settings.itemWidth;

						h = _.settings.itemHeight;

						// Add to total width.
							itemsWidth += w;

						// Item.
							$item
								.css('position', 'relative')
								.css('width', w)
								.css('height', h);

						// Image?
							if ($img.length > 0) {

								var $itemInner, $h2;

								// img.
									$img
										.css('position', 'absolute')
										.css('width', '100%')
										.css('height', 'auto')
										.css('min-height', '100%')
										.css('top', 0)
										.css('left', 0);

								// inner (for fade effect).
									$item.wrapInner('<div class="inner" />');
									$itemInner = $item.children('.inner');
									$itemInner
										.css('position', 'relative')
										.css('display', 'block')
										.css('-webkit-backface-visibility', 'hidden')
										.css('width', '100%')
										.css('height', '100%');

									if (_.IEVersion < 9)
										$itemInner.show();
									else if (_.IEVersion < 10) {

										$itemInner.hide();

										window.setTimeout(function() {
											$itemInner.fadeIn(_.settings.thumbSpeed);
										}, _.settings.thumbDelay + Math.floor(Math.random() * _.settings.thumbDelaySpread));

									}
									else {

										$itemInner.css('opacity', 0);

										$itemInner.h5u_xcss('transition', 'opacity ' + (_.settings.thumbSpeed / 1000.00) + 's ease-in-out');

										window.setTimeout(function() {
											$itemInner.css('opacity', 1);
										}, _.settings.thumbDelay + Math.floor(Math.random() * _.settings.thumbDelaySpread));

									}

									$img.attr('src', $img.attr('src'));

							}

					});

				// Main.
					if (_.isTouch)
						_.objects.main
							.css('overflow-x', 'auto')
							.css('overflow-y', 'hidden')
							.h5u_xcss('overflow-scrolling', 'touch');
					else
						_.objects.main.css('overflow', 'hidden');

				// Scrolling.

					// Scroll Wheel.

						if (_.IEVersion < 9)
							_.objects.main.css('overflow-x', 'scroll');
						else {

							var scrollHandler = function(e) {
								var	delta = (e.detail ? e.detail * -10 : e.wheelDelta) * _.settings.scrollFactor;
								_.objects.main.scrollLeft( _.objects.main.scrollLeft() - delta );
								$SZ._parallelism_update();
								e.preventDefault();
								e.stopPropagation();
							};

							var st;

							if (_.settings.scrollWheelTarget == 'reel')
								st = _.objects.main[0];
							else
								st = _.objects.window[0];

							st.addEventListener('DOMMouseScroll', scrollHandler, false);
							st.addEventListener('mousewheel', scrollHandler, false);

						}

						if (_.settings.resetScroll)
							window.setTimeout(function() {
								_.objects.main.scrollLeft(0);
							}, 0);

					// Scroll Zones.
						if (!_.isTouch && _.settings.useScrollZones) {

							_.objects.body.append('<div class="SZRight" style="right: 0;" />');
							_.objects.body.append('<div class="SZLeft" style="left: 0;" />');

							$SZLeft = _.objects.body.children('.SZLeft');
							$SZRight = _.objects.body.children('.SZRight');
							$SZ = $SZLeft.add($SZRight);

							$SZ
								.css('position', 'fixed')
								.css('width', _.settings.scrollZoneWidth)
								.css('height', 100)
								.css('z-index', 100)
								.css('background', 'rgba(255,255,255,0)') // Required due to a weird IE bug (affects <=10)
								.css('top', 0);

							$SZ._parallelism_update = function() {

								if (_.objects.main.scrollLeft() == 0)
									$SZLeft.hide();
								else
									$SZLeft.show();

								if (_.objects.main.scrollLeft() + $(window).width() >= _.objects.reel.outerWidth())
									$SZRight.hide();
								else
									$SZRight.show();

							};

							$SZRight.bind('mouseenter', function(e) {

								SZIntervalId = window.setInterval(function() {
									_.objects.main.scrollLeft( _.objects.main.scrollLeft() + (_.settings.scrollZoneAmount * _.settings.scrollFactor) );
									$SZ._parallelism_update();
								}, _.settings.scrollZoneDelay);
								return false;

							});

							$SZLeft.bind('mouseenter', function(e) {

								SZIntervalId = window.setInterval(function() {
									_.objects.main.scrollLeft( _.objects.main.scrollLeft() - (_.settings.scrollZoneAmount * _.settings.scrollFactor) );
									$SZ._parallelism_update();
								}, _.settings.scrollZoneDelay);
								return false;

							});

							$SZ.bind('mouseleave', function(e) {
								window.clearInterval(SZIntervalId);
							});

						}
						else
							$SZ._parallelism_update = function() {};

					// Scroll Keys.
						if (_.settings.useScrollKeys) {

							_.objects.window.keydown(function(e) {
								if ($('.p-img-mobilemf').is(':visible'))
									return;

								switch (e.keyCode)
								{
									case 39:
										window.clearInterval(SZIntervalId);
										_.objects.main.scrollLeft( _.objects.main.scrollLeft() + (_.settings.scrollKeyAmount * _.settings.scrollFactor) );
										$SZ._parallelism_update();
										return false;

									case 37:
										window.clearInterval(SZIntervalId);
										_.objects.main.scrollLeft( _.objects.main.scrollLeft() - (_.settings.scrollKeyAmount * _.settings.scrollFactor) );
										$SZ._parallelism_update();
										return false;

									default:
										break;
								}
							});

						}

		// Dropdowns.
			$('#nav > ul').dropotron({
				mode: 'fade',
				noOpenerFade: true,
				expandMode: (skel.vars.touch ? 'click' : 'hover')
			});


				// Trigger resize event.
					_.objects.window.trigger('resize');



			},

		// Initializes mobile mode.
			initMobile: function() {

				// Auto styling?
					if (_.settings.autoStyleMobile) {

						// Items.
							_.objects.items
								.css('border', 'solid ' + Math.ceil(_.settings.padding / 2) + 'px ' + _.settings.paddingColor);

							_.objects.items.filter('.thumb')
								.css('margin-top', (-1 * Math.ceil(_.settings.padding / 2)) + 'px')
								.filter(':nth-child(2n)')
									.css('border-right', 0);

					}

				// Items.
					_.objects.items.each(function() {

						var $item = $(this), $img = $item.find('img');

						$img
							.css('opacity', 0);

						$item
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', 'center center')
							.css('background-size', 'cover');


					});


	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$header = $('#header'),
			$banner = $('#banner');

			$window.on('load', function() {
				$body.removeClass('is-loading');
			});

		// CSS polyfills (IE<9).
			if (skel.vars.IEVersion < 9)
				$(':last-child').addClass('last-child');

		// Off-Canvas Navigation.

			// Navigation Button.
				$(
					'<div id="navButton">' +
						'<a href="#navPanel" class="toggle"></a>' +
					'</div>'
				)
					.appendTo($body);

			// Navigation Panel.
				$(
					'<div id="navPanel">' +
						'<nav>' +
							$('#nav').navList() +
						'</nav>' +
					'</div>'
				)
					.appendTo($body)
					.panel({
						delay: 500,
						hideOnClick: true,
						hideOnSwipe: true,
						resetScroll: true,
						resetForms: true,
						side: 'left',
						target: $body,
						visibleClass: 'navPanel-visible'
					});

			// Fix: Remove navPanel transitions on WP<10 (poor/buggy performance).
				if (skel.vars.os == 'wp' && skel.vars.osVersion < 10)
					$('#navButton, #navPanel, #page-wrapper')
						.css('transition', 'none');

		// Header.
		// If the header is using "alt" styling and #banner is present, use scrollwatch
		// to revert it back to normal styling once the user scrolls past the banner.
		// Note: This is disabled on mobile devices.
			if (!skel.vars.mobile
			&&	$header.hasClass('alt')
			&&	$banner.length > 0) {

				$window.on('load', function() {

					$banner.scrollwatch({
						delay:		0,
						range:		1,
						anchor:		'top',
						on:			function() { $header.addClass('alt reveal'); },
						off:		function() { $header.removeClass('alt'); }
					});

				});

			}

	});

			},

		// Main init method
			init: function() {

				// Skel.
					skel
						.breakpoints({
							desktop: '(min-width: 840px)',
							mobile: '(max-width: 839px)'
						})
						.viewport({
							breakpoints: {
								desktop: {
									width: 1200,
									scalable: false
								}
							}
						});

					_.isTouch = skel.vars.touch;
					_.IEVersion = skel.vars.IEVersion;

				// jQuery.
					$.fn.h5u_xcss = function(k, v) {
						return $(this)
							.css('-webkit-' + k, v)
							.css('-moz-' + k, v)
							.css('-o-' + k, v)
							.css('-ms-' + k, v)
							.css(k, v);
					};

				$(function() {

					// Objects.
						_.objects.window = $(window),
						_.objects.wrapper = $('#wrapper'),
						_.objects.body = $('body'),
						_.objects.main = $('#main'),
						_.objects.reel = $('#reel'),
						_.objects.items = _.objects.main.find('.item');

					// Mode.
						_.objects.window.on('load', function() {

							skel
								.on('+desktop', function() {
									_.initDesktop();
								})
								.on('+mobile', function() {
									_.initMobile();
								})
								.on('-desktop -mobile', function() {
									window.setTimeout(function() {
										location.reload(true);
									}, 50);
								});

						});

				});

				$(document).ready(function() {
					$('.item').magnificPopup({
						delegate: 'a',
						type: 'image',
						tLoading: 'Loading image #%curr%...',
						mainClass: 'mfp-with-zoom', // this class is for CSS animation below
					    zoom: {
					    enabled: true, // By default it's false, so don't forget to enable it

					    duration: 300, // duration of the effect, in milliseconds
					    easing: 'ease-in-out', // CSS transition easing function
						},
						gallery: {
							enabled: true,
							navigateByImgClick: true,
							preload: [0,1] // Will preload 0 - before current, and 1 after the current image
						},
						image: {
							tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
							titleSrc: function(item) {
								return item.el.attr('title') + '<small>'+item.el.attr('caption') +'</small>';
							}
						}
					});



				});

			}


}; return _; })(jQuery);

parallelism.init();