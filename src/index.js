import PixabayApiService from './apiService';
import * as basicLightbox from 'basiclightbox';
import imageCard from './templates/image-card.hbs';

import { showModal } from './showModal';
import { showStackBottomRight } from './showNotice';
import { defaultModules } from '@pnotify/core';
import * as PNotifyBootstrap4 from '@pnotify/bootstrap4';
import * as PNotifyFontAwesome4 from '@pnotify/font-awesome4';

defaultModules.set(PNotifyBootstrap4, {});
defaultModules.set(PNotifyFontAwesome4, {});

const refs = {
  gallery: document.querySelector('.gallery'),
  photoСard: document.querySelector('.photo-card'),
  input: document.querySelector('input'),
  searchForm: document.querySelector('.search-form'),
  container: document.querySelector('.content-container'),
  btnSearch: document.querySelector('.btn-search'),
  loadMoreBtn: document.querySelector('.btn-load-more'),
};

const pixabayApiService = new PixabayApiService();

refs.searchForm.addEventListener('submit', onSearch);
refs.btnSearch.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();
  pixabayApiService.query = e.currentTarget.elements.query.value;
  if (pixabayApiService.query.trim() === '') {
    return showStackBottomRight('info');
  }
  pixabayApiService.resetPage();
  clearContainer();
  pixabayApiService
    .fetchArticles()
    .then((hits) => {
      console.log(hits);
      if (hits.length > 0) {
        showStackBottomRight('success');
        refs.loadMoreBtn.classList.remove('is-hidden');

        return renderCard(hits);
      } else {
        refs.loadMoreBtn.classList.add('is-hidden');
        showStackBottomRight('error');
      }
    })
    .catch((error) => {
      showStackBottomRight('error');
    });
  refs.container.addEventListener('click', openModal);
}

function renderCard(hits) {
  console.log('Rendering card');
  refs.container.insertAdjacentHTML('beforeend', imageCard(hits));
}

function onLoadMore() {
  pixabayApiService.fetchArticles().then(renderCard);
}

function clearContainer() {
  refs.container.innerHTML = '';
}

function openModal(event) {
  const instance = basicLightbox.create(`
    <img src="${event.target.src}" width="800" height="600">
`);
  instance.show();
  console.log(hits.indexOf(event.target));
  // window.addEventListener('keydown', turnOnKeys);
}

// const turnOnKeys = (event) => {
//   if (event.keyCode === 27) {
//     modalClose(event);
//     return;
//   }
//   // arrow right
//   if (event.keyCode === 39) {
//     if (selectedItemIndex === images.length - 1) {
//       selectedItemIndex = 0;
//     } else {
//       selectedItemIndex++;
//     }
//     lightBoxImage.src = images[selectedItemIndex].original;
//   }
//   // arrow left
//   if (event.keyCode === 37) {
//     if (selectedItemIndex === 0) {
//       selectedItemIndex = images.length;
//     } else {
//       selectedItemIndex--;
//     }
//     lightBoxImage.src = images[selectedItemIndex].original;
//   }
// };
