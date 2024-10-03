export class Habit {
    name: string | undefined;
    datesCompleted: Array<string> = [];
    isComplete: boolean = false;
    startdate?: Date;
    enddate?: Date;
}