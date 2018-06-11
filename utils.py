# -*- coding: utf-8 -*-

import hashlib
import os
import time

import config

from MyQR.myqr import run


def generate_global(root_path):
    """
    根据传入的root_path建立一系列GLOBAL参数，绝对路径
    :param root_path: app.root_path
    :return: 成功则返回1，否则返回0
    """
    config.GLOBAL['ROOT_PATH'] = root_path
    # config.GLOBAL['STATIC_PATH'] = os.path.join(root_path, 'static')
    config.GLOBAL['TEMP_PATH'] = os.path.join(root_path, 'temp')
    # config.GLOBAL['IMAGE_PATH'] = os.path.join(root_path, 'static', 'images')
    return 1


def run_halftone(words, version=1, level='H', picture=None, colorized=False, contrast=1.0, brightness=1.0):
    m = hashlib.md5()
    m.update(str(time.time()))
    qrname = m.hexdigest() + "." + picture.split('.')[-1]
    run(words=words, version=version, level=level, picture=picture, colorized=colorized, contrast=contrast,
        brightness=brightness, save_name=qrname, save_dir=config.GLOBAL['TEMP_PATH'])
    return qrname


if __name__ == '__main__':
    pass
