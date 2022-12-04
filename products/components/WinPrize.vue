<template>
  <div class="tips-model" @click="callback">
    <img class="smile" src="../assets/tips/smile.png" alt="">
    <p class="msg">{{info}}期<span class="kai">开奖啦</span>，你中奖了吗？</p>
    <img class="close" src="../assets/tips/close.png" alt="" @click.prevent="closePanel">
  </div>
</template>
<script>
import { ref } from 'vue'
import { reportInfo } from "@/utils/jsBridge";

export default {
  props: {
    info:  String
  },
  setup(props, { emit }) {
    const info = ref(props.info)
    reportInfo({
        eventCode:"choujiang_jiangchi_warn_show",
        eventName:"奖池页开奖提醒曝光",
        eventType:"show",
      })
    const closePanel = () => {
      reportInfo({
        eventCode:"choujiang_jiangchi_warn_click",
        eventName:"奖池页开奖提醒点击",
        eventType:"click",
        extraParams:{
          click_content:'关闭'
        }
      })
      emit('close')
    }
    const callback = () => {
      emit('callback')
    }
    
    return {
      info,
      closePanel,
      callback
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.tips-model {
  position: fixed;
  z-index: 99;
  width: 100%;
  bottom: 5px;
  left: 0;
  .flex();
  background: url(../assets/tips/bg.png) center center no-repeat;
  background-size: 100% auto;
  .smile {
    width: 49px;
    height: 49px;
    margin: 0 4px 7px 9px;
  }
  .close {
    width: 14px;
    height: 14px;
    margin-right: 18px;
  }
  .msg {
    font-size: 16px;
    font-weight: 500;
    color: #fff;
    .kai {
      color: #FFF419;
      font-size: 20px;
    }
  }
  
}
</style>
