# -*- coding: utf-8 -*-
import logging
import config

logger = logging.getLogger('euclid')
logger.setLevel(logging.DEBUG)

# log format
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')

# file log
fh = logging.FileHandler(config.GLOBAL['LOG_PATH'])
fh.setLevel(logging.DEBUG)
fh.setFormatter(formatter)
logger.addHandler(fh)

# console log 
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
ch.setFormatter(formatter)
logger.addHandler(ch) 