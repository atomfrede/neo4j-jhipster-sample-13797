import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ExamService } from '../service/exam.service';

import { ExamComponent } from './exam.component';

describe('Component Tests', () => {
  describe('Exam Management Component', () => {
    let comp: ExamComponent;
    let fixture: ComponentFixture<ExamComponent>;
    let service: ExamService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ExamComponent],
      })
        .overrideTemplate(ExamComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ExamComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ExamService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.exams?.[0]).toEqual(jasmine.objectContaining({ id: 'ABC' }));
    });
  });
});
