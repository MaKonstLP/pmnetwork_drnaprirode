'use strict';

export default class Main{
	constructor(){
		let self = this;
		$('body').on('click', '[data-seo-control]', function(){
			$(this).closest('[data-seo-text]').addClass('_active');
		});

		$('.btn_banquet').on('click', function() {
			self.showDropForm($('.banquet_form_wrapper'));
		});

		$('.btn_call').on('click', function() {
			self.showDropForm($('.call_form_wrapper'));
		});

		$('.header_city_select').on('click', function() {
			self.showDropForm($('.city_select_search_wrapper'));
		});

		$('.back_to_header_menu').on('click', function() {
			self.closeDropForm();
		});

		// Клик по чекбоксу
		$('[data-action="city_checkbox"]').on('click',(e) => {
			let $el = $(e.currentTarget);
			let $input = $el.siblings('input');

			if(!$(e.target).hasClass('_link')){
				$('.city_checkbox').removeClass("_active");
				$el.toggleClass("_active");
				$('.city_select_btn').attr('href', `${$el.attr('data-href')}`);
				$input.prop("checked", !$input.prop("checked"));
				e.stopImmediatePropagation();
			}	
		});
	
		$('.header_burger').on('click', function() {
			self.openBurgerMenu();
		});

		$('.header_burger').on('click', function() {
			self.burgerHandler();
		});

		$('.header_list_drop').on('click', function() {
			self.openHeaderDropMenu();
		});

		$(document).on('mouseup', function(e) {
			self.closeHeaderDropMenu(e);
			self.closeAll(e);
		});

		$(document).ready(
			self.headerScrolling(),
			// self.citySelectMove()
		);

		$(document).on('scroll', function() {
			self.headerScrolling();
		});
	}

	openHeaderDropMenu() {
		if ($('.drop_content').hasClass('drop_content_visible')) {
			$('.drop_content').removeClass('drop_content_visible');
		} else {
			$('.drop_content').addClass('drop_content_visible');
		}
	}

	closeHeaderDropMenu(e) {
		let $target = $(e.target);
		let $button = $(".header_list_drop");
		let $dropMenu = $(".drop_content");

		if( !$button.is($target)
		&& $button.has($target).length === 0
		&& !$dropMenu.is($target)
		&& $dropMenu.has($target).length === 0){
			if ( $dropMenu.hasClass("drop_content_visible") ){
				$dropMenu.removeClass("drop_content_visible");
			}
		}
	}

	closeAll(e) {
		let $target = $(e.target);
		let $dropWrap = $(".dropForm_wrapper");

		if (!$('.btn_banquet').is($target)
			&& $('.btn_banquet').has($target).length === 0
			&& !$('.btn_call').is($target)
			&& $('.btn_call').has($target).length === 0
			&& !$('.header_city_select').is($target)
			&& $('.header_city_select').has($target).length === 0
			&& !$('.dropForm_wrapper').is($target)
			&& $('.dropForm_wrapper').has($target).length === 0
			&& !$('.message_send').is($target)
			&& $('.message_send').has($target).length === 0) {
			$dropWrap.each(function() {
				if (!$(this).hasClass('_hide') || !$('.message_send').hasClass('_hide')) {
					$('body').removeClass('body_fixed');

					// Удаляем фиксацию и скроллим body только при открытых всплывашках
					let logic = true; 

					$('.dropForm_wrapper').each(function() {
						logic = logic && $(this).hasClass('_hide');
					});

					if (!$('.message_send').hasClass('_hide') || !logic) {
						let y = 0;

						if ($('body').attr('body-scroll-top')) {
							y = $('body').attr('body-scroll-top');
							$(window).scrollTop(y);
						}
					}
					// end

					$('.dropForm_wrapper').addClass("_hide");
					$('.message_send').addClass('_hide');	
				}

				
			});
		}	
	}

	// Уменьшение логотипа и центрирование элементов фиксированной шапки
	headerScrolling() {
		// Взаимодействие всплывашек между собой для корректного отображения фиксированной шапки
		let logic = true; 

		$('.dropForm_wrapper').each(function() {
			logic = logic && $(this).hasClass('_hide');
		});
		// end

		if (window.pageYOffset > 76 || !$('.message_send').hasClass('_hide') || !logic) {
			
			if ($(window).width() > 767) {
				$('.header_menu').addClass('header_menu_fixed');

				// $('.header_logo').addClass('logo_min');
				// $('.header_city_select').addClass('header_fixed_pos');
				// $('.header_phone').addClass('header_fixed_pos');
				// $('.btn_wrapper').addClass('header_fixed_pos');
			}
			
		} else {
			$('.header_menu').removeClass('header_menu_fixed');

			// $('.header_logo').removeClass('logo_min');
			// $('.header_city_select').removeClass('header_fixed_pos');
			// $('.header_phone').removeClass('header_fixed_pos');
			// $('.btn_wrapper').removeClass('header_fixed_pos');
		}
	}

	openBurgerMenu() {
		if ($('.header_burger_wrapper').hasClass('header_burger_visible')) {
			this.bodyFixedDel();
			$('.header_burger_wrapper').removeClass('header_burger_visible');
		} else {
			this.bodyFixed();
			$('.header_burger_wrapper').addClass('header_burger_visible');
		}
	}

	burgerHandler(e) {
		if($('header').hasClass('_active')){
			$('header').removeClass('_active');
		}
		else{
			$('header').addClass('_active');
		}
	}

	closeBurgerHandler(e){
		var $target = $(e.target);
		var $menu = $(".header_menu");

		if( !$menu.is($target)
		&& $menu.has($target).length === 0) {

			if($('header').hasClass('_active')){
				$('header').removeClass('_active');
			}
		}
	}

	// Показать всплывашки
	showDropForm($formWrapper) {
		if ($formWrapper.hasClass("_hide")) {
			// Взаимодействие всплывашек между собой для скролла body
			let logic = true; 

			$('.dropForm_wrapper').each(function() {
				logic = logic && $(this).hasClass('_hide');
			});

			if (!logic) {
				this.bodyFixedDel();
			} else {
				this.bodyFixed();
			}
			// end
			
			$('.dropForm_wrapper').addClass("_hide");
			$('.message_send').addClass('_hide');	
			$formWrapper.removeClass("_hide");
		} else {
			this.closeDropForm();
		}
	}

	// Скрываем всплывашки
	closeDropForm() {
		// Удаляем фиксацию и скроллим body только при открытых всплывашках
		let logic = true; 

		$('.dropForm_wrapper').each(function() {
			logic = logic && $(this).hasClass('_hide');
		});

		if (!$('.message_send').hasClass('_hide') || !logic) {
			this.bodyFixedDel();
		}
		// end

		$('.dropForm_wrapper').addClass("_hide");
		$('.message_send').addClass('_hide');	
	}

	// Фиксируем body при отображении всплывашек
	bodyFixed() {
		$('body').css("top", `-${$(window).scrollTop()}px`);
		$('body').attr('body-scroll-top', `${$(window).scrollTop()}`);
		$('body').addClass('body_fixed');
	}

	// Удаляем фиксацию и скроллим body при исчезании всплывашек
	bodyFixedDel() {
		$('body').removeClass('body_fixed');
		
		let y = 0;

		if ($('body').attr('body-scroll-top')) {
			y = $('body').attr('body-scroll-top');
			$(window).scrollTop(y);
		}
	}

	// Подвинем кнопку выбора города при длинном названии города (для разрешений меньше 1300)
	// citySelectMove() {
	// 	let citySelect = $('.header_city_select_notdesc');

	// 	if ($(document).width() > 850) {
	// 		$(citySelect).css({
	// 			left: -($(citySelect).width() / 2) + ($('.btn_banquet').width() / 2), 
	// 			'max-width': 'max-content'
	// 		});
	// 	} else {
			

	// 		if ($(document).width() >= 768 && $(citySelect).width() > 135) {
	// 			$(citySelect).css({
	// 				top: '-42px',
	// 				'max-width': '130px'
	// 			});
	// 		} else if ($(citySelect).width() > 135) {
	// 			$(citySelect).css({
	// 				top: '-45px',
	// 				'max-width': '130px'
	// 			});
	// 		}

	// 		$(citySelect).css({
	// 			left: -($(citySelect).width() / 2) + ($('.btn_banquet').width() / 2), 
	// 		});
	// 	}
	// }
}