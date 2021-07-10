import PixabayApiService from './apiService';
import * as basicLightbox from 'basiclightbox';
import imageCard from './templates/image-card.hbs';

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

let selectedIndex = null;
let modalInstance = null;
let currentHits = [];

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
        currentHits = hits;
        showStackBottomRight('success');
        refs.loadMoreBtn.classList.remove('is-hidden');
        return renderCard(currentHits);
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

function scrollToLastGallery() {
  // 1. simple scroll to 'load more' button - it's allways on bottom
  refs.loadMoreBtn.scrollIntoView();

  // 2. for next items  you render separate gallery (html element)
  // so in this case you need to find the last one and scroll to it
  // const allGalleries = document.querySelectorAll('.gallery');
  // const lastGallery = allGalleries[allGalleries.length - 1];
  // lastGallery.scrollIntoView();
}

function renderCard(hits) {
  console.log('Rendering card');
  refs.container.insertAdjacentHTML('beforeend', imageCard(hits));
}

function onLoadMore() {
  pixabayApiService
    .fetchArticles()
    .then((hits) => {
      currentHits = [...currentHits, ...hits];
      return renderCard(hits);
    })
    .then(scrollToLastGallery); // u can use it at thend of renderCard too
}

function clearContainer() {
  refs.container.innerHTML = '';
}

function openModal(event) {
  if (!event.target.src) {
    return;
  }

  // find current index by finding item by its id (id is added in template)
  selectedIndex = currentHits.findIndex((el) => el.id === +event.target.dataset.id);

  modalInstance = basicLightbox.create(`<img src="${event.target.src}" width="800" height="600">`, {
    onClose: onCloseModal,
    onShow: onShowModal,
  });
  modalInstance.show();
}

function onShowModal() {
  window.addEventListener('keydown', turnOnKeys);
}

function onCloseModal() {
  // need to remove event listener (no need to listen on key event when modal is closed)
  window.removeEventListener('keydown', turnOnKeys);
}

const turnOnKeys = (event) => {
  if (event.keyCode === 27) {
    modalInstance.close();
    return;
  }

  // arrow right
  if (event.keyCode === 39) {
    selectedIndex = selectedIndex === currentHits.length - 1 ? 0 : selectedIndex + 1;
    modalInstance.element().querySelector('img').src = currentHits[selectedIndex].webformatURL;
    // or you can add some id in <img> when u create modal (openModal function) and here you can find this element by this id
  }
  // arrow left
  if (event.keyCode === 37) {
    selectedIndex = selectedIndex === 0 ? currentHits.length - 1 : selectedIndex - 1;
    modalInstance.element().querySelector('img').src = currentHits[selectedIndex].webformatURL;
  }
};
