import ApplicationSection from './ApplicationSection';
export function getMap(element) {
    const mapElement = element.querySelector('.as-map-area');
    return mapElement
        ? new ApplicationSection({
            activeClass: 'as-map-area--visible',
            element: mapElement,
            name: mapElement.getAttribute('data-name') || 'Map',
            order: mapElement.getAttribute('data-tab-order') || 0,
            type: 'map'
        })
        : null;
}
export function getSidebars(element) {
    return Array.from(element.querySelectorAll('.as-sidebar')).map(_getSidebar);
}
function _getSidebar(sidebarElement, index) {
    return new ApplicationSection({
        activeClass: 'as-sidebar--visible',
        element: sidebarElement,
        name: sidebarElement.getAttribute('data-name') || `Sidebar ${index}`,
        order: sidebarElement.getAttribute('data-tab-order') || 0,
        type: 'sidebar'
    });
}
export function getPanels(element) {
    return Array.from(element.querySelectorAll('.as-map-panels')).map(_getPanel);
}
function _getPanel(panelElement, index) {
    return new ApplicationSection({
        activeClass: 'as-map-panels--visible',
        element: panelElement,
        name: panelElement.getAttribute('data-name') || `Panel ${index}`,
        order: panelElement.getAttribute('data-tab-order') || 0,
        type: 'panels'
    });
}
export function getFooter(element) {
    const footerElement = element.querySelector('.as-map-footer');
    return footerElement
        ? new ApplicationSection({
            activeClass: 'as-map-footer--visible',
            element: footerElement,
            name: footerElement.getAttribute('data-name') || `Bottom Bar`,
            order: footerElement.getAttribute('data-tab-order') || 0,
            type: 'mapFooter'
        })
        : null;
}
export default {
    getFooter,
    getMap,
    getPanels,
    getSidebars,
};
