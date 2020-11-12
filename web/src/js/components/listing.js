'use strict';
import Filter from './filter';
import YaMapAll from './map';

export default class Listing{
	constructor($block){
		var self = this;
		this.block = $block;
		this.filter = new Filter($('[data-filter-wrapper]'));
		this.yaMap = new YaMapAll(this.filter);			

		//КЛИК ПО КНОПКЕ "ПОДОБРАТЬ"
		$('[data-filter-button]').on('click', function(){
			self.reloadListing();
		});

		//КЛИК ПО ПАГИНАЦИИ
		$('body').on('click', '[data-pagination-wrapper] [data-listing-pagitem]', function(){
			self.filter.paginationStateRefresh($('[data-pagination-wrapper]'));
			self.reloadListing($(this).data('page-id'));
		});


		$('body').on('click', '[data-pagination-wrapper] [data-pagswitch-prev]', function(){
			self.reloadListing($(this).data('page-id'));
		});

		$('body').on('click', '[data-pagination-wrapper] [data-pagswitch-next]', function(){
			self.reloadListing($(this).data('page-id'));
		});
	}

	reloadListing(page = 1){
		let self = this;
		self.block.addClass('_loading');
		self.filter.filterListingSubmit(page);
		self.filter.promise.then(
			response => {
				// console.log(response);
				// ym(66603799,'reachGoal','filter');
				// gtag('event', 'Filter', {
				//  'event_category': 'Search',
				// });
				// ym(64598434,'reachGoal','filter');
				// gtag('event', 'filter');
				$('[data-listing-list]').html(response.listing);
				$('[data-listing-title]').html(response.title);
				$('[data-listing-text-top]').html(response.text_top);
				$('[data-listing-text-bottom]').html(response.text_bottom);
				$('[data-pagination-wrapper]').html(response.pagination);
				self.block.removeClass('_loading');				
				if ($(window).width() > 767) {
					$('html,body').animate({scrollTop:$('.title').offset().top - 100}, 400);
				} else if ($(window).width() < 360) {
					$('html,body').animate({scrollTop:$('.title').offset().top + 40}, 400);
				} else {
					$('html,body').animate({scrollTop:$('.title').offset().top}, 400);
				}
				history.pushState({}, '', '/ploshhadki/'+response.url);
				this.yaMap.refresh(this.filter);
			}
		);
	}
}