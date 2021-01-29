import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrendasAdminComponent } from './prendas-admin.component';

describe('PrendasAdminComponent', () => {
  let component: PrendasAdminComponent;
  let fixture: ComponentFixture<PrendasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrendasAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrendasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
