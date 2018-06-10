# -*- coding: utf-8 -*-
import os
import config
import numpy as np

from logger import logger
from PIL import Image

samples = []


def generate_global(root_path):
    """
    根据传入的root_path建立一系列GLOBAL参数，绝对路径
    :param root_path: app.root_path
    :return: 成功则返回1，否则返回0
    """
    config.GLOBAL['ROOT_PATH'] = root_path
    config.GLOBAL['STATIC_PATH'] = os.path.join(root_path, 'static')
    config.GLOBAL['TEMP_PATH'] = os.path.join(root_path, 'temp')
    config.GLOBAL['IMAGE_PATH'] = os.path.join(root_path, 'static', 'images')
    return 1


def read_images(test=False):
    """
    读取预置图片的信息
    :return: 返回list，存储10张图片的数组
    """
    try:
        for i in range(10):
            if test:
                samples.append(np.asarray(Image.open(os.path.join("static\\images", str(i) + ".jpg"))))
            else:
                samples.append(np.asarray(Image.open(os.path.join(config.GLOBAL['IMAGE_PATH'], str(i) + ".jpg"))))
        return True
    except StandardError as ex:
        logger.error(ex.message)


def calculate_distance(file_in_temp_folder):
    """
    计算输入图像与预置图片的欧式距离
    :param file_in_temp_folder: 输入图像
    :return: 返回距离最短的图片编号
    """
    src = os.path.join("temp", file_in_temp_folder)
    dst = resize_image(src, 960, 540)
    test = np.asarray(Image.open(dst))
    result = []
    for i in range(len(samples)):
        result.append([i, np.linalg.norm(test - samples[i])])
    result.sort(key=lambda d: d[1])
    print result
    return result[0][0]


def resize_image(src, w, h):
    """
    修改图片尺寸并保存为png
    :param src: 源图片路径
    :param w: 新宽度
    :param h: 新高度
    :return: 新文件路径
    """
    img = Image.open(src)
    out = img.resize((w, h))
    dst = src.split(".")[0] + ".png"
    out.save(dst)
    return dst


if __name__ == '__main__':
    read_images(test=True)
    test_image = "test3.jpg"
    converted_image = resize_image(test_image, 960, 540)
    print calculate_distance(converted_image)
