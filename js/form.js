import { sendForm } from './backend.js';
import { validateHashtags } from './hashtags.js';
import { uploadFilePreview } from './upload-file-preview.js';

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
  imageEditForm.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadCancelElement.removeEventListener('keydown', uploadCancelElementEnterPressHandler);
};

const imageSizeValue = imageEditForm.querySelector('.scale__control--value');
const scaleFieldset = imageEditForm.querySelector('.img-upload__scale');

const SCALE_GAP = 25;
const MAX_SCALE = 100;
const MIN_SCALE = 25;

const setScale = (scaleType) => {
  const currentScale = parseFloat(imageSizeValue.value);
  let newScale;
  if (scaleType === 'increase' && currentScale + SCALE_GAP <= MAX_SCALE) {
    newScale = currentScale + SCALE_GAP;
    imageSizeValue.value = `${newScale}%`
    imageUploadPreview.style.transform = `scale(${newScale / 100})`;
  } else if (scaleType === 'decrease' && currentScale - SCALE_GAP >= MIN_SCALE) {
    imageSizeValue.value = `${currentScale - SCALE_GAP}%`
    newScale = currentScale - SCALE_GAP;
    imageUploadPreview.style.transform = `scale(${newScale / 100})`;
  }
};

const scaleFieldsetClickHandler = (evt) => {
  const scaleType = (evt.target.classList.contains('scale__control--bigger')) ? 'increase' : (evt.target.classList.contains('scale__control--smaller')) ? 'decrease' : '';
  setScale(scaleType);
};

const hashtagsInput = document.querySelector('.text__hashtags');
const commentInput = document.querySelector('.text__description');

const imageEditFormEscapePressHandler = (evt) => {
  if (evt.key === 'Escape' && hashtagsInput !== document.activeElement && commentInput !== document.activeElement) {
    evt.preventDefault();
    document.removeEventListener('keydown', imageEditFormEscapePressHandler);
    resetForm();
    closeImageEditForm();
  }
};

const uploadCancelElementEnterPressHandler = (evt) => {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    uploadCancelElement.removeEventListener('keydown', uploadCancelElementEnterPressHandler);
    resetForm();
    closeImageEditForm();
  }
};

const uploadCancelElementClickHandler = () => {
  resetForm();
  closeImageEditForm();
};

const hashtagsInputHandler = () => {
  validateHashtags();
  if (hashtagsInput.validity.valid) {
    hashtagsInput.style = 'box-shadow: none'
  } else {
    hashtagsInput.reportValidity();
    hashtagsInput.style = 'box-shadow: 0px 0px 5px 5px red;'
  }
};

const effectLevel = document.querySelector('.effect-level');
const effectLevelPin = document.querySelector('.effect-level__pin');
const effectLevelDepth = document.querySelector('.effect-level__depth');
const effectLevelValue = document.querySelector('.effect-level__value');

const effectsFieldset = document.querySelector('.img-upload__effects');

const setSlider = (pinPosition, effectLevel) => {
  effectLevelPin.style.left = `${pinPosition}px`;
  effectLevelDepth.style.width = `${effectLevel}%`;
  effectLevelValue.value = `${effectLevel}`;
}

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

const EFFECT_LEVEL_DEFAULT = '100';

const resetEffects = () => {
  imageUploadPreview.className = '';
  imageUploadPreview.style.filter = '';
  effectLevel.value = EFFECT_LEVEL_DEFAULT;
  setSlider(EFFECT_LEVEL_PIN_X_MAX, effectLevel.value);
  setEffect(effectLevelValue.value);
};

const EFFECT_LEVEL_PIN_X_MIN = 5;
const EFFECT_LEVEL_PIN_X_MAX = 455;

const effectLevelPinMouseDownHandler = (evt) => {
  evt.preventDefault();
  let startCoordX = evt.clientX;

  const mouseMoveHandler = (moveEvt) => {
    moveEvt.preventDefault();
    const shiftX = startCoordX - moveEvt.clientX;
    startCoordX = moveEvt.clientX;
    const effectLevelPinNewX = effectLevelPin.offsetLeft - shiftX;
    const effectLevelWidth = document.querySelector('.effect-level__line').offsetWidth;

    if (effectLevelPinNewX >= EFFECT_LEVEL_PIN_X_MIN && effectLevelPinNewX <= EFFECT_LEVEL_PIN_X_MAX) {
      const newEffectLevel = Math.floor(effectLevelPinNewX / effectLevelWidth * 100);
      setSlider(effectLevelPinNewX, newEffectLevel)
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
};

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
  resetForm();
  closeImageEditForm();
};

const successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
const successMessageElement = successMessageTemplate.cloneNode(true);
const successMessageElementOkButton = successMessageElement.querySelector('.success__button');

const removeSuccessMessage = () => {
  successMessageElement.remove();
};

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

const resetForm = () => {
  imageSizeValue.value = '100%';
  imageUploadPreview.src = '';
  imageUploadPreview.style.transform = 'scale(1.00)';
  document.querySelector('#effect-none').checked = true;
  resetEffects();
  hashtagsInput.value = '';
  commentInput.value = '';
  uploadFileInput.value = '';
};

const successHandler = () => {
  main.insertAdjacentElement('afterbegin', successMessageElement);
  document.addEventListener('click', removeSuccessMessage);
  document.addEventListener('keydown', successMessageEscapePressHandler)
  resetForm();
  closeImageEditForm();
};

const imageUploadFormSubmitHandler = (evt) => {
  evt.preventDefault();
  sendForm(new FormData(imageUploadForm), successHandler, errorHandler);
};

const effectsFieldsetChangeHandler = (evt) => {
  resetEffects();
  if (evt.target.value === 'none') {
    effectLevel.classList.add('visually-hidden');
  } else {
    imageUploadPreview.classList.add(`effects__preview--${evt.target.value}`);
    effectLevel.classList.remove('visually-hidden');
  }
};

const uploadFileInputChangeHandler = () => {
  openImageEditForm();
  scaleFieldset.addEventListener('click', scaleFieldsetClickHandler);
  effectLevel.classList.add('visually-hidden');
  effectLevelPin.addEventListener('mousedown', effectLevelPinMouseDownHandler);
  effectsFieldset.addEventListener('change', effectsFieldsetChangeHandler);
  hashtagsInput.addEventListener('input', hashtagsInputHandler);
  imageUploadForm.addEventListener('submit', imageUploadFormSubmitHandler);
  uploadFilePreview();
};

const activateForm = () => {
  uploadFileInput.addEventListener('change', uploadFileInputChangeHandler);
};

export {activateForm};
