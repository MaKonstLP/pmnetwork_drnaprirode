import Animation from './animation.js';
//import modal from './modal';
import {status, json} from './utilities';
import Inputmask from 'inputmask';
var animation = new Animation;

export default class Form {
	constructor(form) {
		this.$form = $(form);
		this.$formWrap = this.$form.parents('.form_wrapper');
		this.$formCal = this.$form.find('.calendar_wrapper');
		this.$submitButton = this.$form.find('button[type="submit"]');
		this.$policy = this.$form.find('[name="policy"]');
		this.to = (this.$form.attr('action') == undefined || this.$form.attr('action') == '') ? this.to : this.$form.attr('action');
		let im_phone = new Inputmask('+7 (999) 999-99-99', {
			clearIncomplete: true,
	    });
	    im_phone.mask($(this.$form).find('[name="phone"]'));

		this.bind();

		this.$form.find('[name="name"]').on('input', function() {
			var name = /^[А-Яа-яA-Za-z]+$/;

			if ( $(this).val().match(name)) {
				$(this).removeClass('input_error');
			} else {
				$(this).addClass('input_error');
			}
		});

		this.$form.find('[name="guests_number"]').on('input', function() {
			var guestsNumber = /^[0-9]+$/;

			if ( $(this).val().match(guestsNumber)) {
				$(this).removeClass('input_error');
			} else {
				$(this).addClass('input_error');
			}
		});

		this.$form.find('[name="phone"]').on('input', function() {
			if($(this).val().length < 18) {
				$(this).addClass('input_error');
			} else {
				$(this).removeClass('input_error');
			}
		});
	}

	bind() {
		this.$form.find('[data-dynamic-placeholder]').each(function () {
			$(this).on('blur',function () {
				if ($(this).val() == '')
					$(this).removeClass('form_input_filled');
				else
					$(this).addClass('form_input_filled');
			})
		})

		this.$form.on('submit', (e) => {
			this.sendIfValid(e);
		});

		this.$form.on('click', 'button.disabled', function(e) {
			e.preventDefault();
			return false;
		});

		$('[data-action="form_checkbox"]').on('click',(e) => {
			let $el = $(e.currentTarget);
			let $input = $el.siblings('input');

			if(!$(e.target).hasClass('_link')){
				$el.toggleClass("_active");
				$el.find('.personalData').toggleClass("input_error");
				$input.prop("checked", !$input.prop("checked"));
				e.stopImmediatePropagation();
			}	
		});

		this.$formWrap.find('[data-success] [data-success-close]').on('click', (e) => {
			this.$formWrap.find('[data-success]').addClass('_hide');
		});
	}

	checkFields() {
		var valid = true;

    	this.$form.find('[data-required]').each((i, el) => {
			if ($(el).hasClass('input_error') || $(el).val() == '') {
				$(el).addClass('input_error');
				valid = false;
			}
		});

		if (!valid) {
			this.$form.find('.input_error')[0].focus();
		}

		return valid;
	}

	reset() {
		this.$form.reset();
	}

	success(data, formType) {
		switch(formType) {
		  case 'main_order':
		  	ym(70764172,'reachGoal','send_banquet');
		    break;
		  case 'main_call':
		  	ym(70764172,'reachGoal','send_call');
		    break;
		  case 'main_callback':
		  	ym(70764172,'reachGoal','send_find_place');
		    break;
		}
	}

	sendIfValid(e) {
	    e.preventDefault();
	    if (!this.checkFields()) return;
	    if (this.disabled) return;

	    this.disabled = true;

	    var formData = new FormData(this.$form[0]);

	    var formType = this.$form.data('type');
	    formData.append('type', formType);
	    var formUrl = window.location.href;
	    formData.append('url', formUrl);

	    for (var pair of formData.entries()) {
		    console.log(pair[0]+ ', ' + pair[1]);
		}

	    fetch(this.to,{
			method: 'POST',
			body: formData
	    })
	    .then(status)
	    .then(json)
	    .then(data => {
			this.success(data, formType);
			this.disabled = false;
	    })
	    .catch(() => {
			this.disabled = false;
		});

		// Отображаем попап успешной отправки
		$('.message_send').removeClass('_hide');

		// Сбросим поля формы
		this.$form[0].reset(); // сбросим все поля формы (кроме даты)
		$($(this.$form[0]).find('[name="date"]')[0]).attr("value", ""); // сбросим поле даты
		$($(this.$formCal[0]).find('.fc-selected-date')[0]).removeClass('fc-selected-date'); // сбросим выбранную дату на календаре

		// Узнаем, через какую формы было отправлено - всплывающую или статичную
		let logic = true; 

		$('.dropForm_wrapper').each(function() {
			logic = logic && $(this).hasClass('_hide');
		});

		if (!logic) {
			let y = 0;

			if ($('body').attr('body-scroll-top')) {
				y = $('body').attr('body-scroll-top');
				$(window).scrollTop(y);
			}
		} else {
			$('body').css("top", `-${$(window).scrollTop()}px`);
			$('body').attr('body-scroll-top', `${$(window).scrollTop()}`);	
		}
		// end

		// Скрываем всплывающие окна и фиксируем body
		$('.dropForm_wrapper').addClass("_hide");
		$('body').addClass('body_fixed');
	}
}