"use strict";

export default class YaMapSingleObject{
	constructor(){
		let self = this;
    var fired = false;

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

	init() {
    this.script('//api-maps.yandex.ru/2.1/?lang=ru_RU').then(() => {
        const ymaps = global.ymaps;
    		ymaps.ready(function(){
    			let map = document.querySelector(".map");
          let myMap = new ymaps.Map(map, {center: [55.76, 37.64], zoom: 15, controls: []},
                      {suppressMapOpenBlock: true});

          myMap.behaviors.disable('scrollZoom');

          let zoomControl = new ymaps.control.ZoomControl({
            options: {
                size: "small",
                position: {
                  top: 10,
                  right: 10
                }

            }
          });

          let geolocationControl = new ymaps.control.GeolocationControl({
            options: {
              noPlacemark: true,
              position: {
                top: 10,
                left: 10
              }
            }
        });

          myMap.controls.add(zoomControl);
          myMap.controls.add(geolocationControl);

          let mapDotX = $("#map").attr("data-mapDotX");
          let correctedMapDotX = Number(mapDotX) + 0.001;
          let balloonCoordinates = [$("#map").attr("data-mapDotX"), $("#map").attr("data-mapDotY")];
          let mapCoordinates = [`${correctedMapDotX}`, $("#map").attr("data-mapDotY")];

          let myBalloonLayout = ymaps.templateLayoutFactory.createClass(
            `<div class="balloon_layout balloon_layout_single top">
              <a class="close" href="#"></a>
              <div class="arrow"></div>
              <div class="balloon_inner">
                $[[options.contentLayout]]
              </div>
            </div>`, {
            build: function() {
              this.constructor.superclass.build.call(this);
  
              this._$element = $('.balloon_layout', this.getParentElement());

              setTimeout(() => {
                this.applyElementOffset();
                $('.telShow').bind('click', this.showTelOnMap);
              }, 1);
  
              this._$element.find('.close')
                .on('click', $.proxy(this.onCloseClick, this));
            },

            showTelOnMap: function() {
              $('.telShow').addClass('telHidden');
              $('.single_map_tel').removeClass('telHidden');
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

          let myBalloonContentLayout = 
            `<div class="balloon_wrapper single_balloon_wrapper">
  
              <div class="balloon_content">
  
                <div class="balloon_text">
  
                  <div class="balloon_address single_balloon_address">
                    <p>${$("#map").attr("data-address")}</p>
                  </div>

                  <div class="single_balloon_phone">
                    <p class="telShow">Показать контакты</p>
                    <a href="tel:${$("#map").attr("data-phone")}" class="single_map_tel telHidden">${$("#map").attr("data-phone")}</a>
                  </div>
  
                </div>
  
              </div>
              
            </div>`

          let object = new ymaps.Placemark(balloonCoordinates,
            {
              balloonContentBody: myBalloonContentLayout,
            },
            {
              balloonAutoPan: false,
              balloonPanelMaxMapArea: 0,
              balloonLayout: myBalloonLayout,
              hideIconOnBalloonOpen: true,
              iconLayout: 'default#image',
              iconImageHref: '/dist/images/mapPoint.svg',
              iconImageSize: [28, 40],
              mapAutoPan: false
            });

          myMap.geoObjects.add(object);
          myMap.setCenter(mapCoordinates);
          // object.balloon.open(balloonCoordinates, {closeButton: false});
    		});
      });
	}
}