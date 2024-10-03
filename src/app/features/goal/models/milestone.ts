export class Milestone {
    name: string | undefined;
    datesCompleted: Array<string> | undefined;
    startdate?: Date;
    enddate?: Date;
    isComplete: boolean = false;
}