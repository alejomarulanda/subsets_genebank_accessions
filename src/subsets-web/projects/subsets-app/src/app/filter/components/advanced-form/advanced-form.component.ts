import { Options } from '@angular-slider/ngx-slider';
import {
  Component,
  Input,
  OnInit,
  AfterContentInit,
  OnChanges,
} from '@angular/core';
import { SharedService } from '../../../core/service/shared.service';
import { IndicatorService } from '../../../indicator/service/indicator.service';

@Component({
  selector: 'advanced-form',
  templateUrl: './advanced-form.component.html',
  styleUrls: ['./advanced-form.component.scss'],
})
export class AdvancedFormComponent
  implements OnInit, AfterContentInit, OnChanges {
  // Observable with the indicators format
  @Input() indicators: any;
  @Input() formActive: boolean = true;
  listCropWithIndicators: any[];
  listCropAvailable: any[] = [];
  // Observable with the indicators period format
  @Input() cropList: any = [];
  @Input() indicatorPeriods: any;
  // Var to check all complete
  allComplete: boolean = false;
  // Passport params
  @Input() passportParms: any;
  // values list
  listValues: any[];
  pivotList: any[];
  @Input() rangesValues$: any;

  // period optios
  periodMinValue: number = 1983;
  periodMaxValue: number = 1983;
  checkedPeriods: boolean = false;
  periodOptions: Options = {
    floor: 1983,
    ceil: 2016,
    showTicksValues: true,
    tickStep: 1,
    tickValueStep: 30,
  };
  // Months options
  monthFirt: number;
  monthEnd: number;
  constructor(
    private _sharedService: SharedService,
    private api: IndicatorService
  ) {
    this.listValues = [];
    this.pivotList = [];
    this.monthFirt = 1;
    this.monthEnd = 12;
    this.listCropWithIndicators = [
      'Beans',
      'Cassava',
      'Banana',
      'Wheat',
      'Maize',
      'Potato',
      'Sweet potato',
      'Rice',
      'Barley',
      'Sorghum',
      'Pearl millet',
      'Cowpea',
      'Yam',
      'Soybean',
    ];
  }

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.formActive === true) {
      this.cropList.forEach((element: any) => {
        if (this.listCropWithIndicators.includes(element)) {
          this.listCropAvailable.push(element);
        }
      });
      this.indicators.forEach((element: any) => {
        element.checked = false;
        element.indicators.forEach((prop: any) => {
          prop.checked = false;
        });
      });
    }
  }

  ngAfterContentInit() {}

  setTabIndex(indx: number) {
    this._sharedService.setTabSelected(indx);
  }

  // Method to update the checked list
  updateAllComplete(obj: any, field: boolean) {
    // if (obj.category != "Other") {

    obj.checked =
      obj.indicators != null && obj.indicators.every((t: any) => t.checked);
    console.log(obj.checked);
    // }
    // else {

    // }
    this.checkTrueIndicators();
  }

  // Method to check if the users selected some indicators
  someComplete(obj: any): boolean {
    if (obj.indicators == null) {
      return false;
    }
    return (
      obj.indicators.filter((t: any) => t.checked).length > 0 && !obj.checked
    );
  }

  // Set all indicators by category
  setAll(completed: boolean, category: any, obj: any) {
    obj.checked = completed;
    if (category === 'Crop-specific indicators') {
      obj.indicators.forEach((t: any) => {
        if (this.listCropAvailable.includes(t.crop)) {
          t.checked = completed;
        }
      });
    } else {
      obj.indicators.forEach((t: any) => (t.checked = completed));
    }
    this.checkTrueIndicators();
  }

  checkTrueIndicators() {
    this.indicators.forEach((element: any) => {
      element.indicators.forEach((res: any) => {
        let indicatorSelected: any = this.listValues.filter(
          (prop: any) => prop.id == res.id
        );
        // console.log(indicatorSelected);
        if (res.checked == true) {
          if (indicatorSelected.length === 0) {
            this.pivotList.push(res.name);
            // console.log(this.pivotList);
            if (res.indicator_type == 'generic') {
              let minMax = this.rangesValues$.filter(
                (prop: any) => prop.indicator == res.name
              );
              this.listValues.push({
                minValue: minMax[0].min,
                highValue: minMax[0].max,
                type: res.indicator_type,
                indicator: res.name,
                crop: res.crop,
                pref: res.pref,
                id: res.id,
                floor: minMax[0].min,
                ceil: minMax[0].max,
              });
            } else if (res.indicator_type == 'specific') {
              console.log(res.name);
              this.listValues.push({
                minValue: 0,
                highValue: 30,
                type: res.indicator_type,
                indicator: res.name,
                crop: res.crop,
                pref: res.pref,
                id: res.id,
                floor: 0,
                ceil: 30,
              });
              console.log(this.listValues);
            } else {
              if (res.pref == 'BLDFIE') {
                this.listValues.push({
                  minValue: 146.6,
                  highValue: 1707.2,
                  type: res.indicator_type,
                  indicator: res.name,
                  crop: res.crop,
                  pref: res.pref,
                  id: res.id,
                  floor: 146.6,
                  ceil: 1707.2,
                });
              } else if (res.pref == 'CECSOL') {
                this.listValues.push({
                  minValue: 0,
                  highValue: 184.1272,
                  type: res.indicator_type,
                  indicator: res.name,
                  crop: res.crop,
                  pref: res.pref,
                  id: res.id,
                  floor: 0,
                  ceil: 184.1272,
                });
              } else if (res.pref == 'ORCDRC') {
                this.listValues.push({
                  minValue: 0,
                  highValue: 540.4708,
                  type: res.indicator_type,
                  indicator: res.name,
                  crop: res.crop,
                  pref: res.pref,
                  id: res.id,
                  floor: 0,
                  ceil: 540.4708,
                });
              } else if (res.pref == 'PHIHOX') {
                this.listValues.push({
                  minValue: 36.28,
                  highValue: 94.15,
                  type: res.indicator_type,
                  indicator: res.name,
                  crop: res.crop,
                  pref: res.pref,
                  id: res.id,
                  floor: 36.28,
                  ceil: 94.15,
                });
              }
            }
          }
        } else {
          if (indicatorSelected.length > 0) {
            // let indexPivotList = this.pivotList.indexOf(res.name);
            // let indexListValues = this.listValues.map(function(item) { return item.indicator; }).indexOf(res.name);
            // if (indexPivotList > -1) {
            console.log('Hello');
            // this.pivotList.splice(indexPivotList, 1);
            this.listValues = this.listValues.filter(
              (props: any) => props.id != res.id
            );
            // }
          }
        }
      });
    });
    console.log(this.listValues);
    console.log(this.indicators);
  }

  checksPeriods(check: boolean) {
    this.checkedPeriods = check;
  }

  filterIndicatorPeriodById(indicator: string, type: string): string {
    let indicatorPeriodSelected: any = [];
    let summaryPeriod: string = 'mean';
    if (this.checkedPeriods === false) {
      let indicatorPeriodFiltered = this.indicatorPeriods.filter(
        (res: any) => res.indicator == indicator && res.period == summaryPeriod
      );
      indicatorPeriodSelected.push(indicatorPeriodFiltered[0].id);
    } else {
      if (type == 'generic' || type == 'specific') {
        for (
          let index = this.periodMinValue;
          index <= this.periodMaxValue;
          index++
        ) {
          let indicatorsFind = this.indicatorPeriods.filter(
            (prop: any) =>
              prop.indicator == indicator && prop.period == index.toString()
          );
          indicatorsFind.forEach((element: any) => {
            if (!indicatorPeriodSelected.includes(element.id))
              indicatorPeriodSelected.push(element.id);
          });
        }
      } else {
        let indicatorsFind = this.indicatorPeriods.filter(
          (prop: any) =>
            prop.indicator == indicator && prop.period == summaryPeriod
        );
        indicatorsFind.forEach((element: any) => {
          if (!indicatorPeriodSelected.includes(element.id))
            indicatorPeriodSelected.push(element.id);
        });
      }
    }

    return indicatorPeriodSelected;
  }

  sendIndicatorsParameters(params: any) {
    this._sharedService.sendIndicators(params);
  }

  setIndicatorsList(indicator: any) {
    this._sharedService.sendIndicatorList(indicator);
  }

  getSubsetsOfAccession = () => {
    let obj: any = {};
    let request = {};
    let finalRequest: any = [];
    let periods = [this.periodMinValue, this.periodMaxValue];
    this.setIndicatorsList(this.listValues);
    this.listValues.forEach((props: any, index: any) => {
      obj = {
        name: props.indicator,
        indicator: this.filterIndicatorPeriodById(props.id, props.type),
      };
      for (let i = this.monthFirt; i <= this.monthEnd; i++) {
        obj['month' + i] = [props.minValue, props.highValue];
      }
      obj['type'] = props.type;
      obj['crop'] = props.crop;
      obj['period'] = periods;
      finalRequest.push(obj);
    });
    request = {
      data: finalRequest,
      passport: this.passportParms,
    };
    console.log(request);
    this.sendIndicatorsParameters(request);
    this.setTabIndex(1);
  };
}
