<script setup lang="ts">
import { convertMenuGroupOption } from './lt-contextmenu'
import type { MenuCacheMap, MenuGroupOption, MenuProps, MenuValue } from './types/lt-contextmenu'
import LtContextmenuItem from './LtContextmenuItem.vue'
import { computed, nextTick, ref, watchEffect, type CSSProperties } from 'vue';

const menuVisible = ref(false)
const menuRef = ref<HTMLElement>()

const props = withDefaults(defineProps<MenuProps>(), {
    menuStyle: 'google',
    menuTheme: 'light',
    menuSize: 'small',
    beforeClose: (close: () => void) => {
        close()
    }
})
provide('menuProps', props)

const menuOptions = computed(() => convertMenuGroupOption(props.menuOptions))

const menuValueMap = new Map<string | number, MenuCacheMap>()
menuOptions.value.forEach(g => menuValueToMapCache(g))
provide('menuValueMap', menuValueMap)

const menuParam = ref()

const groupClass = computed(() => {
    if (props.groupClass) {
        if (typeof props.groupClass === 'function') {
            return 'menu-group ' + props.groupClass(menuParam)
        }
        return 'menu-group ' + props.groupClass
    }
    return 'menu-group'
})

const groupStyle = computed<CSSProperties>(() => {
    if (props.groupStyle) {
        if (typeof props.groupStyle === 'function') {
            return props.groupStyle(menuParam)
        }
        return props.groupStyle
    }
    return {}
})

function menuValueToMapCache(group?: MenuGroupOption) {
    group?.options.forEach(option => {
        menuValueMap.set(option.id, {
            option,
            value: option.value
        })
        if (option.children && option.children.length > 0) {
            const newGroup = convertMenuGroupOption(option.children)
            newGroup.forEach(ng => menuValueToMapCache(ng))
        }

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
    nextTick(() => {
        if (!menuRef.value) {
            return
        }
        if (props.width) {
            let width = props.width
            if (Number.isInteger(props.width)) {
                width = props.width + 'px'
            }
            menuRef.value.style.width = String(width)
        }
        if (props.maxWidth) {
            let maxWidth = props.maxWidth
            if (Number.isInteger(props.maxWidth)) {
                maxWidth = props.maxWidth + 'px'
            }
            menuRef.value.style.maxWidth = String(maxWidth)
        }

        const rect = menuRef.value.getBoundingClientRect() as DOMRect
        if (y + rect.height > window.innerHeight) {
            menuRef.value.style.top = (y - rect.height > 0 ? y - rect.height : 0) + 'px'
        } else {
            menuRef.value.style.top = y + 'px'
        }

        if (x + rect.width > window.innerWidth) {
            menuRef.value.style.left = (x - rect.width) + 'px'
        } else {
            menuRef.value.style.left = x + 'px'
        }

        window.addEventListener('wheel', close)
    })
}

provide('close', close)
function close() {
    menuVisible.value = false

    //移除事件监听
    window.removeEventListener('wheel', close)
}

function closeWithBlank(e: MouseEvent) {
    if (menuVisible.value && !menuRef.value?.contains(e.target as Node)) {
        props.beforeClose(close)
    }
}

watchEffect((onInvalidate) => {
    if(typeof window !== 'undefined'){
        document.addEventListener('click', closeWithBlank, true)
        document.addEventListener('contextmenu', closeWithBlank, true)
    }
    onInvalidate(() => {
        if(typeof window !== 'undefined'){
            document.removeEventListener('click', closeWithBlank, true)
            document.removeEventListener('contextmenu', closeWithBlank, true)
        }
    });
})

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
            :menuTheme="menuTheme" :menuSize="menuSize">
            <slot name="header" :menuParam="menuParam"></slot>
            <div :class="groupClass" :style="groupStyle" v-for="groupOption in menuOptions" :key="groupOption.group">
                <template v-for="option in groupOption.options" :key="option.label">
                    <LtContextmenuItem :option="option" :menu-param="menuParam" :menu-style="props.menuStyle"
                        :width="props.width" :max-width="props.maxWidth" :item-class="props.itemClass"
                        :item-style="props.itemStyle" />
                </template>
            </div>
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

.menu-group {
    padding: var(--menu-group-padding);
}

.menu-group~.menu-group {
    border-top: 1px solid var(--menu-group-border-color);
}
</style>