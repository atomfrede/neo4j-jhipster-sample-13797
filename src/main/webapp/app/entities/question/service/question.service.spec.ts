import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IQuestion, Question } from '../question.model';

import { QuestionService } from './question.service';

describe('Service Tests', () => {
  describe('Question Service', () => {
    let service: QuestionService;
    let httpMock: HttpTestingController;
    let elemDefault: IQuestion;
    let expectedResult: IQuestion | IQuestion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(QuestionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        content: 'AAAAAAA',
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

      it('should create a Question', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Question()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Question', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            content: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Question', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            content: 'BBBBBB',
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

      it('should delete a Question', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addQuestionToCollectionIfMissing', () => {
        it('should add a Question to an empty array', () => {
          const question: IQuestion = { id: 'ABC' };
          expectedResult = service.addQuestionToCollectionIfMissing([], question);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(question);
        });

        it('should not add a Question to an array that contains it', () => {
          const question: IQuestion = { id: 'ABC' };
          const questionCollection: IQuestion[] = [
            {
              ...question,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, question);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Question to an array that doesn't contain it", () => {
          const question: IQuestion = { id: 'ABC' };
          const questionCollection: IQuestion[] = [{ id: 'CBA' }];
          expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, question);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(question);
        });

        it('should add only unique Question to an array', () => {
          const questionArray: IQuestion[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'Brand' }];
          const questionCollection: IQuestion[] = [{ id: 'ABC' }];
          expectedResult = service.addQuestionToCollectionIfMissing(questionCollection, ...questionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const question: IQuestion = { id: 'ABC' };
          const question2: IQuestion = { id: 'CBA' };
          expectedResult = service.addQuestionToCollectionIfMissing([], question, question2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(question);
          expect(expectedResult).toContain(question2);
        });

        it('should accept null and undefined values', () => {
          const question: IQuestion = { id: 'ABC' };
          expectedResult = service.addQuestionToCollectionIfMissing([], null, question, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(question);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
