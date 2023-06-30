import { AppProperties } from "../app.properties";

export class CommonUtils {

    public static DATA_BASE_URL = "http://" + AppProperties.DATA_SERVER_IP + ":" + AppProperties.DATA_SERVER_PORT;
    public static WEB_BASE_URL = "http://" + AppProperties.WEB_SERVER_IP + ":" + AppProperties.WEB_SERVER_PORT;
    public static getFormattedDateStr(commonUtilsDate: Date): string {
        let dateStr =
            commonUtilsDate.getUTCFullYear() + "-" +
            commonUtilsDate.getUTCMonth() + "-" +
            commonUtilsDate.getUTCDate() + " " +
            commonUtilsDate.getUTCHours() + ":" +
            commonUtilsDate.getUTCMinutes() + ":" +
            commonUtilsDate.getUTCSeconds();
        return dateStr;
    }


    public static getDate(date: Date, hour: number, minute: number, second: number): Date {
        // new Date().toLocaleString("en-US", {timeZone: "America/New_York"})
        let formattedDate = new Date(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate(),
            hour, minute, second
        )

        return formattedDate;
    }
 public static getLocalDate(date:Date):Date
{
   let leapDate = new Date('2020-02-29T00:00:00')
   let dt = this.getDate(date, 10, 10, 10);
   dt.setDate(dt.getDate() + 1)
   dt.setMonth(dt.getMonth() + 1)
   if (date.getTime() >= leapDate.getTime())
       dt.setHours(dt.getHours() + 2)
   else
       dt.setHours(dt.getHours() + 1)


   return dt;
}    public static getDateStr(date: Date, hour: number, minute: number, second: number): string {
        let leapDate = new Date('2020-02-29T00:00:00')
        let dt = this.getDate(date, hour, minute, second);
        dt.setDate(dt.getDate() + 1)
        dt.setMonth(dt.getMonth() + 1)
        if (date.getTime() >= leapDate.getTime())
            dt.setHours(dt.getHours() + 2)
        else
            dt.setHours(dt.getHours() + 1)

        //  dt.setMinutes( dt.getMinutes() + dt.getTimezoneOffset() );

        //  console.log("Utils.getDateStr()==> date eu/paris="+dt.toLocaleString("fr-FR", {timeZone: "Europe/Paris"}))
        // console.log("=====LeapDate="+leapDate.getTime()) 
        // console.log("Utils.getDateStr()==> date eu/paris="+dt.toString())
        return this.getFormattedDateStr(dt);

    }
  public   static  getDateStrOnly(dt:Date):string
    {
      return dt.getUTCFullYear()+"-"+dt.getUTCMonth()+"-"+dt.getUTCDate();
    }
}

export class Logger {
    public static SHOW_INFO = true;
    public static SHOW_DEBUG = true;
    public static SHOW_ERROR = true;
    public static info(txt): void {
        if (this.SHOW_INFO)
            console.log(txt);
    }
    public static debug(txt): void {
        if (this.SHOW_DEBUG)
            console.log(txt);
    }
    public static error(txt): void {
        if (this.SHOW_ERROR)
            console.log(txt);
    }
}