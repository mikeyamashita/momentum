import { Habit } from "../../habits/models/habit";
import { Milestone } from "../../milestones/models/milestone";

export class Goal {
    name: string = "";
    description: string = "";
    habits: Array<Habit> = [];
    startdate?: Date;
    enddate?: Date;
    milestones: Array<Milestone> = [];
    isComplete: boolean = false;
}
