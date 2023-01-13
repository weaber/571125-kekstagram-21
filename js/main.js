import { renderPicture } from './picture.js';
import { activateForm } from './form.js';
import { getPictures } from './backend.js';

const successHandler = (data) => {
  const picturesListElement = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  data.forEach((element) => {
    fragment.appendChild(renderPicture(element));
  });

  picturesListElement.appendChild(fragment);
};

const errorHandler = (errorMessage) => {
  const errorContainerElement = document.createElement('div');
  errorContainerElement.style = `
    z-index: 100;
    margin: 0 auto;
    padding: 10px;
    text-align: center;
    background-color: red;
    position: absolute;
    left: 0;
    right: 0;
    font-size: 30px;
    `;
  errorContainerElement.textContent = errorMessage;
  document.body.insertAdjacentElement('afterbegin', errorContainerElement);
};

getPictures(successHandler, errorHandler);

const uploadFileInput = document.querySelector('#upload-file');

const uploadFileInputClickHandler = () => {
  activateForm();
};

uploadFileInput.addEventListener('change', uploadFileInputClickHandler);
