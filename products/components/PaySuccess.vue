<template>
  <div class="pay-sus-model">
    <img class="close" src='@/assets/images/dClose.png'  @click="panelCancel"  alt="" />

    <div class="pay-sus-dialog">
      <!-- 当前商品 -->
      <div class="cur-pro">
        <img src="http://test-static.wisdomwz.com/weather/cms/2022-10-17/1666013435107dnG3nh.jpg" alt="">
        <p class="name">农场鸡蛋40个</p>
      </div>
      <ul class="rec-pro">
        <li>
          <img src="http://test-static.wisdomwz.com/weather/cms/2022-11-22/16691129921993tmZdc.png" alt="">
          <span class="name">30原话费券</span>
        </li>
        <li>
          <img src="http://test-static.wisdomwz.com/weather/cms/2022-11-22/16691129921993tmZdc.png" alt="">
          <span class="name">会员免广告权益</span>
        </li>
      </ul>
      <div class="pay-bottom">
        <img src="../assets/group/one.png" alt="再来一单">
        <img src="../assets/group/more.png" alt="查看更多商品">
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { reportInfo} from "@/utils/jsBridge";

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    }
  },
  setup(props,{ emit }) {
    const data = ref(props.data)
   
    // 有埋点数据的话 需要进行曝光埋点
   
      // reportInfo(pointData.value)
     
    const panelCancel = () => {
      emit('close')
    }
    const panelConfirm = () => {
      emit('confirm')
    }
    return { 
      data,
      panelCancel,
      panelConfirm,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.pay-sus-model {
  position: relative;
  padding-top: 30px;
}
.close {
    width: 20px;
    position: absolute;
    right: 20px;
    top: 0;
  }
.pay-sus-dialog {
  background: url(../assets/group/t1_bg.png) 0 0 no-repeat;
  background-size: 100% 100%;
  width: 351px;
  font-size: 14px;
  font-weight: 400;
  color: #fff;
  text-align: center;
  
  .cur-pro{
    position:relative;
    width: 113px;
    margin: 0 auto ;
    padding-top: 61px;
    background: url(../assets/group/shadowBg.png) center bottom no-repeat;
    background-size: 100% auto;
    padding-bottom: 9px; 
  
    img{
      border-radius: 12px;
      border: 2px solid #FFEBB8;
      width: 113px;
      height: 113px;
    }
    .name {
      position: absolute;
      width:109px;
      left: 0;
      margin: 0 2px;
      bottom: 10px;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, #000000 100%);
      border-radius: 0px 0px 12px 12px;
      opacity: 0.6;
    }
  }
  .rec-pro {
    background: url(../assets/group/t1_c.png) 0 0 no-repeat;
    background-size: 100% 100%;
    width: 287px;
    height: 182px;
    margin: 56px auto 0;
    padding-top: 36px;
    .flex(center);
    img {
      width: 129px;
      height: 110px;
    }
    .name {
      display: block;
      margin-top: 6px;
    }
  }
  .pay-bottom {
    padding: 13px 28px 24px;
    .flex();
    img {
      width: 147px;
    }
  }
}


</style>
