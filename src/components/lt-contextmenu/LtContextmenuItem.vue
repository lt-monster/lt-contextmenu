<script setup lang="ts">
import { convertMenuGroupOption, getMenuVisible } from './lt-contextmenu'
import IconMore from '@/components/icons/IconMore.vue'
import IconMoreSolid from '@/components/icons/IconMoreSolid.vue'
import Toggle from '@/components/Toggle/index.vue'
import type { MenuCacheMap, MenuGroupOption, MenuItemProps, MenuOption, MenuProps, MenuValue } from './types/lt-contextmenu';
import { computed, h, nextTick, ref, type CSSProperties } from 'vue';

const props = defineProps<MenuItemProps>()

const close = inject('close') as () => void
const menuProps = inject('menuProps') as MenuProps

const menuValueMap = inject<Map<string | number, MenuCacheMap>>('menuValueMap')

const menuItemContainerRef = ref<HTMLElement>()
const menuItemRef = ref<HTMLElement>()
const toggleRef = ref<InstanceType<typeof Toggle>>()
const menuChildrenRef = ref<HTMLElement>()

const childrenVisible = ref(false)

const menuValue = computed<MenuValue|undefined>(() => {
    let value:MenuValue|undefined = undefined
    if(typeof props.option.value === 'function'){
        value = props.option.value(props.menuParam)
    }
    else{
        value = props.option.value
    }
    return value
})

const disabled = computed(() => {
    let disabled = false
    if (typeof props.option.disabled === 'function') {
        disabled = props.option.disabled(props.menuParam, props.option)
    }
    else {
        disabled = props.option.disabled ?? false
    }
    return disabled
})

const visible = computed(() => getMenuVisible(props.option, props.menuParam))

const isDefaultMenu = computed(() => props.fatherOption?.type !== 'radio' && props.fatherOption?.type !== 'toggle')

const radioChecked = computed(() => {
    const val = menuValueMap?.get(props.fatherOption?.id ?? '')?.value
    let realValue
    if(typeof val === 'function'){
        realValue = val(props.menuParam)
    }
    else{
        realValue = val
    }
    return realValue === menuValue.value
})

const moreIcon = computed(() => {
    switch (props.menuStyle) {
        case 'edge': return IconMoreSolid
        default: return IconMore
    }
})

const containerClass = computed(() => {
    return disabled.value ? 'menu-item menu-item-unusable ' : 'menu-item '
})

const itemClass = computed(() => {
    if (props.itemClass) {
        if (typeof props.itemClass === 'function') {
            return props.itemClass(props.menuParam)
        }
        return props.itemClass
    }
    return ''
})

const children = computed<MenuGroupOption[]>(() => {
    let menuGroup:MenuGroupOption[] = []
    if(typeof props.option.children === 'function'){
        menuGroup = convertMenuGroupOption(props.option.children(props.menuParam, menuValue.value, props.option),props.menuParam,toggleChecked.value,props.option)
    }
    else{
        menuGroup = convertMenuGroupOption(props.option.children!,props.menuParam,toggleChecked.value,props.option)
    }
    return menuGroup
})

const itemStyle = computed<CSSProperties>(() => {
    if (props.itemStyle) {
        if (typeof props.itemStyle === 'function') {
            return props.itemStyle(props.menuParam)
        }
        return props.itemStyle
    }
    return {}
})

const childrenVisibility = computed(() => children.value.length > 0 && childrenVisible.value  && isDefaultMenu.value)

function labelRender(option: MenuOption) {
    if (typeof option.label === 'string') {
        return h('span', null, option.label)
    }
    if (typeof option.label === 'function') {
        const labelResult = option.label(props.menuParam)
        if (typeof labelResult === 'string') {
            return h('span', null, labelResult)
        }
        return option.label(props.menuParam)
    }
    return h('span', null, '')
}

//菜单单击事件
function menuClick(e: MouseEvent) {
    if (disabled.value) {
        return
    }

    if (props.option.type === 'radio') {
        return
    }
    if (props.option.type === 'toggle') {
        const target = e.target as HTMLElement
        if (toggleRef.value?.$el.contains(target)) {
            if (props.option?.change) {
                props.option.change(props.menuParam, toggleChecked.value, props.option)
            }
            return
        } else {
            return
        }
    }
    if (props.fatherOption?.type === 'radio') {
        const mvm = menuValueMap?.get(props.fatherOption.id)
        if (mvm && mvm.value !== menuValue.value) {
            if(typeof mvm.value !== 'function'){
                mvm.value = menuValue.value
            }
            if (props.fatherOption?.change) {
                props.fatherOption.change(props.menuParam, menuValue.value, props.option)
            }
        }
    }
    if (typeof props.option.handler === 'function') {
        props.option.handler(props.menuParam, menuValue.value, props.option)
    }
    close()
}

const toggleChecked = ref(menuValue.value ? true : false)
function toggle(value: boolean) {
    toggleChecked.value = value
}

function showChildrenMenu() {
    childrenVisible.value = true
    nextTick(() => {
        if (menuChildrenRef.value) {
            if (props.width) {
                let width = props.width
                if (Number.isInteger(props.width)) {
                    width = props.width + 'px'
                }
                menuChildrenRef.value.style.width = String(width)
            }
            if (props.maxWidth) {
                let maxWidthTemp = props.maxWidth
                if (Number.isInteger(props.maxWidth)) {
                    maxWidthTemp = props.maxWidth + 'px'
                }
                menuChildrenRef.value.style.maxWidth = String(maxWidthTemp)
            }

            const menuContainerRect = menuItemContainerRef.value!.getBoundingClientRect() as DOMRect
            const menuItemRect = menuItemRef.value!.getBoundingClientRect() as DOMRect
            const menuChildrenRect = menuChildrenRef.value.getBoundingClientRect() as DOMRect
            let x = menuContainerRect.width + 'px'
            let y = '0'
            if (menuChildrenRect.x + menuChildrenRect.width + menuContainerRect.width > window.innerWidth) {
                x = -menuChildrenRect.width + 'px'
            }
            if (menuChildrenRect.y + menuChildrenRect.height > window.innerHeight) {
                y = -(children.value.length - 1) * menuItemRect.height + 'px'
            }
            menuChildrenRef.value.style.transform = `translate(${x}, ${y})`
        }
    })
}

function closeChildrenMenu() {
    // console.log('关闭了菜单')
    childrenVisible.value = false
}

</script>

<template>
    <div ref="menuItemContainerRef" v-if="visible" :class="containerClass + itemClass" :style="itemStyle"
        @click="menuClick" @mouseenter="showChildrenMenu" @mouseleave="closeChildrenMenu">
        <div ref="menuItemRef" lt-item-data>
            <div v-if="props.fatherOption?.type === 'radio'" class="menu-item-point" :checked="radioChecked"
                :style="{ backgroundColor: radioChecked ? 'var(--menu-text-color)' : 'inherit' }">
            </div>
            <component :is="option.icon ?? 'div'" :class="'menu-item-icon '" />
            <div class="menu-item-label">
                <component :is="labelRender(option)" />
            </div>
            <Toggle ref="toggleRef" v-if="option.type === 'toggle'" @change="toggle" :value="toggleChecked"
                :size="menuProps.menuSize !== 'large' ? 'small' : 'normal'" />
            <component v-else :is="children.length > 0 && isDefaultMenu ? moreIcon : 'div'"
                class="menu-item-more" />
        </div>
        <div ref="menuChildrenRef" class="menu-container" v-if="childrenVisibility" lt-item-children>
            <div class="menu-item-group" v-for="groupOptionChildren in children"
                :key="groupOptionChildren.group">
                <template v-for="optionChildren in groupOptionChildren.options" :key="optionChildren.label">
                    <LtContextmenuItem :option="optionChildren" :menuParam="menuParam" :fatherOption="option"
                        :menu-style="props.menuStyle" :width="props.width" :max-width="props.maxWidth" />
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.menu-container {
    position: absolute;
    z-index: 10000;
    border-radius: 8px;
    box-shadow: var(--menu-container-shadow);
    background-color: var(--menu-container-bg-color);
    left: 0;
    top: var(--menu-container-children-top);
}

.menu-item-group {
    padding: var(--menu-group-padding);
}

.menu-item-group~.menu-item-group {
    border-top: 1px solid var(--menu-group-border-color);
}

.menu-item {
    padding: var(--menu-item-padding);
    height: var(--menu-item-height);
    cursor: default;
    position: relative;
    border-radius: 4px;
}

.menu-item>div[lt-item-data] {
    height: 100%;
    display: flex;
    align-items: center;
}

.menu-item-unusable {
    cursor: not-allowed;
    opacity: 0.5;
}

.menu-item:not(.menu-item-unusable):hover {
    background-color: var(--menu-item-bg-color-hover);
}

.menu-item-point {
    width: 6px;
    height: 6px;
    margin-right: 12px;
    flex-shrink: 0;
    border-radius: 100%;
}

.menu-item-icon {
    width: 1.1em;
    height: 1.1em;
    flex-shrink: 0;
}

.menu-item-label {
    overflow: hidden;
    text-overflow: ellipsis;
    text-wrap: nowrap;
    flex-grow: 1;
    margin: var(--menu-item-label-padding);
}

.menu-item-more {
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    opacity: .8;
    color: var(--menu-item-more-color);
}
</style>