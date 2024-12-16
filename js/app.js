document.addEventListener("DOMContentLoaded", function (e) {

	// бургер меню
	let burger = document.querySelector(".burger-menu");
	let documentBody = document.documentElement;

	function menuOpen() {
		documentBody.classList.toggle("lock");
		documentBody.classList.toggle("menu-open");
	};

	function menuClose() {
		documentBody.classList.remove("menu-open");
		documentBody.classList.remove("lock");
	};


	burger?.addEventListener("click", function () {
		menuOpen();
	});

	const mainBlock = document.querySelector('#main');

	if (mainBlock) {
		new fullpage(mainBlock, {
			menu: '#menu',
    //anchors: ['introduction', 'content', 'footer'],
			//parallax: true,
			onLeave: function (origin, destination, direction) {
				console.log("Leaving section" + origin.index);
			},
		});
	}


	//Слайдеры
	function initSliders() {
		if (document.querySelector('.reviews-about__slider')) {
			new Swiper('.reviews-about__slider', {
				observer: true,
				observeParents: true,
				slidesPerView: 1,
				spaceBetween: 10,
				autoHeight: true,
				centeredSlides: false,
				speed: 500,

				// Пагинация
				pagination: {
					el: '.swiper-pagination',
					clickable: true,
				},


				// Брейкпоинты
				/*
				breakpoints: {
					320: {
						slidesPerView: 1,
						spaceBetween: 0,
						autoHeight: true,
					},
					768: {
						slidesPerView: 2,
						spaceBetween: 20,
					},
					992: {
						slidesPerView: 3,
						spaceBetween: 20,
					},
					1268: {
						slidesPerView: 4,
						spaceBetween: 30,
					},
				},
				*/
			});
		}
	}

	window.addEventListener("load", function (e) {
		// Запуск инициализации слайдеров
		initSliders();
	});


	// Вспомогательные модули плавного расскрытия и закрытия объекта ======================================================================================================================================================================
	let _slideUp = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.style.transitionProperty = 'height, margin, padding';
			target.style.transitionDuration = duration + 'ms';
			target.style.height = `${target.offsetHeight}px`;
			target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			window.setTimeout(() => {
				target.hidden = !showmore ? true : false;
				!showmore ? target.style.removeProperty('height') : null;
				target.style.removeProperty('padding-top');
				target.style.removeProperty('padding-bottom');
				target.style.removeProperty('margin-top');
				target.style.removeProperty('margin-bottom');
				!showmore ? target.style.removeProperty('overflow') : null;
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
				// Создаем событие 
				document.dispatchEvent(new CustomEvent("slideUpDone", {
					detail: {
						target: target
					}
				}));
			}, duration);
		}
	}
	let _slideDown = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide');
			target.hidden = target.hidden ? false : null;
			showmore ? target.style.removeProperty('height') : null;
			let height = target.offsetHeight;
			target.style.overflow = 'hidden';
			target.style.height = showmore ? `${showmore}px` : `0px`;
			target.style.paddingTop = 0;
			target.style.paddingBottom = 0;
			target.style.marginTop = 0;
			target.style.marginBottom = 0;
			target.offsetHeight;
			target.style.transitionProperty = "height, margin, padding";
			target.style.transitionDuration = duration + 'ms';
			target.style.height = height + 'px';
			target.style.removeProperty('padding-top');
			target.style.removeProperty('padding-bottom');
			target.style.removeProperty('margin-top');
			target.style.removeProperty('margin-bottom');
			window.setTimeout(() => {
				target.style.removeProperty('height');
				target.style.removeProperty('overflow');
				target.style.removeProperty('transition-duration');
				target.style.removeProperty('transition-property');
				target.classList.remove('_slide');
				// Создаем событие 
				document.dispatchEvent(new CustomEvent("slideDownDone", {
					detail: {
						target: target
					}
				}));
			}, duration);
		}
	}
	let _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration);
		} else {
			return _slideUp(target, duration);
		}
	}

	// Обработа медиа запросов из атрибутов 
	function dataMediaQueries(array, dataSetValue) {
		// Получение объектов с медиа запросами
		const media = Array.from(array).filter(function (item, index, self) {
			if (item.dataset[dataSetValue]) {
				return item.dataset[dataSetValue].split(",")[0];
			}
		});
		// Инициализация объектов с медиа запросами
		if (media.length) {
			const breakpointsArray = [];
			media.forEach(item => {
				const params = item.dataset[dataSetValue];
				const breakpoint = {};
				const paramsArray = params.split(",");
				breakpoint.value = paramsArray[0];
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
				breakpoint.item = item;
				breakpointsArray.push(breakpoint);
			});
			// Получаем уникальные брейкпоинты
			let mdQueries = breakpointsArray.map(function (item) {
				return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
			});
			mdQueries = uniqArray(mdQueries);
			const mdQueriesArray = [];

			if (mdQueries.length) {
				// Работаем с каждым брейкпоинтом
				mdQueries.forEach(breakpoint => {
					const paramsArray = breakpoint.split(",");
					const mediaBreakpoint = paramsArray[1];
					const mediaType = paramsArray[2];
					const matchMedia = window.matchMedia(paramsArray[0]);
					// Объекты с нужными условиями
					const itemsArray = breakpointsArray.filter(function (item) {
						if (item.value === mediaBreakpoint && item.type === mediaType) {
							return true;
						}
					});
					mdQueriesArray.push({
						itemsArray,
						matchMedia
					})
				});
				return mdQueriesArray;
			}
		}
	}

	// Уникализация массива
	function uniqArray(array) {
		return array.filter(function (item, index, self) {
			return self.indexOf(item) === index;
		});
	}


	const spollersArray = document.querySelectorAll('[data-spollers]');
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
			return !item.dataset.spollers.split(",")[0];
		});
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular);
		}
		// Получение слойлеров с медиа запросами
		let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener("change", function () {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
				});
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
			});
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init');
					initSpollerBody(spollersBlock);
					spollersBlock.addEventListener("click", setSpollerAction);
				} else {
					spollersBlock.classList.remove('_spoller-init');
					initSpollerBody(spollersBlock, false);
					spollersBlock.removeEventListener("click", setSpollerAction);
				}
			});
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(item => item.closest('[data-spollers]') === spollersBlock);
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex');
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true;
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1');
						spollerTitle.nextElementSibling.hidden = false;
					}
				});
			}
		}
		function setSpollerAction(e) {
			const el = e.target;
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]');
				const spollersBlock = spollerTitle.closest('[data-spollers]');
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
				const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
						hideSpollersBody(spollersBlock);
					}
					spollerTitle.classList.toggle('_spoller-active');
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
				}
				e.preventDefault();
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._spoller-active');
			const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
			if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
				spollerActiveTitle.classList.remove('_spoller-active');
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]');
		if (spollersClose.length) {
			document.addEventListener("click", function (e) {
				const el = e.target;
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]');
						const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
						spollerClose.classList.remove('_spoller-active');
						_slideUp(spollerClose.nextElementSibling, spollerSpeed);
					});
				}
			});
		}
	}

});



