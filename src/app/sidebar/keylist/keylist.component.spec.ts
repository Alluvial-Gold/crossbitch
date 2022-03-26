import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeylistComponent } from './keylist.component';

describe('KeylistComponent', () => {
  let component: KeylistComponent;
  let fixture: ComponentFixture<KeylistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeylistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
