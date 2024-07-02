<script setup lang="ts">
import { convertMenuGroupOption } from './lt-contextmenu'
import IconMore from '@/components/icons/IconMore.vue'
import IconMoreSolid from '@/components/icons/IconMoreSolid.vue'
import type { MenuCacheMap, MenuItemProps, MenuOption } from './types/lt-contextmenu';
import { computed, h, nextTick, ref, type CSSProperties } from 'vue';

const props = defineProps<MenuItemProps>()

const menuValueMap = inject<Map<string | number, MenuCacheMap>>('menuValueMap')

const menuItemContainerRef = ref()
const menuItemRef = ref()
const menuChildrenRef = ref()

const childrenVisible = ref(false)

const isDefaultMenu = computed(() => props.fatherOption?.type !== 'radio' && props.fatherOption?.type !== 'checkbox')

const radioChecked = computed(() => menuValueMap?.get(props.fatherOption?.id ?? '')?.value === props.option.value)

const moreIcon = computed(() => {
    switch (props.menuStyle) {
        case 'edge': return IconMoreSolid
        default: return IconMore
    }
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

const itemStyle = computed<CSSProperties>(() => {
    if (props.itemStyle) {
        if (typeof props.itemStyle === 'function') {
            return props.itemStyle(props.menuParam)
        }
        return props.itemStyle
    }
    return {}
})

function isDisabled(option: MenuOption) {
    let disabled = false
    if (option.disabled instanceof Function) {
        disabled = option.disabled(props.menuParam)
    }
    else {
        disabled = option.disabled ?? false
    }
    return 'menu-item ' + (disabled ? 'menu-item-unusable ' : '')
}

function isVisiable(option: MenuOption) {
    let visible = true
    if (option.visible instanceof Function) {
        visible = option.visible(props.menuParam)
    }
    else {
        visible = option.visible ?? true
    }

    return visible
}

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
function menuClick(option: MenuOption) {
    if (props.fatherOption?.type === 'radio') {
        const mvm = menuValueMap?.get(props.fatherOption.id)
        if (mvm) {
            mvm.value = option.value
        }
    }
    if (option.handler instanceof Function) {
        option.handler(props.menuParam, option.value, props.option)
    }
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
                menuChildrenRef.value.style.width = width
            }
            if (props.maxWidth) {
                let maxWidthTemp = props.maxWidth
                if (Number.isInteger(props.maxWidth)) {
                    maxWidthTemp = props.maxWidth + 'px'
                }
                menuChildrenRef.value.style.maxWidth = maxWidthTemp
            }

            const menuContainerRect = menuItemContainerRef.value.getBoundingClientRect() as DOMRect
            const menuItemRect = menuItemRef.value.getBoundingClientRect() as DOMRect
            const menuChildrenRect = menuChildrenRef.value.getBoundingClientRect() as DOMRect
            let x = menuContainerRect.width + 'px'
            let y = '0'
            if (menuChildrenRect.x + menuChildrenRect.width + menuContainerRect.width > window.innerWidth) {
                x = -menuChildrenRect.width + 'px'
            }
            if (menuChildrenRect.y + menuChildrenRect.height > window.innerHeight) {
                y = -(props.option.children!.length - 1) * menuItemRect.height + 'px'
            }
            menuChildrenRef.value.style.transform = `translate(${x}, ${y})`
        }
    })
}

function closeChildrenMenu() {
    childrenVisible.value = false
}

</script>

<template>
    <div ref="menuItemContainerRef" v-if="isVisiable(option)" :class="isDisabled(option) + itemClass" :style="itemStyle"
        @click="menuClick(option)" @mouseenter="showChildrenMenu" @mouseleave="closeChildrenMenu">
        <div ref="menuItemRef" lt-item-data>
            <div v-if="props.fatherOption?.type === 'radio'" class="menu-item-point" :checked="radioChecked"
                :style="{ backgroundColor: radioChecked ? 'var(--menu-text-color)' : 'inherit' }">
            </div>
            <component :is="option.icon ?? 'div'" :class="'menu-item-icon '" />
            <div class="menu-item-label">
                <component :is="labelRender(option)" />
            </div>
            <component :is="(option.children?.length ?? 0) > 0 && isDefaultMenu ? moreIcon : 'div'"
                class="menu-item-more" />
        </div>
        <div ref="menuChildrenRef" class="menu-container"
            v-if="option.children && option.children.length > 0 && childrenVisible && isDefaultMenu" lt-item-children>
            <div class="menu-item-group" v-for="groupOptionChildren in convertMenuGroupOption(option.children)"
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