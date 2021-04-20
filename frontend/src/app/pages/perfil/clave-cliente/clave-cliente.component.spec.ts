import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaveClienteComponent } from './clave-cliente.component';

describe('ClaveClienteComponent', () => {
  let component: ClaveClienteComponent;
  let fixture: ComponentFixture<ClaveClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaveClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaveClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
