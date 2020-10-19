import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AfterViewInit } from '@angular/core';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements AfterViewInit, OnInit {
  data;
  time;
  globalTotalDeath: any;
  globalTotalRecovered: any;
  globalTotalConfirmed: any;
  globalNewDeath: any;
  globalNewRecovered: any;
  globalNewConfirmed: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private requestSerice: RequestService
  ) {}
  // Run the function only in the browser
  browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  // NewConfirmed: 229184
  // NewDeaths: 2766
  // NewRecovered: 132631
  // TotalConfirmed: 39893212
  // TotalDeaths: 1112523
  // TotalRecovered: 27415352

  ngOnInit(): void {
    this.requestSerice
      .sendRequest('https://api.covid19api.com/summary')
      .subscribe((data: any) => {
        this.data = data;
        console.log('====================================');
        console.log(this.data);
        console.log('====================================');
        this.globalTotalDeath = this.data.Global.TotalDeaths;
        this.globalTotalRecovered = this.data.Global.TotalRecovered;
        this.globalTotalConfirmed = this.data.Global.TotalConfirmed;
        this.globalNewDeath = this.data.Global.NewDeaths;
        this.globalNewRecovered = this.data.Global.NewRecovered;
        this.globalNewConfirmed = this.data.Global.NewConfirmed;
        this.time = this.data.Date;
      });
  }

  ngAfterViewInit(): void {
    // Chart code goes in here
    this.browserOnly(() => {
      am4core.useTheme(am4themes_animated);

      // Create map instance
      const chart = am4core.create('chartdiv', am4maps.MapChart);

      // Set map definition
      chart.geodata = am4geodata_worldLow;

      // Set projection
      chart.projection = new am4maps.projections.Miller();

      // Series for World map
      const worldSeries = chart.series.push(new am4maps.MapPolygonSeries());
      worldSeries.tooltip.label.fill = am4core.color('#FFFFF');
      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
        '#e6f7ff'
      );
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

      // worldSeries.data = JSON.parse(JSON.stringify(this.data.Countries));
      // console.log(worldSeries);

      worldSeries.exclude = ['AQ'];
      worldSeries.useGeodata = true;

      const polygonTemplate = worldSeries.mapPolygons.template;
      // polygonTemplate.tooltipText = '{name}';
      // polygonTemplate.fill = chart.colors.getIndex(5);
      polygonTemplate.fill = am4core.color('#929292');
      polygonTemplate.nonScalingStroke = true;

      // Hover state
      const hs = polygonTemplate.states.create('hover');
      hs.properties.fill = am4core.color('#FFFFF');

      worldSeries.mapPolygons.template.adapter.add(
        'tooltipText',
        (text, target: any): any => {
          const countries: any = target.series.data;
          let tooltip;

          // Country: "Albania"
          // CountryCode: "AL"
          // Date: "2020-10-17T04:59:50Z"
          // NewConfirmed: 289
          // NewDeaths: 4
          // NewRecovered: 93
          // Premium: {}
          // Slug: "albania"
          // TotalConfirmed: 16501
          // TotalDeaths: 443
          // TotalRecovered: 9957
          // __proto__: Object

          this.data.Countries.forEach((element) => {
            if (element.Country.includes(target.dataItem.dataContext.name)) {
              // console.log('====================================');
              // console.log(element);
              // console.log('====================================');
              tooltip =
                element.Country +
                '\nNew Confirmed Cases: ' +
                element.NewConfirmed +
                '\nNew Deaths: ' +
                element.NewDeaths +
                '\nNew Recovered: ' +
                element.NewRecovered +
                '\nTotal Confirmed Cases: ' +
                element.TotalConfirmed +
                '\nTotal Deaths: ' +
                element.TotalDeaths +
                '\nTotal Recovered: ' +
                element.TotalRecovered;
            }
          });

          return tooltip;
        }
      );

      // Set up click events
      worldSeries.events.on('hit', (ev: any) => {
        // const countries: any = ev.target.data;
        // console.log('====================================');
        // console.log(ev.target.dataItem.dataContext);
        // console.log('====================================');
        // console.log(ev);
      });
    });
  }
}
