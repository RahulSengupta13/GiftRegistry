import { TestBed, inject } from '@angular/core/testing';

import { UserRegistryService } from './user-registry.service';

describe('UserRegistryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserRegistryService]
    });
  });

  it('should be created', inject([UserRegistryService], (service: UserRegistryService) => {
    expect(service).toBeTruthy();
  }));
});
