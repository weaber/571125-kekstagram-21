const validateHashtags = () => {
  const hashtagsInput = document.querySelector('.text__hashtags');
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

export {validateHashtags}
