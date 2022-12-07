<template>
  <div class="content flex-content">
    <header-item>
      <template v-slot:center>
        <span> {{history ? '历史参与记录' :'参与记录'}}</span>
      </template>
	</header-item>
    <div class="records-content">
      <div v-if="recordLists.length">
				<RecordItem   
        v-for="(list,index) in recordLists" 
        :key="index"
        :data="list"
      />
			</div>
			<div v-else class="no-record">
      <img src="./assets/noRecord.png" alt="">
			<p>暂无参与记录</p>
			</div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRoute } from "vue-router"
import HeaderItem from '@/components/HeaderItem'
import RecordItem from './components/RecordItemOld'
import {recordList} from './api'
import {reportInfo} from "@/utils/jsBridge";
export default {
  components: {
    HeaderItem,
    RecordItem,
  },
  setup() {
    const route = useRoute()
		reportInfo({
			eventCode:"choujiang_involve_show",
			eventName:"参与记录页曝光",
			eventType:"show"
		})
    const state = reactive({
      recordLists: [],
      history: ''
    })
    state.history =  route.query.history || ''
 
    recordList().then(res=>{
      console.log(res.data);
      if(res.data) {
        state.recordLists = res.data
      }
    })
    return {
      ...toRefs(state)
    }
  },
}
</script>

<style lang="less" scoped>
.records-content {
  overflow: auto;
  flex: 1;
  padding: 0 12px;
}
.no-record{
	margin-top: 150px;
	img{
		width: 139px;
	}
	text-align: center;
	color: #62666B;
}
</style>
