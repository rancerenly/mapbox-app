import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import * as Mapboxgl from "mapbox-gl";
import {FormControl} from "@angular/forms";
import {FeatureCollection, IGeoJson} from "../models/map";
import {MapboxService} from "../services/mapbox.service";
import {MatSelectChange} from "@angular/material/select";
import {MapboxGeoJSONFeature} from "mapbox-gl";

@Component({
  selector: 'app-components',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss']
})
export class MapboxComponent implements OnInit {
  constructor(private mapboxService: MapboxService) {
  }
  map: any;
  source: any;
  filters = new  FormControl('');

  data: FeatureCollection;
  filterGroup: string[];
  selectedFeature: IGeoJson;

  readFile(event: any) {

  }

  setData(content: any) {

  }
  redrawMap(event: MatSelectChange) {
    this.source = this.map.getSource('accidents')
    const filters = event.value;
    if(filters.length > 0) {
      const features = this.data.features.filter(f => filters.includes(f.properties.type));
      const newData = new FeatureCollection(features);
      const [lng, lat] = features[features.length-1].geometry.coordinates;
      this.source.setData(newData);
      this.map.flyTo({center: [lng,lat], zoom: 12})
    }
    else {
      this.source.setData(this.data);
    }

  }
  ngOnInit() {
    this.map = new Mapboxgl.Map({
      accessToken: environment.mapboxKey,
      container: 'map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-103.5917, 40.6699],
      zoom: 3
    });

    this.map.on('load', () => {
// Add a new source from our GeoJSON data and
// set the 'cluster' option to true. GL-JS will
// add the point_count property to your source data.
      this.map.addSource('earthquakes', {
        type: 'geojson',
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
        data: 'https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'earthquakes',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'earthquakes',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 4,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

// inspect a cluster on click
      this.map.on('mousemove', 'clusters', (e:any) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        console.log(features);
        // @ts-ignore
        const clusterId = features[0].properties.cluster_id;
        // @ts-ignore
        this.map.getSource('earthquakes').getClusterExpansionZoom(
          clusterId,
          (err: any, zoom: any) => {
            if (err) return;



            this.map.easeTo({
              // @ts-ignore
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

// When a click event occurs on a feature in
// the unclustered-point layer, open a popup at
// the location of the feature, with
// description HTML from its properties.
      this.map.on('mousemove', 'unclustered-point', (e:any) => {
        // @ts-ignore
        console.log(e.features);
        const coordinates = e.features[0].geometry.coordinates.slice();
        // @ts-ignore
        const mag = e.features[0].properties.mag;
        // @ts-ignore
        // @ts-ignore
        const tsunami = e.features[0].properties.tsunami === 1 ? 'yes' : 'no';

// Ensure that if the map is zoomed out such that
// multiple copies of the feature are visible, the
// popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new Mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `magnitude: ${mag}<br>Was there a tsunami?: ${tsunami}`
          )
          .addTo(this.map);
      });

      this.map.on('mouseenter', 'clusters', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
  }

  /*ngOnInit(): void {
    const url =  'https://api.maptiler.com/data/758568b2-c865-483c-9ee9-4d6fb05d71e3/features.json?key=sqpCxX195GY0xafZ4q4o'
    this.mapboxService.getData().subscribe((resp: FeatureCollection) => {
      this.data = resp;
      const types = this.data.features.map(data => data.properties.type);
      this.filterGroup = Array.from(new Set(types));
    })

    this.map = new Mapboxgl.Map({
      accessToken: environment.mapboxKey,
      container: 'map', // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [48.363611, 57.894444], // starting position [lng, lat]
      zoom: 8,


    });
    this.map.on('load', () => {
      this.map.addSource('accidents', {
        type: 'geojson',
        data: 'https://api.maptiler.com/data/758568b2-c865-483c-9ee9-4d6fb05d71e3/features.json?key=sqpCxX195GY0xafZ4q4o',
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50
      });
      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'accidents',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'accidents',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });
      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: 'accidents',

        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 10,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
      });

      this.map.on('click', 'clusters', (e: any) => {
        const features = this.map.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        console.log(features);
        const clusterId = features[0].properties.cluster_id;
        this.map.getSource('accidents').getClusterExpansionZoom(
          clusterId,
          (err: any, zoom:any) => {
            if (err) return;

            this.map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom
            });
          }
        );
      });

      this.map.on('click', 'point', (e: any) => {

        const coordinates = e.features[0].geometry.coordinates.slice();
        const mag = e.features[0].properties;

        console.log(coordinates);
        console.log(mag);
        // Ensure that if the map is zoomed out such that
        // multiple copies of the feature are visible, the
        // popup appears over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new Mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(
            `magnitude: ${mag}<br>Was there a tsunami?`
          )
          .addTo(this.map);

      });
      this.map.on('mouseenter', 'clusters', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });
      this.map.on('mouseleave', 'clusters', () => {
        this.map.getCanvas().style.cursor = '';
      });




      })

      /!*

      *!/


  }*/
  public viewCard() {


  }
}
