import {
  Component,
  Inject,
  NgZone,
  PLATFORM_ID,
  OnInit,
  ApplicationRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

// amCharts imports
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { AfterViewInit } from '@angular/core';
import { RequestService } from '../request.service';
import { Cases } from './cases.model';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements AfterViewInit, OnInit {
  data: any;
  time: string;
  country: string;
  clicked = false;

  globalCases: Cases = new Cases('0', '0', '0', '0', '0', '0', '0');
  countryCases: Cases = new Cases('0', '0', '0', '0', '0', '0', '0');

  constructor(
    @Inject(PLATFORM_ID) private platformId,
    private zone: NgZone,
    private requestSerice: RequestService,
    private appRef: ApplicationRef
  ) {}

  // Run the function only in the browser
  browserOnly(f: () => void): void {
    if (isPlatformBrowser(this.platformId)) {
      this.zone.runOutsideAngular(() => {
        f();
      });
    }
  }

  ngOnInit(): void {
    this.requestSerice
      .sendRequest('https://api.covid19api.com/summary')
      .subscribe((data: any) => {
        this.data = data;
        this.globalCases.totalDeath = this.formatNumber(
          this.data.Global.TotalDeaths
        );
        this.globalCases.totalRecovered = this.formatNumber(
          this.data.Global.TotalRecovered
        );
        this.globalCases.totalConfirmed = this.formatNumber(
          this.data.Global.TotalConfirmed
        );
        this.globalCases.newDeath = this.formatNumber(
          this.data.Global.NewDeaths
        );
        this.globalCases.newRecovered = this.formatNumber(
          this.data.Global.NewRecovered
        );
        this.globalCases.newConfirmed = this.formatNumber(
          this.data.Global.NewConfirmed
        );
        this.time = this.data.Date;
        this.globalCases.active = this.formatNumber(
          (
            this.data.Global.TotalConfirmed -
            this.data.Global.TotalRecovered -
            this.data.Global.TotalDeaths
          ).toString()
        );
      });
  }

  formatNumber(count: string): string {
    const nStr = count + '';
    const x = nStr.split('.');
    let x1 = x[0];
    const x2 = x.length > 1 ? '.' + x[1] : '';
    const rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
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
      chart.backgroundSeries.mapPolygons.template.polygon.fill = am4core.color(
        '#212327'
      );
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 1;

      worldSeries.exclude = ['AQ'];
      worldSeries.useGeodata = true;

      const polygonTemplate = worldSeries.mapPolygons.template;
      polygonTemplate.fill = am4core.color('#3b3b3b');
      polygonTemplate.stroke = am4core.color('#fe8626');
      polygonTemplate.nonScalingStroke = true;

      // Hover state
      const hs = polygonTemplate.states.create('hover');
      hs.properties.fill = am4core.color('#0f0f0f');

      worldSeries.mapPolygons.template.adapter.add(
        'tooltipText',
        (text, target: any): any => {
          let tooltip;
          this.data.Countries.forEach((element: any) => {
            if (element.Country.includes(target.dataItem.dataContext.name)) {
              const active = (
                parseInt(element.TotalConfirmed, 10) -
                parseInt(element.TotalDeaths, 10) -
                parseInt(element.TotalRecovered, 10)
              ).toString();
              tooltip =
                `[bold]` +
                element.Country +
                `[/]` +
                '\n\nActive cases: ' +
                this.formatNumber(active) +
                '\nNew Confirmed Cases: ' +
                element.NewConfirmed +
                '\nNew Deaths: ' +
                this.formatNumber(element.NewDeaths) +
                '\nNew Recovered: ' +
                this.formatNumber(element.NewRecovered) +
                '\nTotal Confirmed Cases: ' +
                this.formatNumber(element.TotalConfirmed) +
                '\nTotal Deaths: ' +
                this.formatNumber(element.TotalDeaths) +
                '\nTotal Recovered: ' +
                this.formatNumber(element.TotalRecovered);
              this.appRef.tick();
              return tooltip;
            }
          });
          return tooltip;
        }
      );

      // Set up click events
      polygonTemplate.events.on('hit', (ev: any) => {
        // console.log(ev);
        this.country = ev.target.dataItem.dataContext.name;
        this.data.Countries.forEach((element) => {
          if (element.Country.includes(this.country)) {
            this.clicked = true;
            this.countryCases.newConfirmed = this.formatNumber(
              element.NewConfirmed
            );
            this.countryCases.newDeath = this.formatNumber(element.NewDeaths);
            this.countryCases.newRecovered = this.formatNumber(
              element.NewRecovered
            );
            this.countryCases.totalConfirmed = this.formatNumber(
              element.TotalConfirmed
            );
            this.countryCases.totalDeath = this.formatNumber(
              element.TotalDeaths
            );
            this.countryCases.totalRecovered = this.formatNumber(
              element.TotalRecovered
            );
            this.countryCases.active = this.formatNumber(
              (
                element.TotalConfirmed -
                element.TotalDeaths -
                element.TotalRecovered
              ).toString()
            );
            this.appRef.tick();
          }
        });
      });

      // Zoom control
      chart.zoomControl = new am4maps.ZoomControl();

      const homeButton = new am4core.Button();
      homeButton.events.on('hit', () => {
        this.clicked = false;
        this.appRef.tick();
        chart.goHome();
        // worldSeries.show();
      });
      homeButton.icon = new am4core.Sprite();
      homeButton.padding(7, 5, 7, 5);
      homeButton.width = 30;
      homeButton.icon.path =
        'M16,8 L14,8 L14,16 L10,16 L10,10 L6,10 L6,16 L2,16 L2,8 L0,8 L8,0 L16,8 Z M16,8';
      homeButton.marginBottom = 10;
      homeButton.parent = chart.zoomControl;
      homeButton.insertBefore(chart.zoomControl.plusButton);
    });
  }
}
