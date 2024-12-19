import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { TaskModel } from 'src/app/models/task.model';
import { AiService } from 'src/app/services/ai.service';
import { StorageService } from 'src/app/services/storage.service';
import * as marked from 'marked';
import * as convert from 'xml-js';
@Component({
  selector: 'fc-tasks-modal',
  templateUrl: './tasks-modal.component.html',
  styleUrls: ['./tasks-modal.component.scss']
})
export class TasksModalComponent implements OnInit {
  convert: any = convert;
  taskXML: string = '';
  task: TaskModel;
  tasks: any = []; //TaskModel[] = [];
  getId = this.router.url.split('/')[2].trim();
  selected: any = {};
  showDor = false;
  @Input() event: any = {};
  @Output('onClose') onClose: any = new EventEmitter<void>();
  @Output('onSelectTask') onSelectTask: any = new EventEmitter<TaskModel>();
  dor: string;
  loadingIA = false;
  iaResponse: any;
  showIAmodal = false;

  constructor(private storageSVC: StorageService, private router: Router, private AIservice: AiService) {}

  ngOnInit(): void {
    this.getTasks();
    this.getDor();
  }

  validateDOR(task: TaskModel, event: any) {
    event.stopPropagation();

    this.event.selectedTask = task;
    this.storageSVC.update(this.getId, 'events', this.event);
    this.onSelectTask.emit(task);
    
    this.getIA(task);
    console.log('validate task');
  }

  async getIA(task: TaskModel) {
    this.loadingIA = true;
    const prompt = `Evalúa si la tarea de JIRA cumple con el Definition of Ready (DOR), identificando:

    -Aspectos que cumplen con el DOR
    -Áreas que no cumplen
    -Sugerencias específicas de mejora
    
    Entrada:
    
    Tarea de JIRA: ${JSON.stringify(task)}
    Definition of Ready (DOR): ${this.dor}
    
    El análisis debe ser directo, enfocándose en los puntos críticos para preparar la tarea para su implementación.`;

    const result = await this.AIservice.model.generateContent(prompt);
    const response = await result.response;
    this.iaResponse = marked.parse(response.text());
    this.loadingIA = false;
    console.log(this.iaResponse);

      this.showIAmodal = true;
   
  }

  setDor(dor: any) {
    this.dor = dor;
  }

  toggleShowDor() {
    this.showDor = !this.showDor;
  }

  ngOnChanges(changes: SimpleChanges) {
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

    this.storageSVC.insertCustomID('tasks', this.getId, tasksDB);

    this.taskXML = '';
  }

  selectTask(task: TaskModel) {
    this.event.selectedTask = task;
    this.storageSVC.update(this.getId, 'events', this.event);
    this.onSelectTask.emit(task);
    this.onClose.emit();
  }

  unSelectTask() {
    this.event.selectedTask = null;
    this.storageSVC.update(this.getId, 'events', this.event);
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

    if (task.key._text == this.selected.key._text) this.unSelectTask();
    this.storageSVC.insertCustomID('tasks', this.getId, tasksDB);
  }

  getTasks() {
    console.log(this.getId);
    this.storageSVC.getByParameter('tasks', 'eventID', this.getId).subscribe((res: any) => {
      this.tasks = res[0] ? res[0].tasks : [];
      console.log(this.tasks);
    });
  }

  getDor() {
    this.storageSVC.getByParameter('dor', 'eventID', this.getId).subscribe((res: any) => {
      this.dor = res[0] ? res[0].dor : '';
      console.log(this.dor);
    });
  }

  saveAndClose() {
    console.log(this.dor);
    let dorDB = {
      eventID: this.getId,
      dor: this.dor
    };
    this.storageSVC.insertCustomID('dor', this.getId, dorDB);
    this.toggleShowDor();
  }

  closeModal() {
    this.onClose.emit();
  }
}
