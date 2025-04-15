const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');
const cards = document.getElementById('cards');
const search = document.getElementById('search');
const search_input = document.getElementById('search_input');

// Добавляем кнопки для прокрутки серий
const leftSeriesBtn = document.getElementById('left-series');
const rightSeriesBtn = document.getElementById('right-series');
const cardsSeries = document.getElementById('cards-series');

leftBtn.addEventListener('click', () => {
  cards.scrollLeft -= 354;
});

rightBtn.addEventListener('click', () => {
  cards.scrollLeft += 354;
});

// Прокрутка для сериалов
leftSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollLeft -= 354;
});

rightSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollLeft += 354;
});

let json_url = "static/movie.json";

// Загружаем JSON-файл
fetch(json_url)
  .then(response => response.json()) // Преобразуем ответ в JSON
  .then(data => {
    // Создаём карточки фильмов для основного отображения
    data.forEach((ele, i) => {
        let { name, imdb, description, product,  date, sposter, bposter, genre, type, url, trailer, low, medium, high } = ele;
        let card = document.createElement('a');
        card.classList.add("card");
        card.href = url;
        card.innerHTML = `
        <img src="${sposter}" alt="${name}" class="poster">
            <div class="rest_card">
                <img src="${bposter}" alt="">
                <div class="cont">
                    <h4>${name}</h4>
                    <div class="sub">
                        <p>${genre}, ${date}</p>
                        <h3><span>IMBD </span> <i class="bi bi-star-fill"></i> ${imdb}</h3>
                    </div>
                </div>
            </div>
        `;
        cards.appendChild(card);
    });
    

    // Устанавливаем начальную информацию для первого фильма
    document.getElementById('title').innerText = data[0].name;
    document.getElementById('description').innerText = data[0].description;
    document.getElementById('gen').innerText = data[0].genre;
    document.getElementById('date').innerText = data[0].date;
    document.getElementById('rate').innerHTML = `<span>IMBD </span> <i class="bi bi-star-fill"></i>${data[0].imdb}`;
    document.getElementById('product').innerText = data[0].product;

     // Создаём карточки фильмов для результатов поиска
    data.forEach(element => {
         let { name, imdb, description, product,  date, sposter, bposter, genre, type, url, trailer, low, medium, high } = element;
        let card = document.createElement('a');
        card.classList.add("card");
        card.href = url;
        card.innerHTML = `
            <img src="${sposter}" alt="${name}">
                    <div class="cont">
                        <h3>${name}</h3>
                        <p>${genre}, ${date}  <span>IMBD </span> <i class="bi bi-star-fill"></i> ${imdb}</p>
                    </div>
        `
        search.appendChild(card);
    });

    // Фильтрация при вводе текста в поле поиска
    search_input.addEventListener('keyup', () => {
        let filter = search_input.value.toUpperCase();  // Получаем текст из поля поиска
        let a = search.getElementsByTagName('a');  // Получаем все карточки

        let hasVisibleCards = false;  // Переменная для проверки, есть ли видимые карточки

        for (let i = 0; i < a.length; i++) {
            let b = a[i].getElementsByClassName('cont')[0];  // Ищем текст внутри карточки
            let TextValue = b.textContent || b.innerText;
            // Если текст карточки содержит фильтруемый текст, то показываем карточку, иначе скрываем
            if (TextValue.toUpperCase().indexOf(filter) > -1) {
                a[i].style.display = "flex";  // Показываем карточку
                hasVisibleCards = true;  // Устанавливаем флаг, что есть видимые карточки
            } else {
                a[i].style.display = "none";  // Скрываем карточку
            }
        }

        // Если в поле поиска что-то введено и есть видимые карточки
        if (search_input.value !== "") {
            search.style.visibility = hasVisibleCards ? "visible" : "hidden";
            search.style.opacity = hasVisibleCards ? 1 : 0;
        } else {
            search.style.visibility = "hidden";
            search.style.opacity = 0;
        }
    });
    
    

    // Создаём карточки для сериалов
    fetch("static/movie.json")
  .then(response => response.json())
  .then(data => {
    const series = data.filter(item => item.type === 'movie');

    series.forEach((ele) => {
       let { name, imdb, description, product,  date, sposter, bposter, genre, type, url, trailer, low, medium, high } = ele;
      let card = document.createElement('a');
      card.classList.add("card");
      card.href = url;
      card.innerHTML = `
        <img src="${sposter}" alt="${name}" class="poster">
        <div class="rest_card">
            <img src="${bposter}" alt="">
            <div class="cont">
                <h4>${name}</h4>
                <div class="sub">
                    <p>${genre}, ${date}</p>
                    <h3><span>IMBD </span> <i class="bi bi-star-fill"></i> ${imdb}</h3>
                </div>
            </div>
        </div>
      `;
      cardsSeries.appendChild(card);
    });

    // ✅ Устанавливаем начальную информацию для первого сериала
    if (series.length > 0) {
      document.getElementById('title-series').innerText = series[0].name;
      document.getElementById('gen-series').innerText = series[0].genre;
      document.getElementById('description-series').innerText = data[0].description;
      document.getElementById('date-series').innerText = series[0].date;
      document.getElementById('rate-series').innerHTML = `<span>IMBD </span> <i class="bi bi-star-fill"></i>${series[0].imdb}`;
    }
  });
  });
