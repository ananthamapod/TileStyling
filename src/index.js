import './sass/style.scss'
import setup from './js/setup'
import init from './js/app'
import $ from 'jquery'
import 'foundation-sites'

$(document).ready(() => {
  $(document).foundation()
  setup()
  init()
})
