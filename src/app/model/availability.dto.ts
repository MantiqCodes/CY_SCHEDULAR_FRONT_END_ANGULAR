export class AvailabilityDto {
public id: number;
public endTime: Date;
public startTime: Date;
public isActive: number;
public gskUsersDTO: {
        id: number,
        email:string

    }

}