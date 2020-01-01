import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicForm } from './topic-form.component';

describe('TopicForm', () => {
  let component: TopicForm;
  let fixture: ComponentFixture<TopicForm>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopicForm ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopicForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
