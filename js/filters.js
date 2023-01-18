const FilterType = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const filterPictures = (filterType, data) => {
  switch (filterType) {
    case FilterType.RANDOM:
      return shuffle(data.slice()).slice(0, 10);
    case FilterType.DISCUSSED:
      return data.slice().sort((left, right) => right.comments.length - left.comments.length);
    default:
      return data;
  }
};

export { FilterType, filterPictures }
