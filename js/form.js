import { sendForm } from './backend.js';

const body = document.querySelector('body');
const imageUploadForm = document.querySelector('#upload-select-image');
const imageEditForm = document.querySelector('.img-upload__overlay');
const uploadFileInput = imageUploadForm.querySelector('#upload-file');
const uploadCancelElement = imageUploadForm.querySelector('#upload-cancel');
const imageUploadPreview = document.querySelector('.img-upload__preview img');

const openImageEditForm = () => {
  imageEditForm.classList.remove('hidden');
  body.classList.add('modal-open');
  uploadCancelElement.addEventListener('click', uploadCancelElementClickHandler);
  document.addEventListener('keydown', imageEditFormEscapePressHandler);
  uploadCancelElement.addEventListener('keydown', uploadCancelElementEnterPressHandler);
};

const closeImageEditForm = () => {
  uploadFileInput.value = '';
  imageEditForm.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadCancelElement.removeEventListener('keydown', uploadCancelElementEnterPressHandler);
};

const decreaseImageButton = imageEditForm.querySelector('.scale__control--smaller');
const inscreaseImageButton = imageEditForm.querySelector('.scale__control--bigger');
const imageSizeValue = imageEditForm.querySelector('.scale__control--value');

const decreaseImage = () => {
  switch (imageSizeValue.value) {
    case '100%':
      imageSizeValue.value = '75%';
      imageUploadPreview.style.transform = 'scale(0.75)';
      break;
    case '75%':
      imageSizeValue.value = '50%';
      imageUploadPreview.style.transform = 'scale(0.50)';
      break;
    case '50%':
      imageSizeValue.value = '25%';
      imageUploadPreview.style.transform = 'scale(0.25)';
      break;
    default:
      break;
  }
}

const increaseImage = () => {
  switch (imageSizeValue.value) {
    case '25%':
      imageSizeValue.value = '50%';
      imageUploadPreview.style.transform = 'scale(0.50)';
      break;
    case '50%':
      imageSizeValue.value = '75%';
      imageUploadPreview.style.transform = 'scale(0.75)';
      break;
    case '75%':
      imageSizeValue.value = '100%';
      imageUploadPreview.style.transform = 'scale(1.00)';
      break;
    default:
      break;
  }
}

const hashtagsInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');

const imageEditFormEscapePressHandler = (evt) => {
  if (evt.key === 'Escape' && hashtagsInput !== document.activeElement && commentInput !== document.activeElement) {
    evt.preventDefault();
    document.removeEventListener('keydown', imageEditFormEscapePressHandler);
    closeImageEditForm();
  }
};

const uploadCancelElementEnterPressHandler = (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    uploadCancelElement.removeEventListener('keydown', uploadCancelElementEnterPressHandler);
    closeImageEditForm();
  }
};

const uploadCancelElementClickHandler = () => {
  closeImageEditForm();
};

const validateHashtags = () => {
  if (hashtagsInput.value) {
    const hashtags = hashtagsInput.value.trim().toLowerCase().split(' ');
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
      return hashtagsInput.setCustomValidity('Хэштэги не должны повторяться');
    } else if (checkMinLength(hashtags)) {
      return hashtagsInput.setCustomValidity('Хэштэг не может состоять только из #');
    } else if (checkMaxLength(hashtags)) {
      return hashtagsInput.setCustomValidity(`Длина Хэштэга не может быть больше ${HASHTAG_MAX_LENGTH}`);
    } else if (checkHashtagMask(hashtags)) {
      const index = hashtags.findIndex((element) => !regular.test(element));
      return hashtagsInput.setCustomValidity(`Хэштэг ${hashtags[index]} не соответствует маске`);
    }
  }
  return hashtagsInput.setCustomValidity('');
};

const hashtagsInputHandler = () => {
  validateHashtags();
};

const effectLevel = document.querySelector('.effect-level');
const effectLevelPin = document.querySelector('.effect-level__pin');
const effectLevelDepth = document.querySelector('.effect-level__depth');
const effectLevelValue = document.querySelector('.effect-level__value');

const effects = document.querySelectorAll('.effects__radio');

const resetEffects = () => {
  imageUploadPreview.className = 'img-upload__preview';
  imageUploadPreview.style.filter = '';
};

const setEffect = (effectValue) => {
  if (document.querySelector('#effect-chrome').checked) {
    imageUploadPreview.style.filter = `grayscale(${effectValue / 100})`;
  } else if (document.querySelector('#effect-sepia').checked) {
    imageUploadPreview.style.filter = `sepia(${effectValue / 100})`;
  } else if (document.querySelector('#effect-marvin').checked) {
    imageUploadPreview.style.filter = `invert(${effectValue}%)`;
  } else if (document.querySelector('#effect-phobos').checked) {
    imageUploadPreview.style.filter = `blur(${effectValue / 100 * 3}px)`;
  } else if (document.querySelector('#effect-heat').checked) {
    imageUploadPreview.style.filter = `brightness(${1 + effectValue / 50})`;
  } else {
    imageUploadPreview.style.filter = '';
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

    const effectLevelWidth = document.querySelector('.effect-level__line').offsetWidth;
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
    document.removeEventListener('mousemove', mouseMoveHandler);
    document.removeEventListener('mouseup', mouseUpHandler);
  };

  document.addEventListener('mousemove', mouseMoveHandler);
  document.addEventListener('mouseup', mouseUpHandler);
};

const main = document.querySelector('main');
const errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');
const errorMessageElement = errorMessageTemplate.cloneNode(true);
const errorMessageElementOkButton = errorMessageElement.querySelector('.error__button');
const removeErrorMessage = () => {
  errorMessageElement.remove();
}

const errorMessageElementOkButtonClickHandler = () => {
  removeErrorMessage();
};

errorMessageElementOkButton.addEventListener('click', errorMessageElementOkButtonClickHandler);

const errorMessageEscapePressHandler = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    document.removeEventListener('keydown', errorMessageEscapePressHandler);
    removeErrorMessage();
  }
};

const errorHandler = () => {
  main.insertAdjacentElement('afterbegin', errorMessageElement);
  document.addEventListener('click', removeErrorMessage);
  document.addEventListener('keydown', errorMessageEscapePressHandler)
  closeImageEditForm();
};

const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const successMessageElement = successMessageTemplate.cloneNode(true);
const successMessageElementOkButton = successMessageElement.querySelector('.success__button');
const removeSuccessMessage = () => {
  successMessageElement.remove();
}
const successMessageElementOkButtonClickHandler = () => {
  removeSuccessMessage();
};

successMessageElementOkButton.addEventListener('click', successMessageElementOkButtonClickHandler);

const successMessageEscapePressHandler = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    document.removeEventListener('keydown', successMessageEscapePressHandler);
    removeSuccessMessage();
  }
};

const successHandler = () => {
  main.insertAdjacentElement('afterbegin', successMessageElement);
  document.addEventListener('click', removeSuccessMessage);
  document.addEventListener('keydown', successMessageEscapePressHandler)
  closeImageEditForm();
};

const imageUploadFormSubmitHandler = (evt) => {
  evt.preventDefault();
  sendForm(new FormData(imageUploadForm), successHandler, errorHandler);
}

const activateForm = () => {
  openImageEditForm();
  decreaseImageButton.addEventListener('click', decreaseImage);
  inscreaseImageButton.addEventListener('click', increaseImage);
  effectLevel.classList.add('visually-hidden');
  effectLevelPin.addEventListener('mousedown', effectLevelPinMouseDownHandler);
  effects.forEach((effect) => {
    effect.addEventListener('click', () => {
      resetEffects();
      if (effect.value === 'none') {
        effectLevel.classList.add('visually-hidden');
      } else {
        imageUploadPreview.classList.add(`effects__preview--${effect.value}`);
        effectLevel.classList.remove('visually-hidden');
      }
    });
  });
  hashtagsInput.addEventListener('input', hashtagsInputHandler);
  imageUploadForm.addEventListener('submit', imageUploadFormSubmitHandler);
}

export {activateForm};
