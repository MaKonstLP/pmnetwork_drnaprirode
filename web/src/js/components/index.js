'use strict';
import Filter from './filter';

export default class Index{
	constructor($block){
		var self = this;
		this.block = $block;
		this.filter = new Filter($('[data-filter-wrapper]'));

		//КЛИК ПО КНОПКЕ "ПОДОБРАТЬ"
		$('[data-filter-button]').on('click', function(){
			self.redirectToListing();
		});


		$('.index_toggle-btn').on('click', function() {
			self.readMore();
		});
	}

	redirectToListing(){
		this.filter.filterMainSubmit();
		this.filter.promise.then(
			response => {
				/*ym(66603799,'reachGoal','filter');
				gtag('event', 'Filter', {
				  'event_category': 'Search',
				});*/
				window.location.href = response;
			}
		);
	}

	readMore() {
		$('.index_seo_text_wrapper').toggleClass('index_seo_text_wrapper-open')

		if ($('.index_seo_text_wrapper').hasClass('index_seo_text_wrapper-open')) {
			$('.index_toggle-btn').html('Свернуть');
		} else {
			$('.index_toggle-btn').html('Читать далее');
		}
	}
}