<script async src="https://docs.opencv.org/4.x/opencv.js" type="text/javascript"></script>
<script>
export default {
	name: "ReceiptFactorBase",
	data() {
		return {
			photos: [],
			isImgNotReady: true,
			isCvNotReady: true,
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
		async generatePhoto() {
			this.isLoading = true;
			try {
				const is_show_skill_icon = this.form.showSkillIcon;
				const limit_px = 2175;
				if (this.isImgNotReady) {
					throw new Error("이미지가 로드되지 않았습니다.");
				} else if (this.isCvNotReady) {
					throw new Error("라이브러리 로드가 완료되지 않았습니다.");
				} else if (!("findLastIndex" in Array.prototype)) {
					throw new Error(
						"필요한 기능이 브라우저에 없습니다. 브라우저를 최신 버전으로 업데이트하세요. iPhone/iPad 사용자는 iOS를 15.4 이상으로 업데이트하세요."
					);
				}
				this.changePercentage(0);
				await this.repaint();

				let imgElements = document.getElementsByClassName("previewImage");
				let l_mat = [];
				for (let i = 0; i < imgElements.length; i++) {
					let tmpImgElement = document.createElement("img");
					tmpImgElement.setAttribute("src", imgElements[i].getAttribute("src"));
					let tmpImg = cv.imread(tmpImgElement);
					cv.cvtColor(tmpImg, tmpImg, cv.COLOR_RGBA2RGB, 0);
					if (tmpImg.rows > limit_px) {
						tmpImg = this.cv2_resize_fixed_aspect(tmpImg, -1, limit_px);
					} else if (tmpImg.cols > limit_px) {
						tmpImg = this.cv2_resize_fixed_aspect(tmpImg, limit_px, -1);
					}
					l_mat.push(tmpImg.clone());
					tmpImg.delete();
				}

				let l_rects = await this.get_rects(l_mat);
				if (is_show_skill_icon) {
					this.changePercentage(5);
				} else {
					this.changePercentage(10);
				}
				await this.repaint();

				if (l_rects.filter((e) => e.rayout_type == "unknown").length >= 1) {
					await this.get_unknown_rects(l_mat, l_rects);
				}
				let imgs = await this.trim_parts(l_mat, l_rects);
				if (is_show_skill_icon) {
					this.changePercentage(10);
				} else {
					this.changePercentage(20);
				}
				await this.repaint();

				let l_group = await this.get_group_list(imgs, l_rects);
				if (is_show_skill_icon) {
					this.changePercentage(12);
				} else {
					this.changePercentage(25);
				}
				await this.repaint();

				await this.get_order_by_scbar(imgs, l_rects, l_group);
				if (is_show_skill_icon) {
					this.changePercentage(15);
				} else {
					this.changePercentage(30);
				}
				await this.repaint();

				const n_tgt = imgs.length;
				let arr_val = new Array(n_tgt).fill(0).map(() => new Array(n_tgt).fill(0.0));
				let arr_loc = new Array(n_tgt).fill(0).map(() => new Array(n_tgt).fill(0.0));

				for (let i = 0; i < n_tgt; i++) {
					await this.match_one_line(imgs, l_group, arr_val, arr_loc, i);
					if (is_show_skill_icon) {
						this.changePercentage(15 + (25 / n_tgt) * i);
					} else {
						this.changePercentage(30 + (50 / n_tgt) * i);
					}
					await this.repaint();
				}

				let l_relative_height = await this.get_relative_dist(arr_val, arr_loc, l_group);
				await this.align_missing_imgs(l_relative_height, l_group, imgs);
				if (is_show_skill_icon) {
					this.changePercentage(50);
				} else {
					this.changePercentage(90);
				}
				await this.repaint();

				let tmpCanvasElement = document.getElementById("canvasOutput");
				if (!tmpCanvasElement) {
					tmpCanvasElement = document.createElement("canvas");
					tmpCanvasElement.setAttribute("id", "canvasOutput");
					tmpCanvasElement.classList.add("hidden");
					document.getElementById("overview").appendChild(tmpCanvasElement);
				}
				this.outputPartsList2Scroll2CanvasByGroup(
					imgs,
					l_group,
					l_relative_height,
					document.getElementById("tmpCanvasScrolls"),
					"canvasScroll"
				);

				if (is_show_skill_icon) {
					let l_detected_factor = this.detectFactor_by_gamma(document.getElementsByClassName("canvasScroll"));
					this.changePercentage(75);
					await this.repaint();
					l_detected_factor = await this.ocr_factor_text(
						document.getElementsByClassName("canvasScroll"),
						l_detected_factor
					);
					let ocr_result_text = l_detected_factor.map((d) =>
						d
							.filter((d) => "factor_text" in d && d.factor_text != "" && !(d.factor_text in dict_skills))
							.map((d) => d.factor_text)
							.join()
					);
					ocr_result_text = ocr_result_text.filter((d) => d != "").join();
					if (ocr_result_text !== "") {
						document.getElementById("overviewOCRResult").classList.remove("hidden");
						document.getElementById("outputOCRResult").value = ocr_result_text;
					} else {
						document.getElementById("overviewOCRResult").classList.add("hidden");
					}
					this.changePercentage(90);
					await this.repaint();
				} else {
					document.getElementById("overviewOCRResult").classList.add("hidden");
				}

				this.outputScrollCanvas2OneCanvas(
					imgs,
					l_group,
					l_relative_height,
					document.getElementsByClassName("canvasScroll"),
					tmpCanvasElement,
					this.form.showHeader
				);

				let outputImage = document.getElementById("outputImage");
				outputImage.src = tmpCanvasElement.toDataURL("image/png");
				outputImage.classList.remove("hidden");
				this.changePercentage(100);
				document.getElementById("SaveBtnArea").classList.remove("hidden");
				document.getElementById("outputAreaText").classList.add("hidden");
				document.getElementById("toggleSizeText").classList.remove("hidden");
				document.getElementById("overview").scrollIntoView({ behavior: "smooth", block: "start" });

				l_mat.forEach((m) => m.delete());
				imgs.forEach((i) => {
					load_parts.forEach((p) => {
						if (p in i) {
							i[p].delete();
						}
					});
				});

				const node = document.getElementById("tmpCanvasScrolls");
				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}
			} catch (e) {
				console.log(e);
				this.raiseErrMsg(e.message);
				document.getElementById("loading").classList.add("hidden");
			} finally {
				this.isLoading = false;
			}
		},
	},
};
</script>

<style scoped></style>
