import { async, TestBed } from '@angular/core/testing';
import { DownloadModule } from './download.module';

describe('DownloadModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DownloadModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(DownloadModule).toBeDefined();
  });
});
