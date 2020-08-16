import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking'
import { action } from '@ember/object';
import { inject as service } from '@ember/service'

export default class BasicController extends Controller {
  @service('theme-service') themeService

  @tracked primaryColor
  @tracked secondaryColor
  @tracked fontSize
  @tracked spacing

  init() {
    super.init(...arguments)

    this.themeService.loadTheme()

    if (!this.themeService.theme) return

    if (this.themeService.theme.primaryColor) this.primaryColor = this.themeService.theme.primary
    if (this.themeService.theme.secondaryColor) this.spacing = this.themeService.theme.secondary
    if (this.themeService.theme.fontSize) this.spacing = this.themeService.theme.baseFontSize
    if (this.themeService.theme.spacing) this.spacing = this.themeService.theme.spacing
  }

  @action
  submit(e) {
    e.preventDefault()

    const theme = {}

    if (this.primaryColor) theme.primary = this.primaryColor
    if (this.secondaryColor) theme.secondary = this.secondaryColor
    if (this.fontSize) theme.baseFontSize = this.fontSize
    if (this.spacing) theme.spacing = this.spacing

    this.themeService.setTheme(theme)
  }

  @action
  reset() {
    this.themeService.resetTheme()
    this.primaryColor = null
    this.secondaryColor = null
    this.fontSize = null
    this.spacing = null
  }
}
