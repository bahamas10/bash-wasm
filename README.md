Bash wasm
==========

Compile the Bash Shell for wasm using emscripten.

I originally made this as an april fools day joke for a youtube video but
like... where's the joke? it actually works lol.

- website: https://bash-wasm.ysap.sh
- video: https://www.youtube.com/watch?v=TEq-6AqMFBI

How To
------

This works on my machine - YMMV

```
mkdir -p build
cd build
emconfigure ../bash-5.3/configure --build="$(bash ../bash-5.3/support/config.guess)" --host wasm32-unknown-emscripten --cache-file=../cache.txt  --without-bash-malloc
emmake make LDFLAGS='-sFORCE_FILESYSTEM=1 -sEXPORTED_RUNTIME_METHODS=FS,callMain -sMODULARIZE=1 -sEXPORT_NAME=createBashModule'
cd ../web
python3 -mhttp.server
```

License
--------

GPLv3
