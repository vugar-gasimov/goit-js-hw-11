import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '39794314-b7170df023ca4db44fdda06f6';

export const per_page = 40;
export const page = 1;
export const q = null;

export const fetchImages = async (searchQuery, page) => {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: per_page,
      page: page,
    },
  });
  return response.data;
};

