import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object';
import { inject as service } from '@ember/service'

export default class BootstrapController extends Controller {
  @service('bootstrap-theme-service') themeService

  @tracked theme = {}

  init() {
    super.init(...arguments)

    this.themeService.loadTheme()

    if (this.themeService.theme) this.theme = {...this.themeService.theme}
  }

  @action
  submit(e) {
    e.preventDefault()

    this.themeService.setTheme(this.theme)
  }

  @action
  reset() {
    this.themeService.resetTheme()
    this.theme = {}
  }
}
