export default () => {
  const markerChildren = ['AR.js','HIRO','Kanji'].map(title => {
    const marker = title.includes('.') ? title.split('.').join('') : title
    return {title, to:{name:'Marker',params:{marker:marker.toLowerCase()}}}
  })
  return [{
    title:'Startseite',
    to:{name:'Index'}
  },{
    title:'AR mit GPS Koordinaten',
    to:{name:'Location'}
  },{
    title:'AR mit einem Marker',
    children: markerChildren
  }]
}
