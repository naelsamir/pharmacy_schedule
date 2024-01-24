import { DatePipe } from '@angular/common';
import { Component, OnInit, numberAttribute } from '@angular/core';
import { Observable } from 'rxjs';
import  {Pharmacist,MonthlySchedule,ScheduleDetails, Shift, DailySchedule}  from './Model/phatmacist';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit
 {
  title = 'pharmacy-schedule';
 constructor(private datePipe: DatePipe, private http:HttpClient){}
 weeDaysCount =0;
 maxNumberOfTotalShifts=0
 numberofDays=0

thecurrentMonth:any 
newPharmacists: Pharmacist[] = []
getPharmacistData(): Observable<Pharmacist[]> {
  return this.http.get<Pharmacist[]>("./assets/pharmacists.json");
}
AllPharmacistsWeekEnd:any[] =[]
AllPharmacistsWeekDay:any[] =[]
newCopyMalearr:any[] =[]
newCopyMalearrWeekDay:any[] =[]
dailySchedule:any[] =[]
monthName:string | undefined;


pickedElement: any;
  ngOnInit(): void {
            
   this.monthName =this.getMonthName(new Date()) 
    this.getPharmacistData().subscribe(res=>{
      this.newPharmacists =res;
      
      this.AllPharmacistsWeekEnd= this.newPharmacists.filter((p) => p.gender === 'male');
      this.AllPharmacistsWeekDay= this.newPharmacists.filter((p) => p.gender === 'male');
      this.AllPharmacistsWeekEnd =this.AllPharmacistsWeekEnd.sort((b, a) => this.getWeekendSaharNumber(b) - this.getWeekendSaharNumber(a));
      this.newCopyMalearr = [...this.AllPharmacistsWeekEnd];
      this.AllPharmacistsWeekDay = this.AllPharmacistsWeekDay.sort((b, a) => this.getTotalSaharNumber(b) - this.getTotalSaharNumber(a));

      this.newCopyMalearrWeekDay = [...this.AllPharmacistsWeekDay];
      this.dailySchedule =this.newGenerateMonthlySchedule(this.shifts)
    })
  
    this.weeDaysCount =  this.getWeekdaysInCurrentMonth();
  
  }

  getMonthName(date: Date): string {
  
    const formattedDate = this.datePipe.transform(date, 'MMMM');
    return formattedDate || 'Invalid Date';
  }

  getDateDifference(startDateStr: any, endDateStr: any): number {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    // Calculate the difference in milliseconds
    const differenceInMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to days
    const differenceInDays = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

    return differenceInDays;
  }
  
  getWeekdaysInCurrentMonth(): number {
    const today = new Date();
    this.thecurrentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Set the date to the first day of the month
    const firstDayOfMonth = new Date(currentYear, this.thecurrentMonth, 1);
   
    // Set the date to the last day of the month
    const lastDayOfMonth = new Date(currentYear, this.thecurrentMonth + 1, 0);
 
    this.numberofDays =lastDayOfMonth.getDate()
    let weekdaysCount = 0;

    // Iterate over each day in the month
    for (let currentDate = firstDayOfMonth; currentDate <= lastDayOfMonth; currentDate.setDate(currentDate.getDate() + 1)) {
      // Check if the current day is a weekday (Sunday to Thursday)
      if (currentDate.getDay() >= 0 && currentDate.getDay() <= 4) {
        weekdaysCount++;
      }
    }

    return weekdaysCount;
  }
  
 
  
   shifts: Shift[] = [
    { shift_id: 1, start_time: new Date('1970-01-01T09:00:00'), end_time: new Date('1970-01-01T12:00:00') },
    { shift_id: 2, start_time: new Date('1970-01-01T00:00:00'), end_time: new Date('1970-01-01T07:00:00') },
  ];

   isWeekday(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 0 && dayOfWeek <= 4; // Monday to Friday
  }
  
   isWeekend(date: Date): boolean {
    const dayOfWeek = date.getDay();
    return dayOfWeek === 5 || dayOfWeek === 6; // Sunday or Saturday
  }


  
// API to generate the Schedule
  newGenerateMonthlySchedule( shifts: Shift[]): any[] {
    const dailySchedule: DailySchedule[] = [];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear()
  
    const daysInMonth = this.numberofDays; // You may adjust based on the actual number of days in the month

  
    for (let day = 1; day <= daysInMonth; day++) {
      const dateShift1 = new Date(`${currentYear}-${currentMonth+1}-${day} ${shifts[0].start_time.getHours()}:${shifts[0].start_time.getMinutes()}`);
      const dateShift2 = new Date(`${currentYear}-${currentMonth+1}-${day} ${shifts[1].start_time.getHours()}:${shifts[1].start_time.getMinutes()}`);
     //this is the 5efara shift
      if(this.isWeekend(dateShift1)){
      
        const pickNextPh = this.pickNewPharmcistInweekEnd(dateShift1,null,currentMonth)
        let pickedElementsMale = pickNextPh();
    
        if( pickedElementsMale != undefined){
       
          pickedElementsMale.monthlySchedules[currentMonth].ScheduleDetails.weekendCountSahar+=1
          pickedElementsMale.monthlySchedules[currentMonth].ScheduleDetails.totalSaharNumber+=1
         
        }
        const pickNextPh2 = this.pickNewPharmcistInweekEnd(dateShift1,pickedElementsMale, currentMonth)
        let pickedElementsMale2 = pickNextPh2();
        if(pickedElementsMale2 != undefined){
          pickedElementsMale2.monthlySchedules[currentMonth].ScheduleDetails.weekendCountSahar+=1
          pickedElementsMale2.monthlySchedules[currentMonth].ScheduleDetails.totalSaharNumber+=1
        }
        const shift2Pharmacists :any= [pickedElementsMale, pickedElementsMale2];
        
        dailySchedule.push({ date: dateShift2, shift: shifts[1], pharmacists: shift2Pharmacists , month:dateShift2.getMonth()});

      }
       else{
         // if 5efara weekday
         const pickNextElementMale = this.pickNewPharmacistsWeekDay(dateShift1, null,currentMonth)
         let pickedElementsMale = pickNextElementMale();
         if(pickedElementsMale != undefined){
          pickedElementsMale.monthlySchedules[currentMonth].ScheduleDetails.weekDayCountSahar+=1
          pickedElementsMale.monthlySchedules[currentMonth].ScheduleDetails.totalSaharNumber+=1
        }
         const pickNextElementMale2 = this.pickNewPharmacistsWeekDay(dateShift1,pickedElementsMale,currentMonth)
         let pickedElementsMale2= pickNextElementMale2();
         if(pickedElementsMale2 != undefined){
          pickedElementsMale2.monthlySchedules[currentMonth].ScheduleDetails.weekDayCountSahar+=1
          pickedElementsMale2.monthlySchedules[currentMonth].ScheduleDetails.totalSaharNumber+=1
        }
         const shift2Pharmacists = [pickedElementsMale, pickedElementsMale2];
      
        
        
        dailySchedule.push({ date: dateShift2, shift: shifts[1], pharmacists: shift2Pharmacists , month:dateShift2.getMonth()});
       }
    }
   // this.pharmacistData(monthlySchedule);
    return dailySchedule;
  }
  

//Pick a pharmcist in weekend
pickNewPharmcistInweekEnd(shiftDate: any, previousPharmcaist:any, currentMonth:number) {

  const pickElement = (): any => {
    if (this.AllPharmacistsWeekEnd.length === 0) {
      // Stop the loop if the array is empty
    
      this.newCopyMalearr.sort((b, a) => this.getWeekendSaharNumber(b) - this.getWeekendSaharNumber(a));

      
      this.AllPharmacistsWeekEnd = [...this.newCopyMalearr];
     
    }
    if(this.AllPharmacistsWeekEnd.length > 0){
      let pickedElement = this.AllPharmacistsWeekEnd.shift();
  
    // const randomIndex = this.AllPharmacistsWeekEnd.length - 1;
    // let pickedElement = this.AllPharmacistsWeekEnd[randomIndex];

    
 // Remove the picked element from the copy
 //this.AllPharmacistsWeekEnd.splice(randomIndex, 1);
 if(previousPharmcaist && !previousPharmcaist?.isPharmacist && pickedElement && !pickedElement?.isPharmacist){
 
  
  let pharmacistArray =this.AllPharmacistsWeekEnd.filter(pharmcist=> pharmcist.isPharmacist)
  if(pharmacistArray?.length == 0){
    return pickElement();
  }
  // const pharmacistWithLeastSahar = pharmacistArray.reduce((minPharmacist, currentPharmacist) => {
  //   return currentPharmacist.totalSaharNumber < minPharmacist.totalSaharNumber ? currentPharmacist : minPharmacist;
  // }, pharmacistArray[0]); 
  const pharmacistWithLeastSahar = pharmacistArray.reduce((minPharmacist, currentPharmacist) => {
    const minTotalSaharNumber = this.getTotalSaharNumber(minPharmacist);
    const currentTotalSaharNumber = this.getTotalSaharNumber(currentPharmacist);
  
    return currentTotalSaharNumber < minTotalSaharNumber ? currentPharmacist : minPharmacist;
  }, pharmacistArray[0]);

  this.AllPharmacistsWeekEnd.unshift(pickedElement);
  pickedElement = pharmacistWithLeastSahar;
   this.AllPharmacistsWeekEnd = this.AllPharmacistsWeekEnd.filter(pharmacist => pharmacist !== pharmacistWithLeastSahar);
   
}
    if (pickedElement?.monthlySchedules) {
        // for (const monthlySchedule of pickedElement.monthlySchedules) {
      if(pickedElement?.monthlySchedules[currentMonth]){
        let monthlySchedule = pickedElement.monthlySchedules[currentMonth];
        if (monthlySchedule.ScheduleDetails) {
            const { date, inVacation, vacationStart, vacationEnd } = monthlySchedule.ScheduleDetails;
           
            if (inVacation) {
              const shiftDateFormatted: any = this.datePipe.transform(shiftDate, 'yyyy-MM-dd');
              const vacationStartFormatted: any = this.datePipe.transform(vacationStart, 'yyyy-MM-dd');
              const vacationEndFormatted: any = this.datePipe.transform(vacationEnd, 'yyyy-MM-dd');
              if (shiftDateFormatted >= vacationStartFormatted && shiftDateFormatted <= vacationEndFormatted) {
                // Pick another pharmacist by recursively calling pickElement
                return pickElement();
              }
            }
          }
        }
      }
    return pickedElement;
  };
  }
  // Return the pickElement function itself
  return pickElement;
}

//Pick a pharmcist in weekday
pickNewPharmacistsWeekDay(shiftDate:any,previousPharmcaist:any, currentMonth:number){
 
  const pickElement = (): any =>  {
    if (this.AllPharmacistsWeekDay.length === 0) {
    
      this.newCopyMalearrWeekDay = this.newCopyMalearrWeekDay.sort((b, a) => this.getTotalSaharNumber(b) - this.getTotalSaharNumber(a));

      // Stop the loop if the array is empty
      this.AllPharmacistsWeekDay = [...this.newCopyMalearrWeekDay]; 
      
  }
  
  if(this.AllPharmacistsWeekDay.length > 0){
   
    let pickedElement = this.AllPharmacistsWeekDay.shift();
    
    //check if both are technicians 
    //filter to the pharmacist array and get the least one with count sahar   
    if(previousPharmcaist && !previousPharmcaist?.isPharmacist && pickedElement && !pickedElement?.isPharmacist){
     
      let pharmacistArray =this.AllPharmacistsWeekDay.filter(pharmcist=> pharmcist.isPharmacist)
      if(pharmacistArray?.length == 0){
        
        return pickElement();
      }
      const pharmacistWithLeastSahar = pharmacistArray.reduce((minPharmacist, currentPharmacist) => {
        const minTotalSaharNumber = this.getTotalSaharNumber(minPharmacist);
        const currentTotalSaharNumber = this.getTotalSaharNumber(currentPharmacist);
      
        return currentTotalSaharNumber < minTotalSaharNumber ? currentPharmacist : minPharmacist;
      }, pharmacistArray[0]);
      
        this.AllPharmacistsWeekDay.unshift(pickedElement);
        pickedElement = pharmacistWithLeastSahar;
       this.AllPharmacistsWeekDay = this.AllPharmacistsWeekDay.filter(pharmacist => pharmacist !== pharmacistWithLeastSahar);
       
    }
   
    if (pickedElement?.monthlySchedules) {
      // for (const monthlySchedule of pickedElement.monthlySchedules) {
    if(pickedElement?.monthlySchedules[currentMonth]){
     
      let monthlySchedule = pickedElement.monthlySchedules[currentMonth];
      if (monthlySchedule.ScheduleDetails) {
          const { date, inVacation, vacationStart, vacationEnd } = monthlySchedule.ScheduleDetails;
         
          if (inVacation) {
            const shiftDateFormatted: any = this.datePipe.transform(shiftDate, 'yyyy-MM-dd');
            const vacationStartFormatted: any = this.datePipe.transform(vacationStart, 'yyyy-MM-dd');
            const vacationEndFormatted: any = this.datePipe.transform(vacationEnd, 'yyyy-MM-dd');
            if (shiftDateFormatted >= vacationStartFormatted && shiftDateFormatted <= vacationEndFormatted) {
              // Pick another pharmacist by recursively calling pickElement
              return pickElement();
            }
          }
        }
      }
    }
   
    return pickedElement;
  };
}
 

// Return the pickElement function itself
return pickElement;
}

sortPharmacistsByTotalSaharNumber(pharmacists: Pharmacist[]):any {
  this.newCopyMalearr.sort((a, b) => this.getTotalSaharNumber(b.ScheduleDetails) - this.getTotalSaharNumber(a.ScheduleDetails));
}

getWeekendSaharNumber(p: any): number {
 
  return p.monthlySchedules[this.thecurrentMonth].ScheduleDetails.weekendCountSahar || 0;
}
getTotalSaharNumber(p: any): number {
 
  return p.monthlySchedules[this.thecurrentMonth].ScheduleDetails.totalSaharNumber || 0;
}
  
}
