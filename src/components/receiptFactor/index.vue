<template>
	<div class="container">
		<div v-if="isLoading" class="loading-spinner">
			<div class="spinner"></div>
			<p class="percentage-text">{{ percentage }}%</p>
		</div>
		<div class="toolbar">
			<div id="errMsg" class="message hidden"></div>
			<div id="normalMsg" class="message hidden"></div>
		</div>
		<div class="wrapper">
			<article id="detail">
				<section id="top">
					<el-form method="post" enctype="multipart/form-data">
						<div id="dragDropArea" @dragover.prevent @drop="handleDrop">
							<div class="drag-drop-inside">
								<p class="drag-drop-info">드래그 & 드롭</p>
								<p class="drag-drop-buttons">
									or
									<button type="button" class="custom-button" @click="triggerFileInput">파일 선택</button>
									<input
										id="fileInput"
										type="file"
										accept="image/*"
										multiple="multiple"
										value="파일 선택"
										name="photo"
										@change="handleFileInput"
										style="display: none"
									/>
								</p>
								<p id="uiUploadFromClipboard">
									or
									<button type="button" id="btnUploadFromClipboard" class="custom-button" @click="uploadFromClipboard">
										클립보드에서 붙여넣기
									</button>
								</p>
								<p>자동으로 정렬되므로 순서는 신경 쓰지 않아도 됩니다!</p>
								<p>※수동으로 잘라낸 스크린샷은 지원하지 않습니다.</p>
								<p>
									PC 버전이라면 Alt+PrintScreen 등, PC클라이언트 창을 자동으로 잘라내는 기능으로 스크린샷을
									준비해주세요.
								</p>
							</div>
						</div>
						<div id="PreAlert"></div>
						<div id="previewArea">
							<div class="previewWrap">
								<div v-for="(photo, index) in photos" :key="index" class="previewItem">
									<div class="functionWrap">
										<div class="icon--cross" @click="deletePhoto(index)"></div>
									</div>
									<img class="previewImage" :src="photo" />
								</div>
							</div>
						</div>
						<div class="considerWrap">
							<el-checkbox v-model="form.showHeader">헤더 표시</el-checkbox>
						</div>
						<el-form-item>
							<el-button
								id="btnSubmit"
								type="success"
								:class="{
									disable: isImgNotReady || isCvNotReady,
									imgNotReady: isImgNotReady,
									cvNotReady: isCvNotReady,
								}"
								@click="generatePhoto"
							>
								제작
							</el-button>
							<el-button
								id="btnReset"
								type="info"
								:class="{ disable: isImgNotReady, imgNotReady: isImgNotReady }"
								@click="resetPage"
							>
								리셋
							</el-button>
						</el-form-item>
					</el-form>
				</section>
				<hr />
				<section id="overview">
					<div id="SaveBtnArea" class="buttonArea hidden">
						<button id="btnSaveJPG" class="btn weak" value="JPG" @click="saveOriginal('jpg')">JPG로 저장</button>
						<button id="btnSavePNG" class="btn weak" value="PNG" @click="saveOriginal('png')">PNG로 저장</button>
						<button id="btnSaveClipBoard" class="btn weak" value="clibBoard" @click="saveToClipBoard">📋에 복사</button>
					</div>
					<p id="outputAreaText" class="overviewTitle">이곳에 결과가 표시됩니다</p>
					<p id="toggleSizeText" class="overviewTitle hidden">이미지 탭으로 표시 크기 전환</p>
					<img id="outputImage" class="hidden" src="" />
				</section>
				<hr />
				<section id="howto">
					<h3>사용 방법</h3>
					<div class="markdown-body editormd-preview-container" id="memo_text">
						<p>
							1. 화면을 스크롤하면서 스크린샷을 촬영합니다.<br />
							・적어도 두 줄씩 겹치도록 촬영해 주세요.<br />
							・스마트폰의 알림등 우마무스메 화면 이외의 것이 찍히지 않도록 해 주세요.<br />
						</p>
						<p>
							2. 이 사이트에 스크린샷을 가져옵니다.<br />
							・가져오는 순서는 상관없습니다. 자동으로 정렬됩니다.<br />
							・불필요한 이미지는 각 미리보기 이미지 왼쪽 상단의 ✕를 탭하여 삭제할 수 있습니다.<br />
							・여러 이미지를 한번에 가져올 수 있습니다.<br />
							・클립보드에서 붙여넣기는 지원하는 브라우저 및 OS에서만 사용할 수 있습니다.<br />
							Windows 11의 Chrome, Edge에서 동작 확인했습니다.<br />
							・클립보드에서 붙여넣기는 Ctrl+V로도 가능합니다.
						</p>
						<p>
							3. 생성 버튼을 탭합니다.<br />
							・가져온 이미지의 수에 따라 최대 수십 초 시간이 걸립니다.<br />
							・겹치는 방법을 제대로 특정할 수 없을 경우 위아래로 연결합니다.
						</p>
						<p>
							4. 출력된 영수증 이미지를 확인하고 저장 버튼을 탭합니다.<br />
							・출력된 이미지를 탭하면 1:1 비율로 표시와 화면 너비에 맞춘 표시를 전환할 수 있습니다.<br />
							・리셋 버튼으로 모든 미리보기 이미지와 출력 결과를 삭제하고 처음부터 다시 시작할 수 있습니다.<br />
							・iOS에서 이미지 앱에 저장하고 싶을 경우 이미지를 길게 눌러 저장해 주세요.<br />
						</p>
						<!-- <p>
							β. 인자에 스킬 아이콘 추가<br />
							・각 인자에 스킬 아이콘을 추가합니다.<br />
							・시나리오 인자 등의 능력이 상승하는 인자는 파란 아이콘을 추가합니다.<br />
							・인자 이름을 제대로 가져올 수 없었던 경우에는 [？]가 추가됩니다.<br />
							・가져온 이미지의 해상도가 낮을수록 정확도가 떨어집니다. 세로 길이 1500px 이상의 이미지를 권장합니다.<br />
							・스킬 정보는 <a href="https://ウマ娘.攻略.tools/" target="_blank" rel="noopener">U-tools</a>에서
							제공받았습니다.
						</p> -->
					</div>
				</section>
				<hr />
				<update-note />
				<hr />
			</article>
		</div>
		<div class="hidden" style="display: none">
			<img id="tmplClose" src="./img/tmpl_close.png" />
			<img id="tmplGrowthRate" src="./img/tmpl_growth_rate.png" />
			<img id="tmplRegisterPartner" src="./img/tmpl_register_partner.png" />
			<img id="tmplUnregisterPartner" src="./img/tmpl_unregister_partner.png" />
			<img id="tmpl1Factor" src="./img/tmpl_1factor.png" />
			<img id="tmplFactorDisc" src="./img/tmpl_factor_disc.png" />
			<img id="tmplHeaderTextResultTable" src="./img/tmpl_header_text_result_table.png" />
			<img id="tmplHeaderTextUmaDetail" src="./img/tmpl_header_text_uma_detail.png" />
			<img id="tmplHeaderTextScoreInfo" src="./img/tmpl_header_text_score_info.png" />
			<img id="tmplHeaderTextScoreDetail" src="./img/tmpl_header_text_score_detail.png" />
			<img id="tmplHeaderTextField" src="./img/tmpl_header_text_field.png" />
			<img id="tmplHeaderTextRaceDetail" src="./img/tmpl_header_text_race_detail.png" />
			<img id="tmplHeaderTextGougai" src="./img/tmpl_header_text_gougai.png" />
			<div id="tmpCanvasScrolls"></div>
			<div id="tmpSkillIcons">
				<img id="skillIcon10011" src="./img/skill_icons/10011.webp" />
				<img id="skillIcon10012" src="./img/skill_icons/10012.webp" />
				<img id="skillIcon10013" src="./img/skill_icons/10013.webp" />
				<img id="skillIcon10014" src="./img/skill_icons/10014.webp" />
				<img id="skillIcon10016" src="./img/skill_icons/10016.webp" />
				<img id="skillIcon10021" src="./img/skill_icons/10021.webp" />
				<img id="skillIcon10022" src="./img/skill_icons/10022.webp" />
				<img id="skillIcon10023" src="./img/skill_icons/10023.webp" />
				<img id="skillIcon10024" src="./img/skill_icons/10024.webp" />
				<img id="skillIcon10026" src="./img/skill_icons/10026.webp" />
				<img id="skillIcon10031" src="./img/skill_icons/10031.webp" />
				<img id="skillIcon10032" src="./img/skill_icons/10032.webp" />
				<img id="skillIcon10033" src="./img/skill_icons/10033.webp" />
				<img id="skillIcon10034" src="./img/skill_icons/10034.webp" />
				<img id="skillIcon10036" src="./img/skill_icons/10036.webp" />
				<img id="skillIcon10041" src="./img/skill_icons/10041.webp" />
				<img id="skillIcon10042" src="./img/skill_icons/10042.webp" />
				<img id="skillIcon10043" src="./img/skill_icons/10043.webp" />
				<img id="skillIcon10044" src="./img/skill_icons/10044.webp" />
				<img id="skillIcon10046" src="./img/skill_icons/10046.webp" />
				<img id="skillIcon10051" src="./img/skill_icons/10051.webp" />
				<img id="skillIcon10052" src="./img/skill_icons/10052.webp" />
				<img id="skillIcon10053" src="./img/skill_icons/10053.webp" />
				<img id="skillIcon10054" src="./img/skill_icons/10054.webp" />
				<img id="skillIcon10056" src="./img/skill_icons/10056.webp" />
				<img id="skillIcon10061" src="./img/skill_icons/10061.webp" />
				<img id="skillIcon20011" src="./img/skill_icons/20011.webp" />
				<img id="skillIcon20012" src="./img/skill_icons/20012.webp" />
				<img id="skillIcon20013" src="./img/skill_icons/20013.webp" />
				<img id="skillIcon20014" src="./img/skill_icons/20014.webp" />
				<img id="skillIcon20015" src="./img/skill_icons/20015.webp" />
				<img id="skillIcon20016" src="./img/skill_icons/20016.webp" />
				<img id="skillIcon20021" src="./img/skill_icons/20021.webp" />
				<img id="skillIcon20024" src="./img/skill_icons/20024.webp" />
				<img id="skillIcon20041" src="./img/skill_icons/20041.webp" />
				<img id="skillIcon20044" src="./img/skill_icons/20044.webp" />
				<img id="skillIcon20051" src="./img/skill_icons/20051.webp" />
				<img id="skillIcon20061" src="./img/skill_icons/20061.webp" />
				<img id="skillIcon20064" src="./img/skill_icons/20064.webp" />
				<img id="skillIcon20091" src="./img/skill_icons/20091.webp" />
				<img id="skillIcon20101" src="./img/skill_icons/20101.webp" />
				<img id="skillIcon20111" src="./img/skill_icons/20111.webp" />
				<img id="skillIcon20121" src="./img/skill_icons/20121.webp" />
				<img id="skillIcon20131" src="./img/skill_icons/20131.webp" />
				<img id="skillIcon20141" src="./img/skill_icons/20141.webp" />
				<img id="skillIcon20151" src="./img/skill_icons/20151.webp" />
				<img id="skillIcon20161" src="./img/skill_icons/20161.webp" />
				<img id="skillIcon20171" src="./img/skill_icons/20171.webp" />
				<img id="skillIcon20181" src="./img/skill_icons/20181.webp" />
				<img id="skillIcon20191" src="./img/skill_icons/20191.webp" />
				<img id="skillIcon20201" src="./img/skill_icons/20201.webp" />
				<img id="skillIcon20202" src="./img/skill_icons/20202.webp" />
				<img id="skillIcon20211" src="./img/skill_icons/20211.webp" />
				<img id="skillIcon20212" src="./img/skill_icons/20212.webp" />
				<img id="skillIcon20221" src="./img/skill_icons/20221.webp" />
				<img id="skillIcon20241" src="./img/skill_icons/20241.webp" />
				<img id="skillIcon20261" src="./img/skill_icons/20261.webp" />
				<img id="skillIcon30011" src="./img/skill_icons/30011.webp" />
				<img id="skillIcon30021" src="./img/skill_icons/30021.webp" />
				<img id="skillIcon30041" src="./img/skill_icons/30041.webp" />
				<img id="skillIcon30051" src="./img/skill_icons/30051.webp" />
				<img id="skillIcon30071" src="./img/skill_icons/30071.webp" />
				<img id="skillIcon3001111" src="./img/skill_icons/3001111.webp" />
				<img id="skillIcon3001121" src="./img/skill_icons/3001121.webp" />
				<img id="skillIcon3001131" src="./img/skill_icons/3001131.webp" />
				<img id="skillIcon3001141" src="./img/skill_icons/3001141.webp" />
				<img id="skillIcon3001151" src="./img/skill_icons/3001151.webp" />
				<img id="skillIcon3001191" src="./img/skill_icons/3001191.webp" />
				<img id="skillIcon3002121" src="./img/skill_icons/3002131.webp" />
				<img id="skillIcon3002131" src="./img/skill_icons/3002131.webp" />
				<img id="skillIcon3002141" src="./img/skill_icons/3002141.webp" />
				<img id="skillIcon3002151" src="./img/skill_icons/3002151.webp" />
				<img id="skillIcon3002191" src="./img/skill_icons/3002191.webp" />
				<img id="skillIcon3003131" src="./img/skill_icons/3003131.webp" />
				<img id="skillIcon3003141" src="./img/skill_icons/3003141.webp" />
				<img id="skillIcon3003151" src="./img/skill_icons/3003151.webp" />
				<img id="skillIcon3003191" src="./img/skill_icons/3003191.webp" />
				<img id="skillIcon3004141" src="./img/skill_icons/3004141.webp" />
				<img id="skillIcon3004151" src="./img/skill_icons/3004151.webp" />
				<img id="skillIcon3004191" src="./img/skill_icons/3004191.webp" />
				<img id="skillIcon3005151" src="./img/skill_icons/3005151.webp" />
				<img id="skillIcon3005191" src="./img/skill_icons/3005191.webp" />
				<img id="skillIcon3009191" src="./img/skill_icons/3009191.webp" />
				<img id="skillIconUnknown" src="./img/skill_icons/unknown.webp" />
			</div>
		</div>
	</div>
</template>

<script>
import UpdateNote from "./UpdateNote.vue";
import ReceiptFactorBase from "./base.vue";

export default {
	name: "ReceiptFactor",
	components: {
		UpdateNote,
	},
	mixins: [ReceiptFactorBase],
	mounted() {
		window.addEventListener("paste", this.handlePaste);
	},
	beforeDestroy() {
		window.removeEventListener("paste", this.handlePaste);
	},
	methods: {
		triggerFileInput() {
			document.getElementById("fileInput").click();
		},
		handleFileInput(event) {
			this.photoPreview(event);
		},
		handleDrop(event) {
			event.preventDefault();
			const files = event.dataTransfer.files;
			this.photoPreview({ target: { files } });
		},
		uploadFromClipboard() {
			navigator.clipboard
				.read()
				.then((items) => {
					for (let item of items) {
						if (item.types.includes("image/png") || item.types.includes("image/jpeg")) {
							item.getType("image/png").then((blob) => {
								const file = new File([blob], "clipboard-image.png", { type: blob.type });
								this.photoPreview({ target: { files: [file] } });
							});
						}
					}
				})
				.catch((error) => {
					console.error("클립보드에서 이미지를 읽어오는 중 오류 발생:", error);
				});
		},
		handlePaste(event) {
			const items = (event.clipboardData || event.originalEvent.clipboardData).items;
			for (let item of items) {
				if (item.type.includes("image")) {
					const file = item.getAsFile();
					this.photoPreview({ target: { files: [file] } });
				}
			}
		},
		generatePhoto() {
			this.generatePhotos();
		},
		resetPage() {
			location.reload();
		},
		saveOriginal() {
			// 원본 저장 로직
		},
		saveToClipBoard() {
			// 클립보드에 저장 로직
		},
		selectText(event) {
			event.target.select();
		},
	},
	data() {
		return {};
	},
};
</script>

<style scoped>
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background-color: #f0f0f0;
	margin: 0;
}

.wrapper {
	width: 80%;
	max-width: 900px;
	background-color: #fff;
	padding: 20px;
	border-radius: 8px;
}

#previewArea {
	display: flex;
	overflow-x: scroll;
}
.previewWrap {
	display: flex;
}
.previewItem {
	flex-shrink: 0;
	position: relative;
}
.previewImage {
	max-height: 300px;
	margin-right: 5px;
}
.previewItem > .functionWrap {
	position: absolute;
	margin: 5px;
	background-color: #ffffff8a;
}

.icon--cross::after {
	content: "";
	height: 1.5rem;
	width: 1.5rem;
	cursor: pointer;
	background-image: url("./img/sprites/cross/cross.svg");
	background-repeat: no-repeat;
	display: inline-block;
	background-size: 100%;
	vertical-align: text-bottom;
}
.icon--cross.inactive {
	display: none;
}
#dragDropArea {
	border: 2px dashed #ccc;
	padding: 20px;
	text-align: center;
	background-color: #f9f9f9;
	margin: 20px 0;
}

.drag-drop-inside {
	font-size: 16px;
	color: #666;
}

.drag-drop-buttons {
	margin: 10px 0;
}

#fileInput {
	display: inline-block;
	margin: 0 5px;
}

.drag-drop-info {
	font-weight: bold;
	margin-bottom: 10px;
}

p {
	margin: 5px 0;
}
.editormd,
.markdown-body,
.editormd .CodeMirror {
	font-family: "Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans", Meiryo, sans-serif;
	width: inherit;
	margin-top: 0;
	margin-bottom: 16px;
}
.markdown-body p {
	margin-top: 0;
	margin-bottom: 16px;
}
.markdown-body ul {
	list-style: circle;
}
.editormd-preview-container,
.editormd-html-preview {
	text-align: left;
	font-size: 14px;
	line-height: 1.6;
	overflow: auto;
	width: inherit;
	background-color: #fff;
}
.considerWrap {
	margin: 10px 0;
	font-size: 14px;
}
.loading-spinner {
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background-color: rgba(255, 255, 255, 0.8);
	padding: 20px;
	border-radius: 10px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	text-align: center;
	z-index: 1000;
	width: 100px;
	height: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
}

.spinner {
	border: 8px solid rgba(0, 0, 0, 0.1);
	border-top: 8px solid #3498db;
	border-radius: 50%;
	width: 80px;
	height: 80px;
	animation: spin 1s linear infinite;
}

.percentage-text {
	font-size: 16px;
	color: #3498db;
	margin-top: 10px;
	position: absolute;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
.custom-button {
	background-color: #3498db;
	color: white;
	border: none;
	padding: 5px 10px;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	transition: background-color 0.3s ease;
}

.custom-button:hover {
	background-color: #2980b9;
}

.custom-button:active {
	background-color: #1c598a;
}
</style>
