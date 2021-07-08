const headerCityButton = document.querySelector('.header__city-button');

let hash = location.hash;

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

const getData = async () => {//Универсальная функция для запроса (получение данных) с сервера
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


//

try {
	const goodsList = document.querySelector('.goods__list');

	if (!goodsList) {
		throw 'This is not a goods page!'
	}

	const createCart = ({ id, preview, cost, brand, name, sizes }) => {//деструктуризация 
		const li = document.createElement('li');//создаём элемент li 


		li.classList.add('goods__item'); // добавляем новому элементу класс

		//выводим созданный элемент на страницу
		li.innerHTML = ` 
			<article class="good">
				<a class="good__link-img" href="card-good.html#id${id}">
					<img class="good__img" src="goods-image/${preview}" alt="" />
				</a>
				<div class="good__description">
					<p class="good__price">${cost} &#8381;</p>
					<h3 class="good__title">${brand} <span class="good__title__grey">/ ${name}</span></h3>
					${sizes ?
				`<p class="good__sizes">Размеры (RUS):<span class="good__sizes-list">${sizes.join(' ')}</span></p>` :
				''
			}
					
					<a class="good__link" href="card-good.html#id56454">Подробнее</a>
				</div>
			</article>
		`

		return li
	};

	const renderGoodsList = data => {
		goodsList.textContent = ''

		// for (let i = 0; i < data.length; i++) {
		// 	console.log(data[i]);
		// }
		// for (const item of data) {
		// 	console.log(item);
		// }
		data.forEach((item) => {
			const card = createCart(item);
			goodsList.append(card);
		})

	};
	getGoods(renderGoodsList)

} catch (err) {
	console.warn(err)
}