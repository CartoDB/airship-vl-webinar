function loadMap() {
  const map = new mapboxgl.Map({
    container: 'map',
    style: carto.basemaps.darkmatter,
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
  
  const source = new carto.source.Dataset('ne_10m_airports');
  const viz = new carto.Viz(`
    @locationHist: viewportHistogram($location)
    @longitudeHist: viewportHistogram($longitude)
    strokeWidth: 0
  `);
  
  const vizLayer = new carto.Layer('layer', source, viz);
  
  vizLayer.addTo(map); 
  
  return vizLayer;
}
