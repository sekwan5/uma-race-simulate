<template>
	<div class="container">
		<div v-if="true" class="loading-spinner">
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
								<p class="drag-drop-info">여기에 파일을 드랍</p>
								<p></p>
								<p class="drag-drop-buttons">
									or
									<input
										id="fileInput"
										type="file"
										accept="image/*"
										multiple="multiple"
										value="파일 선택"
										name="photo"
										@change="handleFileInput"
									/>
								</p>
								<p id="uiUploadFromClipboard">
									or
									<button type="button" id="btnUploadFromClipboard" @click="uploadFromClipboard">
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
										<div class="icon--cross" @click="deletePhoto(index)">X</div>
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
								@click="generatePhoto()"
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
			// 사진 생성 로직
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

.icon--cross {
	width: 20px;
	height: 20px;
	background-color: red;
	color: white;
	text-align: center;
	line-height: 20px;
	border-radius: 50%;
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

#uiUploadFromClipboard button {
	background-color: #f0f0f0;
	border: 1px solid #ccc;
	padding: 5px 10px;
	cursor: pointer;
}

#uiUploadFromClipboard button:hover {
	background-color: #e0e0e0;
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
</style>
