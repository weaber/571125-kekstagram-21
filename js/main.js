'use strict';

const PHOTOS_AMOUNT = 25;
const body = document.querySelector(`body`);

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

const getRandomInt = (a = 1, b = 0) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDescription = () => {
  return MESSAGES[getRandomInt(MESSAGES.length - 1)];
};

const generateComments = () => {
  let comments = [];
  const commentsAmount = getRandomInt(0, 3);
  for (let i = 0; i <= commentsAmount; i++) {
    const newComment = generateComment();
    comments.push(newComment);
  }
  return comments;
};

const generateComment = () => {
  return {
    avatar: `img/avatar-${getRandomInt(1, 6)}.svg`,
    message: generateMessage(),
    name: NAMES[getRandomInt(NAMES.length - 1)]
  };
};

const generateMessage = () => {
  const amount = getRandomInt(1, 2);
  let message = ``;
  for (let i = 0; i < amount; i++) {
    message = message.concat(` ${MESSAGES[getRandomInt(MESSAGES.length - 1)]}`);
  }
  return message.substring(1);
};

const generatePicture = (id) => {
  return {
    url: `photos/${id}.jpg`,
    description: generateDescription(),
    likes: getRandomInt(15, 200),
    comments: generateComments()
  };
};

const dataBase = new Array(PHOTOS_AMOUNT).fill().map((element, index) => {
  element = generatePicture(index + 1);
  return element;
});

const picturesListElement = document.querySelector(`.pictures`);
const pictureTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);
const fragment = document.createDocumentFragment();

const renderPicture = (picture) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector(`.picture__img`).src = picture.url;
  pictureElement.querySelector(`.picture__likes`).textContent = picture.likes;
  pictureElement.querySelector(`.picture__comments`).textContent = picture.comments.length;
  return pictureElement;
};

dataBase.forEach((element) => {
  fragment.appendChild(renderPicture(element));
});

picturesListElement.appendChild(fragment);

const renderBigPicture = (id) => {
  const bigPicture = document.querySelector(`.big-picture`);

  bigPicture.querySelector(`.big-picture__img`).src = dataBase[id].url;
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

  bigPicture.classList.remove(`hidden`);
  bigPicture.querySelector(`.social__comment-count`).classList.add(`hidden`);
  bigPicture.querySelector(`.comments-loader`).classList.add(`hidden`);
  body.classList.add(`modal-open`);
};

renderBigPicture(0);
