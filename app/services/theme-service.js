import Service from '@ember/service';
import { tracked } from '@glimmer/tracking'
import { dasherize } from '@ember/string'

const THEME_KEY = '_theme'

export default class ThemeServiceService extends Service {
  @tracked theme

  loadTheme() {
    const json = window.localStorage.getItem(THEME_KEY)

    if (json) {
      try {
        const theme = JSON.parse(json)

        this.theme = theme

        this.setThemeProperties(this.theme)
      } catch(e) {
        window.localStorage.removeItem(THEME_KEY)
        this.setThemeProperties()
      }
    } else {
      this.setThemeProperties()
    }
  }

  setTheme(newTheme) {
    this.theme = newTheme
    this.setThemeProperties(newTheme)

    const json = JSON.stringify(this.theme)
    window.localStorage.setItem(THEME_KEY, json)
  }

  setThemeProperties(properties = {}) {
    const root = document.documentElement

    Object.keys(properties).forEach(property => {
      root.style.setProperty(`--${dasherize(property)}`, properties[property])
    })
  }

  resetTheme() {
    const root = document.documentElement

    Object.keys(this.theme).forEach(property => {
      root.style.removeProperty(`--${property}`)
    })

    window.localStorage.removeItem(THEME_KEY)
    this.theme = null
  }
}
