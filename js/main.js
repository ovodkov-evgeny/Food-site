window.addEventListener('DOMContentLoaded', () => {

	// Tabs

	const tabs = document.querySelectorAll('.tabheader__item');
	const tabsContent = document.querySelectorAll('.tabcontent');
	const tabsParent = document.querySelector('.tabheader__items');

	const hideTabContent = () => {
		tabsContent.forEach(item => {
			item.classList.add('hide');
			item.classList.remove('show', 'fade');
		});

		tabs.forEach(item => {
			item.classList.remove('tabheader__item_active');
		});
	};

	const showTabContent = (i = 0) => {
		tabsContent[i].classList.add('show', 'fade');
		tabsContent[i].classList.remove('hide');
		tabs[i].classList.add('tabheader__item_active');
	};

	hideTabContent();
	showTabContent();

	tabsParent.addEventListener('click', (evt) => {
		const target = evt.target;
		
		if (target && target.classList.contains('tabheader__item')) {
			tabs.forEach((item, i) => {
				if (target === item) {
					hideTabContent();
					showTabContent(i);
				}
			});
		}
	});
	
	// Timer

	const deadline = '2020-10-05';

	function getTimeRemaining(endtime) {
		const t = Date.parse(endtime) - new Date(),
					days = Math.floor(t / (1000 * 60 * 60 * 24)),
					hours = Math.floor((t / (1000 * 60 * 60) % 24)),
					minutes = Math.floor((t / 1000 / 60) % 60),
					seconds = Math.floor((t / 1000) % 60);

		return {
			'total': t,
			'days': days,
			'hours': hours,
			'minutes': minutes,
			'seconds': seconds
		};
	}

	function getZero(num) {
		if (num >= 0 && num < 10) {
			return `0${num}`;
		} else {
			return num;
		}
	}

	function setClock (selector, endtime) {
		const timer = document.querySelector(selector),
					days = timer.querySelector('#days'),
					hours = timer.querySelector('#hours'),
					minutes = timer.querySelector('#minutes'),
					seconds = timer.querySelector('#seconds'),
					timeInterval = setInterval(updateClock, 1000);

		updateClock();

		function updateClock () {
			const t = getTimeRemaining(endtime);

			days.innerHTML = getZero(t.days);
			hours.innerHTML = getZero(t.hours);
			minutes.innerHTML = getZero(t.minutes);
			seconds.innerHTML = getZero(t.seconds);

			if (t.total <= 0) {
				clearInterval(timeInterval);
			}
		}
	}

	setClock('.timer', deadline);

	// Modal

	const modalTrigger = document.querySelectorAll('[data-modal]'),
				modal = document.querySelector('.modal'),
				modalTimerID = setTimeout(openModal, 20000);

	function openModal() {
		modal.classList.add('show');
		modal.classList.remove('hide');
		document.body.style.overflow = 'hidden';
		clearInterval(modalTimerID);
	}

	function closeModal() {
		modal.classList.add('hide');
		modal.classList.remove('show');
		document.body.style.overflow = '';
	}

	modalTrigger.forEach(btn => {
		btn.addEventListener('click', openModal);
	});

	modal.addEventListener('click', (evt) => {
		if (evt.target === modal || evt.target.getAttribute('data-close') == '') {
			closeModal();
		}
	});

	document.addEventListener('keydown', (evt) => {
		if (evt.code === 'Escape' && modal.classList.contains('show')) {
			closeModal();
		}
	});

	function showModalByScroll () {
		if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
			openModal();
			window.removeEventListener('scroll', showModalByScroll);
		}
	}

	window.addEventListener('scroll', showModalByScroll);

	// Classes for catalog items

	class MenuCard {
		constructor(src, alt, title, descr, price, parentSelector, ...classes) {
			this.src = src;
			this.alt = alt;
			this.title = title;
			this.descr = descr;
			this.price = price;
			this.classes = classes;
			this.parent = document.querySelector(parentSelector);
			this.transfer = 27;
			this.changeToUAH();
		}

		changeToUAH() {
			this.price = this.price * this.transfer;
		}

		render() {
			const element = document.createElement('div');
			
			if (this.classes.length === 0) {
				this.element = 'menu__item';
				element.classList.add(this.element);
			} else {
				this.classes.forEach(className => element.classList.add(className));
			}

			element.innerHTML = `
				<img src=${this.src} alt=${this.alt}>
				<h3 class="menu__item-subtitle">${this.title}</h3>
				<div class="menu__item-descr">${this.descr}</div>
				<div class="menu__item-divider"></div>
				<div class="menu__item-price">
					<div class="menu__item-cost">Цена:</div>
					<div class="menu__item-total"><span>${this.price}</span> грн/день</div>
				</div>
			`;
			this.parent.append(element);
		}
	}

	new MenuCard(
		"./img/tabs/vegy.jpg",
		"vegy",
		'Меню "Фитнес"',
		'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
		9,
		'.menu .container',
		'menu__item'
	).render();

	new MenuCard(
		"./img/tabs/elite.jpg",
		"elite",
		'Меню “Премиум”',
		'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
		17,
		'.menu .container',
		'menu__item'
	).render();

	new MenuCard(
		"./img/tabs/post.jpg",
		"post",
		'Меню "Постное"',
		'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
		13,
		'.menu .container',
		'menu__item'
	).render();

	// Forms

	const forms = document.querySelectorAll('form');
	const message = {
		loading: './img/form/spinner.svg',
		success: 'Всё прошло успешно!',
		failure: 'Что-то пошло не так'
	};

	function postData(form) {
		form.addEventListener('submit', (evt) => {
			evt.preventDefault();

			const statusMessage = document.createElement('img');
			statusMessage.src = message.loading;
			statusMessage.style.cssText = `
				display: block;
				margin: 0 auto;
			`;
			form.insertAdjacentElement('afterend', statusMessage);

			const formData = new FormData(form);

			const obj = {};
			formData.forEach(function(value, key) {
				obj[key] = value;
			});

			fetch('server.php', {
				method: 'POST',
				headers: {
					'Content-type': 'application/json'
				},
				body: JSON.stringify(obj)
			})
			.then(data => data.text())
			.then(data => {
				console.log(data);
				showThanksModal(message.success);
				form.reset();
				statusMessage.remove();
			})
			.catch(() => {
				showThanksModal(message.failure);
			})
			.finally(() => {
				form.reset();
			});

			// const json = JSON.stringify(obj);
			// request.send(json);

			// request.addEventListener('load', () => {
			// 	if (request.status === 200) {
			// 		console.log(request.response);
			// 		showThanksModal(message.success);
			// 		form.reset();
			// 		statusMessage.remove();
			// 	} else {
			// 		showThanksModal(message.failure);
			// 	}
			// });
		});
	}

	forms.forEach(item => {
		postData(item);
	});

	function showThanksModal(message) {
		const prevModalDialog = document.querySelector('.modal__dialog');

		prevModalDialog.classList.add('hide');
		openModal();

		const thanksModal = document.createElement('div');
		thanksModal.classList.add('modal__dialog');
		thanksModal.innerHTML = `
			<div class='modal__content'>
				<div class='modal__close' data-close>&times;</div>
				<div class='modal__title>${message}</div>
			</div>
		`;

		document.querySelector('.modal').append(thanksModal);

		setTimeout(() => {
			thanksModal.remove();
			prevModalDialog.classList.add('show');
			prevModalDialog.classList.remove('hide');
			closeModal();
		}, 4000);
	}
});
