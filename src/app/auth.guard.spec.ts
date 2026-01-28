import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginService } from './features/login/components/login/login.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let router: jasmine.SpyObj<Router>;
  let loginService: jasmine.SpyObj<LoginService>;

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    loginService = jasmine.createSpyObj(
      'LoginService',
      [],
      { employeeId: '' }
    );

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: router },
        { provide: LoginService, useValue: loginService }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should redirect to login if employeeId is empty', () => {
    loginService.employeeId = '';

    const result = guard.canActivate();

    expect(result).toBeFalse();
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should allow navigation if employeeId exists', () => {
    loginService.employeeId = '123';

    const result = guard.canActivate();

    expect(result).toBeTrue();
  });
});
