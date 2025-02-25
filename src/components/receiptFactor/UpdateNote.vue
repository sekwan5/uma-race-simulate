<template>
	<div>
		<h3>{{ $t("message.lastUpdate") }}：{{ updates[updates.length - 1].timestamp }}</h3>
		<el-collapse v-model="updateNote">
			<el-collapse-item :title="$t('message.updateNote')">
				<el-timeline :reverse="true">
					<el-timeline-item v-for="(update, index) in updates" :key="index" :timestamp="update.timestamp">
						<div v-html="update.content"></div>
					</el-timeline-item>
				</el-timeline>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
export default {
	name: "UpdateNote",
	data: function () {
		return {
			updateNote: "",
			updates: [
				{
					content: "~2025.08.19 출시스킬 추가,일부 스킬발동조건 수정",
					timestamp: "2025-02-22",
				},
			],
		};
	},
};
</script>
