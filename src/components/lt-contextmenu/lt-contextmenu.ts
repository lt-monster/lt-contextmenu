import type { MenuGenericOption, MenuGroupOption, MenuOption } from "./types/lt-contextmenu"

//转换为菜单组
export function convertMenuGroupOption(options: MenuGenericOption) {
    let menuGroupOptions: MenuGroupOption[] = []
    if (options.length > 0) {
        if (Object.keys(options[0]).includes('group')) {
            menuGroupOptions = options as MenuGroupOption[]
        }
        else {
            menuGroupOptions = [{
                group: 'default',
                options: options
            }] as MenuGroupOption[]
        }
        menuGroupOptions = menuGroupOptions.filter(mg => mg.options.filter(m => isVisible(m)).length > 0)
    }
    return menuGroupOptions
}

//是否可见
export function isVisible(option: MenuOption, menuParam?: any) {
    let isVisible = true
    if (option.visible instanceof Function) {
        isVisible = option.visible(menuParam)
    }
    else {
        isVisible = option.visible ?? true
    }
    return isVisible
}