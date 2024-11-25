import type { MenuChildrenOption, MenuGenericOption, MenuGroupOption, MenuOption, MenuValue } from "./types/lt-contextmenu"

//转换为菜单组
export function convertMenuGroupOption(options: MenuChildrenOption, menuParam?: any, value?: MenuValue, itemOption?: MenuOption) {
    let genericOption:MenuChildrenOption = []
    if(Array.isArray(options)){
        genericOption = options
    }else if(typeof options === 'function'){
        genericOption = options(menuParam, value, itemOption)
    }
    return genericOptionToGroupOption(genericOption)
}

function genericOptionToGroupOption(options: MenuGenericOption){
    let menuGroupOptions: MenuGroupOption[] = []
    if(options.length > 0){
        if (Object.keys(options[0]).includes('group')) {
            menuGroupOptions = options as MenuGroupOption[]
        }
        else {
            menuGroupOptions = [{
                group: 'default',
                options: options
            }] as MenuGroupOption[]
        }
    }
    return menuGroupOptions
}

export function getMenuVisible(option: MenuOption, menuParam?: any){
    let visible = true
    if (typeof option.visible === 'function') {
        visible = option.visible(menuParam, option)
    }
    else {
        visible = option.visible ?? true
    }
    return visible
}