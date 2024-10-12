<template>
  <div>
    <el-form-item>
      <el-button @click="executeIndicated" type="success">
        {{ $t("message.emulateStart") }}
      </el-button>
      <el-button v-if="isAdmin" @click="makeMashinToTsv" type="success">
        {{ "마신표 제작" }}
      </el-button>
    </el-form-item>
    <el-form-item :label="$t('message.testTime')">
      <el-input-number value="20" v-model="indicatedMaxEpoch"></el-input-number>
    </el-form-item>
    <el-form-item>
      <el-button @click="executeOnce" type="info">
        {{ $t("message.emulateOnce") }}
      </el-button>
    </el-form-item>

    <el-form-item :label="$t('message.skillActivateAdjustment')">
      <el-select v-model="skillActivateAdjustment" style="width: 130px">
        <el-option :label="$t('message.skillActivateAdjustment0')" value="0"></el-option>
        <el-option :label="$t('message.skillActivateAdjustment1')" value="1"></el-option>
        <el-option :label="$t('message.skillActivateAdjustment2')" value="2"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('message.randomPosition')">
      <el-select v-model="randomPosition" style="width: 130px">
        <el-option :label="$t('message.randomPosition0')" value="0"></el-option>
        <el-option :label="$t('message.randomPosition1')" value="1"></el-option>
        <el-option :label="$t('message.randomPosition2')" value="2"></el-option>
        <el-option :label="$t('message.randomPosition3')" value="3"></el-option>
        <el-option :label="$t('message.randomPosition4')" value="4"></el-option>
        <el-option :label="$t('message.randomPosition5')" value="5"></el-option>
      </el-select>
    </el-form-item>

    <!-- 기존 팝업 -->
    <el-dialog :visible.sync="emulating" style="text-align: center">
      {{ $t("message.emulating") }}
      <el-progress :percentage="Math.min(100, Math.floor((100 * epoch) / runMaxEpoch))"></el-progress>
    </el-dialog>

    <!-- 새로운 마신 계산 진행 팝업 -->
    <el-dialog :visible.sync="calculatingMashin" style="text-align: center">
      {{ `스킬 시뮬레이션 진행 중... ${this.completedSkills}/${this.totalSkills}` }}
      <el-progress :percentage="Math.min(100, Math.floor((100 * completedSkills) / totalSkills))"></el-progress>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ExecuteBlock",
  props: ["execFunction", "execMakeMashinToTsv"],
  data() {
    return {
      // 기존 데이터
      epoch: 0,
      indicatedMaxEpoch: 50,
      runMaxEpoch: 50,
      emulating: false,
      skillActivateAdjustment: "0",
      randomPosition: "0",

      // 새로운 데이터
      calculatingMashin: false,
      completedSkills: 0,
      totalSkills: 0,

      isAdmin: false,
    };
  },
  computed: {
    progressPercentage() {
      return this.totalSkills > 0 ? Math.min(100, Math.floor((100 * this.completedSkills) / this.totalSkills)) : 0;
    },
    progressMessage() {
      return `스킬 시뮬레이션 진행 중... ${this.completedSkills}/${this.totalSkills}`;
    },
  },
  created() {
    this.indicatedMaxEpoch = localStorage.getItem("maxEpoch");
    if (!this.indicatedMaxEpoch) {
      this.indicatedMaxEpoch = 50;
    }
  },
  watch: {
    indicatedMaxEpoch(value) {
      localStorage.setItem("maxEpoch", value);
    },
  },
  methods: {
    executeIndicated() {
      this.runMaxEpoch = this.indicatedMaxEpoch;
      this.execute();
    },
    executeOnce() {
      this.runMaxEpoch = 1;
      this.execute();
    },
    execute() {
      this.emulating = true;
      this.epoch = 0;
      this.execFunction(this.runMaxEpoch);
    },
    makeMashinToTsv() {
      this.calculatingMashin = true;
      this.completedSkills = 0;
      this.totalSkills = 0;
      this.execMakeMashinToTsv();
    },
    checkAdminStatus() {
      const hash = window.location.hash;
      const searchParams = new URLSearchParams(hash.split("?")[1]);
      this.isAdmin = searchParams.get("admin") === "true";
    },
  },
  mounted() {
    this.checkAdminStatus();
    // 라우트 변경 시에도 관리자 상태를 확인합니다
    this.$router.afterEach(() => {
      this.checkAdminStatus();
    });
  },
  beforeDestroy() {},
};
</script>

<style scoped></style>
