import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPhotoPage } from './chat-photo.page';

describe('ChatPhotoPage', () => {
  let component: ChatPhotoPage;
  let fixture: ComponentFixture<ChatPhotoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatPhotoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPhotoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
