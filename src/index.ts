import { Context, Dict, Schema } from 'koishi'
import { DataService } from '@koishijs/plugin-console'
import { resolve } from 'path'
import { createHash } from 'crypto'

declare module '@koishijs/plugin-console' {
  namespace Console {
    interface Services {
      iframe: IFrameService
    }
  }
}

class IFrameService extends DataService<IFrameService.Route[]> {
  constructor(ctx: Context, private config: IFrameService.Config) {
    super(ctx, 'iframe')

    ctx.console.addEntry({
      dev: resolve(__dirname, '../client/index.ts'),
      prod: resolve(__dirname, '../dist'),
    })
  }

  async get(forced?: boolean) {
    for (const route in this.config.routes) {
      if (Object.prototype.hasOwnProperty.call(this.config.routes, route)) {
        const options = this.config.routes[route]
        if(options.proxy) {
          options.link = createHash('md5').update(options.link).digest('hex')
          this.ctx.router.get(`/iframe/proxy${options.link}`, async (ctx) => {
          })
          this.config.routes[route] = options
        }
      }
    }
    return this.config.routes
  }
}

namespace IFrameService {
  export interface Route {
    name: string
    desc?: string
    path: string
    link: string
    order?: number
    proxy?: boolean
    headers?: Dict<string, string>
  }

  export const Route: Schema<Route> = Schema.intersect([
    Schema.object({
      name: Schema.string().required().description('页面标题。'),
      desc: Schema.string().description('页面描述。'),
      path: Schema.string().required().description('页面所占据的路由。'),
      link: Schema.string().required().description('页面要访问的网络链接。'),
      order: Schema.number().default(0).description('页面在活动栏中显示的优先级。'),
    }),
    Schema.intersect([
      Schema.object({
        proxy: Schema.boolean().default(false).description('是否使用代理。'),
      }),
      Schema.union([
        Schema.object({
          proxy: Schema.const(true).required(),
          headers: Schema.dict(String).default({
            'X-Frame-Options': 'SAMEORIGIN',
          }).role('table').description('要附加或覆盖的请求头。'),
        }),
        Schema.object({})
      ])
    ])
  ]) as Schema<Route>

  export interface Config {
    routes: Route[]
  }

  export const Config: Schema<Config> = Schema.object({
    routes: Schema.array(Route),
  })
}

export default IFrameService
