'use strict';
import Swiper from 'swiper';
import 'slick-carousel';
import * as Lightbox from '../../../node_modules/lightbox2/dist/js/lightbox.js';

export default class Item{
	constructor($item){
		var self = this;
		this.sliders = new Array();
		
		$('[data-action="show_phone"]').on("click", function(){
			$(".object_book").addClass("_active");
			$(".object_book_hidden").addClass("_active");
			$(".object_book_interactive_part").removeClass("_hide");
			$(".object_book_send_mail").removeClass("_hide");
			ym(66603799,'reachGoal','showphone');
			gtag('event', 'ShowPhone', {
			  'event_category': 'Search',
			});
		});

		$('[data-action="show_form"]').on("click", function(){
			$(".object_book_send_mail").addClass("_hide");
			$(".send_restaurant_info").removeClass("_hide");
		});

		$('[data-action="show_mail_sent"]').on("click", function(){
			$(".send_restaurant_info").addClass("_hide");
			$(".object_book_mail_sent").removeClass("_hide");
		});

		$('[data-action="show_form_again"]').on("click", function(){
			$(".object_book_mail_sent").addClass("_hide");
			$(".send_restaurant_info").removeClass("_hide");
		});

		$('[data-title-address]').on('click', function(){
            let map_offset_top = $('.map').offset().top;
            let map_height = $('.map').height();
            let header_height = $('.header_wrap_fixed').height();
            let window_height = $(window).height();
            let scroll_length = map_offset_top - header_height - ((window_height - header_height)/2) + map_height/2;
            $('html,body').animate({scrollTop:scroll_length}, 400);
        });


        $(document).ready(function() {
            let presentDate = new Date();
            presentDate.setDate(presentDate.getDate() + 14);

            function formatDate(date) {
                var monthNames = [
                  "января", "февраля", "марта",
                  "апреля", "мая", "июня", "июля",
                  "августа", "сентября", "октября",
                  "ноября", "декабря"
                ];
              
                var day = date.getDate();
                var monthIndex = date.getMonth();
              
                return day + ' ' + monthNames[monthIndex];
            }

            $('.place_reserv_date').html(formatDate(presentDate));
        });


		var galleryThumbs = new Swiper('.gallery-thumbs', {
			spaceBetween: 10,
			slidesPerView: "auto",
			slidesPerColumn: 1,
			freeMode: true,
			watchSlidesVisibility: true,
			watchSlidesProgress: true,

			breakpoints: {
				767: {
					slidesPerView: 3,
					slidesPerColumn: 1
				}
			}
		});
		var galleryTop = new Swiper('.gallery-top', {
			spaceBetween: 10,
			navigation: {
				nextEl: '.carousel_nav_next',
				prevEl: '.carousel_nav_prev',
			},
			thumbs: {
				swiper: galleryThumbs
			}
		});

		var galleryList = new Swiper('.gallery-top-list', {
			spaceBetween: 20,
			slidesPerView: 3,
			navigation: {
				nextEl: '.carousel_nav_next_list',
				prevEl: '.carousel_nav_prev_list',
			},
			thumbs: {
				swiper: galleryThumbs
			},
			
			breakpoints: {
				1440: {
					spaceBetween: 30
				},
				767: {
					slidesPerView: 1
				}
			}
		});

		$('.object_gallery._room').each((t,e) => {
			let galleryRoomThumbs = new Swiper($(e).find('.gallery-thumbs-room'), {
	            //el: ".gallery-thumbs-room",
	            spaceBetween: 10,
	            slidesPerView: 5,
	            slidesPerColumn: 1,
	            freeMode: true,
	            watchSlidesVisibility: true,
				watchSlidesProgress: true,
				// navigation: {
				// 	nextEl: '.carousel_nav_next',
				// 	prevEl: '.carousel_nav_prev',
				// },

	            breakpoints: {
	                767: {
	                    slidesPerView: 3,
	                    slidesPerColumn: 1
	                }
	            }
	        });
	        let galleryRoomTop = new Swiper($(e).find('.gallery-top-room'), {
				spaceBetween: 10,
				navigation: {
					// nextEl: '.carousel_nav_next_hall',
					nextEl: `.carousel_nav_next_hall-${t+1}`,
					prevEl: `.carousel_nav_prev_hall-${t+1}`,
				},
	            thumbs: {
	                swiper: galleryRoomThumbs
	            }
	        });

	        this.sliders.push(galleryRoomThumbs);
	        this.sliders.push(galleryRoomTop)
		});		

		$('.place_reserv_telToggle').on('click', function() {
			self.showNumber();
		});

		$('.telShow').on('click', function() {
			self.showNumberOnMap();
		});
	}

	showNumber() {
		$('.place_reserv_telToggle').toggleClass('numberVisible');
		$('.place_reserv_telNumber').toggleClass('telHidden')

		if ($('.place_reserv_telToggle').hasClass('numberVisible')) {
			if (window.innerWidth > 1440) {
				$('.place_reserv_telToggle').html('<span>Скрыть номер</span>');
			} else {
				$('.place_reserv_telToggle').addClass('telHidden');
			}
		} else {
			$('.place_reserv_telToggle').html('<span>Показать номер</span>');
		}
	}

	showNumberOnMap() {
		$('.telShow').addClass('telHidden');
		$('.single_map_tel').removeClass('telHidden');
	}


	// swiperNavDisable() {
	// 	if ($('.swiper-slide-active').siblings('.swiper-slide-prev')) {
	// 		$('.carousel_nav').addClass('nav_prev_disable')
	// 	}
	// }
}