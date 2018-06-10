const textInput = document.getElementById('text-input');
const imageBox = document.getElementById('image-box');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const imageResult = document.getElementById('image-result');

const postData = () => {
    const formData = new FormData();
    const text = textInput.innerText;
    const image = imagePreview.file;

    if (!image || !text.length) {
        return;
    }
    if (!text.replace(/\s/, '').length) {
        return;
    }

    formData.append('image', image);
    formData.append('text', text);

    fetch('calculate', {
        method: 'POST',
        body: formData,
    }).then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error(`Network Error`);
        }
    }).then(response => {
        console.log(response);
        if (response['status'] === 1) {
            const filePath = response['filepath'];
            imageResult.src = `/temp/${filePath}`;
            document.getElementById('image-result-box').style.width = `400px`;
        } else {
            throw new Error(`Server Error`);
        }
    }).catch(error => {
        console.error(`Error ${error}`);
    })
};

// const onDragEnter = e => {
//     e.stopPropagation();
//     e.preventDefault();
// };

const onDragOver = e => {
    e.stopPropagation();
    e.preventDefault();

    e.currentTarget.classList.add(`drag-over`);
};

const onDragLead = e => {
    e.stopPropagation();
    e.preventDefault();

    e.currentTarget.classList.remove(`drag-over`);
};

const onDrop = e => {
    e.stopPropagation();
    e.preventDefault();

    const dt = e.dataTransfer;
    const files = dt.files;

    e.currentTarget.classList.remove(`drag-over`);
    changeImage(files[0])
};

const changeImage = file => {
    const imageType = /^image\//;
    if (!file) {
        file = imageInput.files[0];
    }

    if (!imageType.test(file.type)) {
        return;
    }

    const reader = new FileReader();
    imagePreview.file = file;
    reader.readAsDataURL(file);
    reader.onload = e => {
        console.log(file);
        imagePreview.src = e.target.result;
    };
};

const onFileChange = () => {
    changeImage()
};

// textInput.innerText = textInput.dataset.content;

imagePreview.addEventListener(`click`, () => {
    imageInput.click();
});

// imageBox.addEventListener(`dragenter`, onDragEnter, false);
imageBox.addEventListener(`dragover`, onDragOver, false);
imageBox.addEventListener(`dragleave`, onDragLead, false);
imageBox.addEventListener(`drop`, onDrop, false);
imageInput.addEventListener(`change`, onFileChange);

textInput.addEventListener(`input`, postData);
// imagePreview.addEventListener('load', postData);

const config = {
    childList: true,
    attributes: true,
    characterData: true,
};

const onFormChange = mutationRecords => {
    mutationRecords.forEach(record => {
        // console.log(record.attributeName);
        // if (record.type ===  && ) {
        // }
        switch (record.type) {
            case 'attributes':
                if (record.attributeName === 'src') {
                    postData();
                } else {
                    console.log(111);
                }
                break;
            default:
                console.log(2222);
                break;
        }
    });
};

const observer = new MutationObserver(onFormChange);

// observer.observe(textInput, config);
observer.observe(imagePreview, config);