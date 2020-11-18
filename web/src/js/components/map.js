"use strict";

export default class YaMapAll{
	constructor(filter){
		let self = this;
		var fired = false;
        this.filter = filter;
        this.myMap = false;
        this.objectManager = false;
        this.myBalloonLayout = false;
		this.myBalloonContentLayout = false;

		window.addEventListener('click', () => {
		    if (fired === false) {
		        fired = true;
	        	load_other();
			}
		}, {passive: true});
 
		window.addEventListener('scroll', () => {
		    if (fired === false) {
		        fired = true;
	        	load_other();
			}
		}, {passive: true});

		window.addEventListener('mousemove', () => {
	    	if (fired === false) {
	        	fired = true;
	        	load_other();
			}
		}, {passive: true});

		window.addEventListener('touchmove', () => {
	    	if (fired === false) {
	        	fired = true;
	        	load_other();
			}
		}, {passive: true});

		function load_other() {
			setTimeout(function() {
				self.init();
			}, 100);
		}
	}

	script(url) {
	  if (Array.isArray(url)) {
	    let self = this;
	    let prom = [];
	    url.forEach(function (item) {
	      prom.push(self.script(item));
	    });
	    return Promise.all(prom);
	  }

	  return new Promise(function (resolve, reject) {
	    let r = false;
	    let t = document.getElementsByTagName('script')[0];
	    let s = document.createElement('script');

	    s.type = 'text/javascript';
	    s.src = url;
	    s.async = true;
	    s.onload = s.onreadystatechange = function () {
	      if (!r && (!this.readyState || this.readyState === 'complete')) {
	        r = true;
	        resolve(this);
	      }
	    };
	    s.onerror = s.onabort = reject;
	    t.parentNode.insertBefore(s, t);
	  });
	}

	refresh(filter){
        let self = this;
        let data = {
            subdomain_id : $('[data-map-api-subid]').data('map-api-subid'),
            filter : JSON.stringify(filter.state)
        };

        $.ajax({
            type: "POST",
            url: "/api/map_all/",
            data: data,
            success: function(response) {
				let serverData = response;
				
                self.objectManager = new ymaps.ObjectManager(
                    {
						geoObjectBalloonLayout: self.myBalloonLayout, 
						geoObjectBalloonContentLayout: self.myBalloonContentLayout,
						geoObjectHideIconOnBalloonOpen: true,
						clusterize: true,
						clusterDisableClickZoom: false,
						clusterBalloonItemContentLayout: self.myBalloonContentLayout,
						geoObjectIconLayout: 'default#image',
						geoObjectIconImageHref: '/dist/images/mapPoint.svg',
						geoObjectIconImageSize: [28, 40],
						clusterIconColor: "green",
                    }
                );
				self.objectManager.add(serverData);
				self.myMap.geoObjects.removeAll();
				self.myMap.geoObjects.add(self.objectManager);

				if (self.objectManager.objects.getLength() === 1) {
					self.myMap.setCenter(self.objectManager.getBounds()[0]);
				} else if (self.objectManager.objects.getLength() === 0) {
					self.myMap.setCenter([55.749362, 37.627214], 10);
				} else {
					self.myMap.setBounds(self.objectManager.getBounds(), {
						checkZoomRange: true,
						zoomMargin: [70, 20, 40, 40]
					});
				}                             
            },
            error: function(response) {

            }
        });
    }

	init() {
		let self = this;
		this.script('//api-maps.yandex.ru/2.1/?lang=ru_RU').then(() => {
			const ymaps = global.ymaps;
			  
			ymaps.ready(function(){
				let map = document.querySelector(".map");
				self.myMap = new ymaps.Map(map, {
					center: [55.76, 37.64],
					zoom: 14,
					controls: ['zoomControl', 'fullscreenControl', 'typeSelector', 'trafficControl', 'geolocationControl']
				}, {balloonPanelMaxMapArea: 0});
				self.myMap.behaviors.disable('scrollZoom');

				self.myBalloonLayout = ymaps.templateLayoutFactory.createClass(
					`<div class="balloon_layout top">
						<a class="close" href="#"></a>
						<div class="arrow"></div>
						<div class="balloon_inner">
							$[[options.contentLayout]]
						</div>
					</div>`, {
					build: function() {
						this.constructor.superclass.build.call(this);

						this._$element = $('.balloon_layout', this.getParentElement());

						this.applyElementOffset();

						this._$element.find('.close')
							.on('click', $.proxy(this.onCloseClick, this));
					},

					clear: function () {
						this._$element.find('.close')
								.off('click');

						this.constructor.superclass.clear.call(this);
					},

					applyElementOffset: function () {
						this._$element.css({
							left: -(this._$element[0].offsetWidth / 2),
							top: -(this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight)
						});
					},

					onCloseClick: function (e) {
						e.preventDefault();

						this.events.fire('userclose');
					},

					getShape: function () {
						if(!this._isElement(this._$element)) {
								return self.myBalloonLayout.superclass.getShape.call(this);
						}

						var position = this._$element.position();

						return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
								[position.left, position.top], [
										position.left + this._$element[0].offsetWidth,
										position.top + this._$element[0].offsetHeight + this._$element.find('.arrow')[0].offsetHeight
								]
						]));
					},

					_isElement: function (element) {
						return element && element[0] && element.find('.arrow')[0];
					}
					}
				);

				self.myBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
					`<div class="balloon_wrapper">

						<div class="balloon_content">

							<div class="balloon_text">

								<div class="balloon_header">
									<a href="{{properties.link}}">{{properties.organization}}</a></button>
								</div>

								<div class="balloon_type">
									<p>{{properties.type.name}}</p>
								</div>

								<div class="balloon_address">
									<p>{{properties.address}}</p>
								</div>

							</div>

						</div>
						
					</div>`
				);

				self.objectManager = new ymaps.ObjectManager(
					{
						geoObjectBalloonLayout: self.myBalloonLayout, 
						geoObjectBalloonContentLayout: self.myBalloonContentLayout,
						geoObjectHideIconOnBalloonOpen: true,
						clusterize: true,
						clusterDisableClickZoom: false,
						clusterBalloonItemContentLayout: self.myBalloonContentLayout,
						geoObjectIconLayout: 'default#image',
						geoObjectIconImageHref: '/dist/images/mapPoint.svg',
						geoObjectIconImageSize: [28, 40],
						clusterIconColor: "green",
					}
				);

				let serverData = null;
				let data = {
					subdomain_id : $('[data-map-api-subid]').data('map-api-subid'),
					filter : JSON.stringify(self.filter.state)
				};
				$.ajax({
		            type: "POST",
		            url: "/api/map_all/",
		            data: data,
		            success: function(response) {
						serverData = response;
						
						self.objectManager.add(serverData);  
						self.myMap.geoObjects.add(self.objectManager);

						if (self.objectManager.objects.getLength() === 1) {
							self.myMap.setCenter(self.objectManager.getBounds()[0]);
						} else if (self.objectManager.objects.getLength() === 0) {
							self.myMap.setCenter([55.749362, 37.627214], 10);
						} else {
							self.myMap.setBounds(self.objectManager.getBounds(), {
								checkZoomRange: true,
								zoomMargin: [70, 20, 40, 40]
							});
						}	
		            },
		            error: function(response) {

		            }
				});
			});
	    });
	}
}