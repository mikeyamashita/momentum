export class Habit {
    name: string | undefined;
    datesCompleted: Array<string> = [];
    time?: Date;
    isComplete: boolean = false;
}