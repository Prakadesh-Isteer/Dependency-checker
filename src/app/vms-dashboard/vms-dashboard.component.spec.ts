import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VmsDashboardComponent } from './vms-dashboard.component';

describe('VmsDashboardComponent', () => {
  let component: VmsDashboardComponent;
  let fixture: ComponentFixture<VmsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VmsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VmsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
