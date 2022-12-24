import { renderBigPicture } from './preview.js';

const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const renderPicture = function (picture) {

  const pictureClickHanlder = () => {
    renderBigPicture(picture);
  };

  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;

  pictureElement.addEventListener('click', pictureClickHanlder);
  return pictureElement;
};

export {renderPicture};
