<template>
  <div>
    <el-form-item>
      <el-button @click="executeIndicated" type="success">
        {{ $t("message.emulateStart") }}
      </el-button>
      <el-button @click="makeMashinToTsv" type="success">
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

    <el-dialog :visible.sync="emulating" style="text-align: center">
      {{ $t("message.emulating") }}
      <el-progress :percentage="Math.min(100, Math.floor((100 * epoch) / runMaxEpoch))"></el-progress>
      <p>
        <!--<Adsense v-if="$parent.production"
                 data-ad-client="ca-pub-4611969396217909"
                 data-ad-slot="6969023753">
        </Adsense>
        <adfit-banner
          v-if="$parent.production"
          class="kakao_ad_area"
          data-ad-unit="DAN-vJ9rL4rqJ1hzbVdW">
        </adfit-banner>-->
      </p>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ExecuteBlock",
  props: ["execFunction", "execMakeMashinToTsv"], // execMakeMashinToTsv 추가
  data() {
    return {
      epoch: 0,
      indicatedMaxEpoch: 50,
      runMaxEpoch: 50,
      emulating: false,
      skillActivateAdjustment: "0",
      randomPosition: "0",
    };
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
      // this.emulating = true;
      this.epoch = 0;
      this.execMakeMashinToTsv(); // MixinRaceCore의 execMakeMashinToTsv 함수 호출
    },
  },
};
</script>

<style scoped></style>
