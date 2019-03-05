<template>
  <div class="as-app">
    <main class="as-content">
      <div class="as-main">
        <div class="as-map-area">
          <Map
            v-bind:histogramStore="histogramData"
            v-bind:categoriesStore="categoriesData"
            v-bind:histogramRange="histogramData.range"
            v-bind:categoriesFilter="categoriesData.selectedCats"
          />
        </div>
      </div>
      <aside class="as-sidebar as-sidebar--l as-sidebar--right" data-name="General info">
        <div class="as-container as-container--scrollable">
          <section class="as-box as-m--16">
            <h2 class="as-title as-color--primary">Histogram</h2>
            <Histogram
              v-bind:histogramStore="histogramData"
              v-bind:bins="histogramData.bins" />
          </section>
          <section class="as-box as-m--16">
            <h2 class="as-title as-color--primary">Category Widget</h2>
            <Categories
              v-bind:categoryStore="categoriesData"
              v-bind:categories="categoriesData.categories" />
          </section>
        </div>
      </aside>
    </main>
  </div>
</template>

<script>
import Map from './components/Map.vue';
import Histogram from './components/Histogram.vue';
import Categories from './components/Categories.vue';

const HistogramStore = {
  bins: [],
  range: null,
  setBins: function (bins) {
    this.bins = bins.map(bin => {
      return {
        start: bin.start,
        end: bin.end,
        value: bin.freq
      };
    });
  },
  setRange: function (range) {
    this.range = range;
  }
};

const CategoriesStore = {
  categories: [],
  selectedCats: [],
  setCategories: function (cats) {
    this.categories = cats.map(category => {
      return {
        name: category.name,
        value: category.value
      };
    });
  },
  setSelected: function (selected) {
    this.selectedCats = selected;
  }
}

export default {
  name: 'app',
  data: function () {
    return {
      histogramData: HistogramStore,
      categoriesData: CategoriesStore
    }
  },
  components: {
    Map,
    Histogram,
    Categories
  }
}
</script>

<style scoped>
.as-panel__element {
  max-width: none;
}
</style>
