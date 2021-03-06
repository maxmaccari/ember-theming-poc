import EmberRouter from '@ember/routing/router';
import config from 'theme-poc/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('vanilla');
  this.route('bootstrap');
});
