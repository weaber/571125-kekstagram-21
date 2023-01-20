const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];
const uploadFileInput = document.querySelector('#upload-file');
const imageUploadPreview = document.querySelector('.img-upload__preview img');

const uploadFilePreview = () => {
  const file = uploadFileInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    const reader = new FileReader();
    const imageUploadPreviewLoadHandler = () => {
      imageUploadPreview.src = reader.result;
    }

    reader.addEventListener('load', imageUploadPreviewLoadHandler);
    reader.readAsDataURL(file);
  }
};

export { uploadFilePreview }
