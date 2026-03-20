# pyaudioop shim for Python 3.13+ (audioop removed from stdlib)
# pydub 0.25.1 imports pyaudioop which doesn't exist as a package
# audioop-lts provides the audioop module
from audioop import *
