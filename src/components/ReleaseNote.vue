<template>
  <div>
    <h3>{{ $t("message.lastUpdate") }}：{{ releases[releases.length - 1].timestamp }}</h3>
    <el-collapse v-model="releaseNote">
      <el-collapse-item :title="$t('message.releaseNote')">
        <el-timeline :reverse="true">
          <el-timeline-item v-for="(release, index) in releases" :key="index" :timestamp="release.timestamp">
            <div v-html="release.content"></div>
          </el-timeline-item>
        </el-timeline>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "ReleaseNote",
  data: function () {
    return {
      releaseNote: "",
      releases: [
        {
          content: "어기여차, Do ya 수정",
          timestamp: "2024-05-28",
        },
        {
          content: "진수 시리즈 추가",
          timestamp: "2024-05-28",
        },
        {
          content: "마신표 계산기 내장기능으로 포함, 일부 한글화, 온존시스템 발동여부 추가 ",
          timestamp: "2024-10-12",
        },
        {
          content: "스태미너 승부 추가 , 선택한 패시브 파일명 표시 ",
          timestamp: "2024-10-15",
        },
      ],
    };
  },
};
</script>
