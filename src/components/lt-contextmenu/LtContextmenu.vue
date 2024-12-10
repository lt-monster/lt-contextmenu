<script setup lang="ts">
import { convertMenuGroupOption, getMenuVisible } from './lt-contextmenu'
import type { MenuCacheMap, MenuChildrenOption, MenuGroupOption, MenuOption, MenuProps, MenuValue } from './types/lt-contextmenu'
import LtContextmenuItem from './LtContextmenuItem.vue'
import { computed, nextTick, ref, type CSSProperties } from 'vue';

const menuVisible = ref(false)
const menuRef = ref<HTMLElement>()

const props = withDefaults(defineProps<MenuProps>(), {
    menuStyle: 'google',
    menuTheme: 'light',
    menuSize: 'small',
    expandTrigger: 'hover',
    beforeClose: (close: () => void) => {
        close()
    }
})
provide('menuProps', props)
console.log('props',props)

const menuOptions = computed(() => convertMenuGroupOption(props.menuOptions))

const menuValueMap = new Map<string | number, MenuCacheMap>()
provide('menuValueMap', menuValueMap)

const visibleChildrenMenuIds = ref<Array<string|number>>([])
provide('visibleChildrenMenuIds', visibleChildrenMenuIds)

const width = computed<string>(() => {
    if(props.width){
        if(typeof props.width === 'number'){
            return props.width+'px'
        }
        else if(typeof props.width === 'string'){
            return props.width
        }
    }
    return ''
})
const maxWidth = computed<string>(() => {
    if(props.maxWidth){
        if(typeof props.maxWidth === 'number'){
            return props.maxWidth+'px'
        }
        else if(typeof props.maxWidth === 'string'){
            return props.maxWidth
        }
    }
    return ''
})
const height = computed<string>(() => {
    if(props.height){
        if(typeof props.height === 'number'){
            return props.height+'px'
        }
        else if(typeof props.height === 'string'){
            return props.height
        }
    }
    return ''
})
const maxHeight = computed<string>(() => {
    if(props.maxHeight){
        if(typeof props.maxHeight === 'number'){
            return props.maxHeight+'px'
        }
        else if(typeof props.maxHeight === 'string'){
            return props.maxHeight
        }
    }
    return ''
})
provide('width',width.value)
provide('maxWidth',maxWidth.value)
provide('height',height.value)
provide('maxHeight',maxHeight.value)

const containerStyle = ref<CSSProperties>({
    width: width.value,
    maxWidth: maxWidth.value
})
//判断顶级菜单是否存在子菜单,如果有则height,maxHeight无效,他们仅对当前层有效(设计缺陷)
const childrenExistence = ref(false)

const menuParam = ref()

const groupClass = computed(() => {
    if (props.groupClass) {
        if (typeof props.groupClass === 'function') {
            return 'menu-group ' + props.groupClass(menuParam.value)
        }
        return 'menu-group ' + props.groupClass
    }
    return 'menu-group'
})

const groupStyle = computed<CSSProperties>(() => {
    if (props.groupStyle) {
        if (typeof props.groupStyle === 'function') {
            return props.groupStyle(menuParam.value)
        }
        return props.groupStyle
    }
    return {}
})

function groupVisible(menuGroupOption: MenuGroupOption){
    return menuGroupOption.options.map(o => getMenuVisible(o, menuParam.value)).some(v => v)
}

function menuValueToMapCache(group?: MenuGroupOption, fatherId?: string|number) {
    group?.options.forEach(option => {
        menuValueMap.set(option.id, {
            option,
            value: option.value,
            fatherId: fatherId
        })
        let children:MenuChildrenOption = []
        if(Array.isArray(option.children)){
            children = option.children
        }
        else if(typeof option.children === 'function'){
            let value:MenuValue|undefined = undefined
            if(typeof option.value === 'function'){
                value = option.value(menuParam.value)
            }
            else{
                value = option.value
            }
            children = option.children(menuParam.value, value, option)
        }
        if(children.length > 0){
            childrenExistence.value = true
        }
        const newGroup = convertMenuGroupOption(children)
        newGroup.forEach(ng => menuValueToMapCache(ng, option.id))
    })
}

function open(event: MouseEvent | { x: number, y: number }, param?: any) {
    let x = 0
    let y = 0
    if (event instanceof Event) {
        event.preventDefault()
        x = event.clientX
        y = event.clientY
    }
    else {
        x = event.x
        y = event.y
    }
    menuParam.value = param
    menuVisible.value = true
    menuOptions.value.forEach(g => menuValueToMapCache(g))
    if(!childrenExistence.value){
        if(height.value){
            containerStyle.value.height = height.value
        }
        if(maxHeight.value){
            containerStyle.value.maxHeight = maxHeight.value
        }
        containerStyle.value.overflow = 'auto'
    }
    nextTick(() => {
        if (!menuRef.value) {
            return
        }

        const rect = menuRef.value.getBoundingClientRect() as DOMRect
        if (y + rect.height > window.innerHeight) {
            containerStyle.value.top = (y - rect.height > 0 ? y - rect.height : 0) + 'px'
        } else {
            containerStyle.value.top = y + 'px'
        }

        if (x + rect.width > window.innerWidth) {
            containerStyle.value.left = (x - rect.width) + 'px'
        } else {
            containerStyle.value.left = x + 'px'
        }

        window.addEventListener('wheel', closeByWheel)
        document.addEventListener('click', closeWithBlank, true)
        document.addEventListener('contextmenu', closeWithBlank, true)
    })
}

provide('close', close)
function close() {
    //移除事件监听
    window.removeEventListener('wheel', closeByWheel)
    document.removeEventListener('click', closeWithBlank, true)
    document.removeEventListener('contextmenu', closeWithBlank, true)

    visibleChildrenMenuIds.value = []
    menuVisible.value = false
}

function closeWithBlank(e: MouseEvent) {
    if (menuVisible.value && !menuRef.value?.contains(e.target as Node)) {
        props.beforeClose(close)
    }
}

function closeByWheel(e: WheelEvent){
    if (menuVisible.value && !menuRef.value?.contains(e.target as Node)) {
        props.beforeClose(close)
    }
}

defineExpose({
    open,
    close,
    getMenuOption: (id: string | number) => menuValueMap.get(id)?.option,
    setRadioValue: (id: string | number, value?: MenuValue) => {
        const mvm = menuValueMap.get(id)
        if (mvm) {
            mvm.value = value
        }
    },
    getRadioValue: (id: string | number) => menuValueMap.get(id)?.value
})

</script>

<template>
    <Teleport to="body">
        <div ref="menuRef" v-if="menuVisible && menuOptions.length > 0" class="menu-container" :menuStyle="menuStyle"
            :menuTheme="menuTheme" :menuSize="menuSize" :style="containerStyle">
            <slot name="header" :menuParam="menuParam"></slot>
            <template v-for="groupOption in menuOptions" :key="groupOption.group">
                <div v-if="groupVisible(groupOption)" :class="groupClass" :style="groupStyle">
                    <template v-for="option in groupOption.options" :key="option.label">
                        <LtContextmenuItem :option="option" :menu-param="menuParam" :menu-style="props.menuStyle"
                            :width="props.width" :max-width="props.maxWidth" :item-class="props.itemClass"
                            :item-style="props.itemStyle" :expandTrigger="props.expandTrigger" />
                    </template>
                </div>
            </template>
            <slot name="footer" :menuParam="menuParam"></slot>
        </div>
    </Teleport>
</template>

<style scoped>
@import './styles/themes.css';
@import './styles/google.css';
@import './styles/edge.css';

.menu-container {
    position: fixed;
    z-index: 9999;
    border-radius: 8px;
    box-shadow: var(--menu-container-shadow);
    color: var(--menu-text-color);
    font-size: var(--menu-container-fontsize);
    background-color: var(--menu-container-bg-color);
}

/* 全局滚动条样式 */
.menu-container::-webkit-scrollbar {
  width: 6px; /* 滚动条宽度 */
}

/* 滚动条轨道 */
.menu-container::-webkit-scrollbar-track {
  background: var(--scrollbar-track-backgroun-color);
  border-radius: 5px; /* 轨道圆角 */
}

/* 滚动条滑块 */
.menu-container::-webkit-scrollbar-thumb {
  background-color: var(--scrollbar-thumb-backgroun-color); /* 滑块颜色 */
  border-radius: 5px; /* 滑块圆角 */
}

/* 滑块的hover样式 */
.menu-container::-webkit-scrollbar-thumb:hover {
    background-color: var(--scrollbar-thumb-backgroun-color-hover); /* 滑块hover颜色 */
}

/* 滑块的active样式 */
.menu-container::-webkit-scrollbar-thumb:active {
    background-color: var(--scrollbar-thumb-backgroun-color-hover); /* 滑块active颜色 */
}

.menu-group {
    padding: var(--menu-group-padding);
}

.menu-group~.menu-group {
    border-top: 1px solid var(--menu-group-border-color);
}
</style>