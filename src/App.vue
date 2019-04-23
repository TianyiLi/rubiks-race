<template>
  <div id="app">
    <h1>Rubic's race!</h1>
    <div class="setting">
      <div v-if="!isStart">
        <label for="size">size: </label>
        <select v-model.number="size"
          id="size">
          <option :value="4">4</option>
          <option :value="5">5</option>
          <option :value="6">6</option>
        </select>
      </div>
      <div class="button-line">
        <!-- <button @click="introIsShow = true"
          v-if="!isStart">How to play?</button> -->
        <button @click="start"
          v-if="!isStart">start</button>
        <button v-if="isStart"
          @click="isStart = false">restart</button>
      </div>
    </div>
    <div class="blocks-ctn answer"
      style=""
      v-if="isStart">
      <div class="block"
        v-for="(answerBlock, index) in answer()"
        :key="answerBlock.id"
        :style="{order: index, backgroundColor: answerBlock.color, height: 150 / (size - 2) + 'px', width: 150 / (size - 2) + 'px'}"></div>
    </div>
    <div class="blocks-ctn"
      v-if="isStart">
      <div class="answer-ring"
        :style="answerRingStyle"></div>
      <div class="block"
        v-for="(block, index) in block()"
        :key="block.id"
        @click="clickToMove(index)"
        :style="{order: index, backgroundColor: block.color, height: (blockSize / size) + 'px', width: (blockSize / size) + 'px', cursor: canMove() && 'pointer' || 'initial'}"></div>
    </div>
    <!-- <intro @end="introIsShow = false"></intro> -->
    <div class="finish"
      v-if="isStart && isFinish()">
      <div @click="reset()"
        class="line">Success<br>You spend {{getTotalTime()}} seconds<br>click to resetart</div>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import Core from './core'
import intro from './components/How-to-play'
const core = new Core.RubicsGameCore(['red', 'blue', 'white', 'orange', 'yellow', 'green'])
export default {
  name: 'app',
  components: {
    intro
  },
  data () {
    return {
      size: 4,
      mode: Core.GameMode.Color,
      /** @type  {{id: number, color: string, text: string}[]}  */
      isStart: false,
      introIsShow: false
    }
  },
  destroyed () {
    document.removeEventListener('keydown', this.move)
  },
  computed: {
    blockSize: {
      get () {
        return +getComputedStyle(document.documentElement).getPropertyValue('--blocks-ctn-size').match(/\d+/)[0]
      },
      set (value) {
        const _n = +value
        document.documentElement.style.setProperty('--blocks-ctn-size', _n + 'px')
      }
    },
    answerRingStyle () {
      const sizePX = +getComputedStyle(document.documentElement).getPropertyValue('--blocks-ctn-size').match(/\d+/)[0]
      const style = {
        top: sizePX / this.size + 'px',
        left: sizePX / this.size + 'px',
        width: (sizePX - (sizePX / this.size * 2)) + 'px',
        height: (sizePX - (sizePX / this.size * 2)) + 'px'
      }
      console.log(style)
      return style
    }
  },
  methods: {
    answer () {
      return core.answer
    },
    getTotalTime () {
      return ~~(core.endTime - core.startTime) / 1000
    },
    block () {
      return core.blocks
    },
    reset () {
      core.reset()
      this.size = core.size
      this.isStart = false
      this.$forceUpdate()
      document.removeEventListener('keydown', this.move)
    },
    isFinish () {
      if (!this.isStart) return false
      return core.validation()
    },
    start () {
      core.setSize(this.size)
      core.setMode(this.mode)
      core.start()
      this.isStart = true
      // core.createAnswer()
      console.log(core.blocks.map(ele => ele.color))
      document.addEventListener('keydown', this.move)
      this.$forceUpdate()
    },
    move ({ key = '' }) {
      console.log(key)
      const str = key.replace('Arrow', '').toLowerCase()
      core.move(str)
      this.$forceUpdate()
    },
    clickToMove (id) {
      const direction = core.canMove(id)
      console.log(direction)
      if (direction) this.move({ key: direction })
    },
    canMove (id) {
      return !!core.canMove(id)
    }
  }
}
</script>
<style lang="stylus">
*
  margin 0
  padding 0
:root
  --blocks-ctn-size 800px
html, body
  size(100%)
  font-family monospace
  background-color gray
size($w, $h = $w)
  height $h
  width $w
#app
  size(100%)
  height 100vh
  display flex
  flex-direction column
  justify-content center
  align-items center
  box-sizing border-box
  .setting
    display flex
    flex-direction column
    justify-content center
    align-items center
    line-height 3rem
    font-size 1.5rem
    padding-bottom 2rem
    .button-line
      display flex
      button
        margin 2rem
    button
      padding 0.3rem 1rem
      background white
      border none
      font-size inherit
      &:active
        box-shadow 5px 5px 5px gray
.blocks-ctn
  display flex
  flex-wrap wrap
  position relative
  size(var(--blocks-ctn-size))
  &.answer
    size(150px)
    opacity 0.5
    position absolute
    top 4em
    left 1em
    z-index 1
  .answer-ring
    pointer-events none
    position absolute
    box-sizing border-box
    border 1rem solid rgba(black, 0.4)
.finish
  position fixed
  top 0
  left 0
  .line
    position fixed
    top 50%
    width 100%
    transform translateY(-50%)
    display flex
    justify-content center
    align-items center
    font-size 3rem
    font-weight 800
    height 12rem
    z-index 2
    background linear-gradient(217deg, rgba(255, 0, 0, 0.8), rgba(255, 0, 0, 0) 70.71%), linear-gradient(127deg, rgba(0, 255, 0, 0.8), rgba(0, 255, 0, 0) 70.71%), linear-gradient(336deg, rgba(0, 0, 255, 0.8), rgba(0, 0, 255, 0) 70.71%)
  .background
    position fixed
    z-index 0
    background rgba(gray, 0.7)
    content ''
    width 100vw
    height 100vh
@keyframes start
  from
    width 100%
  to
    width 0%
    height 0
    opacity 0
</style>
