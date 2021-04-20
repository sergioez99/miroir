import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroClienteComponent } from './cuadro-cliente.component';

describe('CuadroClienteComponent', () => {
  let component: CuadroClienteComponent;
  let fixture: ComponentFixture<CuadroClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadroClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadroClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
