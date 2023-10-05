import axios from 'axios';

// Create a class for fetching news articles from the Pixabay API
class NewsApi {
  constructor() {
    // Initialize default parameters
    this.page = 1; // Current page
    this.per_page = 40; // Number of results per page
    this.maxPage = 100; // Maximum allowed page
    this.image_type = 'photo'; // Type of images to search for
    this.orientation = 'horizontal'; // Image orientation
    this.safesearch = true; // Enable safe search by default
  }

  // Method for fetching news articles
  async fetchArticles(searchQuery, apiKey) {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = apiKey; 

    // Construct query parameters
    const PARAMS = new URLSearchParams({
      q: searchQuery,
      page: this.page,
      per_page: this.per_page,
      key: API_KEY,
      image_type: this.image_type,
      orientation: this.orientation,
      safesearch: this.safesearch,
    });

    try {
      // Send a GET request to the Pixabay API
      const response = await axios.get(BASE_URL, { params: PARAMS });
      
      // Check if the response status is not 200
      if (response.status !== 200) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
      
      // Return the response data
      return response.data;
    } catch (error) {
      // Log and re-throw any errors that occur during the request
      console.error('Error fetching news articles:', error);
      throw error;
    }
  }
}

// Export the NewsApi class to be used in other modules
export { NewsApi };