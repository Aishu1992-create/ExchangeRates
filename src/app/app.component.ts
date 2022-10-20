import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { MenuItem, PrimeIcons } from 'primeng/api';
import * as moment from 'moment'
import {PaginatorModule} from 'primeng/paginator';





interface ExchangeRate {
  symbolwaluty?: string;
  waluta?: string;
  kurswaluty?: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  title = 'ExchangeRates';
  exchangedataTable: any = [];
  exchangeCodes: any = [];
  exchangeCurrency: ExchangeRate[] = [];
  tableData: any[] = [];
  cols: any[] = [];
  date: Date;
  minDate: Date;
  maxDate: Date;
  es: any;
  invalidDates: Array<Date>
  isDataError :boolean=true
  errorMessage : any=[];

  constructor(private http: HttpClient) {
   
  }
 

  ngOnInit(): void  {
    
    this.cols = [
      { field: "symbolwaluty", header: "Symbol waluty" },
      { field: "waluta", header: "Waluta" },
      { field: "kurswaluty", header: "Kurs waluty" },
    ];

    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
      dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      monthNamesShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      today: 'Hoy',
      clear: 'Borrar'
    }

    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();
    let prevMonth = (month === 0) ? 11 : month - 1;
    let prevYear = (prevMonth === 11) ? year - 1 : year;
    let nextMonth = (month === 11) ? 0 : month + 1;
    let nextYear = (nextMonth === 0) ? year + 1 : year;
    this.minDate = new Date();
    this.minDate.setMonth(prevMonth);
    this.minDate.setFullYear(prevYear);
    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    this.maxDate.setFullYear(nextYear);
    let invalidDate = new Date();
    invalidDate.setDate(today.getDate() - 1);
    this.invalidDates = [today, invalidDate];
    this.http.get('https://api.nbp.pl/api/exchangerates/tables/A/?format=json').subscribe((data: any) => {
      this.exchangedataTable = data;
      this.exchangedataTable.forEach((element: any) => {
        this.exchangeCurrency = element.rates
      });
      console.log("data", this.exchangeCurrency);

    });
    
  }

  selectDate(event: any) {
    console.log("data", event)
    const today = new Date();    
    var d= moment(event).format('YYYY-MM-DD')
    console.log("D",d)   
    this.http.get("http://api.nbp.pl/api/exchangerates/tables/A/" + d + "/?format=json").subscribe((data: any) => {
      console.log("Data",data)
      this.isDataError=true;
    },
    error => {
      console.log('error',error);
      if(error){
        this.isDataError=false;
        this.errorMessage= error.status+  ' '  + error.statusText
      }
      
    });

  }


}



