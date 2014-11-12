kppoint.github.io
=================

kppoint official website

Repository Branches
-------------------
* `master`: Used by Github to generate organization branch. *Compiled files & static assets only.*
* `dev`: Major development branch.
* `<other branches>`: Feature branches.


Directory Structure
-------------------
* `src/` : Contains all the source files.
* `static/` : Contains all non-compiled assets, such as images, icons, etc.
* `config/` : Configurations.
* `vendor/` : Third-party libraries, bower components, etc.

Environment Setup
-----------------

```
$ npm install -g gulp
$ npm install
```

Development
-----------

```
$ gulp
```

This opens up a http server, which listens [localhost:8080](http://localhost:8080).
When source files (specified or requred in `config/webpack.js`) are changed, the browser window will reload by itself.
Compilation status (of files managed by webpack) will be shown in the browser console.

Deployment
----------

```
$ make deploy
```

This builds the assets in `src/` directory, emits compiled assets to `assets/`, creates `build/` and copies all relevant files into that directory, and commits its content onto `master` branch using forced git push.

If the action above seems too "automatic", it is possible to inspect the compiled website without updating the upstream master branch:

```
$ make        # creates build/ directory
$ cd build/
$ python -m SimpleHTTPServer # Opens a static web server at localhost:8000
```
