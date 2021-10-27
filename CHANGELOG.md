# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.8.0](https://github.com/tatupesonen/formatbot/compare/v1.7.3...v1.8.0) (2021-10-27)


### Features

* **latex:** add latex command ([2005d95](https://github.com/tatupesonen/formatbot/commit/2005d953ccc331bcc0108ce16e669980e436ef45))


### Bug Fixes

* **external:** comply to new CE api changes ([e9c44ec](https://github.com/tatupesonen/formatbot/commit/e9c44ec0c128185b6513d364c941fa171f86398f))

### [1.7.3](https://github.com/tatupesonen/formatbot/compare/v1.7.2...v1.7.3) (2021-09-21)


### Bug Fixes

* **parser:** improve language key detection ([eaa1795](https://github.com/tatupesonen/formatbot/commit/eaa17953e4fedbbf6d2bbf781f4bbe22795b3a49))

### [1.7.2](https://github.com/tatupesonen/formatbot/compare/v1.7.1...v1.7.2) (2021-09-21)


### Bug Fixes

* **formatter:** fix small formatting issue ([63d74dc](https://github.com/tatupesonen/formatbot/commit/63d74dc7c5fa28fa2b28bcc63fc8e472718b06b3))

### [1.7.1](https://github.com/tatupesonen/formatbot/compare/v1.7.0...v1.7.1) (2021-09-21)


### Bug Fixes

* **slashcommand:** error with case of no userInputLanguage ([54345bf](https://github.com/tatupesonen/formatbot/commit/54345bf54c6bb781db526c98a9f195f820cac2b6))

## [1.7.0](https://github.com/tatupesonen/formatbot/compare/v1.6.0...v1.7.0) (2021-09-21)


### Features

* adds formatting command for mobile users ([4bc962a](https://github.com/tatupesonen/formatbot/commit/4bc962a94aeecb05cefb319a7bbf345bd3720a36))

## [1.6.0](https://github.com/tatupesonen/formatbot/compare/v1.5.0-deploy...v1.6.0) (2021-09-20)

### Bug Fixes
* issue with languageKey containing backticks ([bf7762c](https://github.com/tatupesonen/formatbot/commit/bf7762c085e89804ce78f8bf1fc6e1c74382a0f1))
* regex issue where the parser would find nonsupported language key ([5a1d1c2](https://github.com/tatupesonen/formatbot/commit/5a1d1c2b7941a34d8367251827c05d2276f0cb5e))
* remove debug console.logs in format.ts ([35b923f](https://github.com/tatupesonen/formatbot/commit/35b923f6fd592bdd41d9e6690f6c9b9214a07dac))


## [1.5.0](https://github.com/tatupesonen/formatbot/compare/v1.5.0-deploy...v1.5.0) (2021-09-18)


### Features

* add commitlint to project ([398e901](https://github.com/tatupesonen/formatbot/commit/398e9010ffad8c626e089830d284068ce1af14bf))
* **ci:** add husky pre-push hook to run tests ([84c53f0](https://github.com/tatupesonen/formatbot/commit/84c53f065b9390179b764e0296c2d35e08b654e5))
* **core:** add new codeblock parser ([fdc878f](https://github.com/tatupesonen/formatbot/commit/fdc878fb1f362088cad45dd1024abbd119df397e))
* **core:** add new formatting command ([1559906](https://github.com/tatupesonen/formatbot/commit/1559906d7197717fbf9e4c97e4e1e6ff170463af))
* show amount of guilds joined in status ([aa0bf7e](https://github.com/tatupesonen/formatbot/commit/aa0bf7e602616184ad5113d1fe610ae0a606ee56))


### Bug Fixes

* add IParser to DITypes ([9112520](https://github.com/tatupesonen/formatbot/commit/9112520e210fe69e8786753ce9b9f4994d99c651))
* **chore:** update lint-staged settings ([077634c](https://github.com/tatupesonen/formatbot/commit/077634c7b9d3b249b95ce010291003612ea57440))
* **ci:** sign releases ([b05e31a](https://github.com/tatupesonen/formatbot/commit/b05e31abe9a9481e4103f9c645d0252cb665a7a6))
* **ci:** try fixing test action ([2e83620](https://github.com/tatupesonen/formatbot/commit/2e836208adbf8540537d4fca3701e12ba3dc5abe))
* **core:** handle case for no code blocks ([2e01220](https://github.com/tatupesonen/formatbot/commit/2e01220ee798913fe89c3333ba2346325cdfa986))
* remove debug console.logs in format.ts ([35b923f](https://github.com/tatupesonen/formatbot/commit/35b923f6fd592bdd41d9e6690f6c9b9214a07dac))
* **test:** fix whitespacing in test ([983d27b](https://github.com/tatupesonen/formatbot/commit/983d27b7e9119cb2f903d69fd78a465a9c292b68))

### [1.3.1](https://github.com/tatupesonen/formatbot/compare/v1.3.0-fix-tensorflow...v1.3.1) (2021-09-02)


### Bug Fixes

* Need this to run CI for now... ([16425d8](https://github.com/tatupesonen/formatbot/commit/16425d8b1eea6ae88aa8376a3233f2da14efbfaf))

## [1.3.0](https://github.com/tatupesonen/formatbot/compare/v1.2.1...v1.3.0) (2021-09-02)


### Features

* Add format!help ([54e9ae1](https://github.com/tatupesonen/formatbot/commit/54e9ae1931bb56c89b42385a30a5fce24cda8f8e))
* Add initial language detector using guesslang ([71faa28](https://github.com/tatupesonen/formatbot/commit/71faa282cb732bfa0d6b956d91970572d52d4d06))


### Bug Fixes

* logger fileformat to not have hours ([542803a](https://github.com/tatupesonen/formatbot/commit/542803ab46fa81c81cdf95e728c556476665d02b))

## [1.2.0](https://github.com/tatupesonen/formatbot/compare/v1.1.0...v1.2.0) (2021-08-29)


### Features

* Add more log transports, daily rotate file ([27a9b56](https://github.com/tatupesonen/formatbot/commit/27a9b569d437bd196fd8f960b7576740f61fa3aa))
* Add winston ([b4c1218](https://github.com/tatupesonen/formatbot/commit/b4c1218c4ae3b6ad07b227dc1292fcfe4fd2688b))
* Add winston-daily-rotate-file ([4505bdd](https://github.com/tatupesonen/formatbot/commit/4505bddb2ffbeb1a68f9150cbd435d781f3107e7))

## [1.1.0](https://github.com/tatupesonen/formatbot/compare/v1.0.3...v1.1.0) (2021-08-29)


### Features

* Add winston ([fc664a3](https://github.com/tatupesonen/formatbot/commit/fc664a37a07323590b18a122c9fd2dc1719fcf10))

### [1.0.3](https://github.com/tatupesonen/formatbot/compare/v1.0.2...v1.0.3) (2021-08-29)

### [1.0.2](https://github.com/tatupesonen/formatbot/compare/v1.0.1...v1.0.2) (2021-08-28)

### 1.0.1 (2021-08-28)
