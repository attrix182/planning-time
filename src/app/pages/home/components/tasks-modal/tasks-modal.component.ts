import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/models/task.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'fc-tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.scss']
})
export class TasksModalComponent implements OnInit {
  convert = require('xml-js');
  taskXML: string = '';
  task: TaskModel;
  tasks: any = []; //TaskModel[] = [];
  getId = this.router.url.split('/')[2].trim();
  selected: any = {};
  @Input() event: any = {};
  @Output('onClose') onClose: any = new EventEmitter<void>();
  @Output('onSelectTask') onSelectTask: any = new EventEmitter<TaskModel>();

  constructor(private storageSVC: StorageService, private router: Router) {}

  ngOnInit(): void {
    this.getTasks();
  }

  ngOnChanges(changes: SimpleChanges){
    this.selected = this.event.selectedTask;
  }


  importTask() {
    let task = `${this.taskXML}`;
    let converted = this.convert.xml2json(task, { compact: true, spaces: 4 });
    this.task = JSON.parse(converted).rss.channel.item;
    this.tasks.push(this.task);

    let tasksDB = {
      eventID: this.getId,
      tasks: this.tasks
    };

    this.storageSVC.InsertCustomID('tasks', this.getId, tasksDB);

    console.log(this.tasks);
  }

  selectTask(task: TaskModel) {
    this.event.selectedTask = task;
    this.storageSVC.Update(this.getId, 'events', this.event);
    this.onSelectTask.emit(task);
    this.onClose.emit();
  }

  addTask() {
    this.importTask();
  }

  deleteTask(task: TaskModel) {
    this.tasks.splice(this.tasks.indexOf(task), 1);
    let tasksDB = {
      eventID: this.getId,
      tasks: this.tasks
    };

    this.storageSVC.InsertCustomID('tasks', this.getId, tasksDB);
  }

  getTasks() {
    console.log(this.getId);
    this.storageSVC.GetByParameter('tasks', 'eventID', this.getId).subscribe((res: any) => {
      this.tasks = res[0] ? res[0].tasks : [];
      console.log(this.tasks);
    });
  }

  saveAndClose() {
    this.onClose.emit();
  }

  closeModal() {
    this.onClose.emit();
  }
}
