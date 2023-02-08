import ControllerInterface from '../../interfaces/controller.interface';
import {StartPageView} from './startPage.view';

export  class StartPageController implements ControllerInterface {
  constructor(private viewInstance: StartPageView) {
  }

  initView(): void {
    this.viewInstance.render();
  }

}