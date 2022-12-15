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

const generateUrl = function (id) {
  return `photos/${id}.jpg`;
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
    url: generateUrl(id),
    likes: getRandomInt(15, 300),
    comments: generateComments(),
    description: MESSAGES[getRandomInt(MESSAGES.length - 1)]
  };
};

const dataBase = new Array(PICTURES_AMOUNT).fill().map((element, index) => generatePicture(index + 1));

const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);

const picturesListElement = document.querySelector(`.pictures`);

const renderPicture = function (picture) {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector(`.picture__img`).src = picture.url;
  pictureElement.querySelector(`.picture__comments`).textContent = picture.comments.length;
  pictureElement.querySelector(`.picture__likes`).textContent = picture.likes;
  return pictureElement;
};

const fragment = document.createDocumentFragment();

dataBase.forEach((element) => {
  fragment.appendChild(renderPicture(element));
});

picturesListElement.appendChild(fragment);
