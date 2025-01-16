<script setup lang="ts">
import { LtContextmenu, type MenuGroupOption, type MenuOption, type MenuValue } from '.';
import FileExport from '@/components/icons/FileExport.vue'
import GoogleContextmenu from '@/components/tests/GoogleContextmenu.vue'
import Toggle from '@/components/Toggle/index.vue'

const ltContextmenu = ref<InstanceType<typeof GoogleContextmenu>>()

const data = ref({
  name: 'lijiatu',
  children: ['1', '2']
})

</script>

<template>
  <div style="display: flex;justify-content: flex-start;align-items: center;">
    <div class="div-main" @click.right="(e) => ltContextmenu?.open(e, data)">
      <GoogleContextmenu ref="ltContextmenu" />
    </div>
    <!-- <Toggle />
    <svg t="1721319046134" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
      p-id="2726" width="200" height="200">
      <path
        d="M284.202667 258.005333a232.32 232.32 0 0 0-9.728 8.832 341.376 341.376 0 1 0 477.269333 2.133334 245.76 245.76 0 0 0-11.946667-10.88 45.653333 45.653333 0 0 1-7.552-60.714667 40.021333 40.021333 0 0 1 58.538667-7.68c10.624 8.917333 19.072 16.597333 25.429333 23.04A426.154667 426.154667 0 0 1 938.666667 512c0 235.648-191.018667 426.666667-426.666667 426.666667S85.333333 747.648 85.333333 512a426.197333 426.197333 0 0 1 147.2-322.346667 40.490667 40.490667 0 0 1 59.221334 7.722667 45.525333 45.525333 0 0 1-7.552 60.586667zM469.333333 469.333333V128a42.666667 42.666667 0 0 1 85.333334 0v341.333333a42.666667 42.666667 0 0 1-85.333334 0z"
        fill="#5D6E7F" p-id="2727"></path>
    </svg> -->
  </div>
</template>

<style scoped>
.toggle-main {
  position: relative;
  border: 1px solid pink;
  border-radius: 9999px;
  height: 1em;
  width: 2em;
  cursor: pointer;
}

.toggle-main>div {
  width: .8em;
  height: .8em;
  background: pink;
  border-radius: 9999px;
  position: absolute;
  top: .1em;
  left: .1em;
}

.div-main {
  width: 200px;
  height: 200px;
  background-color: palevioletred;
  margin: 100px;
}
.div-main:hover{
  background-color: skyblue;
}
</style>
