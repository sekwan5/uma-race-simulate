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
      totalTasks: 0,
      completedTasks: 0,
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
    getStyleName(value) {
      const strValue = value.toString();

      switch (strValue) {
        case "1":
          return "도주";
        case "2":
          return "선행";
        case "3":
          return "선입";
        case "4":
          return "추입";
      }
    },
    getSurfaceName(value) {
      const strValue = value.toString();
      switch (strValue) {
        case "1":
          return "양호";
        case "2":
          return "다습";
        case "3":
          return "포화";
        case "4":
          return "불량";
      }
    },

    async execMakeMashinToTsv() {
      console.log("makeMashinToTsv 시작");

      let result = { 적성: [], 녹딱: [], 일반기: [], 고유기: [], 진화: [] };

      // 전체 작업 수 계산
      this.$refs.executeBlock.totalSkills =
        2 +
        2 +
        10 +
        this.availableSkills.speed.rare.length +
        this.availableSkills.speed.normal.length +
        this.availableSkills.acceleration.rare.length +
        this.availableSkills.acceleration.normal.length +
        this.availableSkills.composite.rare.length +
        this.availableSkills.composite.normal.length +
        this.availableSkills.speed.inherit.length +
        this.availableSkills.acceleration.inherit.length +
        this.availableSkills.composite.inherit.length +
        this.uniqueSkillData.length -
        1 +
        this.availableSkills.evo.length +
        120;

      // 진행 상황 업데이트 함수
      this.makeMashinStatus();
      this.maxEpoch = 1000;
      this.originHasSkills = JSON.parse(JSON.stringify(this.hasSkills));
      this.originHasEvoSkills = JSON.parse(JSON.stringify(this.hasEvoSkills));
      this.originUniqueLevel = JSON.parse(JSON.stringify(this.uniqueLevel));
      this.selectedSkillIds.push(...this.hasEvoSkills);
      this.selectedSkillIds.push(this.selectedUnique);
      const keys = Object.keys(this.hasSkills);
      const detailKeys = ["all", "rare", "normal", "inherit"];
      for (const key of keys) {
        for (const detailKey of detailKeys) {
          this.selectedSkillIds.push(...this.hasSkills[key][detailKey]);
        }
      }
      const nameKr = this.$i18n.messages.ko;
      const courseNames = nameKr.course;
      const courseData = this.courseList[this.track.course]; // 코스정보
      await this.runEmulation();
      // console.log("this.hasSkills", this.hasSkills);
      this.baseAvgRaceTime = this.avgRaceTime;
      console.log("기본 평균 레이스 시간:", this.baseAvgRaceTime);

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
            this.umaStatus.distanceFit === "A" && this.umaStatus.surfaceFit === "A"
              ? 0
              : ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          row["스킬명(나무)"] =
            this.getDistanceName(this.courseLength) +
            this.fitRanks[i] +
            " " +
            nameKr.surface[courseData.surface] +
            this.fitRanks[j];
          row["예상 출시일"] = "2022년 6월 20일";
          result.적성.push(row);
          this.$refs.executeBlock.completedSkills++;
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
      result["녹딱"].push(...(await this.makeSkillMashin(200271, "passive", "rare", "스피드 80", true))); //단독◎
      result["녹딱"].push(...(await this.makeSkillMashin(200301, "passive", "rare", "스피드 60", true))); //복병◎
      result["녹딱"].push(...(await this.makeSkillMashin(-200174, "passive", "rare", "스피드 파워 60", true))); //첫 봄바람
      result["녹딱"].push(...(await this.makeSkillMashin(200281, "passive", "rare", "파워 60", true))); //대항의식◎
      result["녹딱"].push(...(await this.makeSkillMashin(200291, "passive", "rare", "근성 60", true))); //집중마크◎
      result["녹딱"].push(...(await this.makeSkillMashin(202441, "passive", "rare", "승부사", false))); //승부사
      result["녹딱"].push(...(await this.makeSkillMashin(200302, "passive", "normal", "스피드 40", true))); //복병○
      result["녹딱"].push(...(await this.makeSkillMashin(200282, "passive", "normal", "파워 40", true))); //대항의식○
      result["녹딱"].push(...(await this.makeSkillMashin(200292, "passive", "normal", "근성 40", true))); //집중마크○
      result["녹딱"].push(...(await this.makeSkillMashin(202442, "passive", "normal", "모험심", false))); //모험심

      // 3. 일반기 마신 계산
      console.log("일반기 마신계산 시작");
      //3-1 계승기 마신 계산
      let inherit = [
        ...(await this.makeSkillMashinMulti(this.availableSkills.speed.inherit, "speed", "inherit")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.inherit, "acceleration", "inherit")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.composite.inherit, "composite", "inherit")),
      ];
      //3-1 일반기+계승기
      result["일반기"] = [
        ...(await this.makeSkillMashinMulti(this.availableSkills.speed.rare, "speed", "rare")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.speed.normal, "speed", "normal")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.rare, "acceleration", "rare")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.acceleration.normal, "acceleration", "normal")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.composite.rare, "composite", "rare")),
        ...(await this.makeSkillMashinMulti(this.availableSkills.composite.normal, "composite", "normal")),
        ...inherit,
      ];

      // result["일반기"] = [...(await this.makeSkillMashin(200642, "acceleration", "rare", "직선 주파"))];
      // result["일반기"] = [...(await this.makeSkillMashin(900201, "acceleration", "rare", "직선 주파"))];
      //4. 고유기 마신 계산
      console.log("고유기및 핑딱 마신계산 시작");

      if (typeof this.selectedUnique == "string" || this.selectedUnique == 1) {
        // const tmpUniqueSkills = this.uniqueSkillData.slice(1);
        for (const skill of this.uniqueSkillData.slice(1)) {
          this.selectedUnique = await skill.id;
          result["고유기"].push(...(await this.makeSkillMashin(skill.id, "unique", "unique", skill.name)));
          if (this.availableSkills.evo.length > 0) {
            this.$refs.executeBlock.totalSkills += this.availableSkills.evo.length;
            for (const evoSkill of this.availableSkills.evo) {
              result["진화"].push(...(await this.makeSkillMashin(evoSkill.id, "evo", "evo", evoSkill.name)));
            }
          }
        }
        this.selectedUnique = 1;
      } else {
        if (this.availableSkills.evo.length > 0) {
          this.$refs.executeBlock.totalSkills += this.availableSkills.evo.length;
          for (const evoSkill of this.availableSkills.evo) {
            result["진화"].push(...(await this.makeSkillMashin(evoSkill.id, "evo", "evo", evoSkill.name)));
          }
        }
      }

      // result["고유기"] = [...(await this.makeSkillMashin(100201, "unique", "unique", "앵글링"))];
      console.log("result_Final", result);

      //5.파일명 생성 및 데이터 정리

      const uniqueSkillName = this.uniqueSkillData.find(
        (skill) => skill.id === this.selectedUnique && skill.id !== 1
      )?.name; //고유기이름
      const { style, speed, power, stamina, guts, wisdom, styleFit, distanceFit, surfaceFit } = this.umaStatus;
      const hasSkillNames = [];

      const skillCategories = ["speed", "acceleration", "composite"];
      skillCategories.forEach((category) => {
        if (this.hasSkills[category].inherit.length > 0) {
          const skillNames = this.hasSkills[category].inherit
            .map((skillId) => this.availableSkills[category].inherit.find((v) => v.id === skillId)?.name)
            .filter(Boolean); // undefined 값 제거
          hasSkillNames.push(...skillNames);
        }
      });

      let filename = `${this.getStyleName(style)} - ${courseNames[this.track.location]} ${
        nameKr.surface[courseData.surface] + courseData.distance + "m" + this.courseNameSuffix(courseData.name)
      } ${this.getSurfaceName(this.track.surfaceCondition)}`;
      if (uniqueSkillName) filename += ` (고유 ${uniqueSkillName})`;
      if (hasSkillNames.length > 0) filename += ` (일반 ${hasSkillNames.join(", ")})`;

      let firstLine = `${courseNames[this.track.location]}\t${nameKr.surface[courseData.surface]}\t${
        courseData.distance
      }\t${this.getDistanceName(courseData.distance)}\t${this.getSurfaceName(
        this.track.surfaceCondition
      )}\t${this.getStyleName(style)}\t${
        speed + "/" + power + "/" + stamina + "/" + guts + "/" + wisdom
      }\t${distanceFit}\t${surfaceFit}\t${styleFit}\t${"최상"}\t${this.uniqueLevel}\t${
        this.maxEpoch
      }\t${this.courseNameSuffix(courseData.name)}`;

      firstLine += uniqueSkillName ? `\t${uniqueSkillName}` : "\t";
      firstLine += hasSkillNames.length > 0 ? `\t${hasSkillNames.join(", ")}` : "\t";
      const data = [...result["적성"], ...result["녹딱"], ...result["고유기"], ...result["진화"], ...result["일반기"]];
      this.downloadTSV(data, filename, firstLine);
      this.$emit("mashin-calculation-complete");
      this.selectedSkillIds = [];
      this.$refs.executeBlock.calculatingMashin = false;
    },

    async makeSkillMashin(skillId, skillType, rarity, custom_skillName = "", sOnes = false) {
      console.log("skillId", skillId);
      this.$refs.executeBlock.completedSkills++;
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
        if (this.selectedSkillIds.includes(Number(upperSkillId))) {
          console.log("이미 선택한 상위 스킬");
          return [];
        }
      }

      //유저가 선택한 고유기의 계승기면 스킵
      if (!skillId.toString().startsWith("1") && this.selectedUnique.toString() === "1" + skillId.toString().slice(1)) {
        console.log("이미 선택한 고유기");
        return [];
      }

      //유저가 선택한 계승기의 고유기면 스킵
      for (const lowerSkillId of lowerSkillIds) {
        if (this.selectedSkillIds.includes(Number(lowerSkillId))) {
          console.log("유저가 선택한 계승기의 고유기면 스킵");
          return [];
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

        if (once) {
          await this.runEmulation();
          skillData["마신"] = ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          skillData["표준 편차"] = (this.timeStandardDeviation * 10).toFixed(2) * 1;
        } else {
          await this.runEmulation();
          skillData["마신"] = ((this.baseAvgRaceTime - this.avgRaceTime) * 10).toFixed(2) * 1;
          skillData["표준 편차"] = (this.timeStandardDeviation * 10).toFixed(2) * 1;
          let randomPosition = [];
          randomPosition.push(this.bestTime);
          randomPosition.push(this.worstTime);
          const mashinArray = this.allRaceTime.map((time) => ((this.baseAvgRaceTime - time) * 10).toFixed(2) * 1);
          for (let i = 1; i < 6; i++) {
            this.$refs.executeBlock.randomPosition = i.toString();
            this.maxEpoch = 1;
            await this.runEmulation();
            this.maxEpoch = 1000;
            randomPosition.push(this.avgRaceTime);
          }
          const best = Math.min(...randomPosition);
          const worst = Math.max(...randomPosition);

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
        if (!this.triggeredSkills.includes(skillId)) {
          skillData["마신"] = 0;
          skillData["표준 편차"] = 0;
          skillData["최대"] = 0;
          skillData["최소"] = 0;
          skillData["중앙"] = 0;
        }

        this.triggeredSkills = [];
        this.hasSkills = JSON.parse(JSON.stringify(this.originHasSkills));
        this.hasEvoSkills = [...this.originHasEvoSkills];
        this.$refs.executeBlock.randomPosition = "0";
        this.uniqueLevel = this.originUniqueLevel;

        resultSkillDataArray.push(skillData);
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
      this.$refs.executeBlock.skillActivateAdjustment = "1";
      this.umaStatus.distanceFit = "A";
      this.umaStatus.styleFit = "A";
      this.umaStatus.surfaceFit = "A";
      this.umaStatus.condition = "0";
      if (this.courseLength < 2000) {
        this.umaStatus.speed = 1500;
        this.umaStatus.stamina = 1200;
        this.umaStatus.power = 1300;
        this.umaStatus.guts = 1200;
        this.umaStatus.wisdom = 1300;
      } else if (this.courseLength <= 2400) {
        this.umaStatus.speed = 1500;
        this.umaStatus.stamina = 1200;
        this.umaStatus.power = 1250;
        this.umaStatus.guts = 1200;
        this.umaStatus.wisdom = 1250;
      } else {
        this.umaStatus.speed = 1500;
        this.umaStatus.stamina = 1300;
        this.umaStatus.power = 1250;
        this.umaStatus.guts = 1200;
        this.umaStatus.wisdom = 1250;
      }

      //       장거리 = 1500 1300 1250 1200 1250 ( 혹은 여기에 금힐 하나 확정발동으로 넣어서)

      // 중거리 = 1500 1200 1250 1200 1250

      // 단 마일 = 1500 1200 1300 1300 1300
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

    downloadTSV(dictionaryArray, filename, firstLine) {
      let longest = dictionaryArray[0];
      for (let i = 1; i < dictionaryArray.length; i++) {
        if (Object.keys(dictionaryArray[i]).length > Object.keys(longest).length) {
          longest = dictionaryArray[i];
        }
      }
      const keys = Object.keys(longest);
      const rows = [keys, ...dictionaryArray.map((obj) => keys.map((key) => (obj[key] !== undefined ? obj[key] : "")))];
      const tsv = firstLine + "\n" + rows.map((row) => row.join("\t")).join("\n");
      const blob = new Blob([tsv], { type: "text/tab-separated-values" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${filename}.tsv`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
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
