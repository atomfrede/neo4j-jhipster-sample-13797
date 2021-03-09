jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IQuestion, Question } from '../question.model';
import { QuestionService } from '../service/question.service';

import { QuestionRoutingResolveService } from './question-routing-resolve.service';

describe('Service Tests', () => {
  describe('Question routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: QuestionRoutingResolveService;
    let service: QuestionService;
    let resultQuestion: IQuestion | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(QuestionRoutingResolveService);
      service = TestBed.inject(QuestionService);
      resultQuestion = undefined;
    });

    describe('resolve', () => {
      it('should return IQuestion returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultQuestion).toEqual({ id: 'ABC' });
      });

      it('should return new IQuestion if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestion = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultQuestion).toEqual(new Question());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultQuestion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultQuestion).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
