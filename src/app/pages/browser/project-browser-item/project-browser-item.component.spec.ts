import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectBrowserItemComponent } from './project-browser-item.component';

describe('ProjectBrowserItemComponent', () => {
  let component: ProjectBrowserItemComponent;
  let fixture: ComponentFixture<ProjectBrowserItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectBrowserItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectBrowserItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
