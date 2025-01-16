<script setup lang="ts">
import LtContextmenu from "../lt-contextmenu/LtContextmenu.vue"
import type { MenuGroupOption, MenuOption, MenuValue } from "../lt-contextmenu/types/lt-contextmenu"
import FileExport from "@/components/icons/FileExport.vue"
import IconSortMode from "@/components/icons/IconSortMode.vue"
import IconSortAsc from "@/components/icons/IconSortAsc.vue"
import IconSortDesc from "@/components/icons/IconSortDesc.vue"
import IconSortNone from "@/components/icons/IconSortNone.vue"
import IconDetail from "@/components/icons/IconDetail.vue"
import IconRefresh from "@/components/icons/IconRefresh.vue"
import IconAdd from "@/components/icons/IconAdd.vue"
import IconModify from "@/components/icons/IconModify.vue"
import IconDelete from "@/components/icons/IconDelete.vue"
import IconCollect from "@/components/icons/IconCollect.vue"
import IconToggle from "@/components/icons/IconToggle.vue"

type ActorInfo = {
    Name: string
}

const actors = ref<ActorInfo[]>([])

const tlContextmenuRef = ref<InstanceType<typeof LtContextmenu>>()

const selectRadioValue = ref('none')

const ss = ['lijiatu']

const cs = ref<string[]>([])
for (let i = 0; i < 20; i++) {
    cs.value.push('菜单项xxxxxxxxxxxxxxx-'+(i+1))
}

const menuOptions = ref<MenuGroupOption[]>([
    {
        group: "group1",
        options: [
            {
                id: "1",
                icon: () => h(IconRefresh),
                label: "刷新",
                visible(menuParam:any){
                    return menuParam?.name === 'lijiatu' && ss.includes(menuParam?.name)
                },
                // visible: false
            },
            {
                id: "2",
                icon: () => h(IconRefresh),
                label: "刷新222",
                visible(menuParam:any){
                    return menuParam?.name === 'lijiatu' && ss.includes(menuParam?.name)
                },
                children: [
                    {
                        id: '2-1',
                        label: '测试111',
                        children: [
                            {
                                id: '2-1-1',
                                label: '测试222',
                                children: [
                                    {
                                        id: '2-1-1-1',
                                        label: '测试3333'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: '2-2',
                        label: '测试111-222',
                    },
                    {
                        id: '2-3',
                        label: '测试111-333',
                        children: [
                            {
                                id: '2-3-1',
                                label: '测试111-333-111',
                            },
                            {
                                id: '2-3-2',
                                label: '测试111-333-222',
                            },
                        ]
                    },
                ],
                childrenStyle: {
                    maxHeight: 200
                }
            },
            {
                id: "3",
                label: '其他',
                type: 'radio',
                visible(menuParam:any){
                    return true
                },
                children: () => {
                    return cs.value.map(item => {
                        return {
                            id: item,
                            label: item,
                            value: item,
                            handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                                console.log('clicked...'+item)
                            }
                        }
                    })
                },
                childrenStyle: {
                    maxHeight: 200
                }
            }
        ]
    },
    {
        group: "4",
        options: [
            {
                id: "4-2",
                icon: () => h(IconAdd),
                label: "添加"
            },
            {
                id: "4-1",
                icon: () => h(IconSortMode),
                label: "排序方式",
                type: 'radio',
                value: 'none',
                change(menuParam, value, itemOption) {
                    
                },
                children: [
                    {
                        id: "4-1-1",
                        icon: () => h(IconSortAsc),
                        label: "升序",
                        value: 'asc',
                        handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                            selectRadioValue.value = '升序'
                        }
                    },
                    {
                        id: "4-1-2",
                        icon: () => h(IconSortDesc),
                        label: "降序",
                        value: 'desc',
                        handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                            selectRadioValue.value = '降序'
                        }
                    },
                    {
                        id: "4-1-3",
                        icon: () => h(IconSortNone),
                        label: "不排序",
                        value: 'none',
                        handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                            selectRadioValue.value = '不排序'
                        }
                    },
                ]
            },
            {
                id: "4-3",
                icon: () => h(IconToggle),
                label: "开关",
                type: 'toggle',
                value: false,
                change(menuParam, value, itemOption) {
                    console.log('value', value)
                },
            }
        ]
    }
])

// const menuOptions = ref<MenuOption[]>(cs.value.map(c => {
//     return {
//         id: c,
//         label: c,
//     }
// }))

function customClose(close: () => void) {
    console.log('关闭前')
    close()
    console.log('关闭后')
}

defineExpose({
    open: (event: MouseEvent, param?: any) => tlContextmenuRef.value?.open(event, param),
    close: () => tlContextmenuRef.value?.close(),
    getMenuOption: (id: string | number) => tlContextmenuRef.value?.getMenuOption(id),
    setRadioValue: (id: string | number, value: string | number) => tlContextmenuRef.value?.setRadioValue(id, value),
    getRadioValue: (id: string | number) => tlContextmenuRef.value?.getRadioValue(id)
})
</script>

<template>
    <LtContextmenu ref="tlContextmenuRef" :menu-options="menuOptions" menu-theme="light" menu-size="small" :width="180"
        expand-trigger="hover" :before-close="customClose" :height="200" :overlay="{ enable: true }" />
</template>

<style scoped></style>