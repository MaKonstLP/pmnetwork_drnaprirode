"use strict";

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ruLocale from '@fullcalendar/core/locales/ru';

export default class CalendarCustom{
  constructor(calendarEl){
		this.init(calendarEl);
		this.initCalendarButtons();
  }

  	init(calendarEl) {
		let calendar = new Calendar(calendarEl, {
			firstDay: 1,
			defaultDate: new Date(),
			fixedWeekCount: false,			
			locale: ruLocale,
			aspectRatio: 1.35,
			header: {
				left: "title",
				right: "prev,next"
			},
			

			plugins: [ dayGridPlugin, interactionPlugin ],

			dateClick: function(info){
				let numInCell = info.jsEvent.target;
				let selectedDate = info.dateStr;
				let $button = $(".fc-booking-button");

				let updateDateFieldIfInForm = function(target, date) {
					let $input = $(target).closest(".calendar_wrapper").siblings("input[name='date']");

					if ( $(target).closest("form").length !== 0 
						|| $(target).closest("[data-filter-wrapper]").length !== 0) {

						if (date !== ""){
							let tmp = date.split("-");
							let correctDate = tmp[2] + "." + tmp[1] + "." + tmp[0];
							$input.attr("value", correctDate);
							
						} else {
							$input.attr("value", "");
						}
					}
				};

				if(numInCell.tagName == "SPAN"){

					if( $(numInCell).hasClass("fc-selected-date") ){
						$(numInCell).removeClass("fc-selected-date");
						selectedDate = "";
						updateDateFieldIfInForm(numInCell, selectedDate);
						$button.addClass("_hide");
					} else {
						$(".fc-selected-date").removeClass("fc-selected-date");
						$(numInCell).addClass("fc-selected-date");
						updateDateFieldIfInForm(numInCell, selectedDate);
						$button.removeClass("_hide");
					}

				} else {

					if( $(numInCell).find("span").hasClass("fc-selected-date") ){
						$(numInCell).find("span").removeClass("fc-selected-date");
						selectedDate = "";
						updateDateFieldIfInForm(numInCell, selectedDate);
						$button.addClass("_hide");
					} else {
						$(".fc-selected-date").removeClass("fc-selected-date");
						$(numInCell).find("span").addClass("fc-selected-date");
						updateDateFieldIfInForm(numInCell, selectedDate);
						$button.removeClass("_hide");
					}

				}

				if($(numInCell).closest('form').length > 0){
					$(numInCell).closest(".calendar_container").addClass("_hide");
				}

				// Проверка даты, добавление input_error при ошибке
				let selectDate = new Date(selectedDate);
				let todayDate = new Date();
				let input = $(numInCell).closest('.form_block').find('[name="date"]');

				if (selectDate >= todayDate) {
					$(input).removeClass('input_error');
				} else {
					$(input).addClass('input_error');
				}
			}
		});

		calendar.render();
	}

	initCalendarButtons(){
		let $buttons = $(".open_calendar_button");

		$buttons.on("click", function(e){
			let $button = $(e.target).closest(".open_calendar_button");
			let $calendar = $button.next();

			if ( !$button.hasClass("_active") ) {
				$button.addClass("_active");
			} else {
				$button.removeClass("_active");
			}

			if ( $calendar.hasClass("_hide") ) {
				$calendar.removeClass("_hide");
			} else {
				$calendar.addClass("_hide");
			}

			e.stopImmediatePropagation();
		});

		$(document).mouseup(function (e){
			let div = $(".calendar_wrapper");

			for ( let cal of div){
				if (!$(cal).is(e.target) 
					&& $(cal).has(e.target).length === 0
					&& !$(cal).children(".calendar_container").hasClass("_hide")) {
					$(cal).children(".calendar_container").addClass ("_hide");
					$(cal).children(".open_calendar_button").removeClass("_active");
				}
			}
		});
	}
}

