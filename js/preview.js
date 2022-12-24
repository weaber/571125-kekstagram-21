const renderBigPicture = (picture) => {
  const body = document.querySelector('body');
  const bigPicture = document.querySelector('.big-picture');

  bigPicture.querySelector('.big-picture__img img').src = picture.url;
  bigPicture.querySelector('.likes-count').textContent = picture.likes;
  bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
  bigPicture.querySelector('.social__caption').textContent = picture.description;

  const bigPictureComments = bigPicture.querySelector('.social__comments');
  bigPictureComments.innerHTML = '';

  const renderComment = (comment) => {
    return `
      <li class="social__comment">
        <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
        <p class="social__text">${comment.message}</p>
      </li>
    `;
  };

  picture.comments.forEach((element) => {
    const comment = renderComment(element);
    bigPictureComments.insertAdjacentHTML('beforeend', comment);
  });

  const showBigPicture = () => {
    bigPicture.querySelector('.social__comment-count').classList.add('hidden');
    bigPicture.querySelector('.comments-loader').classList.add('hidden');
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
      bigPicture.querySelector('.big-picture__cancel').addEventListener('keydown', bigPictureCancelEnterPressHandler);
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

  bigPicture.querySelector('.big-picture__cancel').addEventListener('click', bigPictureCloseButtonClickHandler);
  bigPicture.querySelector('.big-picture__cancel').addEventListener('keydown', bigPictureCancelEnterPressHandler);
  document.addEventListener('keydown', bigPictureEscPressHandler);
  showBigPicture();
}

export {renderBigPicture};
