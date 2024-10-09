<script>
import MixinRaceCore from "./MixinRaceCore.vue";
import MixinSkills from "./data/MixinSkills.vue";
import MixinCourseData from "./data/MixinCourseData.vue";
import MixinConstants from "./data/MixinConstants.vue";
import { tsvToJson } from "./plugins/utils";

export default {
  name: "MixinMashin",
  mixins: [MixinRaceCore, MixinSkills, MixinCourseData, MixinConstants],
  data() {
    return {
      skillDB: [], // skillDB를 빈 배열로 초기화
      baseAvgRaceTime: 0,
    };
  },
  methods: {
    async getSkillDB() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/sekwan5/Auto-Table-Generator/main/skillDbBefore2.5Year.tsv"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const skillDB_tsv = await response.text();
        return tsvToJson(skillDB_tsv); // JSON 배열 반환
      } catch (error) {
        console.error("스킬 DB를 불러오는 중 오류가 발생했습니다:", error);
        return []; // 오류 발생 시 빈 배열 반환
      }
    },
    async loadSkillDB() {
      this.skillDB = await this.getSkillDB(); // skillDB를 변수에 담기
    },
    async runEmulation() {
      this.emulations = [];
      return new Promise((resolve) => {
        this.progressEpochForMashin(() => {
          resolve();
        });
      });
    },
    getDistanceName(meter) {
      if (meter < 1600) {
        return "단거리";
      } else if (meter < 2000) {
        return "마일";
      } else if (meter <= 2400) {
        return "중거리";
      } else {
        return "장거리";
      }
    },

    async execMakeMashinToTsv() {
      console.log("makeMashinToTsv 시작");

      this.makeMashinStatus();
      this.maxEpoch = 3;
      await this.runEmulation();
      this.baseAvgRaceTime = this.avgRaceTime;
      console.log("기본 평균 레이스 시간:", this.baseAvgRaceTime);

      let result_Final = { 적성: [], 녹딱: [] };

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          this.umaStatus = { ...this.umaStatus };
          this.umaStatus.distanceFit = this.fitRanks[i];
          this.umaStatus.surfaceFit = this.fitRanks[j];
          await this.runEmulation();

          let row = {};
          row["희귀"] = "적성";
          row["분류"] = "적성";
          row["마신"] =
            ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          row["스킬명"] =
            this.getDistanceName(this.courseLength) +
            this.fitRanks[i] +
            " " +
            "경기장" +
            this.fitRanks[j];
          row["예상 출시일"] = "2022년 6월 20일";
          result_Final.적성.push(row);
        }
      }

      let lastBashin =
        result_Final["적성"][result_Final["적성"].length - 1]["마신"];
      if (lastBashin < 0) {
        result_Final["적성"].forEach((row) => {
          row["마신"] += -lastBashin;
          row["마신"] = row["마신"].toFixed(2) * 1;
        });
      }

      this.umaStatus = { ...this.umaStatus };
      this.umaStatus.distanceFit = "S";

      // 3. 녹딱 마신 계산
      result_Final["녹딱"].push(
        ...(await this.makeCompleteSkillData(
          200271,
          "passive",
          "rare",
          "스피드 80",
          true
        ))
      );
      result_Final["녹딱"].push(
        ...(await this.makeCompleteSkillData(
          200301,
          "passive",
          "rare",
          "스피드 60",
          true
        ))
      );
      console.log("result_Final", result_Final);
      const tsvData = this.generateTsvData(result_Final);
      this.downloadTsv(tsvData, "result_Final.tsv"); // 파일 이름 지정
      console.log("makeMashinToTsv 완료");
    },

    async makeCompleteSkillData(
      skillId,
      skillType,
      rarity,
      custom_skillName = "",
      is777 = false
    ) {
      console.log("skillId", skillId);
      console.log("skillId", skillId);
      const skillDataArray = this.skillDB.filter(
        (skill) => skill["스킬 id"] == skillId
      );
      console.log("skillDataArray", skillDataArray);
      const resultSkillDataArray = [];

      for (const skillData of skillDataArray) {
        if (skillData["스킵"] === "TRUE") {
          continue; // 스킵된 스킬은 건너뜀
        }

        skillData["스킬명(한섭)"] = custom_skillName
          ? custom_skillName
          : skillData["스킬명(한섭)"];

        const once =
          is777 || skillData["즉발"] === "즉발" || skillData["최속"] === "TRUE"
            ? true
            : false;

        if (skillType === "passive") {
          if (rarity === "rare") {
            skillData["희귀"] = "레어/상위";
            this.hasSkills.passive.rare.push(skillId);
            if (once) {
              await this.runEmulation();
              skillData["마신"] =
                ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
              skillData["표준 편차"] =
                (this.timeStandardDeviation * 10).toFixed(2) * 1;
            }
          }
        }

        resultSkillDataArray.push(skillData);
        console.log("resultSkillDataArray", resultSkillDataArray);
      }

      return resultSkillDataArray; // 결과 배열 반환
    },

    generateTsvData(result) {
      const rows = [];
      // 헤더 추가
      rows.push(
        ["희귀", "분류", "마신", "스킬명(한섭)", "예상 출시일"].join("\t")
      );

      // 적성 데이터 추가
      for (const row of result.적성) {
        rows.push(
          [
            row["희귀"],
            row["분류"],
            row["마신"],
            row["스킬명(한섭)"],
            row["예상 출시일"],
          ].join("\t")
        );
      }

      // 녹딱 데이터 추가
      for (const row of result.녹딱) {
        rows.push(
          [
            row["희귀"],
            row["분류"],
            row["마신"],
            row["스킬명(한섭)"],
            row["예상 출시일"],
          ].join("\t")
        );
      }

      return rows.join("\n"); // TSV 형식으로 문자열 반환
    },

    makeMashinStatus() {
      this.umaStatus.condition = "0";
      this.umaStatus.speed = 1200;
      this.umaStatus.stamina = 100;
      this.umaStatus.power = 1000;
      this.umaStatus.guts = 400;
      this.umaStatus.wisdom = 400;
    },

    progressEpochForMashin(callback) {
      let epoch = 0;
      const maxEpoch = this.maxEpoch || 3;

      const runBatch = () => {
        const target = epoch + maxEpoch / 5;

        while (epoch < Math.min(target, maxEpoch)) {
          this.start();
          epoch++;
        }

        if (epoch < maxEpoch) {
          setTimeout(runBatch, 1);
        } else {
          if (callback) callback();
        }
      };

      runBatch();
    },

    downloadTsv(tsvData, fileName) {
      const blob = new Blob([tsvData], { type: "text/tab-separated-values" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();
    },
  },

  binarySearch(arr, key, target, findFirst) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
      let mid = Math.floor((left + right) / 2);

      if (parseFloat(arr[mid][key]) === parseFloat(target)) {
        result = mid;
        if (findFirst) {
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      } else if (parseFloat(arr[mid][key]) < parseFloat(target)) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return result;
  },

  computed: {
    // 필요한 계산된 속성들...
  },

  mounted() {
    this.loadSkillDB(); // skillDB를 로드하는 메서드 호출
  },
};
</script>

<style scoped>
.main-frame {
  text-align: left;
}

.input-status {
  width: 90px;
}

.emulation-result {
  text-align: center;
}

.emulation-result th {
  padding: 2px;
  min-width: 90px;
}

.emulation-result td {
  padding: 2px;
  min-width: 90px;
}
</style>

<style>
.el-collapse-item__header {
  font-size: large;
  color: blueviolet;
}
</style>
