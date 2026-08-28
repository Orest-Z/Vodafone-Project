// Builds the "View on Google Maps" link for a store. This is the ONLY
// thing lat/lng is used for — pin placement on the hero shape comes from
// each store's own `position` field in vodafoneStores.ts instead, since
// the hero SVG is drawn at an artistic angle rather than a true north-up
// map projection, and no lat/lng formula will line up with it.
export function googleMapsUrl(store: { lat: number; lng: number; placeId?: string }) {
  // A placeId gives an exact, unambiguous Maps listing (with photos, hours,
  // reviews). Falling back to raw coordinates still works fine, it's just
  // a plain pin rather than the actual place card.
  if (store.placeId) {
    return `https://www.google.com/maps/place/?q=place_id:${store.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${store.lat},${store.lng}`;
}