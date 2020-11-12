'use strict';
import Swiper from 'swiper';
import 'slick-carousel';
import * as Lightbox from '../../../node_modules/lightbox2/dist/js/lightbox.js';

export default class Post{
	constructor($item){
		var self = this;
		this.sliders = new Array();

		var galleryList = new Swiper('.gallery-top-list', {
			spaceBetween: 20,
			slidesPerView: 3,
			navigation: {
				nextEl: '.carousel_nav_next_list',
				prevEl: '.carousel_nav_prev_list',
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
	}
}