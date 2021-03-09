import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { QuestionDetailComponent } from './question-detail.component';

describe('Component Tests', () => {
  describe('Question Management Detail Component', () => {
    let comp: QuestionDetailComponent;
    let fixture: ComponentFixture<QuestionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [QuestionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ question: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(QuestionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(QuestionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load question on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.question).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
