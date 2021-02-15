import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CambiarpasswordComponent } from './cambiarpassword.component';

describe('CambiarpasswordComponent', () => {
  let component: CambiarpasswordComponent;
  let fixture: ComponentFixture<CambiarpasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CambiarpasswordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
