<template>
  <div class="max-w-[800px] w-full mx-auto relative mt-32">
    <text-transformer :text="currentText" />
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TextTransformer from './TextTransformer.vue'

const currentText = ref('Mit diesem Text wird die Komponente gemounted. ')

onMounted(() => {

  setTimeout(() => {
    currentText.value = 'Jetzt kommt noch ein Text um die Bewegung zu testen.'
  }, 3000)

  setTimeout(() => {
    currentText.value = 'Ein dritter Text um sicher zu stellen, dass alles funktioniert. '
  }, 6000)
})
</script>