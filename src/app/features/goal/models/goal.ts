import { Habit } from "./habit";
import { Milestone } from "./milestone";

export class Goal {
    name: string = "";
    description: string = "";
    habits: Array<Habit> | undefined;
    milestones: Array<Milestone> | undefined;
    isComplete: boolean = false;
}
