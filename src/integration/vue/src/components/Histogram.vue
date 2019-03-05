<template>
  <as-histogram-widget ref="histogram"
    show-clear
    heading="Price"
    >
  </as-histogram-widget>
</template>

<script>

export default {
  name: 'Histogram',
  props: {
    bins: Array,
    histogramStore: Object,
  },
  mounted: function () {
    this.histogram = this.$refs.histogram;

    this.histogram.addEventListener('selectionChanged', (e) => {
      this.histogramStore.setRange(e.detail);
    });
  },
  watch: {
    bins: function (newVal) {
      this.histogram.data = newVal;
    }
  }
}
</script>

