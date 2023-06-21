import { fileOpen } from 'browser-fs-access'
import * as dat from 'dat.gui'
import { createPlayer } from 'wgs-player'

const BUILTIN_EXAMPLES: { [key: string]: string } = {
  default: '/examples/default.wgs',
  'mouse input': '/examples/mouse_input.wgs',
  texture: '/examples/texture.wgs',
  'two textures': '/examples/two_textures.wgs',
}

const EXAMPLE_NAMES = Object.keys(BUILTIN_EXAMPLES)

async function main() {
  const canvas = document.getElementById('canvas')
  if (canvas === null) {
    throw 'Could not find canvas.'
  }

  const modal = document.getElementById('modal')

  const runtime = await createPlayer({
    canvas: canvas as HTMLCanvasElement,
  })

  const config = {
    example: EXAMPLE_NAMES[0],
    pause() {
      runtime.pause()
    },
    restart() {
      runtime.restart()
    },
    resume() {
      runtime.resume()
    },
    upload: async () => {
      const blob = await fileOpen({
        extensions: ['.wgs'],
      })

      await runtime.loadFromBlob(blob)
    },
  }

  const gui = new dat.GUI()

  gui
    .add(config, 'example', EXAMPLE_NAMES)
    .name('Online Example')
    .onChange(loadExample)

  gui.add(config, 'upload').name('Open File')

  gui.add(config, 'restart').name('Restart')

  gui.add(config, 'pause').name('Pause')

  gui.add(config, 'resume').name('Resume')

  function loadExample(example: string) {
    modalShow()

    runtime
      .loadFromUrl(
        `${process.env.PUBLIC_PATH || ''}${BUILTIN_EXAMPLES[example]}`
      )
      .finally(modalHide)
  }

  function modalHide() {
    if (modal === null) {
      throw 'Could not find modal.'
    }

    modal.style.display = 'none'
  }

  function modalShow() {
    if (modal === null) {
      throw 'Could not find modal.'
    }

    modal.style.display = 'block'
  }
}

main()
