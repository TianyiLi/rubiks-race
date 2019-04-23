<template>
  <div class="background">
    <div class="modal">
      <ul>
        <li v-if="currentStep === 0">
          <section>
            <h3>Set up the size</h3>
            <p>chose the size you want</p>
            <p>
              <label for="">
                size
                <select disabled
                  @click="nextStep()">
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                </select>
              </label>
            </p>
          </section>
        </li>
        <li v-if="currentStep === 1">
          <section>
            <h3>Use arrow key or mouse click to control the block moving</h3>
            <section>
              <button @click="nextStep">next</button>
              <div class="blocks-ctn"
                style="height: 300px; width: 300px">
                <div class="block"
                  v-for="(block, index) in block()"
                  :key="block.id"
                  @click="clickToMove(index)"
                  :style="{order: index, backgroundColor: block.color, height: (40 / size) + 'px', width: (40 / size) + 'px'}"></div>
              </div>
            </section>

          </section>
        </li>
        <li v-if="currentStep === 2">
          <section>
            <h3>Check the answer blocks(left side), make sure the blocks which in the gray border area is as same as the answer</h3>
            <button @click="$emit('end')">OK, I got it</button>
          </section>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Core from '../core'
const core = new Core.RubicsGameCore(['red', 'blue', 'white', 'orange', 'yellow', 'green'])

export default {
  data () {
    return {
      isShow: false,
      currentStep: 0
    }
  },
  computed: {
    blocks () {
      return core.blocks
    }
  },
  destroyed () {
    document.removeEventListener('keydown', this.move)
  },
  created () {
    core.setSzie(3)
    core.setMode('GAME_MODE_COLOR')
    core.start()
    document.addEventListener('keydown', this.move)
    this.$forceUpdate()
  },
  methods: {
    nextStep () {
      this.currentStep += 1
    },
    move ({ key = '' }) {
      const str = key.replace('Arrow', '').toLowerCase()
      core.move(str)
      this.$forceUpdate()
    },
    clickToMove (id) {
      const direction = core.canMove(id)
      if (direction) this.move({ key: direction })
    }
  }
}
</script>
<style lang="stylus" scoped>
.background
  background rgba(gray, 0.4)
  width 100vw
  height 100vh
</style>
