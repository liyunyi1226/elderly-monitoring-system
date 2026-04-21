<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  page: {
    type: String,
    required: true
  }
});

const router = useRouter();

const src = computed(() => `/legacy-static/${props.page}.html`);

function backHome() {
  router.push("/home");
}
</script>

<template>
  <div class="legacy-wrap">
    <div class="legacy-toolbar">
      <button @click="backHome"><i class="fas fa-arrow-left"></i> 返回导航</button>
      <span>当前页面：{{ page }}（兼容展示）</span>
    </div>
    <iframe :src="src" title="legacy-page" />
  </div>
</template>

<style scoped>
.legacy-wrap {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.legacy-toolbar {
  background: #1e3c72;
  color: #fff;
  padding: 10px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.legacy-toolbar button {
  border: 0;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
}
iframe {
  border: 0;
  flex: 1;
  width: 100%;
}
</style>
