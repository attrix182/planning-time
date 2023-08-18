import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TaskModel } from 'src/app/models/task.model';

@Component({
  selector: 'fc-tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.scss']
})
export class TasksModalComponent implements OnInit {
  convert = require('xml-js');
  taskXML: string = '';
  task: TaskModel;
  tasks: TaskModel[] = [];
  @Output('onClose') onClose: any = new EventEmitter<void>();
  @Output('onSelectTask') onSelectTask: any = new EventEmitter<TaskModel>();

  constructor() {}

  ngOnInit(): void {
    let tasksSaved = localStorage.getItem('tasks');
    if (tasksSaved != null) {
      this.tasks = JSON.parse(tasksSaved) || [];
    }
    console.log(tasksSaved);
  }

  importTask() {
    let task = `${this.taskXML}`;
    let converted = this.convert.xml2json(task, { compact: true, spaces: 4 });
    this.task = JSON.parse(converted).rss.channel.item;
    this.tasks.push(this.task);
    let tasksString = JSON.stringify(this.tasks);
    localStorage.setItem('tasks', tasksString);
    console.log(this.tasks);
  }

  selectTask(task: TaskModel) {
    this.onSelectTask.emit(task);
    this.onClose.emit();
  }

  addTask() {
    this.importTask();
  }

  deleteTask(task: TaskModel) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    let tasksString = JSON.stringify(this.tasks);
    localStorage.setItem('tasks', tasksString);
  }

  saveAndClose() {
    this.onClose.emit();
  }

  closeModal() {
    this.onClose.emit();
  }
}
