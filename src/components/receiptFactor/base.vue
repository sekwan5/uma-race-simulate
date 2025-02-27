<script>
import cv from "opencv.js";
import {
	get_rects,
	trim_parts,
	get_unknown_rects,
	get_group_list,
	get_order_by_scbar,
	match_one_line,
	get_relative_dist,
	align_missing_imgs,
} from "../plugins/receipt_factor";

export default {
	name: "ReceiptFactorBase",
	data() {
		return {
			isLoading: false,
			photos: [],
			isImgNotReady: true,
			isCvNotReady: false,
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
		async repaint() {
			for (let i = 0; i < 2; i++) {
				await new Promise((resolve) => requestAnimationFrame(resolve));
			}
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
		async generatePhotos() {
			try {
				const is_show_skill_icon = false;
				const limit_px = 2175;
				if (this.isImgNotReady) {
					throw new Error("이미지가 로드되지 않았습니다.");
				} else if (this.isCvNotReady) {
					throw new Error("라이브러리 로드가 완료되지 않았습니다.");
				} else if (!("findLastIndex" in Array.prototype)) {
					throw new Error(
						"필요한 기능이 브라우저에 없습니다. 브라우저를 최신 버전으로 업데이트하세요. iPhone/iPad 사용자는 iOS를 15.4 이상으로 업데이트해주세요."
					);
				}
				this.changePercentage(0);

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

				let l_rects = await get_rects(l_mat);
				console.log("l_rects", l_rects);

				if (is_show_skill_icon) {
					this.changePercentage(5);
				} else {
					this.changePercentage(10);
				}

				if (l_rects.filter((e) => e.rayout_type == "unknown").length >= 1) {
					await get_unknown_rects(l_mat, l_rects);
				}
				let imgs = await trim_parts(l_mat, l_rects);
				console.log("imgs", imgs);
				if (is_show_skill_icon) this.changePercentage(10);
				else this.changePercentage(20);

				let l_group = await get_group_list(imgs, l_rects);
				if (is_show_skill_icon) this.changePercentage(12);
				else this.changePercentage(25);

				await get_order_by_scbar(imgs, l_rects, l_group);
				if (is_show_skill_icon) this.changePercentage(15);
				else this.changePercentage(30);

				// console.log(imgs);
				const n_tgt = imgs.length;
				let arr_val = new Array(n_tgt).fill(0).map(() => new Array(n_tgt).fill(0.0));
				let arr_loc = new Array(n_tgt).fill(0).map(() => new Array(n_tgt).fill(0.0));

				for (let i = 0; i < n_tgt; i++) {
					await match_one_line(imgs, l_group, arr_val, arr_loc, i);
					if (is_show_skill_icon) this.changePercentage(15 + (25 / n_tgt) * i);
					else this.changePercentage(30 + (50 / n_tgt) * i);

					// await this.repaint();
				}

				let l_relative_height = await get_relative_dist(arr_val, arr_loc, l_group);
				await align_missing_imgs(l_relative_height, l_group, imgs);

				if (is_show_skill_icon) this.changePercentage(50);
				else this.changePercentage(90);

				let tmpCanvasElement = document.getElementById("canvasOutput");
				if (!tmpCanvasElement) {
					tmpCanvasElement = document.createElement("canvas");
					tmpCanvasElement.setAttribute("id", "canvasOutput");
					tmpCanvasElement.style.display = "none";
					document.getElementById("overview").appendChild(tmpCanvasElement);
				}
				this.outputPartsList2Scroll2CanvasByGroup(
					imgs,
					l_group,
					l_relative_height,
					document.getElementById("tmpCanvasScrolls"),
					"canvasScroll"
				);

				// if (is_show_skill_icon) {
				// 	let l_detected_factor = this.detectFactorByGamma(document.getElementsByClassName("canvasScroll"));
				// 	this.changePercentage(75);
				// 	// await this.repaint();
				// 	l_detected_factor = await this.ocrFactorText(
				// 		document.getElementsByClassName("canvasScroll"),
				// 		l_detected_factor
				// 	);
				// 	let ocr_result_text = l_detected_factor.map((d) =>
				// 		d
				// 			.filter((d) => "factor_text" in d && d.factor_text != "" && !(d.factor_text in dict_skills))
				// 			.map((d) => d.factor_text)
				// 			.join()
				// 	);
				// 	ocr_result_text = ocr_result_text.filter((d) => d != "").join();
				// 	if (ocr_result_text !== "") {
				// 		document.getElementById("overviewOCRResult").classList.remove("hidden");
				// 		document.getElementById("outputOCRResult").value = ocr_result_text;
				// 	} else {
				// 		document.getElementById("overviewOCRResult").classList.add("hidden");
				// 	}
				// 	this.changePercentage(90);
				// 	// await this.repaint();
				// } else {
				// 	document.getElementById("overviewOCRResult").classList.add("hidden");
				// }

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
				this.changePercentage(100);

				l_mat.forEach((m) => m.delete());

				// imgs가 정의되어 있고 배열인지 확인
				if (imgs && Array.isArray(imgs)) {
					imgs.forEach((i) => {
						if (this.load_parts && Array.isArray(this.load_parts)) {
							this.load_parts.forEach((p) => {
								if (p in i) {
									i[p].delete();
								}
							});
						}
					});
				}

				const node = document.getElementById("tmpCanvasScrolls");
				if (node) {
					while (node.firstChild) {
						node.removeChild(node.firstChild);
					}
				}
			} catch (e) {
				console.log(e);
				this.$message.error(e.message);
			} finally {
				this.isLoading = false;
			}
		},
		drawMat2Canvas(mat, canvas_element, x, y, width = -1, height = -1) {
			let tmpCanvasElement = document.createElement("canvas");
			tmpCanvasElement.setAttribute("id", "tmpCanvas");
			cv.imshow(tmpCanvasElement, mat);
			if (width == -1) {
				canvas_element.getContext("2d").drawImage(tmpCanvasElement, x, y);
			} else {
				canvas_element.getContext("2d").drawImage(tmpCanvasElement, x, y, width, height);
			}
			tmpCanvasElement.remove();
		},

		// 스크롤 부분을 그룹별로 연결하여 별도의 캔버스에 출력
		outputPartsList2Scroll2CanvasByGroup(imgs, l_group, l_relative_height, output_div, output_class_name) {
			const n_group = Math.max(...l_group) + 1;
			let w_one_col = Math.min(...imgs.map((e) => e.scroll_full_width.cols));
			let l_max_rh = new Array(n_group).fill(0);
			[...Array(n_group).keys()].forEach((current_group) => {
				let tmp_h = 0;
				let img_header = imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == 0)[0];
				// 그룹별 축척 계산
				let tmp_scale = w_one_col / img_header.scroll_full_width.cols;
				// 캔버스 높이 계산
				// 가장 아래 이미지의 상대 좌표 추가
				l_max_rh[current_group] = Math.max(...l_relative_height.filter((d, i) => l_group[i] == current_group));
				tmp_h += l_max_rh[current_group];
				// 가장 아래 이미지의 높이 추가
				let img_footer = imgs.filter(
					(d, i) => l_group[i] == current_group && l_relative_height[i] == l_max_rh[current_group]
				)[0];
				tmp_h += img_footer.scroll.rows;
				// 범용 레이아웃이면 푸터 부분도 추가
				if (["common_header_scroll", "common_scroll_only"].includes(img_footer.rayout_type)) {
					tmp_h += img_footer.footer.rows;
				}
				// 가장 작은 이미지 그룹에 맞춰 축소
				tmp_h *= tmp_scale;
				// 캔버스 생성
				let canvas_element = document.createElement("canvas");
				canvas_element.setAttribute("class", output_class_name);
				output_div.appendChild(canvas_element);
				// 크기 조정하고 배경색 설정
				canvas_element.width = w_one_col;
				canvas_element.height = tmp_h;
				canvas_element.getContext("2d").fillStyle = "rgb(242, 242, 242)";
				canvas_element.getContext("2d").fillRect(0, 0, canvas_element.width, canvas_element.height);
				// 상대 좌표가 큰 순서대로 인덱스 가져오기
				let l_index_by_rh = [];
				if (
					["common_header_scroll", "common_scroll_only"].includes(
						imgs.filter((d, i) => l_group[i] == current_group)[0].rayout_type
					)
				) {
					// 범용 레이아웃이면 위에서부터 붙여넣어 최하단 버튼이 보이는 것을 방지
					l_index_by_rh = [...Array(imgs.length).keys()]
						.filter((d, i) => l_group[i] == current_group)
						.sort((first, second) => l_relative_height[first] - l_relative_height[second]);
				} else {
					// 다른 것은 아래에서부터 붙여넣어 절단면이 생기는 것을 방지
					l_index_by_rh = [...Array(imgs.length).keys()]
						.filter((d, i) => l_group[i] == current_group)
						.sort((first, second) => l_relative_height[second] - l_relative_height[first]);
				}
				l_index_by_rh.forEach((v, i) => {
					let img = imgs[v];
					// 스크롤 부분 그리기
					// console.log(i, current_group, w_one_col, (l_h_header[current_group] + l_relative_height[v]) * tmp_scale, img.scroll.cols * tmp_scale, img.scroll.rows * tmp_scale);
					this.drawMat2Canvas(
						img.scroll,
						canvas_element,
						0,
						l_relative_height[v] * tmp_scale,
						img.scroll.cols * tmp_scale,
						img.scroll.rows * tmp_scale
					);
					// 범용 레이아웃이면 푸터도 그리기
					console.log(i, v, img.rayout_type);
					if (
						i == l_index_by_rh.length - 1 &&
						["common_header_scroll", "common_scroll_only"].includes(img.rayout_type)
					) {
						this.drawMat2Canvas(
							img.footer,
							canvas_element,
							0,
							(l_relative_height[v] + img.scroll.rows) * tmp_scale,
							img.footer.cols * tmp_scale,
							img.footer.rows * tmp_scale
						);
					}
				});
			});
		},

		// 스크롤 캔버스를 하나의 캔버스로 출력
		outputScrollCanvas2OneCanvas(imgs, l_group, l_relative_height, eles_scroll_canvas, canvas_element, show_header) {
			const show_close = false;
			const n_group = Math.max(...l_group) + 1;
			let l_scroll_canvas = Array.from(eles_scroll_canvas);
			let w_one_col = Math.min(...imgs.map((e) => e.scroll_full_width.cols));
			let l_h_header = new Array(n_group).fill(0);
			// let l_max_rh = new Array(n_group).fill(0);
			let l_scale_per_group = new Array(n_group).fill(1);
			let h = 0;
			[...Array(n_group).keys()].forEach((current_group) => {
				let tmp_h = 0;
				let img_header = imgs.filter((d, i) => l_group[i] == current_group && l_relative_height[i] == 0)[0];
				// 그룹별 축척 가져오기
				l_scale_per_group[current_group] = w_one_col / img_header.scroll_full_width.cols;
				if (show_header) {
					// 헤더 부분 높이 추가
					if ("header" in img_header) {
						tmp_h += img_header.header.rows;
					}
					if ("basic_info" in img_header) {
						tmp_h += img_header.basic_info.rows;
					}
					if ("tab" in img_header) {
						tmp_h += img_header.tab.rows;
					}
					l_h_header[current_group] = tmp_h;
				}
				// 스크롤 부분 높이 추가
				tmp_h += l_scroll_canvas[current_group].height;
				if (show_close) {
					// 닫기 버튼 높이 추가
					console.log("미구현");
				}
				// 가장 작은 이미지 그룹에 맞춰 축소
				tmp_h *= l_scale_per_group[current_group];
				h = Math.max(h, tmp_h);
			});
			if (!show_header) {
				// 헤더 비표시면 너비는 스크롤 부분만 기준으로
				w_one_col = l_scroll_canvas[0].width;
			}
			// console.log(w, h);
			// console.log(l_scale_per_group);
			// 크기 조정하고 배경색 설정
			let w = n_group * w_one_col;
			canvas_element.width = w;
			canvas_element.height = h;
			canvas_element.getContext("2d").fillStyle = "rgb(242, 242, 242)";
			canvas_element.getContext("2d").fillRect(0, 0, canvas_element.width, canvas_element.height);

			if (show_header) {
				// 헤더 그리기
				let l_index_header = [...Array(imgs.length).keys()].filter((d) => l_relative_height[d] == 0);
				l_index_header.forEach((i) => {
					let current_group = l_group[i];
					let img = imgs[i];
					if ("header" in img) {
						this.drawMat2Canvas(
							img.header,
							canvas_element,
							current_group * w_one_col,
							0,
							w_one_col,
							img.header.rows * l_scale_per_group[current_group]
						);
					}
					if ("basic_info" in img) {
						this.drawMat2Canvas(
							img.basic_info,
							canvas_element,
							current_group * w_one_col,
							img.header.rows * l_scale_per_group[current_group],
							w_one_col,
							img.basic_info.rows * l_scale_per_group[current_group]
						);
					}
					if ("tab" in img) {
						this.drawMat2Canvas(
							img.tab,
							canvas_element,
							current_group * w_one_col,
							(img.header.rows + img.basic_info.rows) * l_scale_per_group[current_group],
							w_one_col,
							img.tab.rows * l_scale_per_group[current_group]
						);
					}
				});
			}
			// 스크롤 부분 그리기
			[...Array(n_group).keys()].forEach((current_group) => {
				canvas_element
					.getContext("2d")
					.drawImage(
						l_scroll_canvas[current_group],
						current_group * w_one_col,
						l_h_header[current_group] * l_scale_per_group[current_group]
					);
			});
			if (show_close) {
				// 닫기 버튼 그리기
				console.log("미구현");
			}
		},
	},
};
</script>

<style scoped></style>
