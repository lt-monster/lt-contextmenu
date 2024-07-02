<script setup lang="ts">
import LtContextmenu from '../lt-contextmenu/LtContextmenu.vue'
import type { MenuGroupOption, MenuOption, MenuValue } from '../lt-contextmenu/types/lt-contextmenu'
import FileExport from '@/components/icons/FileExport.vue'

type TestInfo = {
    id: string
    name: string
    icon: string
}

const testInfo = ref<TestInfo>({
    id: '1',
    name: '菜单1',
    icon: 'FileExport'
})

const tlContextmenuRef = ref<InstanceType<typeof LtContextmenu>>()

const menuOptions = ref<MenuGroupOption[]>([
    {
        group: 'group1',
        options: [
            {
                id: '1',
                icon: () => h(FileExport),
                label: '菜单11',
                handler: (menuParam?: TestInfo, menuValue?: MenuValue, itemOption?: MenuOption) => {
                    // console.log('menuParam', menuParam)
                },
                children: [
                    {
                        id: '1-1',
                        icon: () => h(FileExport),
                        label: '菜单1-1111111111111',
                        handler: (menuParam?: TestInfo, menuValue?: MenuValue, itemOption?: MenuOption) => {
                            console.log('menuParam', menuParam)
                            console.log('menuValue', menuValue)
                            console.log('itemOption', itemOption)
                        },
                    },
                    {
                        id: '1-2',
                        icon: () => h(FileExport),
                        label: '菜单1-2'
                    },
                    {
                        id: '1-3',
                        icon: () => h(FileExport),
                        label: '菜单1-3',
                        children: [
                            {
                                id: '1-3-1',
                                icon: () => h(FileExport),
                                label: '菜单1-3-111111111111111111'
                            }
                        ]
                    }
                ]
            },
            {
                id: '2',
                // icon: () => h(FileExport),
                label: '菜单2',
                children: [
                    {
                        group: 'group2-1',
                        options: [
                            {
                                id: '2-1',
                                icon: () => h(FileExport),
                                label: '菜单2-1'
                            },
                            {
                                id: '2-2',
                                icon: () => h(FileExport),
                                label: '菜单2-2'
                            }
                        ]
                    },
                    {
                        group: 'group2-2',
                        options: [
                            {
                                id: '2-3',
                                icon: () => h(FileExport),
                                label: '菜单2-3'
                            },
                            {
                                id: '2-4',
                                icon: () => h(FileExport),
                                label: '菜单2-4'
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        group: '2',
        options: [
            {
                id: '3',
                icon: () => h(FileExport),
                label: '排序方式',
                type: 'radio',
                value: 'name',
                children: [
                    {
                        id: '3-1',
                        icon: () => h(FileExport),
                        label: '名称',
                        value: 'name',
                        handler: (menuParam: TestInfo, value?: MenuValue, itemOption?: MenuOption) => {
                            // console.log('value', value)
                            // console.log('itemOption', itemOption)
                        }
                    },
                    {
                        id: '3-2',
                        icon: () => h(FileExport),
                        label: '修改日期',
                        value: 'date',
                        handler: (menuParam: TestInfo, value?: MenuValue, itemOption?: MenuOption) => {
                            // console.log('value', value)
                            // console.log('itemOption', itemOption)
                        }
                    },
                    {
                        id: '3-3',
                        icon: () => h(FileExport),
                        label: '类型',
                        value: 'type',
                        handler: (menuParam: TestInfo, value?: MenuValue, itemOption?: MenuOption) => {
                            // console.log('value', value)
                            // console.log('itemOption', itemOption)
                        }
                    },
                    {
                        id: '3-4',
                        icon: () => h(FileExport),
                        label: '大小',
                        value: 'size',
                        handler: (menuParam: TestInfo, value?: MenuValue, itemOption?: MenuOption) => {
                            // console.log('value', value)
                            // console.log('itemOption', itemOption)
                        }
                    }
                ]
            },
            {
                id: '4',
                icon: () => h(FileExport),
                label: '菜单4',
                disabled: true
            },
            {
                id: '5',
                icon: () => h(FileExport),
                label: '重新加载111111111111',
                visible: (menuParam: TestInfo) => {
                    return false
                }
            },
            {
                id: '6',
                icon: () => h(FileExport),
                label: '多选',
                type: 'checkbox',
                value: ['name', 'date'],
                children: [
                    {
                        id: '6-1',
                        icon: () => h(FileExport),
                        label: '名称',
                        value: 'name',
                        handler: (menuParam: TestInfo, value?: MenuValue) => {
                            console.log('value', value)
                        }
                    },
                    {
                        id: '6-2',
                        icon: () => h(FileExport),
                        label: '修改日期',
                        value: 'date',
                        handler: (menuParam: TestInfo, value?: MenuValue) => {
                            console.log('value', value)
                        }
                    },
                    {
                        id: '6-3',
                        icon: () => h(FileExport),
                        label: '类型',
                        value: 'type',
                        handler: (menuParam: TestInfo, value?: MenuValue) => {
                            console.log('value', value)
                        }
                    }
                ]
            },
            {
                id: '7',
                label: '类型',
                disabled(menuParam, itemOption) {
                    return true
                },
            }
        ]
    }
])

defineExpose({
    open: (event: MouseEvent, param?: any) => tlContextmenuRef.value?.open(event, param),
    close: () => tlContextmenuRef.value?.close(),
    getMenuOption: (id: string | number) => tlContextmenuRef.value?.getMenuOption(id),
    setRadioValue: (id: string | number, value: string | number) => tlContextmenuRef.value?.setRadioValue(id, value),
    getRadioValue: (id: string | number) => tlContextmenuRef.value?.getRadioValue(id)
})
</script>

<template>
    <LtContextmenu ref="tlContextmenuRef" :menu-options="menuOptions" menu-style="google" menu-theme="light"
        menu-size="normal" :width="240" :max-width="300" :group-class="() => 'aaaa'" :group-style="{ color: '#606266' }"
        :item-class="'bbbb'" :item-style="{ color: '#606266' }">
        <!-- <template #header="{ menuParam }">
            <div>
                我是头部,{{ menuParam.name }}
            </div>
        </template> -->
        <!-- <template #footer="{ menuParam }">
            <div>
                我是底部,{{ menuParam.name }}
            </div>
        </template> -->
    </LtContextmenu>
</template>

<style scoped></style>