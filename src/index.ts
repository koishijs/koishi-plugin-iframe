import { Context, Schema } from 'koishi'
import { DataService } from '@koishijs/plugin-console'
import { resolve } from 'path'

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
  }

  export const Route: Schema<Route> = Schema.object({
    name: Schema.string().required().description('页面标题。'),
    desc: Schema.string().description('页面描述。'),
    path: Schema.string().required().description('页面所占据的路由。'),
    link: Schema.string().required().description('页面要访问的网络链接。'),
    order: Schema.number().default(0).description('页面在活动栏中显示的优先级。'),
  })

  export interface Config {
    routes: Route[]
  }

  export const Config: Schema<Config> = Schema.object({
    routes: Schema.array(Route),
  })
}

export default IFrameService
