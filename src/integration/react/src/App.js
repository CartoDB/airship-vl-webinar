import L from 'leaflet';
import carto from '@carto/carto.js'
import React, { Component } from 'react';
import CategoryWidget from './CategoryWidget';

class App extends Component {
  state = {
    categories: [],
    selection: [],
    filter: null,
  };


  client = new carto.Client({
    apiKey: 'default_public',
    username: 'cartojs-test',
  });

  componentDidMount() {
    this._setupMap();
    this._addLayer();
    this._addDataview();
  }

  _setupMap() {
    this.map = L.map('map', {
      zoomControl: false,
    }).setView([30, 0], 3);
    this.map.scrollWheelZoom.disable();

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png', {
      maxZoom: 18,
    }).addTo(this.map);
  }

  _addLayer() {
    this.source = new carto.source.Dataset('ne_10m_populated_places_simple');
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
  }

  _addDataview() {
    const bboxFilter = new carto.filter.BoundingBoxLeaflet(this.map);
    const categoryDataview = new carto.dataview.Category(this.source, 'adm0name', {
      limit: 10,
      operation: carto.operation.SUM,
      operationColumn: 'pop_max',
    });

    categoryDataview.on('dataChanged', ({ categories }) => this.setState({ categories }));

    categoryDataview.addFilter(bboxFilter);
    this.client.addDataview(categoryDataview);
  }

  _createFilter() {
    const filter = new carto.filter.Category('adm0name', { in: this.state.selection });
    this.source.addFilter(filter);
    this.setState({  filter });
  }

  _updateFilter() {
    this.filter.setFilters({ in: this.state.selection });
  }

  onSelectedChanged = ({ detail }) => {
    let { filter } = this.state;

    if (filter && !detail.length) {
      this.source.removeFilter(filter);
      filter = null;
    }

    this.setState({ selection: detail, filter });
  }

  onApplySelection = () => {
    const { filter, selection } = this.state;

    selection.length > 0 && !filter
      ? this._createFilter()
      : this._updateFilter();
  }

  render() {
    const { categories, filter, selection } = this.state;
    const showApplyButton = selection.length > 0 && !filter;

    return (
      <div className="as-app">
        <main className="as-content">
          <div className="as-main">
            <div className="as-map-area">
              <div id="map"></div>
              <div className="as-map-panels">
                <div className="as-panel as-panel--top as-panel--right">
                  <div className="as-panel__element as-p--24">
                    <CategoryWidget
                      heading="Business Volume"
                      description="Description"
                      categories={categories}
                      onSelectedChanged={this.onSelectedChanged}
                      showClearButton={!!filter}
                    />
                    { showApplyButton && (
                      <div className="as-flex as-justify-end as-mt--8">
                        <button className="as-btn as-btn--s as-btn--primary" onClick={this.onApplySelection}>
                          Apply selection
                        </button>
                      </div>
                    )}
                  </div>
              </div>
            </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
