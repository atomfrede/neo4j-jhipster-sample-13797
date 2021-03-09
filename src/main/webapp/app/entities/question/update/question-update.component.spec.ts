jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { QuestionService } from '../service/question.service';
import { IQuestion, Question } from '../question.model';
import { IExam } from 'app/entities/exam/exam.model';
import { ExamService } from 'app/entities/exam/service/exam.service';

import { QuestionUpdateComponent } from './question-update.component';

describe('Component Tests', () => {
  describe('Question Management Update Component', () => {
    let comp: QuestionUpdateComponent;
    let fixture: ComponentFixture<QuestionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let questionService: QuestionService;
    let examService: ExamService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [QuestionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(QuestionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(QuestionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      questionService = TestBed.inject(QuestionService);
      examService = TestBed.inject(ExamService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Exam query and add missing value', () => {
        const question: IQuestion = { id: 'CBA' };
        const exam: IExam = { id: 'Kiribati Cambridgeshire incremental' };
        question.exam = exam;

        const examCollection: IExam[] = [{ id: 'withdrawal Glen Plastic' }];
        spyOn(examService, 'query').and.returnValue(of(new HttpResponse({ body: examCollection })));
        const additionalExams = [exam];
        const expectedCollection: IExam[] = [...additionalExams, ...examCollection];
        spyOn(examService, 'addExamToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(examService.query).toHaveBeenCalled();
        expect(examService.addExamToCollectionIfMissing).toHaveBeenCalledWith(examCollection, ...additionalExams);
        expect(comp.examsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const question: IQuestion = { id: 'CBA' };
        const exam: IExam = { id: 'Granite Investment' };
        question.exam = exam;

        activatedRoute.data = of({ question });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(question));
        expect(comp.examsSharedCollection).toContain(exam);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = { id: 'ABC' };
        spyOn(questionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = new Question();
        spyOn(questionService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: question }));
        saveSubject.complete();

        // THEN
        expect(questionService.create).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const question = { id: 'ABC' };
        spyOn(questionService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ question });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(questionService.update).toHaveBeenCalledWith(question);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackExamById', () => {
        it('Should return tracked Exam primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackExamById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
