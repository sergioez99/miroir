import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Probador01Component } from './probador01.component';

describe('Probador01Component', () => {
  let component: Probador01Component;
  let fixture: ComponentFixture<Probador01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Probador01Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Probador01Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
