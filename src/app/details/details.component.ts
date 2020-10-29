// amCharts imports
import am4geodata_worldLow from '@amcharts/amcharts4-geodata/worldLow';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4maps from '@amcharts/amcharts4/maps';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ApplicationRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

// other imports
import { Cases } from './cases.model';
import { TopCountries } from './topCountries.model';
import { RequestService } from '../request.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent implements AfterViewInit, OnInit {
  data: any;
  countries: any = [];
  time: string;
  country: string;
  clicked = false;
  activeFilter = 'death';

  globalCases: Cases = new Cases('0', '0', '0', '0', '0', '0', '0');
  countryCases: Cases = new Cases('0', '0', '0', '0', '0', '0', '0');
  topThreeCountries: TopCountries = new TopCountries('', '', '', '0', '0', '0');

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

  // set data retreived from API
  setGlobalData(): void {
    this.globalCases.totalDeath = this.formatNumber(
      this.data.Global.TotalDeaths
    );
    this.globalCases.totalRecovered = this.formatNumber(
      this.data.Global.TotalRecovered
    );
    this.globalCases.totalConfirmed = this.formatNumber(
      this.data.Global.TotalConfirmed
    );
    this.globalCases.newDeath = this.formatNumber(this.data.Global.NewDeaths);
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
  }

  setCountryData(element): any {
    this.countryCases.newConfirmed = this.formatNumber(element.NewConfirmed);
    this.countryCases.newDeath = this.formatNumber(element.NewDeaths);
    this.countryCases.newRecovered = this.formatNumber(element.NewRecovered);
    this.countryCases.totalConfirmed = this.formatNumber(
      element.TotalConfirmed
    );
    this.countryCases.totalDeath = this.formatNumber(element.TotalDeaths);
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
  }

  getTopThreeByTotalCase(): void {
    this.countries.sort(
      (a: any, b: any) => b.TotalConfirmed - a.TotalConfirmed
    );
    this.topThreeCountries.first = this.countries[0].Country;
    this.topThreeCountries.second = this.countries[1].Country;
    this.topThreeCountries.third = this.countries[2].Country;
    this.topThreeCountries.firstCases = this.formatNumber(
      this.countries[0].TotalConfirmed
    );
    this.topThreeCountries.secondCases = this.formatNumber(
      this.countries[1].TotalConfirmed
    );
    this.topThreeCountries.thirdCases = this.formatNumber(
      this.countries[2].TotalConfirmed
    );
  }

  getTopThreeByTotalDeaths(): void {
    this.countries.sort((a: any, b: any) => b.TotalDeaths - a.TotalDeaths);
    this.topThreeCountries.first = this.countries[0].Country;
    this.topThreeCountries.second = this.countries[1].Country;
    this.topThreeCountries.third = this.countries[2].Country;
    this.topThreeCountries.firstCases = this.formatNumber(
      this.countries[0].TotalDeaths
    );
    this.topThreeCountries.secondCases = this.formatNumber(
      this.countries[1].TotalDeaths
    );
    this.topThreeCountries.thirdCases = this.formatNumber(
      this.countries[2].TotalDeaths
    );
  }

  getTopThreeByTotalRecoveries(): void {
    this.countries.sort(
      (a: any, b: any) => b.TotalRecovered - a.TotalRecovered
    );
    this.topThreeCountries.first = this.countries[0].Country;
    this.topThreeCountries.second = this.countries[1].Country;
    this.topThreeCountries.third = this.countries[2].Country;
    this.topThreeCountries.firstCases = this.formatNumber(
      this.countries[0].TotalRecovered
    );
    this.topThreeCountries.secondCases = this.formatNumber(
      this.countries[1].TotalRecovered
    );
    this.topThreeCountries.thirdCases = this.formatNumber(
      this.countries[2].TotalRecovered
    );
  }

  getTopThreeByTotalActiveCase(): void {
    this.countries = this.countries.sort((a: any, b: any) => {
      const temp1 = b.TotalConfirmed - b.TotalRecovered - b.TotalDeaths;
      const temp2 = a.TotalConfirmed - a.TotalRecovered - a.TotalDeaths;
      return temp1 - temp2;
    });
    this.topThreeCountries.first = this.countries[0].Country;
    this.topThreeCountries.second = this.countries[1].Country;
    this.topThreeCountries.third = this.countries[2].Country;
    this.topThreeCountries.firstCases = this.formatNumber(
      (
        this.countries[0].TotalConfirmed -
        this.countries[0].TotalRecovered -
        this.countries[0].TotalDeaths
      ).toString()
    );

    this.topThreeCountries.secondCases = this.formatNumber(
      (
        this.countries[1].TotalConfirmed -
        this.countries[1].TotalRecovered -
        this.countries[1].TotalDeaths
      ).toString()
    );
    this.topThreeCountries.thirdCases = this.formatNumber(
      (
        this.countries[2].TotalConfirmed -
        this.countries[2].TotalRecovered -
        this.countries[2].TotalDeaths
      ).toString()
    );
  }

  // add commas to numbers; 123456 -> 123,456
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

  getColor(id): string {
    if (id === this.activeFilter) {
      return 'coral';
    }
    return 'transparent';
  }

  changeFilter(id: string): void {
    this.activeFilter = id;
    if (id === 'death') {
      this.getTopThreeByTotalDeaths();
    } else if (id === 'active') {
      this.getTopThreeByTotalActiveCase();
    } else if (id === 'recovery') {
      this.getTopThreeByTotalRecoveries();
    } else if (id === 'total') {
      this.getTopThreeByTotalCase();
    }
    this.appRef.tick();
  }

  hideCountryStatus(): void {
    this.clicked = false;
    this.appRef.tick();
  }

  //
  //
  //

  // get covid data
  ngOnInit(): any {
    this.requestSerice
      .sendRequest('https://api.covid19api.com/summary')
      .subscribe((data: any) => {
        this.data = data;
        this.countries = this.data.Countries;
        this.setGlobalData();
        this.getTopThreeByTotalDeaths();
      });
  }

  // create map
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
      chart.backgroundSeries.mapPolygons.template.polygon.fillOpacity = 0;
      worldSeries.tooltip.getFillFromObject = false;
      worldSeries.tooltip.background.fill = am4core.color('#274555');
      worldSeries.tooltip.background.opacity = 0.99;
      worldSeries.tooltip.background.stroke = am4core.color('#fcbe32');
      worldSeries.tooltip.background.strokeWidth = 2;

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
          let tooltip = target.dataItem.dataContext.name;
          let element;
          for (element of this.data.Countries) {
            if (element.Country.includes(target.dataItem.dataContext.name)) {
              const active = (
                parseInt(element.TotalConfirmed, 10) -
                parseInt(element.TotalDeaths, 10) -
                parseInt(element.TotalRecovered, 10)
              ).toString();
              tooltip =
                `[bold font-size: 20px]` +
                element.Country +
                `[/]` +
                '\n\nActive cases: ' +
                this.formatNumber(active) +
                '\n\nNew Confirmed Cases: ' +
                element.NewConfirmed +
                '\nNew Deaths: ' +
                this.formatNumber(element.NewDeaths) +
                '\nNew Recovered: ' +
                this.formatNumber(element.NewRecovered) +
                '\n\nTotal Confirmed Cases: ' +
                this.formatNumber(element.TotalConfirmed) +
                '\nTotal Deaths: ' +
                this.formatNumber(element.TotalDeaths) +
                '\nTotal Recovered: ' +
                this.formatNumber(element.TotalRecovered);
              this.appRef.tick();
              return tooltip;
            }
          }
          return tooltip;
        }
      );

      // Set up click events
      polygonTemplate.events.on('hit', (ev: any) => {
        let element;
        this.country = ev.target.dataItem.dataContext.name;
        for (element of this.data.Countries) {
          if (element.Country.includes(this.country)) {
            this.clicked = true;
            this.setCountryData(element);
            this.appRef.tick();
            break;
          }
        }
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
