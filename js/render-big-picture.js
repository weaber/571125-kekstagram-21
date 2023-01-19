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
  bigPictureComments.innerHTML = '';
  const commentsLoaderButton = bigPicture.querySelector('.comments-loader');
  const commentsCountElement = bigPicture.querySelector('.social__comment-count');

  let commentsShown = 5;
  const COMMENTS_PER_STEP = 5;

  const commentsLoaderButtonClickHandler = () => {
    if (commentsShown + COMMENTS_PER_STEP < comments.length) {
      commentsShown = commentsShown + COMMENTS_PER_STEP;
      commentsCountElement.querySelector('.comments-shown').textContent = commentsShown;
      bigPictureComments.innerHTML = '';
      comments.slice(0, Math.min(commentsShown, commentsShown + COMMENTS_PER_STEP)).forEach((element) => renderComment(element));
    } else {
      commentsShown = comments.length;
      commentsCountElement.classList.add('hidden');
      commentsLoaderButton.classList.add('hidden');
      bigPictureComments.innerHTML = '';
      comments.slice(0, comments.length).forEach((element) => renderComment(element));
      commentsLoaderButton.removeEventListener('click', commentsLoaderButtonClickHandler);
    }
  }

  if (comments.length <= 5) {
    commentsCountElement.classList.add('hidden');
    commentsLoaderButton.classList.add('hidden');
    comments.forEach((element) => renderComment(element));
  } else {
    commentsCountElement.querySelector('.comments-shown').textContent = commentsShown;
    commentsCountElement.classList.remove('hidden');
    commentsLoaderButton.classList.remove('hidden');
    comments.slice(0, commentsShown).forEach((element) => renderComment(element));
    commentsLoaderButton.addEventListener('click', commentsLoaderButtonClickHandler);
  }
};

const renderBigPicture = (picture) => {
  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  renderComments(picture.comments);

  bigPictureCancelButton.addEventListener('click', bigPictureCloseButtonClickHandler);
  bigPictureCancelButton.addEventListener('keydown', bigPictureCancelEnterPressHandler);
  document.addEventListener('keydown', bigPictureEscPressHandler);
  showBigPicture();
}

export {renderBigPicture};
