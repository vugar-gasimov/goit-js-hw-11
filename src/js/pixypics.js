// Import necessary modules and styles
import Notiflix from 'notiflix';
import { fetchImages, per_page, q } from './pixyapi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

// Select DOM elements
const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const loadMoreBtnEl = document.querySelector('.load-more');
const input = document.querySelector('input[name="searchQuery"]');

// Initialize variables
let searchQuery = '';
let page = 1;
const API_KEY = '39833580-35c77e6472e2da9ea800f27de';

// Initialize the lightbox for images
initializeLightbox();

// Event listeners
searchForm.addEventListener('submit', onFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);

// Function to initialize the lightbox for images
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

// Handle form submission
async function onFormSubmit(e) {
  e.preventDefault();
  page = 1;
  searchQuery = input.value.trim();
  loader.classList.remove('visually-hidden');

  // Check if the search query is empty
  if (searchQuery === '') {
    handleEmptySearchQuery();
    return;
  }

  try {
    gallery.innerHTML = '';
    const response = await fetchImages(searchQuery, page);

    // Handle case where no results are found
    if (response.hits.length === 0) {
      handleNoResults(response.totalHits);
      return;
    }

    createMarkup(response.hits);
    handleSuccess(response.totalHits);
    if (response.totalHits <= per_page) {
      loadMoreBtnEl.classList.add('visually-hidden');
    }
    loader.classList.add('visually-hidden');
  } catch (error) {
    handleRequestError();
  }

  scrollPage();
}

// Handle "Load More" button click
async function onLoadMoreBtnClick() {
  page += 1;

  try {
    const response = await fetchImages(searchQuery, page);

    // Handle case where no more results are found
    if (response.hits.length === 0) {
      handleNoMoreResults(response.totalHits);
    } else {
      createMarkup(response.hits);
      loader.classList.add('visually-hidden');
      handleSuccess(response.totalHits);
    }
  } catch (error) {
    handleRequestError();
  }

  scrollPage();
}

// Handle an empty search query
function handleEmptySearchQuery() {
  loadMoreBtnEl.classList.add('visually-hidden');
  gallery.innerHTML = '';
  Notiflix.Notify.failure('Please enter a search query.', {
    cssAnimationStyle: 'from-top',
    timeout: 500,
    closeButton: true,
  });
  loader.classList.add('visually-hidden');
}

// Handle case where no results are found
function handleNoResults(totalHits) {
  input.value = '';
  loadMoreBtnEl.classList.add('visually-hidden');
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.',
    {
      cssAnimationStyle: 'from-top',
      timeout: 1500,
      closeButton: true,
    }
  );
  loader.classList.add('visually-hidden');
}

// Handle a successful search
function handleSuccess(totalHits) {
  Notiflix.Notify.success(`Hooray! We found ${totalHits} ${searchQuery}.`, {
    cssAnimationStyle: 'from-top',
    timeout: 1500,
    closeButton: true,
  });
  loadMoreBtnEl.classList.remove('visually-hidden');
}

// Handle case where no more results are found
function handleNoMoreResults(totalHits) {
  loadMoreBtnEl.classList.add('visually-hidden');
  const lastPage = Math.ceil(totalHits / per_page);

  if (page >= lastPage) {
    Notiflix.Notify.info("You're on the last page of search results.", {
      cssAnimationStyle: 'from-top',
      timeout: 1500,
      closeButton: true,
    });
  } else {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results.",
      {
        cssAnimationStyle: 'from-top',
        timeout: 1500,
        closeButton: true,
      }
    );
  }
}

// Handle request errors
function handleRequestError() {
  Notiflix.Notify.failure(
    'Sorry, there was an error while fetching data. Please try again.',
    {
      cssAnimationStyle: 'from-top',
      timeout: 1500,
      closeButton: true,
    }
  );
  loader.classList.add('visually-hidden');
}

// Create markup for images
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
}

// Scroll the page to show more images
function scrollPage() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 1,
    behavior: 'smooth',
  });
}