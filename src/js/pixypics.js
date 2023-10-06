
import axios from 'axios';
import Notiflix from 'notiflix';
import { fetchImages, per_page, q } from './pixyapi';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const loadMoreBtnEl = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');

let searchQuery = ''; 
let page = 1;
const API_KEY = '39833580-35c77e6472e2da9ea800f27de';

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
    closeText: '×',
    nav: true,
    animationSlide: true,
    animationSpeed: 250,
  });
  lightbox.refresh();
}

searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  searchQuery = input.value.trim();
   loader.classList.remove('visually-hidden');
  if (searchQuery === '') {
    loadMoreBtnEl.classList.add('visually-hidden');
    gallery.innerHTML = '';
    Notiflix.Notify.failure('Please enter a search query.',{
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
    });
    loader.classList.add('visually-hidden');
    return;
  } else {
    loadMoreBtnEl.classList.remove('visually-hidden');
  }

  try {
    gallery.innerHTML = '';
    const response = await fetchImages(searchQuery, page);

    if (response.hits.length === 0) {
      input.value = ''; 
      loadMoreBtnEl.classList.add('visually-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',{
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
      });
      loader.classList.add('visually-hidden');
      return;
    } else {
      createMarkup(response.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${response.totalHits} ${searchQuery}.`,{
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
      });
      loadMoreBtnEl.classList.remove('visually-hidden');
    }
    if (response.totalHits <= per_page) {
      loadMoreBtnEl.classList.add('visually-hidden');
    }
    loader.classList.add('visually-hidden');
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error while fetching data. Please try again.',{
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
    });
    loader.classList.add('visually-hidden');
  }
  scrollPage();
}
async function onLoadMoreBtnClick() {
  page += 1;
  try {
    const response = await fetchImages(searchQuery, page);

    if (response.hits.length === 0) {
      loadMoreBtnEl.classList.add('visually-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results.", {
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
      });
    } else {
      createMarkup(response.hits);
       loader.classList.add('visually-hidden');
    }
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there was an error while fetching more data. Please try again.', {
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
      });
  }

  scrollPage();
}
function createMarkup(images) {
  const markup = images
    .map((image) => {
      return `
        <div class="photo-card">
        <div class="image-container">
          <a href="${image.webformatURL}" class="image-link">
            <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </a>
          </div>
          <div class="info">
            <p class="info-item"><b>Likes: ${image.likes}</b></p>
            <p class="info-item"><b>Views: ${image.views}</b></p>
            <p class="info-item"><b>Comments: ${image.comments}</b></p>
            <p class="info-item"><b>Downloads: ${image.downloads}</b></p>
          </div>
        </div>
      `;
    })
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
   initializeLightbox();
}

function scrollPage() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
}

initializeLightbox();


