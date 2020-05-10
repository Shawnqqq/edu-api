'use strict';

const JWT = require('jsonwebtoken');
module.exports = options => {
  return async (ctx, next) => {
    const { app } = ctx;
    const token = ctx.header.authorization
      ? ctx.headers.authorization.split(' ')[1]
      : '';

    // 没有 token 返回 401
    if(!token) {
      ctx.status = 401;
      return ctx.body = { error_code: 1, message: 'Auth Empty' };
    }

    try {
        const decoded = JWT.verify(token, app.config.jwt.secret);
        const user_id = decoded.user_id;
        ctx.locals.user_id = user_id;
        const manger = await ctx.model.Manager.findByPk(user_id);
        const permissions = await ctx.model.RolePermission.findAll({
            where: { role_id: manger.role_id }
        })
        const permissionSlugs = (permissions || []).map( data => data.permission_slug );
        const hasPermission = permissionSlugs.includes(options);
        if(!hasPermission) {
            ctx.status = 403;
            return ctx.body = { error_code: 1, message: 'No Auth Permission' };
        }
        await next();
    } catch (e) {
        ctx.status = 401;
        console.log(e)
        return ctx.body = { error_code: 1, message: e.message };
    }
  };
};
