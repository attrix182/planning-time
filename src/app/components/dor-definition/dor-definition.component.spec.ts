import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DorDefinitionComponent } from './dor-definition.component';

describe('DorDefinitionComponent', () => {
  let component: DorDefinitionComponent;
  let fixture: ComponentFixture<DorDefinitionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DorDefinitionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DorDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
