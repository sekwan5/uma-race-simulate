<!-- <script>
import cv from "opencv.js";
import Tesseract from "tesseract.js";

export default {
	name: "ReceiptFactor",

	data() {
		return {
			// 검출 범위 지정용 상수
			rectProp: {
				close: [539, 1828, 458, 132],
				whole: [1124, 51, 1124, 1910],
				scroll: [1079, 947, 1079, 829],
				scroll_bar: [1297, 969, 21, 787],
				icon: [347, 235, 150, 150],
				eval_val: [357, 427, 133, 37],
				speed_val: [315, 556, 103, 37],
				growth_rate: [240, 848, 89, 34],
				register_partner: [541, 880, 454, 129],
				factor_area_left: [410, -20, 437, 90],
				factor_disc_left: [427, 0, 36, 36],
				factor_icon_left: [418, -9, 54, 54],
				factor_text_left: [469, 0, 372, 33],
				header_text_result_table: [686, 74, 165, 61],
				header_text_uma_detail: [639, 74, 258, 61],
				header_text_score_info: [639, 74, 258, 61],
				header_text_score_detail: [639, 74, 258, 61],
				header_text_field: [639, 74, 258, 61],
				header_text_race_detail: [639, 74, 258, 61],
				header_text_gougai: [506, 74, 524, 61],
			},

			rectPropDynamic: {
				with_growth_rate: {
					basic_info: [1124, 151, 1124, 2043],
					scroll: [1079, 1076, 1079, 700],
					scroll_bar: [1297, 1100, 21, 528],
				},
				with_register_partner: {
					basic_info: [1124, 151, 1124, 2105],
					scroll: [1079, 1139, 1079, 637],
					scroll_bar: [1297, 1164, 21, 592],
				},
				result_table: {
					basic_info: [1124, 151, 1124, 641],
					scroll: [1079, 792, 1079, 992],
					scroll_bar: [1299, 815, 16, 945],
				},
				score_info: {
					basic_info: [1124, 151, 0, 0],
					scroll: [1079, 166, 1079, 1618],
					scroll_bar: [1293, 181, 16, 1584],
				},
				score_detail: {
					basic_info: [1124, 151, 1124, 239],
					scroll: [1079, 390, 1079, 1360],
					scroll_bar: [1297, 405, 16, 1345],
				},
				field: {
					basic_info: [1124, 151, 0, 0],
					scroll: [1079, 166, 1079, 1543],
					scroll_bar: [1293, 202, 16, 1563],
				},
				race_detail: {
					basic_info: [1124, 151, 1124, 705],
					scroll: [1079, 856, 1079, 920],
					scroll_bar: [1299, 879, 16, 874],
				},
				gougai: {
					basic_info: [1124, 151, 1124, 962],
					scroll: [1079, 1113, 1079, 665],
					scroll_bar: [1293, 202, 16, 1563],
				},
			},
			thres: {
				gray: 215,
				cont_close: 0.1,
				match_tmpl: 0.8,
				match_tmpl_basic_info: 0.85,
				match_tmpl_higher: 0.55,
				match_tmpl_rayout_type: 0.6,
				match_tmpl_disc: 0.1,
				match_tmpl_disc_rate: 0.85,
				header: 0.9,
				common_diff_y1: 20,
				common_diff_y2: 12,
				scroll_bar_position: 210,
				scbar_h: 0.9,
				factor: 140,
				factor_color: 0.3,
			},
			params: {
				force_one_group: false,
				all_rayout_type: [
					"normal",
					"with_growth_rate",
					"with_register_partner",
					"result_table",
					"score_info",
					"score_detail",
					"field",
					"race_detail",
					"gougai",
					"common_scroll_only",
					"common_header_scroll",
				],
				load_parts: [
					"header",
					"basic_info",
					"tab",
					"scroll_full_width",
					"scroll",
					"scroll_bar",
					"bottom_row",
					"bottom_row_higher",
					"icon",
					"eval_val",
					"speed_val",
					"stamina_val",
					"power_val",
					"guts_val",
					"int_val",
				],
				load_parts_simple: [
					"header",
					"basic_info",
					"scroll_full_width",
					"scroll",
					"scroll_bar",
					"bottom_row",
					"bottom_row_higher",
				],
				load_parts_more_simple: [
					"header",
					"scroll_full_width",
					"scroll",
					"scroll_bar",
					"bottom_row",
					"bottom_row_higher",
				],
				load_parts_common: ["header", "scroll_full_width", "scroll", "bottom_row", "bottom_row_higher", "footer"],
				load_parts_scroll_only: ["scroll_full_width", "scroll", "bottom_row", "bottom_row_higher", "footer"],
				tgt_parts_for_group: [
					"icon",
					"eval_val",
					"speed_val",
					"stamina_val",
					"power_val",
					"guts_val",
					"int_val",
					"tab",
				],
				load_parts_by_rayout_type: {
					normal: [
						"header",
						"basic_info",
						"tab",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
						"icon",
						"eval_val",
						"speed_val",
						"stamina_val",
						"power_val",
						"guts_val",
						"int_val",
					],
					with_growth_rate: [
						"header",
						"basic_info",
						"tab",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
						"icon",
						"eval_val",
						"speed_val",
						"stamina_val",
						"power_val",
						"guts_val",
						"int_val",
					],
					with_register_partner: [
						"header",
						"basic_info",
						"tab",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
						"icon",
						"eval_val",
						"speed_val",
						"stamina_val",
						"power_val",
						"guts_val",
						"int_val",
					],
					result_table: [
						"header",
						"basic_info",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
					],
					score_info: ["header", "scroll_full_width", "scroll", "scroll_bar", "bottom_row", "bottom_row_higher"],
					score_detail: [
						"header",
						"basic_info",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
					],
					field: ["header", "scroll_full_width", "scroll", "scroll_bar", "bottom_row", "bottom_row_higher"],
					race_detail: [
						"header",
						"basic_info",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
					],
					gougai: [
						"header",
						"basic_info",
						"scroll_full_width",
						"scroll",
						"scroll_bar",
						"bottom_row",
						"bottom_row_higher",
					],
					common_scroll_only: ["scroll_full_width", "scroll", "bottom_row", "bottom_row_higher", "footer"],
					common_header_scroll: ["header", "scroll_full_width", "scroll", "bottom_row", "bottom_row_higher", "footer"],
				},
				diff_window_size: 32,
			},
		};
	},
	methods: {
		addRectProp(rectProp, rectPropDynamic, rayoutType) {
			let dictOut = {};
			Object.keys(rectProp).forEach(function (key) {
				dictOut[key] = rectProp[key];
			});
			if (rayoutType !== "normal") {
				Object.keys(rectPropDynamic[rayoutType]).forEach(function (key) {
					dictOut[key] = rectPropDynamic[rayoutType][key];
				});
			}
			dictOut["bottom_row"] = [
				rectProp["scroll"][0],
				rectProp["scroll"][1] + rectProp["scroll"][3] - 80,
				rectProp["scroll"][2],
				80,
			];
			dictOut["bottom_row_higher"] = [
				dictOut["bottom_row"][0],
				dictOut["bottom_row"][1] - 60,
				dictOut["bottom_row"][2],
				dictOut["bottom_row"][3] + 60,
			];
			dictOut["scroll_with_header"] = [
				dictOut["whole"][0],
				dictOut["whole"][1],
				dictOut["whole"][2],
				dictOut["scroll"][1] + dictOut["scroll"][3] - dictOut["whole"][1],
			];
			dictOut["scroll_full_width"] = [
				dictOut["whole"][0],
				dictOut["scroll"][1],
				dictOut["whole"][2],
				dictOut["scroll"][3],
			];
			dictOut["tab"] = [
				dictOut["basic_info"][0],
				dictOut["basic_info"][1] + dictOut["basic_info"][3],
				dictOut["basic_info"][2],
				70,
			];
			dictOut["stamina_val"] = [
				dictOut["speed_val"][0] + this.params.x_params,
				dictOut["speed_val"][1],
				dictOut["speed_val"][2],
				dictOut["speed_val"][3],
			];
			dictOut["power_val"] = [
				dictOut["stamina_val"][0] + this.params.x_params,
				dictOut["speed_val"][1],
				dictOut["speed_val"][2],
				dictOut["speed_val"][3],
			];
			dictOut["guts_val"] = [
				dictOut["power_val"][0] + this.params.x_params,
				dictOut["speed_val"][1],
				dictOut["speed_val"][2],
				dictOut["speed_val"][3],
			];
			dictOut["int_val"] = [
				dictOut["guts_val"][0] + this.params.x_params,
				dictOut["speed_val"][1],
				dictOut["speed_val"][2],
				dictOut["speed_val"][3],
			];
			return dictOut;
		},
		fnSum(arr, fn) {
			if (fn) {
				return this.fnSum(arr.map(fn));
			} else {
				return arr.reduce((prev, current) => prev + current);
			}
		},
		fnAvg(arr, fn) {
			return this.fnSum(arr, fn) / arr.length;
		},
		vconcatResizeMin(imList, interpolation = cv.INTER_CUBIC) {
			const wMin = Math.min(...imList.map((d) => d.cols));
			let imListResize = new cv.MatVector();
			let dst = new cv.Mat();
			let dsize = new cv.Size();
			for (let i = 0; i < imList.length; i++) {
				dst = new cv.Mat();
				dsize = new cv.Size(wMin, Math.floor((imList[i].rows * wMin) / imList[i].cols));
				cv.resize(imList[i], dst, dsize, 0, 0, interpolation);
				imListResize.push_back(dst);
			}
			let out = new cv.Mat();
			cv.vconcat(imListResize, out);
			imListResize.delete();
			return out;
		},
		hconcatResizeMin(imList, interpolation = cv.INTER_CUBIC) {
			const hMin = Math.min(...imList.map((d) => d.rows));
			let imListResize = new cv.MatVector();
			let dst = new cv.Mat();
			let dsize = new cv.Size();
			for (let i = 0; i < imList.length; i++) {
				dst = new cv.Mat();
				dsize = new cv.Size(Math.floor((imList[i].cols * hMin) / imList[i].rows), hMin);
				cv.resize(imList[i], dst, dsize, 0, 0, interpolation);
				imListResize.push_back(dst);
				dst.delete();
			}
			let out = new cv.Mat();
			cv.hconcat(imListResize, out);
			imListResize.delete();
			return out;
		},
		cv2ResizeFixedAspect(img, width = -1, height = -1) {
			if (typeof img === "undefined" || (width === -1 && height === -1)) {
				return;
			} else {
				let dst = new cv.Mat();
				let dsize = new cv.Size();
				if (width === -1) {
					dsize = new cv.Size(Math.floor((height / img.rows) * img.cols), height);
				} else {
					dsize = new cv.Size(width, Math.floor((width / img.cols) * img.rows));
				}
				cv.resize(img, dst, dsize, 0, 0);
				return dst;
			}
		},
		cv2Rectangle(img, rect, rectangleColor, lineWeight) {
			let point1 = new cv.Point(rect.x, rect.y);
			let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
			cv.rectangle(img, point1, point2, rectangleColor, lineWeight, cv.LINE_AA, 0);
		},
		calcRects(rectClose, rectProp) {
			let out = {};
			let tgtPerPropW = rectClose.width / rectProp.close[2];
			// let tgtPerPropH = rectClose.height / rectProp.close[3];
			Object.keys(rectProp).forEach((k) => {
				out[k] = {
					x: Math.floor(rectClose.x + (rectProp[k][0] - rectProp.close[0]) * tgtPerPropW),
					y: Math.floor(rectClose.y + (rectProp[k][1] - rectProp.close[1]) * tgtPerPropW),
					width: Math.floor(rectProp[k][2] * tgtPerPropW),
					height: Math.floor(rectProp[k][3] * tgtPerPropW),
				};
			});
			if ("bottom_row" in out && "scroll" in out) {
				out.bottom_row = {
					x: out.bottom_row.x,
					y: out.bottom_row.y,
					width: out.bottom_row.width,
					height: out.scroll.y + out.scroll.height - out.bottom_row.y,
				};
			}
			if ("bottom_row_higher" in out && "scroll" in out) {
				out.bottom_row_higher = {
					x: out.bottom_row_higher.x,
					y: out.bottom_row_higher.y,
					width: out.bottom_row_higher.width,
					height: out.scroll.y + out.scroll.height - out.bottom_row_higher.y,
				};
			}
			return out;
		},
		matchTmplMinMaxLoc(imgTgt, imgTmpl) {
			let dst = new cv.Mat();
			let out = null;
			cv.matchTemplate(imgTgt, imgTmpl, dst, cv.TM_CCOEFF_NORMED);
			out = cv.minMaxLoc(dst);
			dst.delete();
			return out;
		},
		matchTmplWithMskMinMaxLoc(imgTgt, imgTmpl, imgMsk) {
			let dst = new cv.Mat();
			let out = null;
			let imgTgtGray = new cv.Mat();
			let imgTmplGray = new cv.Mat();
			let imgMskGray = new cv.Mat();
			cv.cvtColor(imgTgt, imgTgtGray, cv.COLOR_RGBA2GRAY, 0);
			cv.cvtColor(imgTmpl, imgTmplGray, cv.COLOR_RGBA2GRAY, 0);
			cv.cvtColor(imgMsk, imgMskGray, cv.COLOR_RGBA2GRAY, 0);
			cv.matchTemplate(imgTgtGray, imgTmplGray, dst, cv.TM_CCOEFF_NORMED, imgMskGray);
			out = cv.minMaxLoc(dst);
			dst.delete();
			imgTgtGray.delete();
			imgTmplGray.delete();
			imgMskGray.delete();
			return out;
		},
		geneCommonMsk(imgTmpl, imgTgt) {
			let tmpDiff = new cv.Mat();
			let img0Gray = imgTmpl.clone();
			let img1Gray = imgTgt.clone();
			cv.cvtColor(img0Gray, img0Gray, cv.COLOR_RGBA2GRAY, 0);
			cv.cvtColor(img1Gray, img1Gray, cv.COLOR_RGBA2GRAY, 0);
			cv.absdiff(img0Gray, img1Gray, tmpDiff);
			cv.threshold(tmpDiff, tmpDiff, 0, 255, cv.THRESH_BINARY);
			cv.cvtColor(tmpDiff, tmpDiff, cv.COLOR_GRAY2RGB, 0);
			img0Gray.delete();
			img1Gray.delete();
			return tmpDiff;
		},
		smoothingList(l, windowSize) {
			let out = [];
			for (let i = 0; i < l.length - windowSize + 1; i++) {
				out.push(l.slice(i, i + windowSize).reduce((sum, e) => sum + e, 0) / windowSize);
			}
			return out;
		},
		detectCommonScrollArea(l, lSmooth, windowSize) {
			let out = {};
			let tmpY1 = lSmooth.findIndex((e) => e > this.thres.common_diff_y1);
			if (tmpY1 !== -1) {
				tmpY1 = l.findIndex((e, i) => i >= tmpY1 && e > this.thres.common_diff_y1);
			}
			let tmpY2 = lSmooth.findLastIndex((e) => e > this.thres.common_diff_y2);
			if (tmpY2 !== -1) {
				tmpY2 = l.findLastIndex(
					(e, i) =>
						i <= tmpY2 + windowSize &&
						e > this.thres.common_diff_y2 &&
						lSmooth.slice(i - Math.floor((i - tmpY1) / 16), i).filter((f) => f <= this.thres.common_diff_y2).length ===
							0
				);
			}
			out.y1 = tmpY1;
			out.y2 = tmpY2;
			return out;
		},
		getRects(lMat) {
			return new Promise((resolve) => {
				// const nTgt = lMat.length;
				console.log("닫기 버튼 위치 가져오기");
				console.log("이미지 수:", lMat.length, "첫 번째 이미지의 높이, 너비:", lMat[0].rows, lMat[0].cols);
				let lRects = [];
				let tmpRects = {};
				for (let i = 0; i < lMat.length; i++) {
					// 각 이미지에서 닫기 버튼 감지 및 영역 좌표 가져오기
					tmpRects = this.detectRects(lMat[i]);
					lRects.push(tmpRects);
				}
				resolve(lRects);
			});
		},
		detectRects(imgIn) {
			console.log("detectRects", imgIn);
			let mvContours = new cv.MatVector();
			let hierarchy = new cv.Mat();
			let mvContoursOnlyLarge = new cv.MatVector();
			let rayoutType = "none";
			let rects = {};

			// Canny 에지 검출
			let imgGray = imgIn.clone();
			cv.cvtColor(imgGray, imgGray, cv.COLOR_RGBA2GRAY, 0);
			cv.Canny(imgGray, imgGray, 50, 200, 3);
			let imgGrayHalf = imgGray.roi(
				new cv.Rect(0, Math.floor(imgIn.rows / 2), imgIn.cols, imgIn.rows - Math.floor(imgIn.rows / 2))
			);

			// 입력 이미지에서 윤곽 추출
			cv.findContours(
				imgGrayHalf,
				mvContours,
				hierarchy,
				cv.RETR_LIST,
				cv.CHAIN_APPROX_SIMPLE,
				new cv.Point(0, Math.floor(imgIn.rows / 2))
			);
			// 작은 윤곽은 제외하고 다시 저장
			for (let i = 0; i < mvContours.size(); i++) {
				if (cv.contourArea(mvContours.get(i)) > Math.min(imgGrayHalf.cols, imgGrayHalf.rows) ** 2 / 80) {
					mvContoursOnlyLarge.push_back(mvContours.get(i));
				}
			}
			imgGray.delete();

			// 이진화로 에지 검출
			imgGray = imgIn.clone();
			cv.cvtColor(imgGray, imgGray, cv.COLOR_RGBA2GRAY, 0);
			let ksize = new cv.Size(5, 5);
			cv.GaussianBlur(imgGray, imgGray, ksize, 0, 0, cv.BORDER_DEFAULT);
			cv.threshold(imgGray, imgGray, this.thres.gray, 255, cv.THRESH_BINARY);
			imgGrayHalf = imgGray.roi(
				new cv.Rect(0, Math.floor(imgIn.rows / 2), imgIn.cols, imgIn.rows - Math.floor(imgIn.rows / 2))
			);

			// 입력 이미지에서 윤곽 추출
			cv.findContours(
				imgGrayHalf,
				mvContours,
				hierarchy,
				cv.RETR_LIST,
				cv.CHAIN_APPROX_SIMPLE,
				new cv.Point(0, Math.floor(imgIn.rows / 2))
			);
			// 작은 윤곽은 제외하고 다시 저장
			for (let i = 0; i < mvContours.size(); i++) {
				if (cv.contourArea(mvContours.get(i)) > Math.min(imgGrayHalf.cols, imgGrayHalf.rows) ** 2 / 80) {
					mvContoursOnlyLarge.push_back(mvContours.get(i));
				}
			}

			if (mvContoursOnlyLarge.size() === 0) {
				throw new Error("닫기 버튼이 검출되지 않는 이미지가 있습니다.");
			}

			// 닫기 버튼 템플릿 읽기
			let tmplGray = cv.imread(document.getElementById("tmplClose"));
			cv.cvtColor(tmplGray, tmplGray, cv.COLOR_RGBA2GRAY, 0);
			cv.GaussianBlur(tmplGray, tmplGray, ksize, 0, 0, cv.BORDER_DEFAULT);
			cv.threshold(tmplGray, tmplGray, this.thres.gray, 255, cv.THRESH_BINARY);
			let mvTmplContours = new cv.MatVector();
			let tmplHierarchy = new cv.Mat();
			// 닫기 버튼 윤곽 추출
			cv.findContours(tmplGray, mvTmplContours, tmplHierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
			// 작은 윤곽은 제외하고 배열에 다시 저장
			let lTmplContoursOnlyLarge = [];
			for (let i = 0; i < mvTmplContours.size(); i++) {
				if (cv.contourArea(mvTmplContours.get(i)) > Math.min(tmplGray.cols, tmplGray.rows) ** 2 / 80) {
					lTmplContoursOnlyLarge.push(mvTmplContours.get(i));
				}
			}
			// 큰 순서대로 두 번째를 닫기 버튼의 윤곽으로 채택
			lTmplContoursOnlyLarge.sort((first, second) => cv.contourArea(second) - cv.contourArea(first));
			let mskClose = lTmplContoursOnlyLarge[1];

			// 템플릿과 비교하여 닫기 버튼의 윤곽만 추출
			let contOut = [];
			let infoOut = [];
			let isCloseVal = 1.0;
			let minIsCloseVal = 1.0;
			let onlyMatched = true;
			for (let i = 0; i < mvContoursOnlyLarge.size(); i++) {
				isCloseVal = cv.matchShapes(mvContoursOnlyLarge.get(i), mskClose, cv.CONTOURS_MATCH_I3, 0);
				if (!onlyMatched) {
					contOut.push(mvContoursOnlyLarge.get(i));
					infoOut.push({
						index: i,
						isClose: isCloseVal < this.thres.cont_close,
						isCloseVal: isCloseVal,
					});
				} else if (isCloseVal < this.thres.cont_close && isCloseVal < minIsCloseVal) {
					contOut.shift();
					infoOut.shift();
					contOut.push(mvContoursOnlyLarge.get(i));
					infoOut.push({
						index: i,
						isClose: true,
						isCloseVal: isCloseVal,
					});
					minIsCloseVal = isCloseVal;
				}
			}

			if (contOut.length === 0) {
				rayoutType = "unknown";
			} else {
				let rectClose = cv.boundingRect(contOut[0]);
				rectClose.x = Math.round(imgIn.cols / 2 - rectClose.width / 2);
				let rectWhole = this.calcRects(rectClose, { whole: this.rectProp.whole, close: this.rectProp.close });

				let yStart = Math.max(0, Math.floor(rectWhole.whole.y - rectWhole.whole.height / 20));
				let tmpRect = new cv.Rect(
					rectWhole.whole.x,
					yStart,
					rectWhole.whole.width,
					Math.floor(rectWhole.whole.height / 10)
				);
				console.log("tmpRect", tmpRect);
				if (
					tmpRect.y + tmpRect.height > imgIn.rows ||
					tmpRect.x + tmpRect.width > imgIn.cols ||
					tmpRect.x < 0 ||
					tmpRect.y < 0
				) {
					rayoutType = "unknown";
				} else {
					let imgFindHeader = imgIn
						.roi(new cv.Rect(rectWhole.whole.x, yStart, rectWhole.whole.width, Math.floor(rectWhole.whole.height / 10)))
						.clone();
					cv.cvtColor(imgFindHeader, imgFindHeader, cv.COLOR_RGB2HSV, 0);
					let green = new cv.Mat();
					cv.inRange(
						imgFindHeader,
						new cv.Mat(imgFindHeader.rows, imgFindHeader.cols, imgFindHeader.type(), [20, 150, 0, 0]),
						new cv.Mat(imgFindHeader.rows, imgFindHeader.cols, imgFindHeader.type(), [60, 255, 255, 0]),
						green
					);

					let yAct = rectWhole.whole.y;
					let tmpSum = 0;
					for (let i = 0; i < green.rows; i++) {
						tmpSum = 0;
						for (let j = 0; j < green.cols; j++) {
							tmpSum += green.ucharAt(i, j);
						}
						if (tmpSum / 255 / green.cols > this.thres.header) {
							yAct = yStart + i;
							break;
						}
					}

					let heightAct = rectWhole.whole.height - (yAct - rectWhole.whole.y);
					let actRate = heightAct / rectWhole.whole.height;
					rectClose = {
						x: rectClose.x + (rectClose.width * (1 - actRate)) / 2,
						y: rectClose.y + (rectClose.height * (1 - actRate)) / 2,
						width: rectClose.width * actRate,
						height: rectClose.height * actRate,
					};
					let rectsBase = this.calcRects(rectClose, this.rectProp);
					let arrRayoutScore = [];

					let imgTgt = new cv.Mat();
					let imgTmpl = new cv.Mat();
					let tmpDst = new cv.Mat();

					imgTgt = imgIn.roi(
						new cv.Rect(
							Math.max(rectsBase.header_text_result_table.x - 2, 0),
							Math.max(rectsBase.header_text_result_table.y - 2, 0),
							rectsBase.header_text_result_table.width + 4,
							rectsBase.header_text_result_table.height + 4
						)
					);
					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextResultTable"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_result_table.width, rectsBase.header_text_result_table.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "result_table", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTgt = imgIn.roi(
						new cv.Rect(
							Math.max(rectsBase.header_text_score_info.x - 2, 0),
							Math.max(rectsBase.header_text_score_info.y - 2, 0),
							rectsBase.header_text_score_info.width + 4,
							rectsBase.header_text_score_info.height + 4
						)
					);
					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextScoreInfo"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_score_info.width, rectsBase.header_text_score_info.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "score_info", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextUmaDetail"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_score_detail.width, rectsBase.header_text_score_detail.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "uma_detail", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextScoreDetail"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_score_detail.width, rectsBase.header_text_score_detail.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "score_detail", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextField"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_field.width, rectsBase.header_text_field.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "field", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextRaceDetail"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_race_detail.width, rectsBase.header_text_race_detail.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "race_detail", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					imgTgt = imgIn.roi(
						new cv.Rect(
							Math.max(rectsBase.header_text_gougai.x - 2, 0),
							Math.max(rectsBase.header_text_gougai.y - 2, 0),
							rectsBase.header_text_gougai.width + 4,
							rectsBase.header_text_gougai.height + 4
						)
					);
					imgTmpl = cv.imread(document.getElementById("tmplHeaderTextGougai"));
					cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
					tmpDst = new cv.Mat();
					cv.resize(
						imgTmpl,
						tmpDst,
						new cv.Size(rectsBase.header_text_gougai.width, rectsBase.header_text_gougai.height),
						0,
						0
					);
					arrRayoutScore.push({ rayout_type: "gougai", score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal });

					arrRayoutScore.sort((a, b) => b.score - a.score);
					if (arrRayoutScore[0].score > this.thres.match_tmpl_rayout_type) {
						rayoutType = arrRayoutScore[0].rayout_type;
					} else {
						rayoutType = "unknown";
					}

					if (rayoutType === "uma_detail") {
						arrRayoutScore = [];

						let imgTgt = imgIn.roi(
							new cv.Rect(
								rectsBase.growth_rate.x - 2,
								rectsBase.growth_rate.y - 2,
								rectsBase.growth_rate.width + 4,
								rectsBase.growth_rate.height + 4
							)
						);
						let imgTmpl = cv.imread(document.getElementById("tmplGrowthRate"));
						cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
						let tmpDst = new cv.Mat();
						cv.resize(imgTmpl, tmpDst, new cv.Size(rectsBase.growth_rate.width, rectsBase.growth_rate.height), 0, 0);
						arrRayoutScore.push({
							rayout_type: "with_growth_rate",
							score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal,
						});

						imgTgt = imgIn.roi(
							new cv.Rect(
								rectsBase.register_partner.x - 2,
								rectsBase.register_partner.y - 2,
								rectsBase.register_partner.width + 4,
								rectsBase.register_partner.height + 4
							)
						);
						imgTmpl = cv.imread(document.getElementById("tmplRegisterPartner"));
						cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
						tmpDst = new cv.Mat();
						cv.resize(
							imgTmpl,
							tmpDst,
							new cv.Size(rectsBase.register_partner.width, rectsBase.register_partner.height),
							0,
							0
						);
						arrRayoutScore.push({
							rayout_type: "with_register_partner",
							score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal,
						});

						imgTmpl = cv.imread(document.getElementById("tmplUnregisterPartner"));
						cv.cvtColor(imgTmpl, imgTmpl, cv.COLOR_RGBA2RGB, 0);
						tmpDst = new cv.Mat();
						cv.resize(
							imgTmpl,
							tmpDst,
							new cv.Size(rectsBase.register_partner.width, rectsBase.register_partner.height),
							0,
							0
						);
						arrRayoutScore.push({
							rayout_type: "with_unregister_partner",
							score: this.matchTmplMinMaxLoc(imgTgt, tmpDst).maxVal,
						});

						arrRayoutScore.sort((a, b) => b.score - a.score);
						if (arrRayoutScore[0].score > this.thres.match_tmpl_rayout_type) {
							rayoutType = arrRayoutScore[0].rayout_type;
							if (rayoutType === "with_unregister_partner") {
								rayoutType = "with_register_partner";
							}
						} else {
							rayoutType = "normal";
						}
					}
					imgTgt.delete();
					imgTmpl.delete();
					tmpDst.delete();
					imgFindHeader.delete();
					green.delete();

					if (rayoutType !== "unknown") {
						let rectPropAdded = this.addRectProp(this.rectProp, this.rectPropDynamic, rayoutType);
						rects = this.calcRects(rectClose, rectPropAdded);
						if (
							!(
								0 <= rects.whole.x &&
								0 <= rects.whole.y &&
								rects.whole.x + rects.whole.width < imgIn.cols &&
								rects.whole.y + rects.whole.height < imgIn.rows
							)
						) {
							throw new Error("우마무스메 상세 영역이 올바르게 검출되지 않는 이미지가 있습니다.");
						}
					}
				}
			}

			// 메모리 해제
			imgGray.delete();
			imgGrayHalf.delete();
			mvContours.delete();
			hierarchy.delete();
			mvContoursOnlyLarge.delete();
			tmplGray.delete();
			mvTmplContours.delete();
			tmplHierarchy.delete();
			contOut.forEach((c) => c.delete());
			lTmplContoursOnlyLarge.forEach((c) => c.delete());

			return { rayout_type: rayoutType, rects: rects };
		},
		trimParts(lMat, lRects) {
			console.log("trimParts 시작", lMat, lRects);
			return new Promise((resolve) => {
				console.log("닫기 버튼을 기준으로 각 파트를 잘라내기 시작");
				let tgtSizes = {};
				this.params.all_rayout_type.forEach((r) => {
					if (lRects.filter((e) => e.rayout_type === r).length > 0) {
						tgtSizes[r] = {};
						this.params.load_parts_by_rayout_type[r].forEach((p) => {
							let tmpW = Math.min(...lRects.filter((e) => e.rayout_type === r).map((d) => d.rects[p].width));
							let tmpH = Math.min(...lRects.filter((e) => e.rayout_type === r).map((d) => d.rects[p].height));
							tgtSizes[r][p] = { width: tmpW, height: tmpH };
						});
					}
				});
				console.log("tgtSizes 계산 완료", tgtSizes);

				let imgs = [];
				lMat.forEach((m, i) => {
					console.log(`이미지 ${i} 처리 시작`);
					let objTmp = {};
					let tgtLoadParts = this.params.load_parts_by_rayout_type[lRects[i].rayout_type];
					tgtLoadParts.forEach((p) => {
						console.log(`파트 ${p} 처리 중`);
						let tmpMat = new cv.Mat();
						let tmpDst = new cv.Mat();
						try {
							tmpMat = m.roi(lRects[i].rects[p]).clone();
							cv.resize(tmpMat, tmpDst, tgtSizes[lRects[i].rayout_type][p]);
							objTmp[p] = tmpDst.clone();
						} catch (error) {
							console.error(`에러 발생: 이미지 ${i}, 파트 ${p}`, error);
						} finally {
							tmpMat.delete();
							tmpDst.delete();
						}
					});
					objTmp["rayout_type"] = lRects[i].rayout_type;

					if (tgtLoadParts.includes("scroll_bar")) {
						console.log("스크롤바 처리 중");
						let imgScrollBarGray = objTmp["scroll_bar"].clone();
						cv.cvtColor(imgScrollBarGray, imgScrollBarGray, cv.COLOR_RGBA2GRAY, 0);

						let lSumValByY = [];
						for (let i = 0; i < imgScrollBarGray.rows; i++) {
							let tmpSum = 0;
							for (let j = 0; j < imgScrollBarGray.cols; j++) {
								tmpSum += imgScrollBarGray.ucharAt(i, j);
							}
							lSumValByY.push(tmpSum / imgScrollBarGray.cols);
						}
						imgScrollBarGray.delete();
						this.detectScrollBarPosition(objTmp, lSumValByY);
					}
					imgs.push(objTmp);
					console.log(`이미지 ${i} 처리 완료`);
				});
				console.log("모든 이미지 처리 완료");
				resolve(imgs);
			});
		},
		detectScrollBarPosition(obj, lSmooth) {
			let tmpY1 = lSmooth.findIndex((e) => e < this.thres.scroll_bar_position);
			let tmpY2 = lSmooth.findLastIndex((e) => e < this.thres.scroll_bar_position);
			obj["scroll_bar_y"] = Math.floor((tmpY1 + tmpY2) / 2);
			obj["scroll_bar_h"] = Math.abs(tmpY2 - tmpY1);
		},
		getGroupList(imgs, lRects) {
			const self = this; // this를 self에 저장
			return new Promise(function (resolve) {
				const n_tgt = imgs.length;
				// グループ決め
				let l_group = [];
				if (self.params.force_one_group) {
					// 強制的に全画像同じグループ扱い
					l_group = Array(n_tgt).fill(0);
				} else {
					// グループ番号をnullで初期化
					l_group = Array(n_tgt).fill(null);
					// 各画像の組み合わせ毎の一致度を格納する二次元配列宣言
					// 似てると1、似てないと0なので1.0で初期化
					let arr_val = new Array(n_tgt);
					for (let y = 0; y < n_tgt; y++) {
						arr_val[y] = new Array(n_tgt).fill(1.0);
					}
					// アイコン等からグループ決め
					// 全組み合わせでテンプレートマッチ
					imgs.forEach(function (img_tmpl, i) {
						imgs.forEach(function (img_tgt, j) {
							// 同じ組み合わせで二回チェックしないようjの方が大きい時
							// かつ両者のレイアウトタイプが一致する時だけチェック
							// i == jの時は同じ画像同士=100%一致なので無視
							if (i < j) {
								if (lRects[i].rayout_type != lRects[j].rayout_type) {
									// レイアウトタイプが異なっていたら100%別グループとして0を強制代入
									arr_val[Math.min(i, j)][Math.max(i, j)] = 0;
								} else if (["score_info", "field", "common_header_scroll"].includes(lRects[i].rayout_type)) {
									// ヘッダーを持つレイアウトはヘッダーで比較
									["header"].forEach(function (p) {
										let res = self.matchTmplMinMaxLoc(
											img_tgt[p],
											img_tmpl[p]
												.roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1)))
												.clone()
										);
										// パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
										arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
									});
								} else if (["result_table", "score_detail", "race_detail", "gougai"].includes(lRects[i].rayout_type)) {
									// 基本情報欄を持つレイアウトは基本情報欄で比較
									["basic_info"].forEach(function (p) {
										let res = self.matchTmplMinMaxLoc(
											img_tgt[p],
											img_tmpl[p]
												.roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1)))
												.clone()
										);
										// パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
										arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
									});
								} else if (["common_scroll_only"].includes(lRects[i].rayout_type)) {
									// スクロール範囲しかないものはレイアウトタイプが一致していれば強制的に100%同じグループとして1を強制代入
									arr_val[Math.min(i, j)][Math.max(i, j)] = 1;
								} else {
									// パーツ毎にテンプレートマッチ
									self.params.tgt_parts_for_group.forEach(function (p) {
										let res = self.matchTmplMinMaxLoc(
											img_tgt[p],
											img_tmpl[p]
												.roi(new cv.Rect(0, 0, Math.max(img_tmpl[p].cols - 1, 1), Math.max(img_tmpl[p].rows - 1, 1)))
												.clone()
										);
										// パーツ毎の結果を乗算、全部似てればほぼ1のまま、どれかでも違うと一気に0に近づく
										arr_val[Math.min(i, j)][Math.max(i, j)] *= res.maxVal;
									});
								}
							}
						});
					});
					console.log(arr_val);
					let current_group = -1;
					[...Array(n_tgt).keys()].forEach(function (i) {
						if (l_group[i] == null) {
							current_group += 1;
							l_group[i] = current_group;
							for (let j = i + 1; j < n_tgt; j++) {
								if (l_group[j] == null && arr_val[i][j] > self.thres.match_tmpl_basic_info) {
									l_group[j] = current_group;
								}
							}
						}
					});
				}
				// console.log(l_group);
				resolve(l_group);
			});
		},
		getOrderByScbar(imgs, lRects, lGroup) {
			return new Promise((resolve) => {
				// const nTgt = imgs.length;
				[...Array(Math.max(...lGroup) + 1).keys()].forEach((currentGroup) => {
					let lTmpScbarY = [];
					let lTmpScbarH = [];
					let nTmp = 0;
					imgs.forEach((imgTgt, i) => {
						if (lGroup[i] === currentGroup) {
							nTmp += 1;
							if ("scroll_bar_y" in imgTgt) {
								if (imgTgt["scroll_bar_y"] !== -1) {
									lTmpScbarY.push({ index: i, scroll_bar_y: imgTgt["scroll_bar_y"] });
									lTmpScbarH.push(imgTgt["scroll_bar_h"]);
								}
							} else {
								imgTgt["scroll_bar_y"] = -1;
								imgTgt["scroll_bar_h"] = -1;
							}
						}
					});

					if (nTmp !== lTmpScbarY.length || Math.min(...lTmpScbarH) / Math.max(...lTmpScbarH) < this.thres.scbar_h) {
						imgs.forEach((imgTgt, i) => {
							if (lGroup[i] === currentGroup) {
								imgTgt["position_by_scbar"] = -1;
							}
						});
					} else {
						lTmpScbarY.sort((first, second) => first["scroll_bar_y"] - second["scroll_bar_y"]);
						lTmpScbarY.forEach((tmpScbarY, i) => {
							imgs[tmpScbarY["index"]]["position_by_scbar"] = i;
						});
					}
				});
				resolve();
			});
		},
		matchOneLine(imgs, lGroup, arrVal, arrLoc, i) {
			const self = this; // this를 self에 저장

			return new Promise((resolve) => {
				let imgTmpl = imgs[i];
				console.log("matchOneLine 시작", imgTmpl);
				let simpleRayout = ["result_table", "score_info", "score_detail", "field", "race_detail", "gougai"];
				imgs.forEach((imgTgt, j) => {
					let isNeighborByScbar = false;
					let isTgt = false;
					if (i !== j && lGroup[i] === lGroup[j]) {
						isTgt = true;
						if (imgTmpl["position_by_scbar"] !== -1) {
							if (imgTgt["position_by_scbar"] === imgTmpl["position_by_scbar"] + 1) {
								isNeighborByScbar = true;
							}
						}
					}
					if (isTgt && (imgTmpl["position_by_scbar"] === -1 || isNeighborByScbar)) {
						let res = {};
						let tmpSign = 0;
						if (simpleRayout.includes(imgTmpl.rayout_type)) {
							res = self.matchTmplMinMaxLoc(imgTgt.scroll, imgTmpl.bottom_row_higher);
						} else if (["common_header_scroll", "common_scroll_only"].includes(imgTmpl.rayout_type)) {
							let imgMsk = self.geneCommonMsk(imgTmpl.bottom_row, imgTgt.bottom_row);
							res = self.matchTmplWithMskMinMaxLoc(imgTgt.scroll, imgTmpl.bottom_row, imgMsk);
							imgMsk.delete();
						} else {
							res = self.matchTmplMinMaxLoc(imgTgt.scroll, imgTmpl.bottom_row);
						}
						if (arrVal[Math.min(i, j)][Math.max(i, j)] < res.maxVal && self.thres.match_tmpl < res.maxVal) {
							let dist = 0;
							if (simpleRayout.includes(imgTmpl.rayout_type)) {
								dist = imgTgt.scroll.rows - imgTmpl.bottom_row_higher.rows - res.maxLoc.y;
							} else {
								dist = imgTgt.scroll.rows - imgTmpl.bottom_row.rows - res.maxLoc.y;
							}
							let tmpImgTgt = new cv.Mat();
							let tmpImgTmpl = new cv.Mat();
							if (i >= j) {
								dist *= -1;
							}
							if (dist < 0) {
								tmpSign = 1;
							} else {
								tmpSign = -1;
							}
							tmpImgTgt = imgTmpl.scroll
								.roi(new cv.Rect(0, dist * tmpSign * -1, imgTmpl.scroll.cols, imgTmpl.scroll.rows + dist * tmpSign))
								.clone();
							tmpImgTmpl = imgTgt.scroll
								.roi(new cv.Rect(0, 0, imgTgt.scroll.cols, imgTgt.scroll.rows + dist * tmpSign))
								.clone();

							let tmpRes = self.matchTmplMinMaxLoc(tmpImgTgt, tmpImgTmpl);
							if (self.thres.match_tmpl_higher < tmpRes.maxVal) {
								arrVal[Math.min(i, j)][Math.max(i, j)] = res.maxVal;
								arrLoc[Math.min(i, j)][Math.max(i, j)] = dist;
							}
							tmpImgTmpl.delete();
							tmpImgTgt.delete();
						}
						if (i <= j) {
							tmpSign = 1;
						} else {
							tmpSign = -1;
						}
						if (
							isNeighborByScbar &&
							(arrVal[Math.min(i, j)][Math.max(i, j)] === 0.0 || arrLoc[Math.min(i, j)][Math.max(i, j)] * tmpSign < 0)
						) {
							arrVal[Math.min(i, j)][Math.max(i, j)] = 1.0;
							arrLoc[Math.min(i, j)][Math.max(i, j)] = imgTgt.scroll.rows * tmpSign;
						}
					}
				});
				resolve();
			});
		},
		getRelativeDist(arrVal, arrLoc, lGroup) {
			return new Promise((resolve) => {
				const nTgt = arrVal.length;
				console.log("각 그룹의 선두 이미지로부터의 상대 거리 계산");
				let lRelativeHeight = new Array(nTgt).fill(null);
				let lRelativeHeightScore = new Array(nTgt).fill(0.0);
				let lIsFinished = new Array(nTgt).fill(false);
				let nFinishedBefore = -1;
				let nFinished = 0;

				[...Array(Math.max(...lGroup) + 1).keys()].forEach((currentGroup) => {
					let iMostCertain = 0;
					let lVal = [];
					[...Array(nTgt).keys()]
						.filter((d) => lGroup[d] === currentGroup)
						.forEach((i) => {
							[...Array(nTgt).keys()]
								.filter((d) => lGroup[d] === currentGroup)
								.forEach((j) => {
									lVal.push({ i, j, val: arrVal[i][j], loc: arrLoc[i][j] });
								});
						});
					lVal.sort((first, second) => second.val - first.val);
					if (lVal[0].loc >= 0) {
						iMostCertain = lVal[0].i;
					} else {
						iMostCertain = lVal[0].j;
					}

					let isGroupInitialized = false;
					// eslint-disable-next-line no-constant-condition
					while (true) {
						nFinishedBefore = nFinished;
						[...Array(nTgt).keys()]
							.filter((d) => lGroup[d] === currentGroup)
							.forEach((y) => {
								if (!isGroupInitialized && y === iMostCertain) {
									lRelativeHeight[y] = 0;
									lRelativeHeightScore[y] = 1;
									isGroupInitialized = true;
								}
								if (isGroupInitialized && !lIsFinished[y] && lRelativeHeight[y] !== null) {
									[...Array(nTgt).keys()].forEach((i) => {
										[...Array(nTgt).keys()].forEach((j) => {
											if (arrLoc[i][j] !== 0 && lGroup[i] === currentGroup && lGroup[j] === currentGroup) {
												let tmpRelativeHeightScore = Math.min(lRelativeHeightScore[y], arrVal[i][j]);
												if (i < y && j === y && lRelativeHeightScore[i] < tmpRelativeHeightScore) {
													lRelativeHeight[i] = lRelativeHeight[y] - arrLoc[i][j];
													lRelativeHeightScore[i] = tmpRelativeHeightScore;
													lIsFinished[i] = false;
												} else if (i === y && j > y && lRelativeHeightScore[j] < tmpRelativeHeightScore) {
													lRelativeHeight[j] = lRelativeHeight[y] + arrLoc[i][j];
													lRelativeHeightScore[j] = tmpRelativeHeightScore;
													lIsFinished[j] = false;
												}
											}
										});
									});
									lIsFinished[y] = true;
								}
							});
						nFinished = lIsFinished.filter((d) => d).length;
						if (nFinished === nTgt || nFinishedBefore === nFinished) {
							break;
						}
					}
					let minRelativeHeight = Math.min(...lRelativeHeight.filter((d, i) => lGroup[i] === currentGroup));
					for (let i = 0; i < lRelativeHeight.length; i++) {
						if (lGroup[i] === currentGroup && lRelativeHeight[i] !== null) {
							lRelativeHeight[i] -= minRelativeHeight;
						}
					}
				});
				console.log(lRelativeHeight);
				resolve(lRelativeHeight);
			});
		},
		alignMissingImgs(lRelativeHeight, lGroup, imgs) {
			return new Promise((resolve) => {
				const nTgt = imgs.length;
				console.log("위치를 얻지 못한 이미지를 끝에 단순 배치");
				if (lRelativeHeight.filter((d) => d == null).length) {
					[...Array(Math.max(...lGroup) + 1).keys()].forEach((currentGroup) => {
						let maxRhAlready = Math.max(...lRelativeHeight.filter((d, i) => lGroup[i] === currentGroup));
						let indexMaxRhAlready = [...Array(nTgt).keys()].filter(
							(d) => lGroup[d] === currentGroup && lRelativeHeight[d] === maxRhAlready
						)[0];
						console.log(maxRhAlready, indexMaxRhAlready);
						let nextRh = maxRhAlready + imgs[indexMaxRhAlready].scroll.rows;
						[...Array(nTgt).keys()]
							.filter((d) => lGroup[d] === currentGroup && lRelativeHeight[d] == null)
							.forEach((i) => {
								lRelativeHeight[i] = nextRh;
								nextRh += imgs[i].scroll.rows;
							});
					});
				}
				resolve(lRelativeHeight);
			});
		},
		detectFactorByGamma(elesScrollCanvas) {
			let lOut = [];
			let eleTmpl1Factor = document.getElementById("tmpl1Factor");
			let canvasTmpl1Factor = document.createElement("canvas");
			canvasTmpl1Factor.width = eleTmpl1Factor.naturalWidth;
			canvasTmpl1Factor.height = eleTmpl1Factor.naturalHeight;
			canvasTmpl1Factor.getContext("2d").drawImage(eleTmpl1Factor, 0, 0);
			canvasTmpl1Factor = this.gammaCorrection(canvasTmpl1Factor, 0.1);

			let srcTmpl = cv.imread(canvasTmpl1Factor);
			cv.cvtColor(srcTmpl, srcTmpl, cv.COLOR_RGBA2GRAY, 0);
			cv.threshold(srcTmpl, srcTmpl, this.thres_1factor, 255, cv.THRESH_BINARY);
			let mvTmplContours = new cv.MatVector();
			let mvTmplHierarchy = new cv.Mat();
			cv.findContours(srcTmpl, mvTmplContours, mvTmplHierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

			let lTmplContoursOnlyLarge = [];
			for (let i = 0; i < mvTmplContours.size(); i++) {
				if (cv.contourArea(mvTmplContours.get(i)) > Math.min(srcTmpl.cols, srcTmpl.rows) ** 2 / 50) {
					lTmplContoursOnlyLarge.push(mvTmplContours.get(i));
				}
			}
			lTmplContoursOnlyLarge.sort((first, second) => cv.contourArea(second) - cv.contourArea(first));
			let msk1Factor = lTmplContoursOnlyLarge[1];
			mvTmplContours.delete();
			mvTmplHierarchy.delete();
			srcTmpl.delete();
			canvasTmpl1Factor.remove();

			let lScrollCanvas = Array.from(elesScrollCanvas);
			lScrollCanvas.forEach((sc) => {
				let imgSrc = cv.imread(sc);
				let lTmp = [];
				let tmpCanvasElement = this.gammaCorrection(sc, 0.1);

				let imgSrcGamma = cv.imread(tmpCanvasElement);
				cv.cvtColor(imgSrcGamma, imgSrcGamma, cv.COLOR_RGBA2GRAY, 0);
				cv.threshold(imgSrcGamma, imgSrcGamma, this.thres_1factor, 255, cv.THRESH_BINARY);
				let mvContours = new cv.MatVector();
				let mvHierarchy = new cv.Mat();
				cv.findContours(imgSrcGamma, mvContours, mvHierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
				for (let i = 0; i < mvContours.size(); ++i) {
					if (cv.contourArea(mvContours.get(i)) > Math.min(imgSrcGamma.cols, imgSrcGamma.rows) ** 2 / 50) {
						let isCloseVal = cv.matchShapes(mvContours.get(i), msk1Factor, cv.CONTOURS_MATCH_I3, 0);
						if (isCloseVal < this.thres_cont_close) {
							let tmpRect = cv.boundingRect(mvContours.get(i));
							let tmpScale = tmpRect.width / this.rectProp.factor_area_left[2];
							let tmpDic = {
								rect_factor_disc: {
									left:
										tmpRect.x +
										Math.floor((this.rectProp.factor_disc_left[0] - this.rectProp.factor_area_left[0]) * tmpScale),
									top:
										tmpRect.y +
										Math.floor((this.rectProp.factor_disc_left[1] - this.rectProp.factor_area_left[1]) * tmpScale),
									width: Math.floor(this.rectProp.factor_disc_left[2] * tmpScale),
									height: Math.floor(this.rectProp.factor_disc_left[3] * tmpScale),
								},
								rect_factor_icon: {
									left:
										tmpRect.x +
										Math.floor((this.rectProp.factor_icon_left[0] - this.rectProp.factor_area_left[0]) * tmpScale),
									top:
										tmpRect.y +
										Math.floor((this.rectProp.factor_icon_left[1] - this.rectProp.factor_area_left[1]) * tmpScale),
									width: Math.floor(this.rectProp.factor_icon_left[2] * tmpScale),
									height: Math.floor(this.rectProp.factor_icon_left[3] * tmpScale),
								},
								rect_factor_text: {
									left:
										tmpRect.x +
										Math.floor((this.rectProp.factor_text_left[0] - this.rectProp.factor_area_left[0]) * tmpScale),
									top:
										tmpRect.y +
										Math.floor((this.rectProp.factor_text_left[1] - this.rectProp.factor_area_left[1]) * tmpScale),
									width: Math.floor(this.rectProp.factor_text_left[2] * tmpScale),
									height: Math.floor(this.rectProp.factor_text_left[3] * tmpScale),
								},
							};

							let tmplFactorDisc = cv.imread(document.getElementById("tmplFactorDisc"));
							cv.resize(
								tmplFactorDisc,
								tmplFactorDisc,
								new cv.Size(tmpDic.rect_factor_disc.width, tmpDic.rect_factor_disc.height),
								0,
								0,
								cv.INTER_CUBIC
							);

							let imgTgt = imgSrc
								.roi(
									new cv.Rect(
										Math.max(tmpDic.rect_factor_disc.left - 1, 0),
										Math.max(tmpDic.rect_factor_disc.top - 1, 0),
										tmpDic.rect_factor_disc.width + 2,
										tmpDic.rect_factor_disc.height + 2
									)
								)
								.clone();
							if (this.matchTmplMinMaxLoc(imgTgt, tmplFactorDisc).maxVal > this.thres_match_tmpl_disc) {
								let lResColor = [];
								let img1Factor = imgSrc.roi(tmpRect).clone();
								cv.cvtColor(img1Factor, img1Factor, cv.COLOR_RGB2HSV, 0);
								lResColor.push({
									color: "red",
									val: this.calcColorRate(img1Factor, [155, 100, 0, 0], [175, 205, 255, 0]),
								});
								lResColor.push({
									color: "blue",
									val: this.calcColorRate(img1Factor, [90, 150, 0, 0], [110, 255, 255, 0]),
								});
								lResColor.push({
									color: "green",
									val: this.calcColorRate(img1Factor, [30, 150, 0, 0], [50, 255, 255, 0]),
								});
								lResColor.sort((first, second) => second.val - first.val);
								if (lResColor[0].val > this.thres_1factor_color) {
									tmpDic.bg_color = lResColor[0].color;
									tmpDic.bg_color_val = lResColor[0].val;
								} else {
									tmpDic.bg_color = "white";
									tmpDic.bg_color_val = 1;
								}
								lTmp.push(tmpDic);
								img1Factor.delete();
							}
							tmplFactorDisc.delete();
							imgTgt.delete();
						}
					}
				}
				lOut.push(lTmp);
				mvContours.delete();
				mvHierarchy.delete();
				imgSrc.delete();
				imgSrcGamma.delete();
				tmpCanvasElement.remove();
			});
			msk1Factor.delete();
			return lOut;
		},
		async ocrFactorText(elesScrollCanvas, lDetectedFactor) {
			let lScrollCanvas = Array.from(elesScrollCanvas);
			const minHeightFactorText = 30;

			// let lSkillnames = Object.keys(this.dict_skills);
			// lSkillnames = lSkillnames.map((d) => d.split("")).flat();
			// let charWhitelist = [...new Set(lSkillnames)].join("") + "◯〇";

			const worker = await Tesseract.createWorker({
				workerPath: "https://unpkg.com/tesseract.js@4.1.1/dist/worker.min.js",
			});
			await worker.loadLanguage("jpn");
			await worker.initialize("jpn", 3);

			for (let i = 0; i < lDetectedFactor.length; i++) {
				for (let j = 0; j < lDetectedFactor[i].length; j++) {
					let tmpFactor = lDetectedFactor[i][j];
					if (tmpFactor.bg_color === "white") {
						const tmpCanvasElement = document.createElement("canvas");
						const w = Math.max(
							tmpFactor.rect_factor_text.width,
							Math.floor((tmpFactor.rect_factor_text.width / tmpFactor.rect_factor_text.height) * minHeightFactorText)
						);
						const h = Math.max(tmpFactor.rect_factor_text.height, minHeightFactorText);
						tmpCanvasElement.width = w;
						tmpCanvasElement.height = h;
						tmpCanvasElement
							.getContext("2d")
							.drawImage(
								lScrollCanvas[i],
								tmpFactor.rect_factor_text.left,
								tmpFactor.rect_factor_text.top,
								tmpFactor.rect_factor_text.width,
								tmpFactor.rect_factor_text.height,
								0,
								0,
								w,
								h
							);
						const data = await worker.recognize(tmpCanvasElement, {});
						tmpCanvasElement.remove();
						tmpFactor["factor_text"] = this.normalizeText(data.data.text, this.regexps);

						let skillIconId = "";
						if (tmpFactor.factor_text in this.dict_skills) {
							skillIconId = "skillIcon" + this.dict_skills[tmpFactor.factor_text].iconId;
						} else {
							skillIconId = "skillIconUnknown";
						}
						lScrollCanvas[i]
							.getContext("2d")
							.drawImage(
								document.getElementById(skillIconId),
								tmpFactor.rect_factor_icon.left,
								tmpFactor.rect_factor_icon.top,
								tmpFactor.rect_factor_icon.width,
								tmpFactor.rect_factor_icon.height
							);
					}
				}
			}
			await worker.terminate();
			return lDetectedFactor;
		},
		async getUnknownRects(lMat, lRects) {
			console.log("레이아웃이 불명확한 이미지에 대해 일반적인 처리로 스크롤 범위를 특정합니다");
			let lIndexTgt = [...Array(lRects.length).keys()].filter((e) => lRects[e].rayout_type === "unknown");
			console.log("Unknown 레이아웃 이미지 인덱스:", lIndexTgt);

			if (lIndexTgt.length === 0) {
				console.log("Unknown 레이아웃 이미지가 없습니다.");
				return;
			}

			try {
				// 이미지 너비 계산 (16:9 비율 유지)
				let imgWidth = lMat[lIndexTgt[0]].cols;
				let imgHeight = lMat[lIndexTgt[0]].rows;
				let tmpW = Math.min(imgWidth, Math.floor((imgHeight / 16) * 9));

				console.log("이미지 크기:", imgWidth, "x", imgHeight, "계산된 너비:", tmpW);

				// 모든 unknown 이미지에 대해 기본 레이아웃 적용
				lIndexTgt.forEach((i) => {
					// 레이아웃 타입 설정
					lRects[i].rayout_type = "common_header_scroll";

					// 헤더 영역 (상단 30%)
					let headerHeight = Math.floor(imgHeight * 0.3);
					lRects[i].rects.header = {
						x: Math.floor((imgWidth - tmpW) / 2),
						y: 0,
						width: tmpW,
						height: headerHeight,
					};

					// 스크롤 영역 (중간 60%)
					let scrollHeight = Math.floor(imgHeight * 0.6);
					lRects[i].rects.scroll_full_width = {
						x: Math.floor((imgWidth - tmpW) / 2),
						y: headerHeight,
						width: tmpW,
						height: scrollHeight,
					};

					// 푸터 영역 (하단 10%)
					let footerHeight = imgHeight - headerHeight - scrollHeight;
					lRects[i].rects.footer = {
						x: Math.floor((imgWidth - tmpW) / 2),
						y: headerHeight + scrollHeight,
						width: tmpW,
						height: footerHeight,
					};

					// 스크롤 영역 복사
					lRects[i].rects.scroll = {
						x: lRects[i].rects.scroll_full_width.x,
						y: lRects[i].rects.scroll_full_width.y,
						width: lRects[i].rects.scroll_full_width.width,
						height: lRects[i].rects.scroll_full_width.height,
					};

					// 하단 행 (스크롤 영역의 하단 12.5%)
					let bottomRowHeight = Math.max(Math.floor(scrollHeight / 8), 1);
					lRects[i].rects.bottom_row = {
						x: lRects[i].rects.scroll.x,
						y: lRects[i].rects.scroll.y + scrollHeight - bottomRowHeight,
						width: lRects[i].rects.scroll.width,
						height: bottomRowHeight,
					};

					// 확장된 하단 행 (스크롤 영역의 하단 25%)
					let bottomRowHigherHeight = Math.max(Math.floor(scrollHeight / 4), 1);
					lRects[i].rects.bottom_row_higher = {
						x: lRects[i].rects.scroll.x,
						y: lRects[i].rects.scroll.y + scrollHeight - bottomRowHigherHeight,
						width: lRects[i].rects.scroll.width,
						height: bottomRowHigherHeight,
					};

					console.log(`이미지 ${i} 레이아웃 설정 완료:`, lRects[i]);
				});
			} catch (error) {
				console.error("getUnknownRects 오류 발생:", error);

				// 오류 발생 시 간단한 기본 레이아웃 적용
				lIndexTgt.forEach((i) => {
					let imgWidth = lMat[i].cols;
					let imgHeight = lMat[i].rows;

					lRects[i].rayout_type = "common_scroll_only";
					lRects[i].rects = {
						scroll_full_width: {
							x: 0,
							y: 0,
							width: imgWidth,
							height: imgHeight,
						},
						scroll: {
							x: 0,
							y: 0,
							width: imgWidth,
							height: imgHeight,
						},
						bottom_row: {
							x: 0,
							y: imgHeight - Math.floor(imgHeight / 8),
							width: imgWidth,
							height: Math.floor(imgHeight / 8),
						},
						bottom_row_higher: {
							x: 0,
							y: imgHeight - Math.floor(imgHeight / 4),
							width: imgWidth,
							height: Math.floor(imgHeight / 4),
						},
					};
				});
			}
		},
	},
};
</script>

<style scoped>
/* 스타일 정의 */
</style> -->
