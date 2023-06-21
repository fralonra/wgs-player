# wgs-player

[![Build Status](https://travis-ci.com/fralonra/wgs-player.svg?branch=master)](https://travis-ci.com/fralonra/wgs-player)
[![npm version](https://img.shields.io/npm/v/wgs-player.svg)](https://www.npmjs.com/package/wgs-player)

`wgs-player` helps you to run [`wgs`](https://github.com/fralonra/wgs) file on Web.

It's built on top of [wgs-runtime-wgpu](https://www.npmjs.com/package/wgs-runtime-wgpu).

## Installation

```bash
npm install wgs-player
```

## Usage

```javascript
import { createPlayer } from 'wgs-player'

async function main() {
  const canvas = document.getElementById('canvas')

  const runtime = await createPlayer({ canvas })
}

main()
```

## API

### createPlayer

`function createPlayer(options: PlayerOptions): Promise<WgsPlayer>`

Create a new [`WgsPlayer`](#WgsPlayer) instance.

#### PlayerOptions

```typescript
interface PlayerOptions {
  // Whether to automatically render the wgs once the instance is created.
  // Default is true.
  // If set to `false`, you can always manually invoke `play()` to trigger the rendering.
  autoPLay?: boolean

  // The HTMLCanvasElement where the player will render wgs.
  canvas: HTMLCanvasElement
}
```

### WgsPlayer

The WgsPlayer instance.

#### runtime

_property_ Expose the `WebRuntime` from [wgs-runtime-wgpu](https://www.npmjs.com/package/wgs-runtime-wgpu).

#### destroy

`destroy(): void`

_method_ Destroy the instance manually. Will remove listeners associated with the `HTMLCanvasElement`.

#### loadFromBlob

`loadFromBlob(blob: Blob): Promise<void>`

_method_ Load wgs data from a [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob).

#### loadFromFile

`loadFromFile(file: File): Promise<void>`

_method_ Load wgs data from a [`File`](https://developer.mozilla.org/en-US/docs/Web/API/File).

#### loadFromUrl

`loadFromUrl(url: string, fetchOptions?: RequestInit): Promise<void>`

_method_ Load wgs data from a url. `fetchOptions` will be passed down to Fetch API.

#### pause

`pause(): void`

_method_ Pause the runtime while it's rendering.

#### play

`play(): void`

_method_ Play the runtime manually. Used when `autoPlay` is set to `false`.

#### restart

`restart(): void`

_method_ Restart the runtime.

#### resume

`resume(): void`

_method_ Resume the runtime when it's paused.
