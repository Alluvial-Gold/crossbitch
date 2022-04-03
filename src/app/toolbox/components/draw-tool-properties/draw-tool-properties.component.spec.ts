import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawToolPropertiesComponent } from './draw-tool-properties.component';

describe('DrawToolPropertiesComponent', () => {
  let component: DrawToolPropertiesComponent;
  let fixture: ComponentFixture<DrawToolPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawToolPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawToolPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
