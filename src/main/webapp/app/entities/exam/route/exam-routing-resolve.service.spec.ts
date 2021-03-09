jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IExam, Exam } from '../exam.model';
import { ExamService } from '../service/exam.service';

import { ExamRoutingResolveService } from './exam-routing-resolve.service';

describe('Service Tests', () => {
  describe('Exam routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ExamRoutingResolveService;
    let service: ExamService;
    let resultExam: IExam | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ExamRoutingResolveService);
      service = TestBed.inject(ExamService);
      resultExam = undefined;
    });

    describe('resolve', () => {
      it('should return IExam returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExam = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultExam).toEqual({ id: 'ABC' });
      });

      it('should return new IExam if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExam = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultExam).toEqual(new Exam());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultExam = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultExam).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
