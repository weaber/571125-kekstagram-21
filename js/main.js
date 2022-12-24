import { generatePicture } from './data.js';
import { renderPicture } from './picture.js';
import { activateForm } from './form.js';

const PICTURES_AMOUNT = 25;
const dataBase = new Array(PICTURES_AMOUNT).fill().map((element, index) => generatePicture(index));
const picturesListElement = document.querySelector('.pictures');
const fragment = document.createDocumentFragment();

dataBase.forEach((element) => {
  fragment.appendChild(renderPicture(element));
});

picturesListElement.appendChild(fragment);

const uploadFileInput = document.querySelector('#upload-file');

const uploadFileInputClickHandler = () => {
  activateForm();
};

uploadFileInput.addEventListener('change', uploadFileInputClickHandler);
