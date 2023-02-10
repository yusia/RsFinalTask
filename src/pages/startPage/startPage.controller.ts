import ControllerInterface from '../../interfaces/controller.interface';
import {StartPageView} from './startPage.view';
import{UserModel} from '../../models/user.model';

export  class StartPageController implements ControllerInterface {
  constructor(private viewInstance: StartPageView) {
  }

  initView(): void {
    const tempUser= new UserModel("yulia",'');
    this.viewInstance.render({user:tempUser});
  }

}