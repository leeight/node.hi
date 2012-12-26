#!/usr/bin/env python
#!-*- coding:utf-8 -*-
#!vim: set ts=4 sw=4 sts=4 tw=100:
# ***************************************************************************
# 
# Copyright (c) 2012 Baidu.com, Inc. All Rights Reserved
# $Id$ 
# 
# **************************************************************************/
 
 
 
import os
import sys
 
 
__author__ = 'leeight <liyubei@baidu.com>'
__date__ = '2012/12/24 21:00:41'
__revision = '$Revision$'


from Crypto.PublicKey import RSA
from Crypto.Util import asn1
from base64 import b64decode

key64 = 'MIGJAoGBALeOGqvBvEC0Ta2ZYm998FXxPKZNh/krDjFYVH6iT6oOzJgTPo/rvTC9RuUsgmpgi5dtQi/1ZiXjp7Fl4qsEkx4fVL3W9DK+jgnam2vw5GtrpECrQjV022UkJRu4AWajWE91H/b4V9WU7FI15T+j+Q5jmxeAWSTQKRW5xoreRN1lAgMBAAE='
keyDER = b64decode(key64)
seq = asn1.DerSequence()
seq.decode(keyDER)
print seq[0]
print seq[1]

keyPub = RSA.construct( (seq[0], seq[1]) )


