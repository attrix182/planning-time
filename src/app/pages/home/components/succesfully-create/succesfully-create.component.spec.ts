import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesfullyCreateComponent } from './succesfully-create.component';

describe('SuccesfullyCreateComponent', () => {
  let component: SuccesfullyCreateComponent;
  let fixture: ComponentFixture<SuccesfullyCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SuccesfullyCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccesfullyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
