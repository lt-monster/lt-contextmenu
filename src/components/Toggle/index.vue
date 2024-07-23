<script setup lang="ts">

type Props = {
    size?: 'small' | 'normal'
    value?: boolean
}

type Size = {
    name: string
    styles: Record<string, string>
}

const sizes: Size[] = [
    {
        name: 'small',
        styles: {
            '--checked-thumb-translateX': 'translateX(12px)',
            '--container-width': '24px',
            '--container-height': '12px',
            '--thumb-width': '10px',
            '--thumb-press-width': '14px',
            '--thumb-height': '10px',
            '--thumb-border-radius': '10px',
            '--thumb-translateX': 'translateX(1px)',
            '--thumb-top': '1px',
        }
    },
    {
        name: 'normal',
        styles: {
            '--checked-thumb-translateX': 'translateX(16px)',
            '--container-width': '32px',
            '--container-height': '16px',
            '--thumb-width': '14px',
            '--thumb-press-width': '20px',
            '--thumb-height': '14px',
            '--thumb-border-radius': '14px',
            '--thumb-translateX': 'translateX(2px)',
            '--thumb-top': '1px',
        }
    },
]

const props = withDefaults(defineProps<Props>(), {
    size: 'small',
    value: false
})

const emits = defineEmits<{
    change: [value: boolean]
}>()

const containerRef = ref<HTMLElement>()
const thumbRef = ref<HTMLElement>()

const checked = ref(props.value)
const toggleFlag = ref(false)

onMounted(() => {
    initStyles()
})

onUpdated(() => {
    initStyles()
})

function initStyles() {
    const size = sizes.find(s => s.name === props.size)
    if (size) {
        Object.keys(size.styles).forEach(p => {
            containerRef.value!.style.setProperty(p, size.styles[p])
        })
    }
}

const size = computed(() => sizes.find(s => s.name === props.size) ?? sizes[0])

function toggle(e: MouseEvent) {
    if (toggleFlag.value) {
        return
    }
    checked.value = !checked.value
    thumbRef.value!.style.width = size.value.styles['--thumb-width']

    if (!checked.value) {
        thumbRef.value!.style.transform = size.value.styles['--thumb-translateX']
    } else {
        thumbRef.value!.style.transform = size.value.styles['--checked-thumb-translateX']
    }

    emits('change', checked.value)
    toggleFlag.value = true
}

function down(e: MouseEvent) {
    if (e.button === 0) {
        thumbRef.value!.style.width = size.value.styles['--thumb-press-width']
        if (checked.value) {
            thumbRef.value!.style.transform = `translateX(calc(var(--container-width) - ${thumbRef.value!.style.width} - 2px))`
        }
    }
}

function transitionend(e: TransitionEvent) {
    if (e.propertyName === 'background-color') {
        toggleFlag.value = false
    }
}

</script>

<template>
    <div ref="containerRef" :class="checked ? 'toggle-container toggle-checked' : 'toggle-container'" @click="toggle"
        @mousedown="down">
        <div ref="thumbRef" :class="checked ? 'toggle-thumb toggle-thumb-checked' : 'toggle-thumb'"
            @transitionend="transitionend"></div>
    </div>
</template>

<style scoped>
.toggle-container {
    --checked-color: rgb(249 168 212);
    --container-color: #c8c9cc;
    --container-border-radius: 9999px;
    --container-border-width: 1px;
    --transition-duration: .2s;
    --transition-timing-function: ease-in-out;
}

.toggle-container {
    box-sizing: content-box;
    position: relative;
    width: var(--container-width);
    height: var(--container-height);
    border-radius: var(--container-border-radius);
    border: var(--container-border-width) solid var(--container-color);
    cursor: pointer;
}

.toggle-checked {
    transition: all var(--transition-duration) var(--transition-timing-function);
    border: var(--container-border-width) solid var(--checked-color);
}

.toggle-thumb {
    position: absolute;
    width: var(--thumb-width);
    height: var(--thumb-height);
    left: 0;
    transform: var(--thumb-translateX);
    top: var(--thumb-top);
    border-radius: var(--thumb-border-radius);
    background-color: var(--container-color);
    transition: all var(--transition-duration) var(--transition-timing-function);
}

.toggle-thumb-checked {
    transform: var(--checked-thumb-translateX);
    background-color: var(--checked-color);
}
</style>