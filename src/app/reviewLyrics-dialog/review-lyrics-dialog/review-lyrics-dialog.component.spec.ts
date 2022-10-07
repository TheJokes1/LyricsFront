import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewLyricsDialogComponent } from './review-lyrics-dialog.component';

describe('ReviewLyricsDialogComponent', () => {
  let component: ReviewLyricsDialogComponent;
  let fixture: ComponentFixture<ReviewLyricsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewLyricsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewLyricsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
