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
      originHasSkills: {},
      selectedSkillIds: [],
      originUniqueLevel: 0,
      originHasEvoSkills: [],
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
      this.maxEpoch = 1;
      this.originHasSkills = this.hasSkills;
      this.originHasEvoSkills = this.hasEvoSkills;
      this.originUniqueLevel = this.uniqueLevel;
      this.selectedSkillIds.push(...this.hasEvoSkills);
      const keys = Object.keys(this.hasSkills);
      const detailKeys = ["all", "rare", "normal", "inherit"];
      for (const key of keys) {
        for (const detailKey of detailKeys) {
          this.selectedSkillIds.push(...this.hasSkills[key][detailKey]);
        }
      }
      await this.runEmulation();
      // console.log("this.hasSkills", this.hasSkills);
      this.baseAvgRaceTime = this.avgRaceTime;
      console.log("기본 평균 레이스 시간:", this.baseAvgRaceTime);

      let result = { 적성: [], 녹딱: [], 일반기: [], 고유기: [] };

      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          this.umaStatus = { ...this.umaStatus };
          this.umaStatus.distanceFit = this.fitRanks[i];
          this.umaStatus.surfaceFit = this.fitRanks[j];
          await this.runEmulation();

          let row = {};
          row["희귀"] = "적성";
          row["분류"] = "적성";
          row["마신"] = ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          row["스킬명"] =
            this.getDistanceName(this.courseLength) + this.fitRanks[i] + " " + "경기장" + this.fitRanks[j];
          row["예상 출시일"] = "2022년 6월 20일";
          result.적성.push(row);
        }
      }

      let lastBashin = result["적성"][result["적성"].length - 1]["마신"];
      if (lastBashin < 0) {
        result["적성"].forEach((row) => {
          row["마신"] += -lastBashin;
          row["마신"] = row["마신"].toFixed(2) * 1;
        });
      }

      this.umaStatus = { ...this.umaStatus };
      this.umaStatus.distanceFit = "S";

      // 3. 녹딱 마신 계산
      console.log("녹딱 마신계산 시작");
      // result["녹딱"].push(...(await this.makeSkillMashin(200271, "passive", "rare", "스피드 80", true))); //단독◎
      // result["녹딱"].push(...(await this.makeSkillMashin(200301, "passive", "rare", "스피드 60", true))); //복병◎
      // result["녹딱"].push(...(await this.makeSkillMashin(-200174, "passive", "rare", "스피드 파워 60", true))); //첫 봄바람
      // result["녹딱"].push(...(await this.makeSkillMashin(200281, "passive", "rare", "파워 60", true))); //대항의식◎
      // result["녹딱"].push(...(await this.makeSkillMashin(200291, "passive", "rare", "근성 60", true))); //집중마크◎
      // result["녹딱"].push(...(await this.makeSkillMashin(202441, "passive", "rare", "승부사", false))); //승부사
      // result["녹딱"].push(...(await this.makeSkillMashin(200302, "passive", "normal", "스피드 40", true))); //복병○
      // result["녹딱"].push(...(await this.makeSkillMashin(200282, "passive", "normal", "파워 40", true))); //대항의식○
      // result["녹딱"].push(...(await this.makeSkillMashin(200292, "passive", "normal", "근성 40", true))); //집중마크○
      // result["녹딱"].push(...(await this.makeSkillMashin(202442, "passive", "normal", "모험심", false))); //모험심

      // 3. 일반기 마신 계산
      console.log("일반기 마신계산 시작");
      //3-1 계승기 마신 계산
      // let inherit = [
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.speed.inherit, "speed", "inherit")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.inherit, "acceleration", "inherit")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.composite.inherit, "composite", "inherit")),
      // ];
      //3-1 일반기+계승기
      // result["일반기"] = [
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.speed.rare, "speed", "rare")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.speed.normal, "speed", "normal")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.rare, "acceleration", "rare")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.normal, "acceleration", "normal")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.composite.rare, "composite", "rare")),
      //   ...(await this.makeSkillMashinMulti(this.availableSkills.composite.normal, "composite", "normal")),
      //   ...inherit,
      // ];

      //4. 고유기를 선택하지 않았을때만 고유기 마신 계산
      console.log("고유기 마신계산 시작");

      // if (typeof this.selectedUnique == "string" || this.selectedUnique == 1) {
      //   const tmpUniqueSkills = this.uniqueSkillData.slice(1);
      //   result["고유기"] = [...(await this.makeSkillMashinMulti(tmpUniqueSkills, "unique", "unique"))];
      //   //다 끝났으니 고유기 없음 클릭
      //   this.selectedUnique = 1;
      // }
      for (const data of this.uniqueSkillData.slice(1)) {
        this.selectedUnique = await data.id;
        console.log("this.selectedUnique", this.selectedUnique);
        console.log("this.availableSkills.evo", this.availableSkills.evo);
      }

      // result["고유기"] = [
      //   ...(await this.makeSkillMashin(910061, "unique", "unique", "크리스마스 이브의 미라클 런!")),
      //   ...(await this.makeSkillMashin(110041, "unique", "unique", "뭉클하게♪Chu")),
      // ];
      // const tsvData = this.generateTsvData(result_Final);
      // this.downloadTsv(tsvData, "result_Final.tsv"); // 파일 이름 지정
      console.log("result_Final", result);
      console.log("makeMashinToTsv 완료");
    },

    async makeSkillMashin(skillId, skillType, rarity, custom_skillName = "", sOnes = false) {
      console.log("skillId", skillId);

      const skillDataArray = this.skillDB.filter((skill) => skill["스킬 id"] == Math.abs(skillId)) ?? [];
      // console.log("skillDataArray", skillDataArray);
      const resultSkillDataArray = [];

      const upperSkillIds = this.skillDB
        .filter((v) => v["그룹"] === skillDataArray[0]["그룹"] && v["단계"] > skillDataArray[0]["단계"])
        .map((v) => v["스킬 id"]);
      const lowerSkillIds = this.skillDB
        .filter((v) => v["그룹"] === skillDataArray[0]["그룹"] && v["단계"] < skillDataArray[0]["단계"])
        .map((v) => v["스킬 id"]);

      // 이미 선택한스킬 스킵
      if (this.selectedSkillIds.includes(skillId)) {
        console.log("이미 선택한 스킬");
        return [];
      }
      //선택한 스킬의 하위 스킬이면 스킵
      for (const upperSkillId of upperSkillIds) {
        if (this.selectedSkillIds.includes(upperSkillId)) {
          console.log("이미 선택한 상위 스킬");
          return [];
        }
      }
      //유저가 선택한 고유기의 계승기면 스킵
      if (this.selectedUnique.toString() === "1" + skillId.toString().slice(1)) {
        console.log("이미 선택한 고유기");
        return [];
      }
      //유저가 선택한 계승기의 고유기면 스킵
      if (rarity === "inherit") {
        for (const lowerSkillId of lowerSkillIds) {
          if (this.selectedSkillIds.includes(lowerSkillId)) {
            return [];
          }
        }
      }

      //스킬DB에 없는 스킬이면 데이터 새로 만듦
      if (skillDataArray.length === 0) {
        const newSkillData = {
          "스킬 id": skillId,
          "스킬명(한섭)": custom_skillName,
          분류: skillType,
        };
        console.log("스킬DB에 없는 스킬");
        skillDataArray.push(newSkillData);
      }

      if (typeof this.selectedUnique !== "string" || this.selectedUnique !== 1) {
        if (this.availableSkills.evo.length > 0) {
          console.log("this.availableSkills.evo", this.availableSkills.evo);
          // resultSkillDataArray.push(...(await this.makeSkillMashinMulti(this.availableSkills.evo, "evo", "evo")));
        }
      }

      for (const skillData of skillDataArray) {
        if (skillData["스킵"] === "TRUE") {
          console.log("스킵된 스킬");
          continue; // 스킵된 스킬은 건너뜀
        }

        skillData["스킬명(한섭)"] = custom_skillName ? custom_skillName : skillData["스킬명(한섭)"];

        // TODO 트리거 추가
        //트리거가 적혀있으면 다 활성화
        let foundTriggers = []; //최종적으로 페이지에서 발견된 트리거들

        if (skillData["트리거 스킬 id"]) {
          const triggerIdArray = skillData["트리거 스킬 id"].split(", ").map((e) => e.split("/"));
          for (const array of triggerIdArray) {
            for (const id of array) {
              const result = this.findSkillInAvailableSkills(this.availableSkills, Number(id));
              if (result) {
                this.hasSkills[result.category][result.rarity].push(Number(id));
                foundTriggers.push(Number(id));
                break;
              }
            }
          }

          //모든 array를 다 돌았는데 길이가 다르면 이 파생스킬은 건너뜀. 도주 아닐때 말괄량이 미라클런 등.
          if (triggerIdArray.length !== foundTriggers.length) {
            console.log("모든 array를 다 돌았는데 길이가 다르면 이 파생스킬은 건너뜀");
            continue;
          }
        }
        //최속으로 바꿔야하는 가장빠르게 발동으로 바꾸기 ex)클구리
        if (skillData["최속"] === "TRUE") {
          console.log("최속으로 바꿔야하는 가장빠르게 발동으로 바꾸기");
          this.$refs.executeBlock.randomPosition = "1";
        }

        //진화스킬이면 고유기 레벨 0
        if (rarity === "evo") {
          this.uniqueLevel = 0;
        }

        const once = sOnes || skillData["즉발"] === "즉발" || skillData["최속"] === "TRUE";

        for (const lowerSkillId of lowerSkillIds) {
          if (this.selectedSkillIds.includes(lowerSkillId)) {
            const { updatedSkillData, removed } = this.removehasSkills(this.hasSkills, lowerSkillId);
            if (removed) {
              this.hasSkills = updatedSkillData;
            }
          }
        }

        const skillTypes = ["passive", "speed", "acceleration", "composite"];
        const rarityMap = {
          inherit: "계승",
          rare: "레어/상위",
          normal: "일반/하위",
          unique: "고유",
          evo: "진화",
        };
        if (skillType === "unique") {
          skillData["희귀"] = "고유";
          this.selectedUnique = skillId;
        } else if (skillType === "evo") {
          skillData["희귀"] = "진화";
          this.hasEvoSkills.push(skillId);
        } else if (skillTypes.includes(skillType)) {
          skillData["희귀"] = rarityMap[rarity];
          this.hasSkills[skillType][rarity].push(skillId);
        }

        // console.log("randomPosition", this.$refs.executeBlock.randomPosition);
        if (once) {
          await this.runEmulation();
          skillData["마신"] = ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          skillData["표준 편차"] = (this.timeStandardDeviation * 10).toFixed(2) * 1;
        } else {
          await this.runEmulation();
          let randomPosition = [];
          randomPosition.push(this.bestTime);
          randomPosition.push(this.worstTime);
          const mashinArray = this.allRaceTime.map((time) => ((this.baseAvgRaceTime - time) * 10).toFixed(2) * 1);
          for (let i = 1; i < 6; i++) {
            this.$refs.executeBlock.randomPosition = i.toString();
            await this.runEmulation();
            randomPosition.push(this.avgRaceTime);
          }
          const best = Math.min(...randomPosition);
          const worst = Math.max(...randomPosition);

          // console.log("randomPosition", randomPosition);
          this.$refs.executeBlock.randomPosition = "0";
          skillData["최대"] = ((this.baseAvgRaceTime - best) * 10).toFixed(2) * 1;
          skillData["최소"] = ((this.baseAvgRaceTime - worst) * 10).toFixed(2) * 1;
          skillData["중앙"] = this.calculateMedian(mashinArray).toFixed(2) * 1;
          const quotient = Math.floor(skillData["최대"] / 0.5);

          for (let i = 1; i <= quotient; i++) {
            const key = `≥${0.5 * i}`;
            const ratio =
              (mashinArray.filter((bashin) => bashin >= 0.5 * i).length / mashinArray.length).toFixed(2) * 1;
            skillData[key] = ratio;
          }
        }

        this.hasSkills = { ...this.originHasSkills };
        this.hasEvoSkills = [...this.originHasEvoSkills];
        this.$refs.executeBlock.randomPosition = "0";
        this.uniqueLevel = this.originUniqueLevel;

        resultSkillDataArray.push(skillData);
        // console.log("resultSkillDataArray", resultSkillDataArray);
      }

      return resultSkillDataArray; // 결과 배열 반환
    },
    async makeSkillMashinMulti(skills, skillType, rarity) {
      const result = [];
      for (const skill of skills) {
        result.push(...(await this.makeSkillMashin(skill.id, skillType, skill.rate || rarity, skill.name)));
      }
      return result;
    },
    removehasSkills(hasSkills, id) {
      // 깊은 복사를 통해 원본 데이터를 변경하지 않고 새로운 객체를 생성합니다.
      const updatedSkillData = JSON.parse(JSON.stringify(hasSkills));
      let removed = false;

      for (const category in updatedSkillData) {
        for (const rarity in updatedSkillData[category]) {
          const index = updatedSkillData[category][rarity].indexOf(id);
          if (index !== -1) {
            updatedSkillData[category][rarity].splice(index, 1);
            removed = true;
            break;
          }
        }
        if (removed) break;
      }

      return {
        updatedSkillData,
        removed,
      };
    },
    findSkillInAvailableSkills(skillData, id) {
      for (const category in skillData) {
        if (Array.isArray(skillData[category])) {
          const found = skillData[category].find((item) => String(item.id) === String(id));
          if (found) {
            return { category, rarity: "all", id: found };
          }
        } else if (typeof skillData[category] === "object" && skillData[category] !== null) {
          for (const rarity in skillData[category]) {
            const skills = skillData[category][rarity];
            if (Array.isArray(skills)) {
              const found = skills.find((item) => String(item.id) === String(id));
              if (found) {
                return { category, rarity, id: found };
              }
            }
          }
        }
      }

      console.log(`ID ${id} not found`);
      return null;
    },
    calculateMedian(array) {
      // 배열을 오름차순으로 정렬
      array.sort(function (a, b) {
        return a - b;
      });

      var length = array.length;
      var middleIndex = Math.floor(length / 2);

      if (length % 2 === 0) {
        // 배열의 길이가 짝수인 경우
        var middleValue1 = array[middleIndex - 1];
        var middleValue2 = array[middleIndex];
        return (middleValue1 + middleValue2) / 2;
      } else {
        // 배열의 길이가 홀수인 경우
        return array[middleIndex];
      }
    },

    generateTsvData(result) {
      const rows = [];
      // 헤더 추가
      rows.push(["희귀", "분류", "마신", "스킬명(한섭)", "예상 출시일"].join("\t"));

      // 적성 데이터 추가
      for (const row of result.적성) {
        rows.push([row["희귀"], row["분류"], row["마신"], row["스킬명(한섭)"], row["예상 출시일"]].join("\t"));
      }

      // 녹딱 데이터 추가
      for (const row of result.녹딱) {
        rows.push([row["희귀"], row["분류"], row["마신"], row["스킬명(한섭)"], row["예상 출시일"]].join("\t"));
      }

      return rows.join("\n"); // TSV 형식으로 문자열 반환
    },

    makeMashinStatus() {
      this.umaStatus.condition = "0";
      this.umaStatus.speed = 1200;
      this.umaStatus.stamina = 1000;
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
