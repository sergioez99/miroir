import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificadoComponent } from './verificado.component';

describe('VerificadoComponent', () => {
  let component: VerificadoComponent;
  let fixture: ComponentFixture<VerificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
