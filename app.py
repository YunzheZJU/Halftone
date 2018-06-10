# -*- coding: utf-8 -*-
import hashlib
import time

from utils import *
from flask import Flask, render_template, request, json
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class


app = Flask(__name__)
generate_global(app.root_path)

# 加载默认配置
app.config.update(dict(
    SECRET_KEY='Thisismykeyafuibsvseibgf',
    UPLOADED_PHOTOS_DEST=config.GLOBAL['TEMP_PATH']
))

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
patch_request_class(app)  # 文件大小限制，默认为16MB
read_images(test=True)


@app.route('/')
def euclid():
    return render_template('euclid.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    result = -1
    print request.files
    if 'image' in request.files:
        # 保存文件至临时目录
        m = hashlib.md5()
        m.update(str(time.time()))
        filename = photos.save(request.files['image'], name=m.hexdigest() + ".")
        result = calculate_distance(filename)
    return json.dumps(result), [('Content-Type', 'application/json;charset=utf-8')]


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080)
