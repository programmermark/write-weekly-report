<template>
  <div class="fixed top-0 w-full bg-white h-16 grid grid-cols-12 shadow">
    <div class="w-full h-full flex items-center col-start-3 col-span-8">
      <div class="text-2xl font-semibold">
        <span class="text-gray-700 font-light">Write</span>
        <span class="text-orange-600 font-medium">Weekly</span>
        <span class="text-sky-500 font-bold">Report</span>
      </div>
      <div class="flex-1 flex flex-row-reverse">
        <div class="h-full flex items-center">
          <el-dropdown class="ml-6" @command="handleReportTypeChange">
            <span class="el-dropdown-link flex items-center text-orange-600">
              {{ reportTypeName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="report in reportTypeList"
                  :key="report.value"
                  :command="report.value"
                  >{{ report.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <el-dropdown class="ml-6" @command="handleExportTypeChange">
            <span class="el-dropdown-link flex items-center text-sky-500">
              {{ exportTypeName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="exportItem in exportTypeList"
                  :key="exportItem.value"
                  :command="exportItem.value"
                  >{{ exportItem.name }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "PageHeader",
};
</script>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { useReportStore } from "@/stores/report";

const reportStore = useReportStore();

const reportType = ref("daily");
const reportTypeList = ref([
  { name: "日报", value: "daily" },
  { name: "周报", value: "weekly" },
  { name: "月报", value: "monthly" },
]);
const reportTypeName = computed(() => {
  const report = reportTypeList.value.find(
    (item) => item.value === reportType.value
  );
  return report?.name as string;
});

const exportType = ref("export");
const exportTypeList = ref([
  { name: "导出", value: "export" },
  { name: "导入", value: "import" },
]);
const exportTypeName = computed(() => {
  const findExport = exportTypeList.value.find(
    (item) => item.value === exportType.value
  );
  return findExport?.name as string;
});

const handleReportTypeChange = (command: string) => {
  reportType.value = command;
  if (command === "weekly") {
    reportStore.currentReport = reportStore.getWeeklyReport();
  }
};

const handleExportTypeChange = (command: string) => {
  exportType.value = command;
};
</script>

<style lang="scss" scoped></style>
