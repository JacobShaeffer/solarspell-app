import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewToSpellComponent } from './new-to-spell.component';

describe('AboutComponent', () => {
  let component: NewToSpellComponent;
  let fixture: ComponentFixture<NewToSpellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewToSpellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewToSpellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
