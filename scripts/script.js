const headerCityButton = document.querySelector('.header__city-button');

if (localStorage.getItem('lomoda-location')) {
	headerCityButton.textContent = localStorage.getItem('lomoda-location')
}

headerCityButton.textContent =
	localStorage.getItem('lomoda-location') || 'Ваш город?';

headerCityButton.addEventListener('click', () => {
	const city = prompt('Укажите ваш город')
	headerCityButton.textContent = city;
	localStorage.setItem('lomoda-location', city)
})

//block scroll

const disableScroll = () => {
	const widthScroll = window.innerWidth - document.body.offsetWidth; //в переменной остаётся только скролл

	document.body.dbscrollY = window.scrollY;

	document.body.style.cssText = `
		position: fixed;
		top: ${-window.scrollY}px;
		left: 0;
		width: 100%;
		height:100vh;
		overflow:hidden;
		padding-right: ${widthScroll}px;
	`
}
const enableScroll = () => {
	document.body.style.cssText = '';
	window.scroll({
		top: document.body.dbscrollY
	})
}


//modal

const subheaderCart = document.querySelector('.subheader__cart');
const cartOverlay = document.querySelector('.cart-overlay');

const cartModalOpen = () => {
	cartOverlay.classList.add('cart-overlay-open');
	document.addEventListener('keydown', escapeHandler)
	disableScroll();
}
const cartModalClose = () => {
	cartOverlay.classList.remove('cart-overlay-open');
	document.removeEventListener('keydown', escapeHandler)
	enableScroll()
}
const escapeHandler = event => { //закрытие модального окна по кнопке Escape 
	if (event.code === 'Escape') {
		cartModalClose();
	};
};

//open modal
subheaderCart.addEventListener('click', cartModalOpen);

//close modal
cartOverlay.addEventListener('click', event => {
	const target = event.target;
	if (document.addEventListener('keydown', escapeHandler) || target.classList.contains('cart__btn-close') || target.matches('.cart-overlay')) { // вместо contains можно указать matches (он проверяет селектор)
		cartModalClose()
	}
})


//get data (запрос базы данных)

const getData = async () => {//Универсальная функция для запроса с сервера
	const data = await fetch('db.json') // await заставляет ожидать и не выполняет присваивание пока fetch не вернет ответ. без await получим промис
	if (data.ok) {
		return data.json();
	} else {
		throw new Error(`Данные не были получены, ошибка ${data.status} ${data.statusText}`)
	}
}

const getGoods = callback => {//обработка данных
	getData()
		.then(data => {
			callback(data);
		})
		.catch(err => {
			console.error(err)
		})
}

getGoods((data) => {
	console.warn(data);
})
