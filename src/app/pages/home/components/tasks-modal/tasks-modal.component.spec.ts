import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksModalComponent } from './tasks-modal.component';

describe('TasksModalComponent', () => {
  let component: TasksModalComponent;
  let fixture: ComponentFixture<TasksModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TasksModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
