# Architecture

This documents the desired architecture for this project. This was initially discussed in [this issue](https://github.com/TwinePlatform/DataPower/issues/212).

### Root
```
./
|- config       Project configuration
|- db           Database migration files
|- docs         Documentation
|- client       Client app
|- scripts      Developer and deployment scripts
|- server       Server app
|- ...dotfiles
|- package.json Single top-level package.json instead of two different ones
|- README.md
```

### Client
```
./client
|- assets             Raw assets (img, external or pre-compiled js/css, etc.)
|- dist               Built assets will be stored and served from here
|- css                Styling source files
|- src
|  |- cb-admin        All code specific to the cb-admin UI
|  |  |- components
|  |  |- actions
|  |  |- ...
|  |  |- index.js     Exports a single component that contains the entire cb-admin UI
|  |- twine-admin     All code specific to the twine-admin UI
|  |  |- components
|  |  |- actions
|  |  |- ...
|  |  |- index.js     Exports a single component that contains the entire twine-admin UI
|  |- shared          All code shared between the admin and visitor UIs
|  |  |- components
|  |  |- actions
|  |  |- ...
|  |- visitor         All code specific to the visitor UI
|  |  |- components
|  |  |- actions
|  |  |- ...
|  |  |- index.js     Exports a single component that contains the entire visitor UI
|  |- App.js
|  |- index.js
```

### Server
```
./server
|- cb-admin            All code related to cb-admin features
|  |- controllers      Route definitions for API routes
|  |- models           Database models (objects representing cb-admin-related entities in the DB)
|  |- index.js         Exports single function/app that can be mounted onto the main express app
|- twine-admin         All code related to twine-admin features
|  |- controllers
|  |- ...
|- visitor             All code related to visitor features
|  |- controllers
|  |- ...
|- shared              All shared code
|  |- db
|  |- models
|  |- ...
|- index.js
```

### Tests
Adhere to the `jest` convention of having a `__tests__` directory colocated with all files under-test. For example:
```
./foo
|- __tests__
|  |- foobar.test.js
|  |- index.test.js
|- foobar.js
|- index.js
```
