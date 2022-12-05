<template>
  <div class="more-recomment-model more-recomment-model3">
    <img class="close" src='@/assets/images/dClose.png'  @click="panelCancel"  alt="" />
    <!-- 2-3个产品样式 -->
    <MutilpleItem  v-if="dialogType ==='2' || dialogType ==='3'"
      @close='panelCancel'
      :dialog-type="dialogType"
      :data="data" 
    />
    <!-- 单个样式 -->
    <SignleItem v-if="dialogType ==='4'" @close='panelCancel' :data="data" /> 
    <!-- 4个产品样式 -->
    <FourItem v-if="dialogType ==='1'" @close='panelCancel' :data="data"  />
  </div>
</template>

<script>
import { ref } from 'vue'
import { reportInfo} from "@/utils/jsBridge";
import SignleItem from "./SignleItem";
import MutilpleItem from "./MutilpleItem";
import FourItem from "./FourItem";
export default {
  components:{
    SignleItem,
    MutilpleItem,
    FourItem
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    dialogType:{
      type: String,
      default: "1",
    }
  },
  setup(props,{ emit }) {
    const data = props.data
    let dialogType =props.dialogType
    // dialogType 1 2*2样式 2（1*2），3（1*3），4（单品）
    if(!dialogType.value || dialogType.value === 'undefined' ){
      dialogType.value = '1'
    }
  
    // 有埋点数据的话 需要进行曝光埋点
      // reportInfo(pointData.value)
     
    const panelCancel = () => {
      emit('close')
    }
    const panelConfirm = () => {
      emit('confirm')
    }
    return { 
      curData,
      panelCancel,
      panelConfirm,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.more-recomment-model {
  position: relative;
  padding-top: 30px;
  background: url(../assets/group/light.png) 0 52% no-repeat;
  background-size: 100% auto;
}
.more-recomment-model3{
  background-position: 0 25%;
}
.close {
  width: 20px;
  position: absolute;
  right: 30px;
  top: 0;
}

</style>
