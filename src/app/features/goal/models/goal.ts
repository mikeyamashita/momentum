import { Habit } from "./habit";

export class Goal {
    name: string | undefined;
    description: string | undefined;
    habits: Array<Habit> | undefined;
    isComplete: boolean = false;
}
