export class ReservationDto
{
    id:number;
    startTime:Date;
    endTime:Date;
    title:string;
    email:string;
    isActive:number;
    isComplete:number;
    isCancelled:number;
    isMissed:number;
    gskUsersDTO:{
        id:number,
        email:string
        
    }
}