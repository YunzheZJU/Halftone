const body = document.getElementsByTagName(`body`)[0];
const textInput = document.getElementById('text-input');
const imageBox = document.getElementById('image-box');
const imageInput = document.getElementById('image-input');
const imagePreview = document.getElementById('image-preview');
const imageResult = document.getElementById('image-result');

const logMessage = (() => {
    const maxCount = 8;
    let count = {};
    for (let i = 0; i < maxCount; i++) {
        count[i] = true;
    }
    return messageContent => {
        const message = document.createElement('div');
        let slot = 0;
        while (!count[slot]) {
            slot += 1;
            if (slot === maxCount) {
                slot = 0;
                break;
            }
        }
        count[slot] = false;
        message.classList.add('message');
        message.innerText = messageContent;
        message.style.top = `${slot * 3}rem`;
        body.appendChild(message);
        setTimeout(() => {
            message.classList.add('active');
        }, 100);
        setTimeout(() => {
            count[slot] = true;
            message.remove();
        }, 10000);
    };
})();

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
            throw new Error(response['message']);
        }
    }).catch(error => {
        if (error) {
            logMessage(error);
        } else {
            console.error(`Unknown error from server`);
        }
    })
};

const onDragOver = e => {
    e.stopPropagation();
    e.preventDefault();

    e.currentTarget.classList.add(`drag-over`);
};

const onDragLeave = e => {
    e.stopPropagation();
    e.preventDefault();

    const position = e.relatedTarget.compareDocumentPosition(imageBox);
    if (!(position === 10 || position === 0)) {
        e.currentTarget.classList.remove(`drag-over`);
    }
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

const config = {
    childList: true,
    attributes: true,
    characterData: true,
};

const onFormChange = mutationRecords => {
    mutationRecords.forEach(record => {
        switch (record.type) {
            case 'attributes':
                if (record.attributeName === 'src') {
                    postData();
                }
                break;
            default:
                break;
        }
    });
};

const observer = new MutationObserver(onFormChange);

imagePreview.addEventListener(`click`, () => {
    imageInput.click();
});

imageBox.addEventListener(`dragover`, onDragOver, false);
imageBox.addEventListener(`dragleave`, onDragLeave, false);
imageBox.addEventListener(`drop`, onDrop, false);

imageInput.addEventListener(`change`, onFileChange);

textInput.addEventListener(`input`, postData);

observer.observe(imagePreview, config);