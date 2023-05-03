import { Context, activities, store } from '@koishijs/client'
import { defineComponent, ref, h, resolveComponent, watch } from 'vue'
import {} from '../src'

import './index.scss'

export default function (ctx: Context) {
  let paths: string[] = []

  const disposeWatcher = watch(() => store.iframe, () => {
    disposeRoutes()
    console.log(store.iframe)
    if (!store.iframe) return
    for (const { path, link, name, desc, order } of store.iframe) {
      paths.push(path)
      ctx.page({
        path,
        name,
        desc,
        order,
        component: defineComponent({
          setup() {
            const iframe = ref<HTMLIFrameElement>()
            return () => h(resolveComponent('k-layout'), {}, {
              default: () => h('iframe', { ref: iframe, src: link, class: 'layout-iframe' }),
            })
          },
        }),
      })
    }
  }, { deep: true, immediate: true })

  function disposeRoutes() {
    for (const path of paths) {
      activities[path]?.dispose()
    }
  }

  ctx.on('dispose', () => {
    disposeWatcher()
    disposeRoutes()
  })
}
