const videoContainer = document.getElementById('video-container');
const progress = document.getElementById('progress');
const volume = document.getElementById('volume');
let hideTimeout;
const episodeList = document.getElementById('episode-list');
const video = document.getElementById('video');

// Получаем параметр id из URL
const urlParams = new URLSearchParams(window.location.search);
let movieId = urlParams.get("id");
let episodeId = urlParams.get("episode");  // Параметр для серии

const leftSeriesBtn = document.getElementById('left-series');
const rightSeriesBtn = document.getElementById('right-series');
const cardsSeries = document.getElementById('cards-series');
const cards = document.getElementById('cards-series'); 

// Прокрутка для сериалов
leftSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollLeft -= 354;
});

rightSeriesBtn.addEventListener('click', () => {
  cardsSeries.scrollLeft += 354;
})

// Функция для обновления видео
function updateVideo(movieId, episodeId) {
  fetch('static/movie.json')
    .then(response => response.json())
    .then(movies => {
      const movie = movies.find(m => m.url.includes(movieId));

      if (movie) {
        if (episodeId) {
          // Ищем эпизод по ID
          const episode = movie.episodes.find(e => e.url.includes(episodeId));
          
          if (episode) {
            // Если эпизод найден, устанавливаем трейлер эпизода
            document.getElementById('video').src = episode.trailer;
            document.getElementById('episode-name').innerText = episode.title;
          }
        } else {
          // Если эпизод не указан, показываем трейлер фильма
          document.getElementById('video').src = movie.trailer;
          
        }

        // Обновление карточек с сериями
        createEpisodeCards(movie.episodes, movieId);
      } else {
        document.body.innerHTML = "<h1>Фильм не найден</h1>";
      }
    })
    .catch(error => {
      console.error("Ошибка при загрузке данных фильма:", error);
      document.body.innerHTML = "<h1>Ошибка при загрузке фильма</h1>";
    });
}

// Изначальная загрузка видео и серий
updateVideo(movieId, episodeId);

// Слушаем изменения URL (при переходах по сериям)
window.addEventListener('popstate', () => {
  const urlParams = new URLSearchParams(window.location.search);
  movieId = urlParams.get("id");
  episodeId = urlParams.get("episode");  // Новый параметр episode для серии
  updateVideo(movieId, episodeId);  // Обновляем видео при изменении URL
});

// Создание карточек серий
function createEpisodeCards(episodes, movieId) {
  const episodeList = document.getElementById('episode-list');
  
  if (episodeList) {
    episodeList.innerHTML = '';  // Очищаем старые карточки, если есть
    episodes.forEach(episode => {
      const episodeCard = document.createElement('div');
      episodeCard.classList.add('series');
     

      episodeCard.innerHTML = `
        <a href="movie.html?id=${movieId}&episode=${episode.url.split('=')[1]}" class="card"> <!-- Изменили ссылку, чтобы передавать правильный ID -->
          <img src="${episode.thumbnail}" alt="${episode.title}">
          <div class="cont">
            <div class="movie-info">
              <h2>${episode.title}</h2>
              <p><strong>Дата выхода:</strong> ${episode.date}</p>
              <p><strong>IMDb:</strong> ${episode.imdb}</p>
            </div>
          </div>
        </a>
      `;
      
      episodeList.appendChild(episodeCard);
      
    });
  }
}


let json_url = "static/movie.json";
fetch(json_url)
  .then(response => response.json()) // Преобразуем ответ в JSON
  .then(data => {
    const series = data.filter(item => item.type === 'series');

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
                    <p>${genre}, </p>
                    <p> ${date}</p>
                    
                </div>
            </div>
        </div>
      `;
      cardsSeries.appendChild(card);
    });
});


function togglePlay() {
  video.paused ? video.play() : video.pause();
}

function forward() {
  video.currentTime += 10;
}

function rewind() {
  video.currentTime -= 10;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function showControls() {
  videoContainer.classList.remove('hide-controls');
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    videoContainer.classList.add('hide-controls');
  }, 500); // Таймаут для автоскрытия контролов
}

document.addEventListener('mousemove', showControls);
document.addEventListener('keydown', showControls);
showControls();

videoContainer.addEventListener('click', (e) => {
  if (!e.target.closest('button') && !e.target.closest('input')) {
    togglePlay();
  }
});

video.addEventListener('timeupdate', () => {
  const percent = (video.currentTime / video.duration) * 100;
  progress.value = percent || 0;
});

volume.value = 0.2;
video.volume = volume.value;

progress.addEventListener('input', () => {
  video.currentTime = (progress.value / 100) * video.duration;
});

volume.addEventListener('input', () => {
  video.volume = volume.value;
});