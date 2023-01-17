const body = document.querySelector('body');
const bigPicture = document.querySelector('.big-picture');
const bigPictureCancelButton = bigPicture.querySelector('.big-picture__cancel');
const bigPictureComments = bigPicture.querySelector('.social__comments');

const showBigPicture = () => {
  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');
};

const closeBigPicture = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');
};

const bigPictureCloseButtonClickHandler = () => {
  closeBigPicture();
};

const bigPictureCancelEnterPressHandler = (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    bigPictureCancelButton.addEventListener('keydown', bigPictureCancelEnterPressHandler);
    closeBigPicture();
  }
};

const bigPictureEscPressHandler = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    document.removeEventListener('keydown', bigPictureEscPressHandler);
    closeBigPicture();
  }
};

const renderComment = (comment) => {
  const commentElement = `
    <li class="social__comment">
      <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
      <p class="social__text">${comment.message}</p>
    </li>
  `;
  bigPictureComments.insertAdjacentHTML('beforeend', commentElement);
};

const renderComments = (comments) => {
  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  comments.forEach((element) => renderComment(element));
}

const renderBigPicture = (picture) => {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  bigPictureComments.innerHTML = '';
  renderComments(picture.comments);

  bigPictureCancelButton.addEventListener('click', bigPictureCloseButtonClickHandler);
  bigPictureCancelButton.addEventListener('keydown', bigPictureCancelEnterPressHandler);
  document.addEventListener('keydown', bigPictureEscPressHandler);
  showBigPicture();
}

export {renderBigPicture};
