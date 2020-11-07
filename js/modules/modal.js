function modal() {
		
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
}

module.exports = modal;
