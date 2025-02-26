<script>
import * as ReceiptFactorFunctions from "../plugins/receipt_factor";

export default {
	name: "ReceiptFactorBase",
	// mixins: [ReceiptFactorBase],
	data() {
		return {
			photos: [],
			isImgNotReady: true,
			isCvNotReady: false,
			isLoading: false,
			percentage: 0,
			form: {
				showHeader: true,
				showSkillIcon: false,
			},
		};
	},
	methods: {
		changePercentage(value) {
			this.percentage = value;
		},
		// repaint() {
		// 	for (let i = 0; i < 2; i++) {
		// 		await new Promise((resolve) => requestAnimationFrame(resolve));
		// 	}
		// },
		photoPreview(event, fs = null) {
			let files = fs;
			if (files === null) {
				files = event.target.files;
			}
			let cnt_onload = 0;
			for (let i = 0; i < files.length; i++) {
				let reader = new FileReader();
				reader.onload = (e) => {
					this.addPhoto(e);
					++cnt_onload;
					if (cnt_onload === files.length) {
						this.manageBtnStatus("removeImgNotReady");
					}
				};
				reader.readAsDataURL(files[i]);
			}
		},
		addPhoto(e) {
			this.photos.push(e.target.result);
		},
		deletePhoto(index) {
			this.photos.splice(index, 1);
			if (this.photos.length === 0) {
				this.manageBtnStatus("addImgNotReady");
			}
		},
		manageBtnStatus(action) {
			switch (action) {
				case "addImgNotReady":
					this.isImgNotReady = true;
					break;
				case "removeImgNotReady":
					this.isImgNotReady = false;
					break;
				case "removeCvNotReady":
					this.isCvNotReady = false;
					break;
			}
		},
		async generatePhotos() {
			ReceiptFactorFunctions.generateReceipt();
		},
	},
};
</script>

<style scoped></style>
