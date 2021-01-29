import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilLayoutComponent } from './perfil-layout.component';

describe('PerfilLayoutComponent', () => {
  let component: PerfilLayoutComponent;
  let fixture: ComponentFixture<PerfilLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
