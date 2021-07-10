import { showStackBottomRight } from './showNotice';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  array = null;
  fetchArticles() {
    const options = {
      headers: {
        API_KEY: '22346154-3962a348b9ad97506a5be6443',
      },
    };
    const url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${options.headers.API_KEY}`;

    return fetch(url)
      .then((response) => response.json())
      .then(({ hits }) => {
        this.incrementPage();
        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
