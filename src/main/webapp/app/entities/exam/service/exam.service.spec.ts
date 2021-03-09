import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IExam, Exam } from '../exam.model';

import { ExamService } from './exam.service';

describe('Service Tests', () => {
  describe('Exam Service', () => {
    let service: ExamService;
    let httpMock: HttpTestingController;
    let elemDefault: IExam;
    let expectedResult: IExam | IExam[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ExamService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        title: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Exam', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Exam()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Exam', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Exam', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Exam', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addExamToCollectionIfMissing', () => {
        it('should add a Exam to an empty array', () => {
          const exam: IExam = { id: 'ABC' };
          expectedResult = service.addExamToCollectionIfMissing([], exam);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exam);
        });

        it('should not add a Exam to an array that contains it', () => {
          const exam: IExam = { id: 'ABC' };
          const examCollection: IExam[] = [
            {
              ...exam,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addExamToCollectionIfMissing(examCollection, exam);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Exam to an array that doesn't contain it", () => {
          const exam: IExam = { id: 'ABC' };
          const examCollection: IExam[] = [{ id: 'CBA' }];
          expectedResult = service.addExamToCollectionIfMissing(examCollection, exam);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exam);
        });

        it('should add only unique Exam to an array', () => {
          const examArray: IExam[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Unit Ball Dynamic' }];
          const examCollection: IExam[] = [{ id: 'ABC' }];
          expectedResult = service.addExamToCollectionIfMissing(examCollection, ...examArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const exam: IExam = { id: 'ABC' };
          const exam2: IExam = { id: 'CBA' };
          expectedResult = service.addExamToCollectionIfMissing([], exam, exam2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(exam);
          expect(expectedResult).toContain(exam2);
        });

        it('should accept null and undefined values', () => {
          const exam: IExam = { id: 'ABC' };
          expectedResult = service.addExamToCollectionIfMissing([], null, exam, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(exam);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
