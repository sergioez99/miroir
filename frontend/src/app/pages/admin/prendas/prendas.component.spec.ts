import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasComponent } from './prendas.component';

describe('PrendasComponent', () => {
  let component: PrendasComponent;
  let fixture: ComponentFixture<PrendasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
