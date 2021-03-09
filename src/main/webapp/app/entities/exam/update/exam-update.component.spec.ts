jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ExamService } from '../service/exam.service';
import { IExam, Exam } from '../exam.model';

import { ExamUpdateComponent } from './exam-update.component';

describe('Component Tests', () => {
  describe('Exam Management Update Component', () => {
    let comp: ExamUpdateComponent;
    let fixture: ComponentFixture<ExamUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let examService: ExamService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExamUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ExamUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExamUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      examService = TestBed.inject(ExamService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const exam: IExam = { id: 'CBA' };

        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(exam));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = { id: 'ABC' };
        spyOn(examService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exam }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(examService.update).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = new Exam();
        spyOn(examService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: exam }));
        saveSubject.complete();

        // THEN
        expect(examService.create).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const exam = { id: 'ABC' };
        spyOn(examService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ exam });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(examService.update).toHaveBeenCalledWith(exam);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
