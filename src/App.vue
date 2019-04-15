<template>
  <div id="app">
    <div class="setting">
      <div>
        <label for="size">size: </label>
        <select v-model="size"
          id="size">
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </div>
      <button @click="start">start</button>
      <button>restart</button>
    </div>
    <div class="block-ctn answer" style="transform: scale(0.5); opacity: 0.5; transform-origin: left-top">
      <div class="block"
        v-for="(answerBlock, index) in answer"
        :key="answerBlock.id"
        :style="{order: index, backgroundColor: answerBlock.color, height: 800 / (size - 2) + 'px', width: 800 / (size - 2) + 'px'}"></div>
    </div>
    <div class="blocks-ctn"
      v-if="isStart">
      <div class="block"
        v-for="(block, index) in blocks"
        :key="block.id"
        :style="{order: index, backgroundColor: block.color, height: 800 / size + 'px', width: 800 / size + 'px'}"></div>
    </div>
  </div>
</template>

<script>
import Core from './core'
const core = new Core.RubicsGameCore(['red', 'blue', 'white', 'orange', 'yellow', 'green'])
export default {
  name: 'app',
  data () {
    return {
      size: 4,
      mode: Core.GameMode.Color,
      /** @type  {{id: number, color: string, text: string}[]}  */
      isStart: false
    }
  },
  computed: {
    isFinish () {
      if (!this.isStart) return false
      return core.validation()
    },
    blocks () {
      return core.blocks
    },
    answer () {
      return core.answer
    }
  },
  methods: {
    start () {
      core.setSize(this.size)
      core.setMode(this.mode)
      core.start()
      this.isStart = true
      core.createAnswer()
      document.onkeydown = e => this.move(e.key)
      this.$forceUpdate()
    },
    move (direction = '') {
      const str = direction.replace('Arrow', '').toLowerCase()
      console.log(str)
      core.move(str)
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="stylus">
*
  margin 0
  padding 0
html, body
  size(100%)
size($w, $h = $w)
  height $h
  width $w
#app
  size(100%)
  display flex
  flex-direction column
  justify-content center
  align-items center
  box-sizing border-box
  padding-top 5rem
  background-color gray
  .setting
    display flex
    flex-direction column
    justify-content center
    align-items center
    line-height 3rem
.blocks-ctn
  display flex
  flex-wrap wrap
  size(800px)
  &.answer
    position relative
    z-index 1
</style>
