import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoolFileLoaderComponent } from './pool-file-loader.component';

describe('PoolFileLoaderComponent', () => {
  let component: PoolFileLoaderComponent;
  let fixture: ComponentFixture<PoolFileLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoolFileLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoolFileLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
