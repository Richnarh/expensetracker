export class JsUtils{
    
    static daysFrom2Day = (days:number) =>{
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + days);
        return newDate;
    }

    static daysBeforeToday = (days:number) =>{
        const newDate = new Date();
        newDate.setDate(newDate.getDate() - days);
        return newDate;
    }

    static toCaps(str:string) {
        str = str.toLowerCase().replaceAll("_", " ");
        var splitStr = str.toLowerCase().split(' ');
        for (var i = 0; i < splitStr.length; i++) {
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        return splitStr.join(' '); 
     }
     
    static capsFirst(str:string){
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

  static formatDate(date:Date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }
}