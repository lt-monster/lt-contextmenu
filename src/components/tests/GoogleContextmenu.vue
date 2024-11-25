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
setTimeout(() => {
    cs.value = ['操作1','操作2']
}, 2000)

const menuOptions = ref<MenuGroupOption[]>([
    {
        group: "group1",
        options: [
            {
                id: "1",
                icon: () => h(IconRefresh),
                label: "刷新",
                visible(menuParam:any){
                    console.log('menuParam',menuParam)
                    return menuParam?.name === 'lijiatu' && ss.includes(menuParam?.name)
                },
                // visible: false
            },
            {
                id: "3",
                label: '其他',
                type: 'radio',
                visible(menuParam:any){
                    return menuParam?.name !== 'lijiatu'
                },
                children: () => {
                    return cs.value.map(item => {
                        return {
                            id: item,
                            label: item,
                            value: item
                        }
                    })
                }
            }
        ]
    },
    {
        group: "2",
        options: [
            {
                id: "2-2",
                icon: () => h(IconAdd),
                label: "添加"
            },
            {
                id: "2-1",
                icon: () => h(IconSortMode),
                label: "排序方式",
                type: 'radio',
                value: 'none',
                change(menuParam, value, itemOption) {
                    console.log('menuParam', menuParam)
                    console.log('value', value)
                    console.log('itemOption', itemOption)
                },
                children: [
                    {
                        id: "2-1-1",
                        icon: () => h(IconSortAsc),
                        label: "升序",
                        value: 'asc',
                        handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                            selectRadioValue.value = '升序'
                        }
                    },
                    {
                        id: "2-1-2",
                        icon: () => h(IconSortDesc),
                        label: "降序",
                        value: 'desc',
                        handler: (menuParam?: any, value?: MenuValue, itemOption?: MenuOption) => {
                            selectRadioValue.value = '降序'
                        }
                    },
                    {
                        id: "2-1-3",
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
                id: "2-3",
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
    <LtContextmenu ref="tlContextmenuRef" :menu-options="menuOptions" menu-size="small" :width="180"
        :before-close="customClose" />
</template>

<style scoped></style>