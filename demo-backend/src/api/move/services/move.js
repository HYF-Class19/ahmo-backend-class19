'use strict';

/**
 * move service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::move.move');
