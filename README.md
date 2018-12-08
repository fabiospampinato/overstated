# Overstated

A wrapper around [unstated](https://github.com/jamiebuilds/unstated), with many useful plugins built-in, for easier development.

Unstated promises a beautiful API, but developing complex applications with it can be challenging, so I wrote many plugins for it, which you can find on [awesome-unstated](https://github.com/tiaanduplessis/awesome-unstated), for overcoming these challenges.

Overstated provides everything that you need to develop complex applications, in a single package.

## Challenges/Features

- Using unstated's `Subscribe` container can be cumbersome, so I made [unstated-connect2](https://github.com/fabiospampinato/unstated-connect2) for beautifully connecting containers with components.
- Connecting to multiple containers can be cumbersome, so I made [unstated-compose](https://github.com/fabiospampinato/unstated-compose) for composing containers from other containers, this way you could have a central `App` container while most of the actual state and APIs is available in sub-containers.
- Having a centralized container can be awful for performance since any state update in any of its child containers can cause the entire app to re-render. This is why [unstated-connect2](https://github.com/fabiospampinato/unstated-connect2) comes with a selector and a way of skipping components updates.
- If one of your containers' methods calls multiple other methods that mutate the state your application will get re-rendered multiple times, so I made [unstated-suspense](https://github.com/fabiospampinato/unstated-compose-suspense) for suspending these re-renderings.
- Using [unstated-suspense](https://github.com/fabiospampinato/unstated-compose-suspense) on its own can be challenging though, as you would have to wrap all your methods with it and be extra careful about exceptions, so I made [unstated-suspense-autosuspend](https://github.com/fabiospampinato/unstated-suspense-autosuspend), which automates the process.
- Other state management libraries use middlewares, which you may need at some point when developing complex applications, so I made [unstated-compose-suspense-middleware](https://github.com/fabiospampinato/unstated-compose-suspense-middleware) which leverages [unstated-suspense](https://github.com/fabiospampinato/unstated-compose-suspense) for providing you with middlewares that get called every time the state changes.
- You'll probably want to use Hot-Module-Replacement during development, but by default unstated doesn't preserve the state, so I made [unstated-hmr](https://github.com/fabiospampinato/unstated-hmr) which solves that.
- You'll probably also want access to your application's container at run time and debugging logs everytime the state changes during development, so you should use [unstated-debug](https://github.com/sindresorhus/unstated-debug) for that.

All these features are included into overstated, no need to import multiple packages, and no need to configure things like [unstated-suspense-autosuspend](https://github.com/fabiospampinato/unstated-suspense-autosuspend) on your own.

## Install

```sh
npm install --save overstated
```

## Usage

You should read [unstated](https://github.com/jamiebuilds/unstated)'s and all the plugins' documentations.

```ts
import {Container, Provider, Subscribe, compose, connect, debug, HMR} from 'overstated';
```

## License

MIT © Fabio Spampinato
