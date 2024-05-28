<template>
  <d-function-wrapper
    :classes="['d-chart']"
    v-bind="{...$props, ...$attrs}"
  >
    <d-row
      class="d-chart__container"
      elevation-dark="1"
      elevation-light="n2"
    >
      <d-column
        v-if="showLabels"
        :wrap="false"
        class="py-0"
        style="width:30px"
      >
        <d-spacer />
        <d-card-subtitle
          v-for="(i, x) in rowItems"
          :key="x"
          :style="{'align-self': 'end', transform: `translate(0px,${rowSpacing/2}px)`}"
          class="pa-0 px-2"
          :height="`${rowSpacing}px`"
        >
          <span v-if="(x !== 0 ? (rowItems[x]<rowItems[x-1]):x===0)">{{ i }}</span>
        </d-card-subtitle>
        <div style="height: 30px" />
      </d-column>
      <d-column
        block
        class="pa-0"
        :style="{overflow: 'auto', maxWidth: $innerWidth()-80 + 'px', borderRadius: '0 8px 0 0 !important'}"
        :wrap="false"
      >
        <d-card
          elevation-dark="6"
          class="d-chart__container__chart"
          :class="{'hidden-labels': !showLabels}"
          :style="`width: ${columnSpacing*(columnItems.length-1)}px !important; height: ${rowSpacing*(rowItems.length-1)}px !important`"
        >
          <component
            :is="variant"
            v-bind="{...$props, ...$attrs}"
            v-model="value"
            :columns="columnItems"
            :max-value="maxValue"
          />
        </d-card>
        <d-row
          v-if="showLabels"
          :wrap="false"
        >
          <d-card-subtitle
            v-for="i in columnItems"
            :key="i"
            class="pa-0 px-2"
            :style="{'justify-content': 'center',
                     'min-width': `${columnSpacing}px`,
                     'max-width': `${columnSpacing}px`,
                     height: '30px',
                     transform: `translate(-${columnSpacing/2}px,0px)`}"
            height="30px"
          >
            {{ i }}
          </d-card-subtitle>
        </d-row>
      </d-column>
    </d-row>
  </d-function-wrapper>
</template>

<script>
import lines from "./variant/Lines"

export default {
  name: "DChart",
  components: {
    lines
  },

  props: {
    value: {type: Array, required: true},
    variant: {type: String, default: "lines"},
    columns: {type: Array},
    showDots: {type: Boolean, default: false},
    showGradient: {type: Boolean, default: true},
    showGrid: {type: Boolean, default: false},
    showLabels: {type: Boolean, default: true},
    rowSpacing: {type: [Number, String], default: 40},
    columnSpacing: {type: [String, Number], default: 40},
    rowLines: {type: [String, Number], default: 10},
  },

  computed: {
    maxValue() {
      let maxValue = 0;
      this.value.forEach((item) => {
        item.points.forEach((dataPoint) => {
          if (maxValue < (typeof dataPoint.value === "number" ? dataPoint.value : dataPoint
          )) {
            maxValue = dataPoint.value ?? dataPoint
          }
        })
      })
      return maxValue
    },
    maxColumns() {
      let maxValue = 0;
      this.value.forEach((item) => {
        if (maxValue < item.points.length) {
          maxValue = item.points.length
        }
      })
      return maxValue
    },
    columnItems() {
      let items = []
      if (this.columns && this.columns.length > 0) {
        items = this.columns
      }
      if (items.length < this.maxColumns) {
        const requiredColumns = this.maxColumns - items.length
        items.push(...Array.from({length: requiredColumns}, (_, i) => i + items.length))
      }
      //console.log(items)
      return items
    },
    rowItems() {
      let items = [0]
      for (let i = 0; i < this.rowLines; i++) {
        items.push(Math.ceil((this.maxValue / this.rowLines) * (i + 1)))
      }
      return items.reverse()
    }
  },

  methods: {}
}
</script>

<style scoped lang="scss">
.d-chart {
  width: max-content;

  &__container {
    align-items: stretch;
    position: relative;
    width: max-content;
    max-width: 100%;

    &__chart {
      border-radius: 0 8px 0 0 !important;
      min-width: 0 !important;
      width: auto !important;
      height: 100% !important;
      overflow: hidden !important;
      &.hidden-labels {
        border-radius: 8px !important;
      }
    }

    &__horizontal-divider {
      position: absolute;
      width: 100%;
      left: 0;
      bottom: 30px;
    }
  }
}
</style>
