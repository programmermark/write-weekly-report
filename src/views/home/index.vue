<template>
  <div class="bg-neutral-100 h-full mt-16">
    <div class="grid grid-cols-12 pt-8 rounded">
      <div class="col-start-3 col-span-8 bg-white">
        <div class="mt-8 flex justify-center flex-col">
          <div class="w-full flex justify-center">
            <div class="w-1/2 flex items-center">
              <el-input
                v-model="report"
                :rows="2"
                size="large"
                :autosize="{ minRows: 2, maxRows: 10 }"
                type="textarea"
                placeholder="输入每日周报，支持markdown语法"
              />
              <el-button
                v-show="report.length > 0"
                class="ml-6"
                type="primary"
                size="large"
                @click="saveReport"
                >提交</el-button
              >
            </div>
          </div>
          <div
            class="report-content mt-8 pt-8 border-t border-gray-200"
            v-html="reportContent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PageHome",
};
</script>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import { marked } from "marked";
import hljs from "highlight.js";
import { useReportStore } from "@/stores/report";

marked.setOptions({
  renderer: new marked.Renderer(),
  highlight: function (code) {
    return hljs.highlightAuto(code).value;
  },
  langPrefix: "hljs language-",
  gfm: true,
  pedantic: false,
  sanitize: false,
  breaks: true,
  smartLists: true,
  smartypants: false,
});

const reportStore = useReportStore();

const report = ref("");
const reportContent = computed(() => marked(report.value));

/**
 * 保存日报
 */
const saveReport = () => {
  reportStore.updateReportList(report.value);
};

watch(
  () => reportStore.currentReport,
  (nv, ov) => {
    if (nv !== ov && nv !== report.value) {
      report.value = nv;
    }
  }
);

onMounted(() => {
  reportStore.currentReport = reportStore.getTodayReport();
  report.value = reportStore.getTodayReport();
});
</script>

<style lang="scss" scoped>
.report-content {
  text-align: left;
  padding: 1rem;
  font-size: 1rem;
  line-height: 1.75;

  & :deep() h1,
  & :deep() h2,
  & :deep() h3,
  & :deep() h4,
  & :deep() h5,
  & :deep() h6 {
    font-weight: bold;
    line-height: 1.5;
    margin-top: 35px;
    margin-bottom: 10px;
    padding-bottom: 5px;
  }
  & :deep() h4 {
    font-size: 16px;
  }

  & :deep() img {
    width: 100%;
    margin: 1rem 0;
    border: 1px solid rgb(243, 244, 246);
    border-radius: 4px;
  }
  /* 美化markdown */
  & :deep() p {
    font-size: 15px;
    margin: 22px 0;
  }
  & :deep() ol {
    list-style: auto;
    padding-left: 28px;
  }
  & :deep() ul {
    list-style: auto;
    padding-left: 28px;
  }
  & :deep() li {
    font-size: 15px;
    margin-bottom: 8px;
  }
  & :deep() pre {
    display: block;
    background-color: #283646;
    padding: 0.5rem !important;
    overflow-y: auto;
    font-weight: 300;
    font-family: Menlo, monospace;
    border-radius: 0.3rem;
  }
  & :deep() pre > code {
    border: 0px !important;
    background-color: #283646 !important;
    color: #fff;
  }
  & :deep() code {
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
    margin: 0px 3px;
    width: calc(100% - 10px);
    box-sizing: border-box;
  }
  & :deep() a {
    text-decoration: none;
    color: #0269c8;
    border-bottom: 1px solid #d1e9ff;
  }
  & :deep() blockquote {
    color: #666;
    padding: 1px 23px;
    margin: 22px 0;
    border-left: 4px solid #cbcbcb;
    background-color: #f8f8f8;
  }
  & :deep() table {
    display: inline-block !important;
    font-size: 12px;
    width: auto;
    max-width: 100%;
    overflow: auto;
    border: 1px solid #f6f6f6;
  }
  & :deep() thead {
    background: #f6f6f6;
    color: #000;
    text-align: left;
  }
  & :deep() td,
  & :deep() th {
    padding: 12px 7px;
    line-height: 24px;
  }
  & :deep() td {
    min-width: 120px;
  }
}
</style>
