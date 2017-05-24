import * as _ from 'lodash';

import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Frame } from './frame';

@Injectable()
export abstract class Controller<M, V> {

  // ========================================
  // private properties
  // ========================================

  private _modelSubject: BehaviorSubject<M>;

  private _viewSubject: BehaviorSubject<V>;

  private _model$: Observable<M>;

  private _view$: Observable<V>;

  private _model: M;

  private _view: V;

  private _frame: Frame;

  private _injector: Injector;

  // ========================================
  // public methods
  // ========================================

  /**
   * Model observable accessor.
   */
  public get model$(): Observable<M> { return this._model$; }

  /**
   * View observable accessor.
   */
  public get view$(): Observable<V> { return this._view$; }

  /**
   * Model accessor.
   */
  public get model(): M { return this._model; }

  /**
   * View accessor.
   */
  public get view(): V { return this._view; }

  /**
   * Frame accessor.
   */
  public get frame(): Frame { return this._frame; }

  /**
   * Model accessor.
   */
  public get injector(): Injector { return this._injector; }

  /**
   * Called after controller is initialized with model, view & frame from framing.
   */
  public onControllerInit(): void {}

  /**
   * Called when the controller's route starts resolving.
   */
  public onResolveStart(): void {}

  /**
   * Called when the controller's route end resolving.
   */
  public onResolveEnd(): void {}

  /**
   * Called when the controller's route resolve is cancelled.
   */
  public onResolveCancel(): void {}

  /**
   * Called by framing after construction to link the model, view & frame for this controller.
   */
  public initController(model: M, view: V, frame: Frame, injector: Injector): void {
    this._modelSubject = new BehaviorSubject<M>(model);
    this._viewSubject = new BehaviorSubject<V>(view);
    this._model$ = this._modelSubject.asObservable();
    this._view$ = this._viewSubject.asObservable();
    this._model = model;
    this._view = view;
    this._frame = frame;
    this._injector = injector;
    if (this._frame) {
      this._frame.resolveStart$.subscribe(() => { this.onResolveStart(); });
      this._frame.resolveEnd$.subscribe(() => { this.onResolveEnd(); });
      this._frame.resolveCancel$.subscribe(() => { this.onResolveCancel(); });
    }
    this.onControllerInit();
  }

  public updateModel(model: M, replace: boolean = false): void {
    if (replace) {
      this._model = model;
    } else {
      this._model = _.assign({}, this._model, model);
    }

    this._modelSubject.next(this._model);
  }

  public updateView(view: V, replace: boolean = false): void {
    if (replace) {
      this._view = view;
    } else {
      this._view = _.assign({}, this._view, view);
    }
    this._view = view;
    this._viewSubject.next(this._view);
  }
}
