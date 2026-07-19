# tailwind-src

tailwind userscript bundle, un-bundled. each webpack module pulled back out into its own file.

it's just for reading. the files still reference each other with webpack's `__webpack_require__(...)`, so
nothing runs from here on its own. the thing that actually runs is the single-file bundle.

```
- src/js/app.js — the entry point (mod + game client)
- src/js/config.js — constants
- src/js/data/ — game data + managers (player, items, objectManager, store, ai, ...)
- src/js/libs/ — utils, io-client, animText, modernizr, page (main menu + game ui)
- vultr/VultrClient.js — server list
- loader.js — the loader/native bundle deleter userscript
- vendor/ — third-party libs (base64-js, buffer, msgpack-lite, ieee754, int64-buffer, event-lite, process, webpack)
```