const GET_URL = 'https://22.javascript.pages.academy/kekstagram/data';
const SEND_URL = 'https://22.javascript.pages.academy/kekstagram';
const SUCCESS_CODE = 200;
const getPictures = (onSuccess, onError) => {
  fetch(GET_URL)
    .then((response) => response.json())
    .then((data) => onSuccess(data))
    .catch((error) => onError(error))
}

const sendForm = (data, onSuccess, onError) => {
  fetch(
    SEND_URL,
    {
      method: 'POST',
      body: data,
    },
  )
    .then((response) => {
      if (response.status === SUCCESS_CODE) {
        onSuccess()
      } else {
        onError();
      }
    })
    .catch((error) => onError(error))
}

export {getPictures, sendForm};
