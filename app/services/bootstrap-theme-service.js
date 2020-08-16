import Service from '@ember/service';
import { tracked } from '@glimmer/tracking'
import { dasherize } from '@ember/string'
import trim from 'lodash/trim'

const THEME_KEY = '_bootstrap_theme'
const colors = [
  'blue',
  'indigo',
  'purple',
  'pink',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'cyan',
  'white',
  'gray',
  'gray-dark',
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'light',
  'dark'
]

const rgbToHsl = (red, green, blue) => {
  const r = Number(trim(red)) / 255
  const g = Number(trim(green)) / 255
  const b = Number(trim(blue)) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h,
    s,
    l = (max + min) / 2

  if (max === min) {
    h = s = 0 // achromatic
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
      default:
        break
    }
    h /= 6
  }

  h = Math.round(360 * h)
  s = Math.round(100 * s)
  l = Math.round(100 * l)

  return [h, s, l]
}

// from @josh3736 | https://stackoverflow.com/a/3732187
const colorToHsl = (color) => {
  if (color.startsWith('#')) {
    if (color.length === 4) {
      const r = parseInt(color.substr(1, 1) + color.substr(1, 1), 16)
      const g = parseInt(color.substr(2, 1) + color.substr(2, 1), 16)
      const b = parseInt(color.substr(3, 1) + color.substr(3, 1), 16)
      return rgbToHsl(r, g, b)
    } else {
      const r = parseInt(color.substr(1, 2), 16)
      const g = parseInt(color.substr(3, 2), 16)
      const b = parseInt(color.substr(5, 2), 16)
      return rgbToHsl(r, g, b)
    }
  } else if (color.startsWith('rgba')) {
    const [r, g, b] = color.slice(5, -1).split(',')
    return rgbToHsl(r, g, b).slice(0, 3)
  } else if (color.startsWith('rgb')) {
    const [r, g, b] = color.slice(4, -1).split(',')
    return rgbToHsl(r, g, b)
  } else if (color.startsWith('hsla')) {
    return color.slice(5, -1).split(',').slice(0, 3)
  } else if (color.startsWith('hsl')) {
    return color.slice(4, -1).split(',')
  } else {
    // named color values are not yet supported
    console.error('Named color values are not supported in the config. Convert it manually using this chart: https://htmlcolorcodes.com/color-names/')
    return [0, 0, 16] // defaults to dark gray
  }
}

export default class BootstrapThemeServiceService extends Service {
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

    const newTheme = Object.keys(properties).reduce((theme, property) => {
      if (!properties[property]) return

      if (colors.includes(property)) {
        const [h, s, l] = colorToHsl(properties[property])

        theme[`${property}H`] = h
        theme[`${property}S`] = `${s}%`
        theme[`${property}L`] = `${l}%`
      }
      theme[property] = properties[property]

      return theme
    }, {})

    Object.keys(newTheme).forEach(property => {
      if (newTheme[property]) {
        root.style.setProperty(`--${dasherize(property)}`, newTheme[property])
      }
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
