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
					content: "인자 영수증 합치기 오픈",
					timestamp: "2025-02-27",
				},
			],
		};
	},
};
</script>
