<template>
  <div class="content flex-content">
    <header-item :center-hide="true">
      <template #left class="h-left">
          <div class="record-h-left" @click="goBack">
            <img src="@/assets/images/back.png" alt="back" />
            参与记录
          </div>
        </template>
        <template #right>
          <!-- todo  需要判断是否有历史记录 且为 2.10 以下版本展示 -->
          <span @click="historyRecord" class="customer" v-if="hasRecord">
            <img src="./assets/hisRecord.png" class="his-record" alt="client" />
          </span>
          <span @click="goWechat" class="customer">
            <img src="@/assets/images/client.png" alt="client" />
          </span>
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
import HeaderItem from '@/components/HeaderItem'
import RecordItem from './components/RecordItem'
import {groupRecordList ,recordList} from './api'
import {reportInfo,nativeBridge,nativeRoute} from "@/utils/jsBridge";
export default {
  components: {
    HeaderItem,
    RecordItem
  },
  setup() {
		reportInfo({
			eventCode:"choujiang_involve_show",
			eventName:"参与记录页曝光",
			eventType:"show"
		})
    const state = reactive({
      recordLists: [],
      hasRecord: false
    })

    let headers = {};

    groupRecordList().then(res=>{
      if(res.data) {
        state.recordLists = res.data
      }
    })
    recordList().then( res => {
      if(res.data) {
        nativeBridge.exec("0001").then(_res =>{
          headers =  _res
          // 2.10
          state.hasRecord = res.data.length && (headers["app-id"] === '1102' && headers.versionCode < 44)
        })
      }
    })

    const historyRecord = () =>{
      nativeRoute({
        url: "/recordListOld",
        path: "/luckdraw/RecordActivity",
      });
    }
    const goWechat = () =>{
      nativeBridge.exec("2012")
    }
    const goBack = () => {
      nativeBridge.exec("1002")
    }
    // state.recordLists = [
    //   {
    //     id:'121213',
    //     date:'234234',
    //     goodsName:'wjlfkflklkkkdjflkjeljsdflksf'
    //   }
    // ]
    return {
      goWechat,
      goBack,
      historyRecord,
      ...toRefs(state)
    }
  },
}
</script>

<style lang="less" scoped>
.record-h-left {
  font-size: 20px;
  font-weight: 500;
  img {
    width: 22px;
    margin-left: 8px;
  }
}
.customer{
  position: relative;
  top : -10px;
  &:last-child {
    margin-left: 12px;
  }
  img {
    width: 65px;
  }
  .his-record { 
    width: 74px;
    height: 28px;
  }
}
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
