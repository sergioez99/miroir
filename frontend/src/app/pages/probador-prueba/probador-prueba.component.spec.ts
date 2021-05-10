import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProbadorPruebaComponent } from './probador-prueba.component';

describe('ProbadorPruebaComponent', () => {
  let component: ProbadorPruebaComponent;
  let fixture: ComponentFixture<ProbadorPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProbadorPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProbadorPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
