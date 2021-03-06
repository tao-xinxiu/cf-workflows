const WF = require('push2cloud-workflow-utils');

const waterfall = WF.waterfall;
const step = WF.step;
const map = WF.map;
const mapLimit = WF.mapLimit(Math.round(require('os').cpus().length / 2));
const packageApp = WF.packageApp;

const desiredApps = (api, log, services) =>
  waterfall(
    [ step(log('prepare desired apps'))
    , step(log('===================='))

    , step(log('start deployment'))
    , step(log('package apps'))
    , map(packageApp, 'desired.apps')
    , step(log('create service instances'))
    , map(api.createServiceInstance, services || 'desired.services')
    , step(log('create routes'))
    , map(api.createRoute, 'desired.routes')
    , step(log('push apps'))
    , mapLimit(api.pushApp, 'desired.apps')
    , step(log('set environement'))
    , map(api.setEnv, 'desired.envVars')
    , step(log('stage apps'))
    , map(api.stageApp, 'desired.apps')
    , step(log('bind services'))
    , map(api.bindService, 'desired.serviceBindings')
    , step(log('start apps and wait for instances'))
    , step(log('desired apps prepared'))
    ]
 );

const prepareApps = (api, log, what, services) =>
  waterfall(
    [ step(log('prepare apps'))
    , step(log('===================='))

    , step(log('start deployment'))
    , step(log('package apps'))
    , map(packageApp, what.apps)
    , step(log('create service instances'))
    , map(api.createServiceInstance, services || what.services)
    , step(log('create routes'))
    , map(api.createRoute, what.routes)
    , step(log('push apps'))
    , mapLimit(api.pushApp, what.apps)
    , step(log('set environement'))
    , map(api.setEnv, what.envVars)
    , step(log('stage apps'))
    , map(api.stageApp, what.apps)
    , step(log('bind services'))
    , map(api.bindService, what.serviceBindings)
    , step(log('start apps and wait for instances'))
    , step(log('apps prepared'))
    ]
 );

module.exports = {
  desiredApps: desiredApps,
  prepareApps: prepareApps
};
