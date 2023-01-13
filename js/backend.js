const GET_URL = 'https://22.javascript.pages.academy/kekstagram/data';

const SUCCESS_CODE = 200;

const getPictures = (onSuccess, onError) => {
  const xhr = new XMLHttpRequest();
  xhr.responseType = 'json';

  xhr.addEventListener('load', () => {
    if (xhr.status === SUCCESS_CODE) {
      onSuccess(xhr.response);
    } else {
      onError(`Статус ответа ${xhr.status}`);
    }
  })

  xhr.addEventListener('error', function () {
    onError('Произошла ошибка соединения');
  });
  xhr.addEventListener('timeout', function () {
    onError(`Запрос не успел выполниться за ${xhr.timeout} мс`);
  });

  xhr.timeout = 10000;

  xhr.open('GET', GET_URL);
  xhr.send();
};


export {getPictures};
