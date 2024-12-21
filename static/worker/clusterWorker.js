importScripts('supercluster.min.js')
/*global supercluster*/

importScripts('comlink.min.js')
/*global Comlink*/

class MySupercluster {
  constructor() {
    this.index = undefined
    this.features = []
    this.geojsonTask = undefined
  }

  async loadData(geos, tagIds, categoryIds, bridgeFilter) {
    if (tagIds && tagIds.length && tagIds.length > 0) {
      geos = geos.filter(i => i.tags.some(t1 => tagIds.some(t2 => t2 === t1)))
    }
    if (categoryIds && categoryIds.length && categoryIds.length > 0) {
      geos = geos.filter(i => i.categories.some(t1 => categoryIds.some(t2 => t2 === t1)))
    }
    if (bridgeFilter) {
      geos = geos.filter(i => i.name.includes(bridgeFilter))
    }

    this.features = geos.map(i => {
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [i.longitude, i.latitude]
        },
        properties: {
          id: i.id,
          name: i.name,
          photo_url: i.photo_url
        }
      }
    })

    this.index = this._createSupercluster(this.features)
  }

  getClusterExpansionZoom(clusterId) {
    return this.index.getClusterExpansionZoom(clusterId)
  }

  getCluster(bbox, zoom) {
    return this.index.getClusters(bbox, zoom)
  }

  _createSupercluster(fs) {
    return supercluster({
      log: true,
      radius: 60,
      extent: 256,
      maxZoom: 11
    }).load(fs)
  }
}

Comlink.expose(MySupercluster)
