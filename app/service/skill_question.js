'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class skillQuestionService extends Service {
  async pagination({ limit = 20, page = 1 }) {
    limit = Number(limit);
    page = Number(page);
    const offset = (page - 1) * limit;
    const query = {
      limit, offset,
      order: [
        [ 'created_at', 'desc' ],
        [ 'id', 'desc' ],
      ],
      include: [{
        model: this.ctx.model.Stack,
      }],
    };
    const data = await this.ctx.model.SkillQuestion.findAndCountAll(query)
    return {
      rows: data.rows,
      pagination: {
        total: data.count,
        page_size: limit,
        current_page: page,
      },
    };
  }
}

module.exports = skillQuestionService;