import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsAnimeComponent } from './results-anime.component';

describe('ResultAnimeComponent', () => {
  let component: ResultsAnimeComponent;
  let fixture: ComponentFixture<ResultsAnimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsAnimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
