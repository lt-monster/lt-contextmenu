import type { CSSProperties, VNode } from "vue"

export type MenuProps = {
    menuOptions: MenuGenericOption
    menuStyle?: MenuStyle
    menuTheme?: MenuTheme
    menuSize?: MenuSize
    width?: string | number
    maxWidth?: string | number
    height?: string | number
    maxHeight?: string | number
    groupClass?: string | ((menuParam?: any) => string)
    groupStyle?: CSSProperties | ((menuParam?: any) => CSSProperties)
    itemClass?: string | ((menuParam?: any, itemOption?: MenuOption) => string)
    itemStyle?: CSSProperties | ((menuParam?: any, itemOption?: MenuOption) => CSSProperties)
    expandTrigger?: 'hover'|'click'
    overlay?: {
        enable: boolean
        zIndex?: number
    }
} & MenuEvents

type MenuEvents = {
    beforeClose?: (close: () => void) => void
}

export type MenuItemProps = {
    option: MenuOption,
    fatherOption?: MenuOption,
    menuStyle?: MenuStyle
    menuParam?: any,
    width?: string | number
    maxWidth?: string | number
    itemClass?: string | ((menuParam?: any, itemOption?: MenuOption) => string)
    itemStyle?: CSSProperties | ((menuParam?: any, itemOption?: MenuOption) => CSSProperties)
    expandTrigger?: 'hover'|'click'
}

export type MenuStyle = 'google' | 'edge'

export type MenuTheme = 'light' | 'dark-element' | 'dark-naive'

export type MenuSize = 'normal' | 'small' | 'large'

export type MenuItemType = 'menu' | 'radio' | 'toggle'

export type MenuGenericOption = Array<MenuOption | MenuGroupOption>

export type MenuValue = string | number | boolean | Array<string | number | boolean>

export type MenuCacheMap = {
    option: MenuOption,
    value?: MenuValue | ((menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => MenuValue)
    fatherId?: string | number
}

export type MenuGroupOption = {
    group: string
    options: MenuOption[]
}

export type MenuChildrenOption = MenuGenericOption | ((menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => MenuGenericOption)

export type MenuChildrenStyle = {
    width?: string | number
    maxWidth?: string | number
    height?: string | number
    maxHeight?: string | number
}

export type MenuOption = {
    id: string | number
    icon?: (menuParam?: any, itemOption?: MenuOption) => VNode
    label: string | ((menuParam?: any, itemOption?: MenuOption) => VNode | string)
    visible?: boolean | ((menuParam?: any, itemOption?: MenuOption) => boolean)
    disabled?: boolean | ((menuParam?: any, itemOption?: MenuOption) => boolean)
    type?: MenuItemType
    value?: MenuValue | ((menuParam?: any) => MenuValue)
    handler?: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => void
    children?: MenuChildrenOption
    childrenStyle?: MenuChildrenStyle
    change?: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => void
}