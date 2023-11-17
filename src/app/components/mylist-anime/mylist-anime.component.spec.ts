import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MylistAnimeComponent } from './mylist-anime.component';

describe('MylistAnimeComponent', () => {
  let component: MylistAnimeComponent;
  let fixture: ComponentFixture<MylistAnimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MylistAnimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MylistAnimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});