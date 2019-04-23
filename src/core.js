export const GameMode = {
  Number: 'GAME_MODE_NUMBER',
  Color: 'GAME_MODE_COLOR'
}

function shuffle (array) {
  let currentIndex = array.length
  let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = ~~(Math.random() * currentIndex)
    currentIndex -= 1

    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }
}

export class RubicsGameCore {
  /**
   * @param {string[]} colorSeries colors
   */
  constructor (colorSeries = []) {
    this.colors = colorSeries
    this.size = 4
    this.mode = GameMode.Color
    /** @type {{id: number, color: string, text: string}[]} */
    this.blocks = []
    /** @type {{id: number, color: string, text: string, verifyKey: number}[]} */
    this.answer = []
    this.isEnd = false
    this.startTime = 0
    this.endTime = 0
  }

  get controlBlockId () {
    return this.size ** 2
  }

  reset () {
    this.isEnd = false
    this.size = 4
    while (this.blocks.pop());
    while (this.answer.pop());
  }

  /**
   * @param {number} size
   */
  setSize (size = 4) {
    this.size = size
  }
  /**
   * @param {'GAME_MODE_COLOR' | 'GAME_MODE_NUMBER'} mode gamemode
   */
  setMode (mode = GameMode.Number) {
    this.mode = mode
  }

  createBlocks (size = this.size) {
    const length = size ** 2
    let blocks = Array.from({ length }).map((_, id) => ({ id: id + 1, color: this.colors[id % size] || 'transparent', text: id + 1 }))
    return blocks
  }

  createAnswer () {
    let tmp = this.createBlocks()
    shuffle(tmp)
    tmp.forEach((t, i) => (t.verifyKey = i))
    this.answer = tmp.filter((t, i) => {
      if (i % this.size === 0 || i % this.size === this.size - 1) return false
      if (i >= 0 && i < this.size) return false
      if (i <= tmp.length - 1 && i >= tmp.length - this.size + 1) return false
      return true
    })
  }

  start () {
    this.blocks = this.createBlocks()
    this.blocks[this.blocks.length - 1].color = 'transparent'
    this.blocks[this.blocks.length - 1].text = ' '
    shuffle(this.blocks)
    this.startTime = Date.now()
    this.createAnswer()
  }
  /**
   * @param {'up' | 'down' | 'left' | 'right'} direction arrow key input
   */
  move (direction) {
    const controlBlockPositionArrayId = this.blocks.findIndex(b => b.id === this.controlBlockId)
    let blockToSwitchArrayId = -1
    switch (direction) {
      case 'down':
        blockToSwitchArrayId = controlBlockPositionArrayId - this.size
        if (blockToSwitchArrayId < 0) blockToSwitchArrayId = controlBlockPositionArrayId
        break
      case 'up':
        blockToSwitchArrayId = controlBlockPositionArrayId + this.size
        if (blockToSwitchArrayId > this.size ** 2) blockToSwitchArrayId = controlBlockPositionArrayId
        break
      case 'right':
        if (controlBlockPositionArrayId % this.size === 0) blockToSwitchArrayId = controlBlockPositionArrayId
        else blockToSwitchArrayId = controlBlockPositionArrayId - 1
        break
      case 'left':
        if (controlBlockPositionArrayId % this.size === (this.size - 1)) blockToSwitchArrayId = controlBlockPositionArrayId
        else blockToSwitchArrayId = controlBlockPositionArrayId + 1
        break
      default:
        return false
    }
    if (controlBlockPositionArrayId === blockToSwitchArrayId) return false
    else {
      if (this.blocks[controlBlockPositionArrayId] && this.blocks[blockToSwitchArrayId]) {
        [this.blocks[controlBlockPositionArrayId], this.blocks[blockToSwitchArrayId]] = [this.blocks[blockToSwitchArrayId], this.blocks[controlBlockPositionArrayId]]
        this.validation()
        return true
      } else {
        return false
      }
    }
  }

  canMove (id) {
    const controlBlockPositionArrayId = this.blocks.findIndex(b => b.id === this.controlBlockId)
    if (id - this.size === controlBlockPositionArrayId) return 'up'
    if (id + this.size === controlBlockPositionArrayId) return 'down'
    if (id + 1 === controlBlockPositionArrayId) return 'right'
    if (id - 1 === controlBlockPositionArrayId) return 'left'
    return false
  }

  validation () {
    if (!(this.answer.length && this.blocks.length)) return false
    this.isEnd = this.answer.every(ele => {
      return this.blocks[ele.verifyKey].color === ele.color || this.blocks[ele.verifyKey].id === ele.id
    })
    if (this.isEnd) {
      this.endTime = Date.now()
    }
    return this.isEnd
  }
}

export default {
  RubicsGameCore,
  GameMode
}
