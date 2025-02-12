import { AfterContentInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SharedService } from '../../../core/service/shared.service';
import { IndicatorService } from '../../../indicator/service/indicator.service';
import * as d3 from 'd3';
declare var $: any;

@Component({
  selector: 'beginner-cluster-box-plot',
  templateUrl: './beginner-cluster-box-plot.component.html',
  styleUrls: ['./beginner-cluster-box-plot.component.scss']
})
export class BeginnerClusterBoxPlotComponent implements OnInit, AfterContentInit {
  quantile:any = [];
  @ViewChild('plots') private plots!: ElementRef;
  selectedIndicatorList$:any;
  indicatorSelected:any;
  cropSelected:any;
  cropList:any[];
  constructor(
    private api: IndicatorService,
    private _sharedService: SharedService,
    public chartElem: ElementRef,
    private renderer: Renderer2
  ) { 
    this.cropList = [];
  }

  ngOnInit(): void {
  }

  drawPlot() {
    this.clearDiv();
    this.plot(
      this.quantile,      
      this.indicatorSelected,
      this.cropSelected,
      this.plots,
      this.chartElem
    );
    window.addEventListener('resize', () =>
      this.plot(
        this.quantile,
        this.indicatorSelected,
        this.cropSelected,
        this.plots,
        this.chartElem
      )
    );
  }

  clearDiv() {
    let valueYouWantToPut = '';
    this.renderer.setProperty(
      this.plots.nativeElement,
      'innerHTML',
      valueYouWantToPut
    );
  }
  
  ngAfterContentInit() {
    this._sharedService.sendMultivariableBeginnerObservable.subscribe((res:any) => {
      this.quantile = res.quantile;
      // this.drawPlot();
    })
    this._sharedService.sendIndicatorsListObservable.subscribe((res:any) => {
      this.selectedIndicatorList$ = res;
    })

    this._sharedService.sendCropsListObservable.subscribe((res: any) => {
      this.cropList = res;
    });
    }

    getIndicatorNameByPref(pref:string):string {
      let indicatorFiltered = this.selectedIndicatorList$.filter((prop:any) => prop.pref == pref)
      return indicatorFiltered[0].name
    }

    plot(data: any[], indicator:string,crop:string,plots: any, svg: any) {
      //console.log(data);
      
      var months = [
        'jan',
        'feb',
        'mar',
        'apr',
        'may',
        'jun',
        'jul',
        'ago',
        'sep',
        'oct',
        'nov',
        'dec',
      ];
      let dataFiltered = data.filter((res: any) => res.indicator == indicator && res.crop == crop);
      dataFiltered.forEach((item, index) => {
        $(plots.nativeElement).append(
          '<div id="plot_' +
            index +
            '"><h3>' +
            this.getIndicatorNameByPref(item.indicator) +
            ' - ' +
            'Cluster ' + item.cluster +
            '</h3><div id="indicator_' +
            item.indicator +
            '_' +
            item.cluster +
            '"><svg></svg></div></div>'
        );
        // $('#period_' + item.period + "_" + item.indicator.replaceAll(" ","")).append("<svg></svg>");
        let plot_data = item.data.map(function (d: any, i: any) {
          var l = 0;
          let month = d.month.split('h')
          let obj = {label: month[1] -1, values: {Q1: d.Q1, Q2:d.Q2, Q3:d.Q3, whisker_low: d.whisker_low, whisker_high:d.whisker_high}}
          return obj
        });
        plot_data = plot_data.sort(
          (a: any, b: any) => a.label - b.label);
        console.log(plot_data)
        nv.addGraph(function() {
          var chart = nv.models.boxPlotChart()
          chart.xAxis.axisLabel('Month').tickFormat(function (d) {
            return months[d];
          });
              
    
             d3.select(svg.nativeElement)
            .select(
              '#indicator_' +
                item.indicator +
                '_' +
                item.cluster +
                ' svg'
            )
              .data([plot_data])
              .call(chart);
    
          nv.utils.windowResize(chart.update);
    
          return chart;
        });
      });
    }

}
