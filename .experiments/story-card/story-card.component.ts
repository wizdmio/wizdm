import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatabaseService } from '@wizdm/connect/database';
import { Member, wmMember } from 'app/core/member';
import { Story, wmStory } from 'app/core/stories';


@Component({
  selector: 'wm-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent extends Story {

  constructor(db: DatabaseService, member: Member) { 
    super(db, member); 
  }

  @Input() set story(story: wmStory) {
    this.init(story);
  }

  @Output() open = new EventEmitter<string>();
}
