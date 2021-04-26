'use strict';

import Inputmask from 'inputmask';
import 'jquery-ui/ui/widgets/draggable';

export default class Filter{
	constructor($filter){
		let self = this;
		this.$filter = $filter;
		this.state = {};
		this.statePag = {};

		this.init(this.$filter);

		// My

		// Слайдеры
		self.sliderCalc(this.$filter.find('.slider_cost'), 5);
		self.sliderCalc(this.$filter.find('.slider_quantity'), 5);
		
		// Клик по селекту
		this.$filter.find('.dropFilter_content').on('click', function(){
			let $parent = $(this).closest('.dropFilter_content');
			self.dropFilter($parent);
		});

		// Клик вне селекта
		$(document).click(function(e) {
			if (!$(e.target).closest('.dropFilter_content').length) {
				self.dropFilterClose();
			}
		});

		// Клик по чекбоксу
		$('[data-action="filter_checkbox"]').on('click',(e) => {
			let $el = $(e.currentTarget);
			let $input = $el.siblings('input');

			if(!$(e.target).hasClass('_link')){
				$el.toggleClass("_active");
				$input.prop("checked", !$input.prop("checked"));
				e.stopImmediatePropagation();
			}	
		});

		// Клик применить
		this.$filter.find('.btn_apply').on('click', function() {
			let $parent = $(this).closest('.dropFilter_content');
			self.applyFilter($parent);
			self.selectStateRefresh($(this).closest('[data-filter-select-block]'));
		});

		// Клик показать
		this.$filter.find('[data-filter-button]').on('click', function() {
			self.selectStateRefresh($('.list_select_rest_type').closest('[data-filter-select-block]'));
			self.scrollStateRefresh($('.slider_cost').closest('[data-filter-scroll-block]'));
			self.scrollStateRefresh($('.slider_quantity').closest('[data-filter-scroll-block]'));
		});

		// Клик сбросить фильтр
		this.$filter.find('.filter_reset').on('click', function() {
			self.resetFilter();
		});

		// $(document).ready(
		// 	self.filterScrolling(),
		// );

		// $(document).on('scroll', function() {
		// 	self.filterScrolling();
		// });
		
	}	

	sliderCalc(sliderElem, sections) {
		let thumbElem = sliderElem.children(); // определяем Ползунок
		let sliderElemPos = sliderElem.offset().left; // определяем левый край Слайдера для расчета длины линии Слайдера 
		let minLeft = sliderElemPos - 1; // крайнее левое положение Ползунка
		let maxRight = minLeft + sliderElem.width() - thumbElem.width() + 2; // крайнее правое положение Ползунка
		let sliderLineWidth = maxRight - minLeft; // длина линии Слайдера
		let average = $(sliderElem).closest('.slider_container').find('.average_item');
		let thumbPos = $(sliderElem).offset().left - sliderElemPos + 1; // вычисляем координаты Ползунка относительно начала Слайдера
		let externalSectionLength = sliderLineWidth / sections; // для расчета длины крайних полусекций
		let thumbExternalSectionFinish = Math.ceil((thumbPos) / (externalSectionLength / 2)); // вычисляем коэффициент для привязки Ползунка, когда он отпущен
		let sliderInnerLineWidth = sliderLineWidth - externalSectionLength; // рассчитываем длину внутренней линии Слайдера за вычетом крайних полусекций
		let innerSectionLength = sliderInnerLineWidth / (sections - 2); // вычисляем длину внутренних секций (исключая крайние полусекции)
		let thumbInnerPos = thumbPos - externalSectionLength / 2; //вычисляем координаты Ползунка относительно начала внутренней линии Слайдера 
		let thumbInnerSectionFinish = Math.ceil(thumbInnerPos / innerSectionLength); // вычисляем коэффициент для привязки Ползунка, когда он отпущен на внутренней линии Слайдера

		$(sliderElem).on('click', function(e) {
			let mouesPos = e.pageX - sliderElemPos - 10.5; // вычисляем координаты Ползунка относительно начала Слайдера
			let externalSectionLength = sliderLineWidth / sections; // для расчета длины крайних полусекций
			let thumbExternalSectionFinish = Math.ceil((mouesPos) / (externalSectionLength / 2)); // вычисляем коэффициент для привязки Ползунка, когда он отпущен
			let sliderInnerLineWidth = sliderLineWidth - externalSectionLength; // рассчитываем длину внутренней линии Слайдера за вычетом крайних полусекций
			let innerSectionLength = sliderInnerLineWidth / (sections - 2); // вычисляем длину внутренних секций (исключая крайние полусекции)
			let thumbInnerPos = mouesPos - externalSectionLength / 2; //вычисляем координаты Ползунка относительно начала внутренней линии Слайдера 
			let thumbInnerSectionFinish = Math.ceil(thumbInnerPos / innerSectionLength); // вычисляем коэффициент для привязки Ползунка, когда он отпущен на внутренней линии Слайдера

			$(average).removeClass('visible');

			// прилипание ползунка для крайних полусекций
			if (thumbExternalSectionFinish <= 1) { // прилипание к левому краю
				$(thumbElem).css('left', `-1px`);
				$(thumbElem).css('transition', 'all 0.25s ease');
			} else if (thumbExternalSectionFinish >= sections * 2) { // прилипание к правому краю
				$(thumbElem).css('left', `${maxRight - minLeft}px`);
				$(thumbElem).css('transition', 'all 0.25s ease');
			} else {
				// прилипание ползунка для внутренних секций
				if (thumbInnerSectionFinish <= 1 || thumbInnerSectionFinish > sections - 2) { // прилипание для внутренних крайних секций
					$(thumbElem).css('left', `${((innerSectionLength / 2) * thumbInnerSectionFinish) + (externalSectionLength / 2)}px`);
					$(thumbElem).css('transition', 'all 0.25s ease');
				} else { // прилипание для всех остальных внутренних секций
					$(thumbElem).css('left', `${(innerSectionLength * thumbInnerSectionFinish) - (innerSectionLength / 2) + (externalSectionLength / 2)}px`);
					$(thumbElem).css('transition', 'all 0.25s ease');
				}
			}

			if (thumbExternalSectionFinish <= 1) { // отображение значения при прилипании к левому краю
				$(average).each(function(i) {
					if (i == 0) {
						$(this).addClass('visible');
					}
				});
			} else if (thumbExternalSectionFinish >= sections * 2) { // отображение значения при прилипании к правому краю
				$(average).each(function(i) {
					if (i == sections - 1) {
						$(this).addClass('visible');
					}
				});
			} else { // отображение значения при прилипании ползунка для внутренних секций
				$(average).each(function(i) {
					if (i == thumbInnerSectionFinish) {
						$(this).addClass('visible');
					}
				});
			}
		});


		// Инициализация ползунка
		$(average).each(function(i) {
			if ($(average[i]).hasClass('visible')) {
				thumbInnerSectionFinish = i;

				if (i == $(average).length - 1) {
					thumbExternalSectionFinish = (i + 1) * 2;
				} else {
					thumbExternalSectionFinish = i * 2;
				}

				if (thumbExternalSectionFinish <= 1) { // прилипание к левому краю
					$(thumbElem).css('left', `-1px`);
				} else if (thumbExternalSectionFinish >= sections * 2) { // прилипание к правому краю
					$(thumbElem).css('left', `${maxRight - minLeft}px`);
				} else {
					// прилипание ползунка для внутренних секций
					if (thumbInnerSectionFinish <= 1 || thumbInnerSectionFinish > sections - 2) { // прилипание для внутренних крайних секций
						$(thumbElem).css('left', `${((innerSectionLength / 2) * thumbInnerSectionFinish) + (externalSectionLength / 2)}px`);
					} else { // прилипание для всех остальных внутренних секций
						$(thumbElem).css('left', `${(innerSectionLength * thumbInnerSectionFinish) - (innerSectionLength / 2) + (externalSectionLength / 2)}px`);
					}
				}
			} 
		});

		// Движение ползунка
		$(thumbElem).draggable({
			axis:"x", // движение только по оси Х
			containment:[minLeft,0,maxRight,0], // устанавливаем диапазон передвижения Ползунка
			
			drag: function() { // при движении Ползунка
				let average = $(sliderElem).closest('.slider_container').find('.average_item');
				let thumbPos = $(this).offset().left - sliderElemPos + 1; // вычисляем координаты Ползунка относительно начала Слайдера
				let externalSectionLength = sliderLineWidth / sections; // для расчета длины крайних полусекций
				let thumbExternalSectionFinish = Math.ceil((thumbPos) / (externalSectionLength / 2)); // вычисляем коэффициент для привязки Ползунка, когда он отпущен
				let sliderInnerLineWidth = sliderLineWidth - externalSectionLength; // рассчитываем длину внутренней линии Слайдера за вычетом крайних полусекций
				let innerSectionLength = sliderInnerLineWidth / (sections - 2); // вычисляем длину внутренних секций (исключая крайние полусекции)
				let thumbInnerPos = thumbPos - externalSectionLength / 2; //вычисляем координаты Ползунка относительно начала внутренней линии Слайдера 
				let thumbInnerSectionFinish = Math.ceil(thumbInnerPos / innerSectionLength); // вычисляем коэффициент для привязки Ползунка, когда он отпущен на внутренней линии Слайдера

				$(thumbElem).css('transition', 'none');
				$(average).removeClass('visible');

				if (thumbExternalSectionFinish <= 1) { // отображение значения при прилипании к левому краю
					$(average).each(function(i) {
						if (i == 0) {
							$(this).addClass('visible');
						}
					});
				} else if (thumbExternalSectionFinish >= sections * 2) { // отображение значения при прилипании к правому краю
					$(average).each(function(i) {
						if (i == sections - 1) {
							$(this).addClass('visible');
						}
					});
				} else { // отображение значения при прилипании ползунка для внутренних секций
					$(average).each(function(i) {
						if (i == thumbInnerSectionFinish) {
							$(this).addClass('visible');
						}
					});
				}
			},
			
			stop: function() { // при отпускании Ползунка
				let thumbPos = $(this).offset().left - sliderElemPos + 1; // вычисляем координаты Ползунка относительно начала Слайдера
				let externalSectionLength = sliderLineWidth / sections; // для расчета длины крайних полусекций
				let thumbExternalSectionFinish = Math.ceil((thumbPos) / (externalSectionLength / 2)); // вычисляем коэффициент для привязки Ползунка, когда он отпущен
				let sliderInnerLineWidth = sliderLineWidth - externalSectionLength; // рассчитываем длину внутренней линии Слайдера за вычетом крайних полусекций
				let innerSectionLength = sliderInnerLineWidth / (sections - 2); // вычисляем длину внутренних секций (исключая крайние полусекции)
				let thumbInnerPos = thumbPos - externalSectionLength / 2; //вычисляем координаты Ползунка относительно начала внутренней линии Слайдера 
				let thumbInnerSectionFinish = Math.ceil(thumbInnerPos / innerSectionLength); // вычисляем коэффициент для привязки Ползунка, когда он отпущен на внутренней линии Слайдера

				// прилипание ползунка для крайних полусекций
				if (thumbExternalSectionFinish <= 1) { // прилипание к левому краю
					$(thumbElem).css('left', `-1px`);
					$(thumbElem).css('transition', 'all 0.25s ease');
				} else if (thumbExternalSectionFinish >= sections * 2) { // прилипание к правому краю
					$(thumbElem).css('left', `${maxRight - minLeft - 2}px`);
					$(thumbElem).css('transition', 'all 0.25s ease');
				} else {
					// прилипание ползунка для внутренних секций
					if (thumbInnerSectionFinish <= 1 || thumbInnerSectionFinish > sections - 2) { // прилипание для внутренних крайних секций
						$(thumbElem).css('left', `${((innerSectionLength / 2) * thumbInnerSectionFinish) + (externalSectionLength / 2)}px`);
						$(thumbElem).css('transition', 'all 0.25s ease');
					} else { // прилипание для всех остальных внутренних секций
						$(thumbElem).css('left', `${(innerSectionLength * thumbInnerSectionFinish) - (innerSectionLength / 2) + (externalSectionLength / 2)}px`);
						$(thumbElem).css('transition', 'all 0.25s ease');
					}
				}
			}
		});
	}

	dropFilter($parent) {
		let $list = $parent.find('.dropFilter_list');
		let $listWrapper = $parent.find('.dropFilter_list_wrapper');

		$list.attr('onclick', 'event.stopPropagation()')


		if ($parent.hasClass('dropFilter_content_active')) {
			this.dropFilterClose();
		} else {
			this.dropFilterClose();
			$parent.addClass('dropFilter_content_active');
			$list.removeClass('dropFilter_list_hidden');
			$listWrapper.removeClass('dropFilter_list_wrapper_hidden');
			if ($(document).width() <= 767) {
				$('.main_block').addClass('main_block_down');
			}
		}	
	}

	dropFilterClose() {
		this.$filter.find('.dropFilter_list').each(function(){
			$(this).addClass('dropFilter_list_hidden');
		});

		this.$filter.find('.dropFilter_list_wrapper').each(function(){
			$(this).addClass('dropFilter_list_wrapper_hidden');
		});

		this.$filter.find('.dropFilter_content.dropFilter_content_active').each(function(){
			$(this).removeClass('dropFilter_content_active');
		});

		$('.main_block').removeClass('main_block_down');
	}

	applyFilter($parent) {
		let type = $parent.find('.filter_select_item > p');
		let checked = new Array();
		let showTypes = '';

		type.each(function() {
			if ($(this).closest('.checkbox_item').hasClass('_active')) {
				$(this).closest('[data-filter-select-item]').addClass('_active');
				checked.push($(this).html());
			} 
		});

		$.each(checked, function(index, value) {
			if (index == checked.length-1) {
				showTypes += `${value}`;
			} else {
				showTypes += `${value}, `;
			}
		});

		$parent.find('.select').html(showTypes);

		this.dropFilterClose();
	}

	resetFilter() {
		let filterSelect = $('.select');
		let filterChekced = $('.checkbox_item');

		filterSelect.each(function() {
			$(this).html('');
		});

		filterChekced.each(function() {
			$(this).removeClass('_active');
		});

		this.resetSlider(this.$filter.find('.slider_cost'), 5);
		this.resetSlider(this.$filter.find('.slider_quantity'), 5);

		this.state = {};
	}

	resetSlider(sliderElem, sections) {
		let average = $(sliderElem).closest('.slider_container').find('.average_item');
		let thumbElem = sliderElem.children(); 
		// let sliderElemPos = sliderElem.position().left;
		// let minLeft = sliderElemPos - 1;
		// let maxRight = minLeft + sliderElem.width() - thumbElem.width() + 1;
		// let sliderLineWidth = maxRight - minLeft;
		// let externalSectionLength = sliderLineWidth / sections;
		// let sliderInnerLineWidth = sliderLineWidth - externalSectionLength;
		// let innerSectionLength = sliderInnerLineWidth / (sections - 2);
		// let thumbInnerSectionFinish = 1; 

		$(average).removeClass('visible');

		$(average).each(function(i) {
			if (i == 0) {
				$(this).addClass('visible');
			}
		});

		// $(thumbElem).css('left', `${((innerSectionLength / 2) * thumbInnerSectionFinish) + (externalSectionLength / 2)}px`);
		$(thumbElem).css('left', `-1px`);
		$(thumbElem).css('transition', 'all 0.25s ease');
	}

	init(){
		let self = this;

		this.$filter.find('[data-filter-select-block]').each(function(){
			self.selectStateRefresh($(this));
			self.applyFilter($(this));
		});

		this.$filter.find('[data-filter-scroll-block]').each(function(){
			self.scrollStateRefresh($(this));
		});

	}
	

	filterListingSubmit(page = 1){
		let self = this;
		self.state.page = page;

		let data = {
			'filter' : JSON.stringify(self.state)
		}

		this.promise = new Promise(function(resolve, reject) {
			self.reject = reject;
			self.resolve = resolve;
		});		
		
		$.ajax({
            type: 'get',
            url: '/ajax/filter/',
            data: data,
            success: function(response) {
            	response = $.parseJSON(response);
            	ym(70764172,'reachGoal','filter_use');
                self.resolve(response);
            },
            error: function(response) {

            }
		});		
	}

	filterMainSubmit(){
		let self = this;
		let data = {
			'filter' : JSON.stringify(self.state)
		}

		this.promise = new Promise(function(resolve, reject) {
			self.reject = reject;
			self.resolve = resolve;
	    });

		$.ajax({
            type: 'get',
            url: '/ajax/filter-main/',
            data: data,
            success: function(response) {
            	if(response){
            		ym(70764172,'reachGoal','filter_use');
            		self.resolve('/'+response);
            	}
            	else{
            		self.resolve(self.filterListingHref());
            	}
            },
            error: function(response) {

            }
        });
	}

	selectStateRefresh($block){
		let self = this;
		let blockType = $block.data('type');		
		let $items = $block.find('[data-filter-select-item]._active');

		if($items.length > 0){
			self.state[blockType] = '';
			$items.each(function(){
				if(self.state[blockType] !== ''){
					self.state[blockType] += ','+$(this).data('value');
				}
				else{
					self.state[blockType] = $(this).data('value');
				}
			});
		}
		else{
			delete self.state[blockType];
		}
	}

	scrollStateRefresh($block){
		let self = this;
		let blockType = $block.data('type');		
		let $items = $block.find('[data-filter-select-item].visible');

		if($items.length > 0){
			self.state[blockType] = '';
			$items.each(function(){
				if(self.state[blockType] !== ''){
					self.state[blockType] += ','+$(this).data('value');
				}
				else{
					self.state[blockType] = $(this).data('value');
				}
			});
		}
		else{
			delete self.state[blockType];
		}
	}

	// paginationStateRefresh($block){
	// 	let self = this;
	// 	let blockType = $block.data('type');		
	// 	let $items = $block.find('[data-listing-pagitem]._active');

	// 	if($items.length > 0){
	// 		self.statePag[blockType] = '';
	// 		$items.each(function(){
	// 			if(self.statePag[blockType] !== ''){
	// 				self.statePag[blockType] += ','+$(this).data('page-id');
	// 			}
	// 			else{
	// 				self.statePag[blockType] = $(this).data('page-id');
	// 			}
	// 		});
	// 	}
	// 	else{
	// 		delete self.statePag[blockType];
	// 	}

	// 	self.state = self.statePag;
	// }

	filterListingHref(){
		if(Object.keys(this.state).length > 0){
			var href = '/katalog-ploshchadok/?';
			$.each(this.state, function(key, value){
				href += '&' + key + '=' + value;
			});
		}
		else{
			var href = '/katalog-ploshchadok/';
		}			

		return href;
	}
}



