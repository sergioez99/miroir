import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuadroUsuarioComponent } from './cuadro-usuario.component';

describe('CuadroUsuarioComponent', () => {
  let component: CuadroUsuarioComponent;
  let fixture: ComponentFixture<CuadroUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuadroUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuadroUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
