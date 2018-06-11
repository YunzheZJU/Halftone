# -*- coding: utf-8 -*-

from utils import *
from flask import Flask, render_template, request, json, send_from_directory, url_for
from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class

app = Flask(__name__)
generate_global(app.root_path)

app.config.update(dict(
    SECRET_KEY='Thisismykeyafuibsvseibgf',
    UPLOADED_PHOTOS_DEST=config.GLOBAL['TEMP_PATH']
))

photos = UploadSet('photos', IMAGES)
configure_uploads(app, photos)
patch_request_class(app)


@app.route('/halftone')
def euclid():
    return render_template('index.html')


@app.route('/calculate', methods=['POST'])
def calculate():
    result = {'status': -1}
    print request.form
    if 'image' in request.files:
        # Save image file to /temp/
        m = hashlib.md5()
        m.update(str(time.time()))
        filename = photos.save(request.files['image'], name=m.hexdigest() + ".")
        # Extract
        text = request.form['text'].encode('utf-8')
        # Process and get result
        try:
            filename = run_halftone(words=text, version=1, level='H', brightness=1.0, colorized=True, contrast=1.0,
                                    picture=os.path.join(config.GLOBAL['TEMP_PATH'], filename))
            # Output
            result = {
                'status': 1,
                'filepath': filename,
            }
        except Exception as ex:
            print ex
            result['message'] = ex.message
    return json.dumps(result), [('Content-Type', 'application/json;charset=utf-8')]


# Expose images at /temp/
@app.route('/temp/<path:filename>', methods=['GET'])
def data(filename):
    return send_from_directory(config.GLOBAL['TEMP_PATH'], filename, as_attachment=True)


if __name__ == '__main__':
    app.run(host="127.0.0.1", port=8080)
