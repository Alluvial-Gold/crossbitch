import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaletteEntryDialogComponent } from './add-palette-entry-dialog.component';

describe('AddPaletteEntryDialogComponent', () => {
  let component: AddPaletteEntryDialogComponent;
  let fixture: ComponentFixture<AddPaletteEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPaletteEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaletteEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
