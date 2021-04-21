'use strict';

const PHOTOS_AMOUNT = 25;

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

const generateUrl = (id) => {
  return `photos/${id}.jpg`;
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
    name: generateName()
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

const generateName = () => {
  const name = NAMES[getRandomInt(NAMES.length - 1)];
  return name;
};

const generatePhoto = (id) => {
  return {
    url: generateUrl(id),
    description: generateDescription(),
    likes: getRandomInt(15, 200),
    comments: generateComments()
  };
};

const dataBase = [];

for (let i = 1; i <= PHOTOS_AMOUNT; i++) {
  const newPhoto = generatePhoto(i);
  dataBase.push(newPhoto);
}

const picturesListElement = document.querySelector(`.pictures`);
const similarPhotoTemplate = document.querySelector(`#picture`).content.querySelector(`.picture`);

const renderPicture = (picture) => {
  const photoElement = similarPhotoTemplate.cloneNode(true);
  photoElement.querySelector(`.picture__img`).src = picture.url;
  photoElement.querySelector(`.picture__likes`).textContent = picture.likes;
  photoElement.querySelector(`.picture__comments`).textContent = picture.comments.length;
  return photoElement;
};

const fragment = document.createDocumentFragment();

for (let i = 0; i < PHOTOS_AMOUNT; i++) {
  fragment.appendChild(renderPicture(dataBase[i]));
}

picturesListElement.appendChild(fragment);
