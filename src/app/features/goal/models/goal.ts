import { Habit } from "./habit";
import { Milestone } from "./milestone";

export class Goal {
    name: string = "";
    description: string = "";
    habits: Array<Habit> = [];
    startdate?: Date;
    enddate?: Date;
    milestones: Array<Milestone> = [];
    isComplete: boolean = false;
}
