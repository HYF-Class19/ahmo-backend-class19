'use strict';

/**
 * chat-member service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::chat-member.chat-member');
