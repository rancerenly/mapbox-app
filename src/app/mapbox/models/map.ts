export interface IProperties {
  died: number;
  type: string;
  wounded: number;
}
export interface IGeometry {
  type: string;
  coordinates: number[];
}

export interface IGeoJson {
  type: string;
  geometry: IGeometry;
  id: string;
  properties: IProperties;
}

export class FeatureCollection {
  type = 'FeatureCollection'
  constructor(public features: Array<IGeoJson>) {}
}
