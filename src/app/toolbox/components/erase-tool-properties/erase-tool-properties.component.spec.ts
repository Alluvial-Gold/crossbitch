import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EraseToolPropertiesComponent } from './erase-tool-properties.component';

describe('EraseToolPropertiesComponent', () => {
  let component: EraseToolPropertiesComponent;
  let fixture: ComponentFixture<EraseToolPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EraseToolPropertiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EraseToolPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
