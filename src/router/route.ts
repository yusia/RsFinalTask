import ControllerInterface from "../interfaces/controller.interface";

export class Route {
  default: boolean | undefined = false;

  constructor(public name: string, public controller: ControllerInterface, defaultRoute?: boolean) {
    this.default = defaultRoute;
  }

  isActiveRoute(hashedPath: string) {
    return hashedPath === this.name;
  }
}
