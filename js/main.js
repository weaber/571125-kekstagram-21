'use strict';

const PICTURES_AMOUNT = 25;

const MESSAGES = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`
];

const NAMES = [
  `Федя`,
  `Саша`,
  `Вася`,
  `Света`,
  `Alex`
];

const getRandomInt = function (a = 1, b = 0) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateComment = function () {
  return {
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: MESSAGES[getRandomInt(MESSAGES.length - 1)],
    name: NAMES[getRandomInt(NAMES.length - 1)]
  };
};

const generateComments = function () {
  const commentsAmount = getRandomInt(0, 3);
  const comments = commentsAmount
    ? new Array(commentsAmount).fill().map(generateComment)
    : [];
  return comments;
};

const generatePicture = function (id) {
  return {
    id,
    url: `photos/${id + 1}.jpg`,
    likes: getRandomInt(15, 300),
    comments: generateComments(),
    description: MESSAGES[getRandomInt(MESSAGES.length - 1)]
  };
};

const dataBase = new Array(PICTURES_AMOUNT).fill().map((element, index) => generatePicture(index));

const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);

const picturesListElement = document.querySelector(`.pictures`);

const pictureClickHanlder = (evt) => {
  renderBigPicture(evt.currentTarget.dataset.picNumber);
};

const renderPicture = function (picture) {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector(`.picture__img`).src = picture.url;
  pictureElement.querySelector(`.picture__comments`).textContent = picture.comments.length;
  pictureElement.querySelector(`.picture__likes`).textContent = picture.likes;
  pictureElement.setAttribute(`data-pic-number`, picture.id);
  pictureElement.addEventListener(`click`, pictureClickHanlder);
  return pictureElement;
};

const fragment = document.createDocumentFragment();

dataBase.forEach((element) => {
  fragment.appendChild(renderPicture(element));
});

picturesListElement.appendChild(fragment);

const body = document.querySelector(`body`);

const renderBigPicture = (id) => {
  const bigPicture = document.querySelector(`.big-picture`);

  bigPicture.querySelector(`.big-picture__img img`).src = dataBase[id].url;
  bigPicture.querySelector(`.likes-count`).textContent = dataBase[id].likes;
  bigPicture.querySelector(`.comments-count`).textContent = dataBase[id].comments.length;
  bigPicture.querySelector(`.social__caption`).textContent = dataBase[id].description;

  const bigPictureComments = bigPicture.querySelector(`.social__comments`);
  bigPictureComments.innerHTML = ``;

  const renderComment = (comment) => {
    return `
      <li class="social__comment">
        <img class="social__picture" src="${comment.avatar}" alt="${comment.name}" width="35" height="35">
        <p class="social__text">${comment.message}</p>
      </li>
    `;
  };

  dataBase[id].comments.forEach((element) => {
    const comment = renderComment(element);
    bigPictureComments.insertAdjacentHTML(`beforeend`, comment);
  });

  const showBigPicture = () => {
    bigPicture.querySelector(`.social__comment-count`).classList.add(`hidden`);
    bigPicture.querySelector(`.comments-loader`).classList.add(`hidden`);
    bigPicture.classList.remove(`hidden`);
    body.classList.add(`modal-open`);
  };

  const closeBigPicture = () => {
    bigPicture.classList.add(`hidden`);
    body.classList.remove(`modal-open`);
  };

  const bigPictureCloseButtonClickHandler = () => {
    closeBigPicture();
  };

  const bigPictureCancelEnterPressHandler = (evt) => {
    if (evt.key === `Enter`) {
      evt.preventDefault();
      bigPicture.querySelector(`.big-picture__cancel`).addEventListener(`keydown`, bigPictureCancelEnterPressHandler);
      closeBigPicture();
    }
  };

  const bigPictureEscPressHandler = (evt) => {
    if (evt.key === `Escape`) {
      evt.preventDefault();
      document.removeEventListener(`keydown`, bigPictureEscPressHandler);
      closeBigPicture();
    }
  };

  bigPicture.querySelector(`.big-picture__cancel`).addEventListener(`click`, bigPictureCloseButtonClickHandler);
  bigPicture.querySelector(`.big-picture__cancel`).addEventListener(`keydown`, bigPictureCancelEnterPressHandler);
  document.addEventListener(`keydown`, bigPictureEscPressHandler);
  showBigPicture();
};

const imageUploadForm = document.querySelector(`#upload-select-image`);
const imageEditForm = document.querySelector(`.img-upload__overlay`);
const uploadFileInput = imageUploadForm.querySelector(`#upload-file`);
const uploadCancelElement = imageUploadForm.querySelector(`#upload-cancel`);

const openImageEditForm = () => {
  imageEditForm.classList.remove(`hidden`);
  body.classList.add(`modal-open`);
  uploadCancelElement.addEventListener(`click`, uploadCancelElementClickHandler);
  document.addEventListener(`keydown`, imageEditFormEscapePressHandler);
  uploadCancelElement.addEventListener(`keydown`, uploadCancelElementEnterPressHandler);
};

const closeImageEditForm = () => {
  uploadFileInput.value = ``;
  imageEditForm.classList.add(`hidden`);
  body.classList.remove(`modal-open`);
  uploadCancelElement.removeEventListener(`keydown`, uploadCancelElementEnterPressHandler);
};

const hashtagsInput = document.querySelector(`.text__hashtags`);
const commentInput = document.querySelector(`.text__description`);

const imageEditFormEscapePressHandler = (evt) => {
  if (evt.key === `Escape` && hashtagsInput !== document.activeElement && commentInput !== document.activeElement) {
    evt.preventDefault();
    document.removeEventListener(`keydown`, imageEditFormEscapePressHandler);
    closeImageEditForm();
  }
};

const uploadCancelElementEnterPressHandler = (evt) => {
  if (evt.key === `Enter`) {
    evt.preventDefault();
    uploadCancelElement.removeEventListener(`keydown`, uploadCancelElementEnterPressHandler);
    closeImageEditForm();
  }
};

const uploadFileInputClickHandler = () => {
  openImageEditForm();
};

const uploadCancelElementClickHandler = () => {
  closeImageEditForm();
};

uploadFileInput.addEventListener(`change`, uploadFileInputClickHandler);

const validateHashtags = () => {
  if (hashtagsInput.value) {
    const hashtags = hashtagsInput.value.trim().toLowerCase().split(` `);
    const HASHTAG_MIN_LENGTH = 2;
    const HASHTAG_MAX_LENGTH = 7;
    const HASHTAGS_MAX_AMOUNT = 3;
    const regular = /^#[\w]*$/;

    const checkDuplicates = (array) => {
      return (new Set(array)).size !== array.length;
    };

    const checkMinLength = (hashTags) => {
      return hashTags.some((element) => element.length < HASHTAG_MIN_LENGTH);
    };

    const checkMaxLength = (hashTags) => {
      return hashTags.some((element) => element.length > HASHTAG_MAX_LENGTH);
    };

    const checkHashtagMask = (hashTags) => {
      return hashTags.some((element) => !regular.test(element));
    };

    if (hashtags.length > HASHTAGS_MAX_AMOUNT) {
      return hashtagsInput.setCustomValidity(`Количество Хэштэгов не может быть больше ${HASHTAGS_MAX_AMOUNT}`);
    } else if (checkDuplicates(hashtags)) {
      return hashtagsInput.setCustomValidity(`Хэштэги не должны повторяться`);
    } else if (checkMinLength(hashtags)) {
      return hashtagsInput.setCustomValidity(`Хэштэг не может состоять только из #`);
    } else if (checkMaxLength(hashtags)) {
      return hashtagsInput.setCustomValidity(`Длина Хэштэга не может быть больше ${HASHTAG_MAX_LENGTH}`);
    } else if (checkHashtagMask(hashtags)) {
      const index = hashtags.findIndex((element) => !regular.test(element));
      return hashtagsInput.setCustomValidity(`Хэштэг ${hashtags[index]} не соответствует маске`);
    }
  }
  return hashtagsInput.setCustomValidity(``);
};

const hashtagsInputHandler = () => {
  validateHashtags();
};

hashtagsInput.addEventListener(`input`, hashtagsInputHandler);

const effectLevel = document.querySelector(`.effect-level`);
const effectLevelPin = document.querySelector(`.effect-level__pin`);
const effectLevelDepth = document.querySelector(`.effect-level__depth`);
const effectLevelValue = document.querySelector(`.effect-level__value`);
const imageUploadPreview = document.querySelector(`.img-upload__preview`);

effectLevel.classList.add(`visually-hidden`);

const effects = document.querySelectorAll(`.effects__radio`);

const resetEffects = () => {
  imageUploadPreview.className = `img-upload__preview`;
  imageUploadPreview.style.filter = ``;
};

effects.forEach((effect) => {
  effect.addEventListener(`click`, () => {
    resetEffects();
    if (effect.value === `none`) {
      effectLevel.classList.add(`visually-hidden`);
    } else {
      imageUploadPreview.classList.add(`effects__preview--${effect.value}`);
      effectLevel.classList.remove(`visually-hidden`);
    }
  });
});

const setEffect = (effectValue) => {
  if (document.querySelector(`#effect-chrome`).checked) {
    imageUploadPreview.style.filter = `grayscale(${effectValue / 100})`;
  } else if (document.querySelector(`#effect-sepia`).checked) {
    imageUploadPreview.style.filter = `sepia(${effectValue / 100})`;
  } else if (document.querySelector(`#effect-marvin`).checked) {
    imageUploadPreview.style.filter = `invert(${effectValue}%)`;
  } else if (document.querySelector(`#effect-phobos`).checked) {
    imageUploadPreview.style.filter = `blur(${effectValue / 100 * 3}px)`;
  } else if (document.querySelector(`#effect-heat`).checked) {
    imageUploadPreview.style.filter = `brightness(${1 + effectValue / 50})`;
  } else {
    imageUploadPreview.style.filter = ``;
  }
};

const effectLevelPinMouseDownHandler = (evt) => {
  evt.preventDefault();
  const EFFECT_LEVEL_PIN_X_MIN = 5;
  const EFFECT_LEVEL_PIN_X_MAX = 455;

  let startCoordX = evt.clientX;

  const mouseMoveHandler = (moveEvt) => {
    moveEvt.preventDefault();
    const shiftX = startCoordX - moveEvt.clientX;
    startCoordX = moveEvt.clientX;
    let effectLevelPinNewX = effectLevelPin.offsetLeft - shiftX;

    const effectLevelWidth = document.querySelector(`.effect-level__line`).offsetWidth;
    let newEffectLevel = Math.floor(effectLevelPinNewX / effectLevelWidth * 100);

    if (effectLevelPinNewX >= EFFECT_LEVEL_PIN_X_MIN && effectLevelPinNewX <= EFFECT_LEVEL_PIN_X_MAX) {
      effectLevelPin.style.left = `${effectLevelPinNewX}px`;
      effectLevelDepth.style.width = `${newEffectLevel}%`;
      effectLevelValue.value = `${newEffectLevel}`;
      setEffect(newEffectLevel);
    }
  };

  const mouseUpHandler = (upEvt) => {
    upEvt.preventDefault();
    document.removeEventListener(`mousemove`, mouseMoveHandler);
    document.removeEventListener(`mouseup`, mouseUpHandler);
  };

  document.addEventListener(`mousemove`, mouseMoveHandler);
  document.addEventListener(`mouseup`, mouseUpHandler);

};

effectLevelPin.addEventListener(`mousedown`, effectLevelPinMouseDownHandler);

