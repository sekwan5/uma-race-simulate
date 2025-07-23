<template>
	<div>
		<h3>{{ $t("message.lastUpdate") }}：{{ releases[releases.length - 1].timestamp }}</h3>
		<el-collapse v-model="releaseNote">
			<el-collapse-item :title="$t('message.releaseNote')">
				<el-timeline :reverse="true">
					<el-timeline-item v-for="(release, index) in releases" :key="index" :timestamp="release.timestamp">
						<div v-html="release.content"></div>
					</el-timeline-item>
				</el-timeline>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
export default {
	name: "ReleaseNote",
	data: function () {
		return {
			releaseNote: "",
			releases: [
				{
					content: "어기여차, Do ya 수정",
					timestamp: "2024-05-28",
				},
				{
					content: "진수 시리즈 추가",
					timestamp: "2024-05-28",
				},
				{
					content: "마신표 계산기 내장기능으로 포함, 일부 한글화, 온존시스템 발동여부 추가 ",
					timestamp: "2024-10-12",
				},
				{
					content: "스태미너 승부 추가 , 선택한 패시브 파일명 표시 ",
					timestamp: "2024-10-15",
				},
				{
					content: "고유기선택시 진화스킬 마신계산 오류수정,마신표 제작시 거리적성 S ",
					timestamp: "2024-10-19",
				},
				{
					content: "롱샹경기장 패시브 추가, 롱샹경기장 최직기 오류수정",
					timestamp: "2025-01-05",
				},
				{
					content: "조건부 계승기 지속시간 적용 안되던 오류 수정",
					timestamp: "2025-01-15",
				},
				{
					content: "마신표 제작시 고유기 초기화 변수 수정",
					timestamp: "2025-02-10",
				},
				{
					content: "~2025.08.19 출시스킬 추가,일부 스킬발동조건 수정",
					timestamp: "2025-04-04",
				},
				{
					content: "일부 스킬 변경점 적용",
					timestamp: "2025-07-23",
				},
			],
		};
	},
};
</script>
