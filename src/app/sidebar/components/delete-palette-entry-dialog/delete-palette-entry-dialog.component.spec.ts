import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaletteEntryDialogComponent } from './delete-palette-entry-dialog.component';

describe('DeletePaletteEntryDialogComponent', () => {
  let component: DeletePaletteEntryDialogComponent;
  let fixture: ComponentFixture<DeletePaletteEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePaletteEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePaletteEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
