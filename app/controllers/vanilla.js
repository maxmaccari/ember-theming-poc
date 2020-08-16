import Controller from '@ember/controller';
import { inject as service } from '@ember/service'

export default class BasicController extends Controller {
  @service('theme-service') themeService

  init() {
    super.init(...arguments)

    this.themeService.loadTheme()
  }
}
