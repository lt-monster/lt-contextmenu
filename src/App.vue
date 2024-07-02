<script setup lang="ts">
import { LtContextmenu, type MenuGroupOption, type MenuOption, type MenuValue } from '.';
import FileExport from '@/components/icons/FileExport.vue'

const ltContextmenu = ref()

const data = {
  name: 'lijiatu'
}

const menuOptions = ref<MenuGroupOption[]>([
  {
    group: 'group1',
    options: [
      {
        id: '1',
        icon: () => h(FileExport),
        label: '菜单1',
        children: [
          {
            id: '1-1',
            icon: () => h(FileExport),
            label: '菜单1-1',
            handler: (menuParam?: any, menuValue?: MenuValue, itemOption?: MenuOption) => {
              // menu click event
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
        icon: () => h(FileExport),
        label: '菜单2'
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
            handler: (menuParam: any, value?: MenuValue, itemOption?: MenuOption) => {

            }
          },
          {
            id: '3-2',
            icon: () => h(FileExport),
            label: '修改日期',
            value: 'date',
            handler: (menuParam: any, value?: MenuValue, itemOption?: MenuOption) => {

            }
          },
          {
            id: '3-3',
            icon: () => h(FileExport),
            label: '类型',
            value: 'type',
            handler: (menuParam: any, value?: MenuValue, itemOption?: MenuOption) => {

            }
          },
          {
            id: '3-4',
            icon: () => h(FileExport),
            label: '大小',
            value: 'size',
            handler: (menuParam: any, value?: MenuValue, itemOption?: MenuOption) => {

            }
          }
        ]
      },
      {
        id: '4',
        icon: () => h(FileExport),
        label: '菜单4',
        disabled: true
      }
    ]
  }
])

</script>

<template>
  <div style="width: 100%;height: 100%;" @click.right="(e) => ltContextmenu?.open(e, data)">
    <LtContextmenu ref="ltContextmenu" :menu-options="menuOptions" :width="180" menu-size="small"
      menu-theme="dark-element" />
  </div>
</template>

<style scoped></style>
