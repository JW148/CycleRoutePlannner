export const getRoute = async (from, to) => {
  let routes = [];
  //fetches route with 'avoid-cobbles' profile
  const response1 = await fetch(
    // `http://18.202.213.52:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=avoid-cobbles&alternativeidx=0&format=geojson`
    `http://86.6.75.164:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=avoid-cobbles&alternativeidx=0&format=geojson`
  );
  const route1 = await response1.json();
  //fetches route with 'safety' profile
  const response2 = await fetch(
    // `http://18.202.213.52:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=safety&alternativeidx=0&format=geojson`
    `http://86.6.75.164:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=safety&alternativeidx=0&format=geojson`
  );
  const route2 = await response2.json();
  //fetches route with 'shortest' profile
  const response3 = await fetch(
    // `http://18.202.213.52:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=shortest&alternativeidx=0&format=geojson`
    `http://86.6.75.164:3000/brouter?lonlats=${from.longitude},${from.latitude}|${to.longitude},${to.latitude}&profile=shortest&alternativeidx=0&format=geojson`
  );
  const route3 = await response3.json();

  routes.push(formatRoute(route1));
  routes.push(formatRoute(route2));
  routes.push(formatRoute(route3));

  return routes;
};

function formatRoute(route) {
  let coordsArray = route.features[0].geometry.coordinates;
  let tempRoute = {
    coords: [],
    time: 0,
    distance: 0,
    elevDist: [],
  };
  for (let i = 0; i < coordsArray.length; i++) {
    tempRoute.coords.push({
      latitude: coordsArray[i][1],
      longitude: coordsArray[i][0],
    });
  }
  let properties = route.features[0].properties;
  tempRoute.time = properties["total-time"];
  tempRoute.distance = properties["track-length"];
  //distance is given per segment not overall distance at that point...
  let currentDist = 0;
  for (let i = 1; i < properties.messages.length; i++) {
    //...so calcualte it here
    currentDist += parseInt(properties.messages[i][3]) / 1000;
    tempRoute.elevDist.push({
      x: currentDist,
      y: parseInt(properties.messages[i][2]),
    });
  }
  return tempRoute;
}
