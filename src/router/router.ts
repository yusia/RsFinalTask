import ControllerInterface from '../interfaces/controller.interface';
import { Route } from './route';

export class Router {
  constructor(private routes: Route[]) {
    this.addStateListener();
  }

  init() {
    this.routeChanged();

  }

  getRouteInstance(path: string): ControllerInterface | undefined {
    return this.routes.filter((r) => r.isActiveRoute(this.getRootRoute(path)))[0]?.controller;
  }

  getDefaultRouteInstance(): ControllerInterface {
    return this.routes.filter(r => r.default)[0].controller;
  }

  addStateListener() {
    window.addEventListener('stateChange', () => {
      this.routeChanged();
    });
  }

  routeChanged(): void {
    const defaultInstance = this.getDefaultRouteInstance();
    const path = window.location.pathname.slice(1);
    const routeInstance = this.getRouteInstance(path) ?? defaultInstance;
    this.goToRoute(routeInstance);
  }

  goToRoute(controller: ControllerInterface) {
    const params = this.getParams();
    controller.initView(params);
  }

  getParams() {
    const urlParamsPart = window.location.href.split('?')[1];
    const params = urlParamsPart ? new URLSearchParams(`?${window.location.href.split('?')[1]}`) : undefined;
    return params;
  }

  getRootRoute(path: string): string {
    const parts = path.split('/');
    const routeIndex = 0;
    return parts.length > 0 ? parts[routeIndex] : '';
  }
}
