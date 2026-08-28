export interface VodafoneStore {
  id: string;
  name: string;
  city: string;
  mapsUrl: string;
  position: { top: string; left: string };
}

export const vodafoneStores: VodafoneStore[] = [
  {
    id: "shkoder",
    name: "Vodafone Shkodër",
    city: "Shkodër",
    mapsUrl: "https://maps.app.goo.gl/wgqbD9Hd5WCAFumn9",
    position: { top: "15%", left: "25%" },
  },
  {
    id: "shengjin",
    name: "Vodafone Shengjin",
    city: "Shengjin",
    mapsUrl: "https://maps.app.goo.gl/DUguf5M4MMTb7qedA",
    position: { top: "30%", left: "26%" },
  },
  {
    id: "tirana",
    name: "Vodafone Tiranë",
    city: "Tiranë",
    mapsUrl: "https://maps.app.goo.gl/DEG82CAAPX85NQJP8",
    position: { top: "44%", left: "40%" },
  },
  {
    id: "durres",
    name: "Vodafone Durrës",
    city: "Durrës",
    mapsUrl: "https://maps.app.goo.gl/exdnT4J4dRJoFmcJ9",
    position: { top: "42%", left: "21%" },
  },
  {
    id: "vlore",
    name: "Vodafone Vlorë",
    city: "Vlorë",
    mapsUrl: "https://maps.app.goo.gl/5tRjV2WFSuan69gx8",
    position: { top: "71%", left: "24%" },
  },
  {
    id: "sarande",
    name: "Vodafone Sarandë",
    city: "Sarandë",
    mapsUrl: "https://maps.app.goo.gl/rzHPQSJza9XAX2nr9",
    position: { top: "89%", left: "42%" },
  },
];