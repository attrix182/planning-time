import { TaskModel } from "./task.model";

export interface EventSesion{
  id: string;
  eventDate:string;
  eventTitle: string;
  eventTeam: string;
  team:string;
  active:boolean;
  selectedTask: TaskModel;
  resultsVisibility:boolean;
}
