'use strict';

/**
 * gamer service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::gamer.gamer');
