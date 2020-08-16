import Controller from '@ember/controller';
import { inject as service } from '@ember/service'

export default class BootstrapController extends Controller {
  @service('bootstrap-theme-service') themeService

  init() {
    super.init(...arguments)

    this.themeService.loadTheme()
  }
}
