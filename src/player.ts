import init, { Runtime, setup } from 'wgs-runtime-wgpu'

let globalInited = false

interface PlayerOptions {
  autoPLay?: boolean
  canvas: HTMLCanvasElement
}

class WgsPlayer {
  private canvas: HTMLCanvasElement
  private rafId: number | undefined = undefined

  constructor(public runtime: Runtime, options: PlayerOptions) {
    this.canvas = options.canvas

    this.initCanvas()

    if (options.autoPLay) {
      this.rafId = window.requestAnimationFrame(this.play)
    } else {
      this.runtime.pause()
    }
  }

  destroy(): void {
    if (this.rafId !== undefined) {
      window.cancelAnimationFrame(this.rafId)
    }

    this.destroyCanvas()
  }

  async loadFromBlob(blob: Blob): Promise<void> {
    const buffer = await blob.arrayBuffer()

    const wgsData = new Uint8Array(buffer)

    this.runtime.load(wgsData)
  }

  async loadFromFile(file: File): Promise<void> {
    const reader = new FileReader()

    return new Promise((resolve, reject) => {
      reader.addEventListener('load', (event) => {
        if (event.target === null) {
          reject('Event target must not be null.')
          return
        }

        const buffer = event.target.result as ArrayBuffer

        const wgsData = new Uint8Array(buffer)

        this.runtime.load(wgsData)

        resolve()
      })

      reader.addEventListener('error', () => {
        reject(`Error occurred reading file: ${file.name}`)
      })

      reader.readAsArrayBuffer(file)
    })
  }

  async loadFromUrl(url: string, fetchOptions?: RequestInit): Promise<void> {
    const res = await fetch(url, fetchOptions)

    const blob = await res.blob()

    await this.loadFromBlob(blob)
  }

  pause(): void {
    this.runtime.pause()
  }

  play = () => {
    if (this.runtime.is_paused()) {
      this.runtime.resume()
    }

    this.tick()

    this.rafId = window.requestAnimationFrame(this.play)
  }

  restart(): void {
    this.runtime.restart()
  }

  resume(): void {
    this.runtime.resume()
  }

  private initCanvas(): void {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        this.onCanvasResize()
      }
    })

    resizeObserver.observe(this.canvas)

    this.canvas.addEventListener('mousedown', this.onCanvasMousedown)

    this.canvas.addEventListener('mousemove', this.onCanvasMousemove)

    this.canvas.addEventListener('mouseup', this.onCanvasMouseup)
  }

  private destroyCanvas(): void {
    this.canvas.removeEventListener('mousedown', this.onCanvasMousedown)

    this.canvas.removeEventListener('mousemove', this.onCanvasMousemove)

    this.canvas.removeEventListener('mouseup', this.onCanvasMouseup)
  }

  private onCanvasMousedown = (): void => {
    this.runtime.update_mouse_press()
  }

  private onCanvasMousemove = (event: MouseEvent): void => {
    this.runtime.update_cursor(event.offsetX, event.offsetY)
  }

  private onCanvasMouseup = (): void => {
    this.runtime.update_mouse_release()
  }

  private onCanvasResize(): void {
    this.canvas.width = this.canvas.clientWidth
    this.canvas.height = this.canvas.clientHeight

    this.runtime.resize(this.canvas.width, this.canvas.height)
  }

  private tick(): void {
    this.runtime.render()
  }
}

async function createPlayer(options: PlayerOptions): Promise<WgsPlayer> {
  if (!globalInited) {
    await init()

    globalInited = true
  }

  const canvas = options.canvas
  canvas.width = canvas.clientWidth
  canvas.height = canvas.clientHeight

  const runtime = await setup(canvas)

  if (options.autoPLay === undefined) {
    options.autoPLay = true
  }

  return new WgsPlayer(runtime, options)
}

export { createPlayer }
