import axios from 'axios';
const API_KEY = '39833580-35c77e6472e2da9ea800f27de';
// Create a class for fetching news articles from the Pixabay API
class NewsApi {
  constructor() {
    // Initialize default parameters
    this.q = null;
    this.page = 1; // Current page
    this.per_page = 40; // Number of results per page
  
  }

  // Method for fetching news articles
  async fetchImages(searchQuery, apiKey) {
    const BASE_URL = 'https://pixabay.com/api/';
    
  
    return axios.get(`${BASE_URL}/search/photos`, {
      // Construct query parameters
      const params = new URLSearchParams({
        q: searchQuery,
        page: this.page,
        per_page: this.per_page,
        key: API_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      });
    });
  }
}

// Export the NewsApi class to be used in other modules
export { NewsApi };