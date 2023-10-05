// Import necessary libraries and modules
import axios from 'axios';
import Notiflix from 'notiflix';
import { NewsApi } from './js/pixabay-api';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

// Select DOM elements
const searchForm = document.querySelector('#search-form');
const mainContent = document.querySelector('main');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('#loader');
const loadMoreButton = document.querySelector('.load-more');

// Define API key and initial page number
const API_KEY = '39833580-35c77e6472e2da9ea800f27de';

// Create an instance of the NewsApi class
const newsApi = new NewsApi();

// Create a SimpleLightbox instance
const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  closeText: "×",
  nav: true,
  animationSlide: true,
  animationSpeed: 250,
});

// Function to initialize the lightbox
function initializeLightbox() {
  lightbox.refresh();
}

// Function to scroll to the next group of images
function scrollToNextGroup() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// Function to render search results on the page
function renderSearchResults(results) {
  gallery.innerHTML = '';

  const imageCardsMarkup = results.map((result) => `
    <div class="photo-card">
      <div class="image-container">
        <a href="${result.webformatURL}" class="image-link">
          <img src="${result.webformatURL}" alt="${result.tags}" loading="lazy" />
        </a>
      </div>
      <div class="info">
        <p class="info-item"><b>Likes:</b> ${result.likes}</p>
        <p class="info-item"><b>Views:</b> ${result.views}</p>
        <p class="info-item"><b>Comments:</b> ${result.comments}</p>
        <p class="info-item"><b>Downloads:</b> ${result.downloads}</p>
      </div>
    </div>
  `).join('');

  gallery.insertAdjacentHTML('beforeend', imageCardsMarkup);

  initializeLightbox();
}

// Function to fetch articles with pagination
async function fetchArticlesWithPagination(searchQuery, apiKey, currentPage) {
  try {
    // Fetch data from the NewsApi class
    const data = await newsApi.fetchArticles(searchQuery, apiKey, currentPage);

    // Handle no results
    if (data.hits.length === 0) {
      // Display a warning notification
      Notiflix.Notify.warning('Sorry, there are no images matching your search query. Please try again.', {
        closeButton: true,
        cssAnimationStyle: 'from-top',
        timeout: 1000,
      });
    } else {
      // Render search results on the page
      renderSearchResults(data.hits);

      // Handle notifications and load more button visibility
      if (page === 1) {
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`, {
          closeButton: true,
          cssAnimationStyle: 'from-top',
          timeout: 1000,
        });
      }
      if (data.totalHits <= page * newsApi.per_page) {
        loader.classList.remove('visually-hidden');
        loadMoreButton.classList.add('visually-hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.", {
          closeButton: true,
          cssAnimationStyle: 'from-top',
          timeout: 1000,
        });
      } else {
        loadMoreButton.classList.remove('visually-hidden');
        scrollToNextGroup();
      }
    }
  } catch (error) {
    // Handle errors and display a failure notification
    console.error('Error:', error);
    Notiflix.Notify.failure('Oops! Something went wrong. Please try again later.', {
      closeButton: true,
      cssAnimationStyle: 'from-top',
      timeout: 1000,
    });
  }
}

// Event listener for the search form submission
searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchQuery = e.target.searchQuery.value;
  page = 1;
  await fetchArticlesWithPagination(searchQuery, API_KEY, page);
});

// Event listener for the "Load More" button click
loadMoreButton.addEventListener('click', async () => {
  page += 1;
  const searchQuery = searchForm.searchQuery.value;
  await fetchArticlesWithPagination(searchQuery, API_KEY, page);
});

// Intersection Observer for loading images
const handleIntersection = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      loadImages();
    }
  });
};

const options = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver(handleIntersection, options);

observer.observe(loader);

// Function to load images when intersection occurs
function loadImages() {
  const searchQuery = searchForm.searchQuery.value;
  fetchArticlesWithPagination(searchQuery, API_KEY, page);
}