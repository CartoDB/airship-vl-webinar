function loadMap() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
    center: [0, 30],
    zoom: 2,
    scrollZoom: true,
    dragRotate: false,
    touchZoomRotate: false
  });
  
  carto.setDefaultAuth({
    username: 'roman-carto',
    apiKey: 'default_public'
  });
  
  const s = carto.expressions;
  
  const source = new carto.source.SQL(`select * from ne_10m_airports`);
  const viz = new carto.Viz(`
    strokeWidth: 0
  `);
  
  const vizLayer = new carto.Layer('layer', source, viz);
  
  vizLayer.addTo(map);  
}
