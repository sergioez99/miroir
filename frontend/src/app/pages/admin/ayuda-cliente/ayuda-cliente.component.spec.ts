import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudaClienteComponent } from './ayuda-cliente.component';

describe('AyudaClienteComponent', () => {
  let component: AyudaClienteComponent;
  let fixture: ComponentFixture<AyudaClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AyudaClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AyudaClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
