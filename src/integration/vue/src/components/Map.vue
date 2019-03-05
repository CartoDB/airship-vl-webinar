<template>
  <div id="map" ref="map"></div>
</template>

<script>
import L from 'leaflet';
import carto from '@carto/carto.js';
import 'leaflet/dist/leaflet.css';

export default {
  name: 'Map',
  props: {
    msg: String,
    histogramRange: Array,
    histogramStore: Object,
    categoriesStore: Object,
    categoriesFilter: Array
  },
  watch: {
    histogramRange: function (newVal) {
      if (newVal === null) {
        this.source.removeFilter(this.priceFilter);
        this.priceFilter = null;
      } else if (!this.priceFilter) {
        const [min, max] = newVal;
        this.priceFilter = new carto.filter.Range('price', { between: { min, max } });
        this.source.addFilter(this.priceFilter);
      } else {
        const [min, max] = newVal;
        this.priceFilter.setFilters({ between: { min, max } });
      }
    },
    categoriesFilter: function (newVal) {
      const categories = newVal;
      if (categories.length === 0) {
        this.source.removeFilter(this.neighbourhoodFilter);
        this.neighbourhoodFilter = null;
      } else if (categories && !this.neighbourhoodFilter) {
        this.neighbourhoodFilter = new carto.filter.Category('neighbourhood_group', { in: categories });
        this.source.addFilter(this.neighbourhoodFilter);
      } else {
        this.neighbourhoodFilter.setFilters({ in: categories });
      }
    }
  },
  mounted: function () {
    this.client = new carto.Client({
      apiKey: 'default_public',
      username: 'cartojs-test',
    });
    this.map = L.map(this.$refs.map, {
      zoomControl: false,
    }).setView([40.42252398976147, -3.659729361534119], 12);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);

    this.source = new carto.source.Dataset('airbnb_listings');
    const style = new carto.style.CartoCSS(`
      #layer {
        marker-width: 7;
        marker-fill: #EE4D5A;
        marker-line-color: #FFFFFF;
      }
    `);

    this.layer = new carto.layer.Layer(this.source, style);

    this.client.addLayer(this.layer);
    this.client.getLeafletLayer().addTo(this.map);

    const bboxFilter = new carto.filter.BoundingBoxLeaflet(this.map);
    const histogramDataView = new carto.dataview.Histogram(this.source, 'price', {
      bins: 10
    });

    const categoryDataview = new carto.dataview.Category(this.source, 'neighbourhood_group', {
      limit: 6
    });

    histogramDataView.on('dataChanged', data => {
      this.histogramStore.setBins(data.bins);
    });

    categoryDataview.on('dataChanged', data => {
      this.categoriesStore.setCategories(data.categories);
    });

    histogramDataView.addFilter(bboxFilter);
    categoryDataview.addFilter(bboxFilter);

    this.client.addDataview(histogramDataView);
    this.client.addDataview(categoryDataview);
  }
}
</script>

<style scoped>
#map {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 0;
}
</style>
