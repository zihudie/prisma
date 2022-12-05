<template>
  <div class="more-recomment-model more-recomment-model3">
    <img class="close" src='@/assets/images/dClose.png'  @click="panelCancel"  alt="" />
    <div v-if="dialogType ==='2' || dialogType ==='3'">
      <!-- 2-3个产品样式 -->
      <div :class='["inner-model", `pro-model${dialogType}`]'>
        <ul>
          <li class="pro-list">
            <img class="pro-img" src="http://test-static.wisdomwz.com/weather/cms/2022-10-17/1666013435107dnG3nh.jpg" alt="">
            <div class="pro-info">
              <div>
                <div class="info-top">
                <span class="tejia">特价</span><span class="miao">秒杀</span><span class="title">农家土鸡蛋 40枚</span>
                </div>
                <p>直发 新鲜到家 安全品质</p>
              </div>
              <div class="price-model">
                <span class="price"><span class="symbole">¥</span>89</span>
                <span class="discount">
                  19.9元秒杀
                </span>
              </div>
            </div>
          </li>
        </ul>
        <p class="t-c">
          <img src="../assets/group/rule.png" class="rule-img"/>
        </p>
      </div> 
      <div class="exchange">
        <img @click="exchange" src="../assets/group/exchange.png"/>
      </div>
    </div>
    <!-- 单个样式 -->
    <SignleItem v-if="dialogType ==='4'" /> 
    <!-- 4个产品样式 -->
    <FourItem v-if="dialogType ==='1'" />
  </div>
</template>

<script>
import { ref } from 'vue'
import { reportInfo} from "@/utils/jsBridge";
import SignleItem from "./SignleItem";
import FourItem from "./FourItem";
import { useExchange } from "./useExchange"
export default {
  components:{
    SignleItem,
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
    
    const {exchange,curData} = useExchange(data,Number(dialogType))

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
.pro-model2 {
  background: url(../assets/group/twoBg.png) 0 0 no-repeat;
  background-size: 100% auto;
  height: 405px;
}
.pro-model3 {
  background: url(../assets/group/threeBg.png) 0 0 no-repeat;
  background-size: 100% auto;
  height: 507px;
}
.pro-model2,.pro-model3 {
  width: 375px;
  margin: 0 auto;
  padding-top: 102px;
}
.pro-list {
  .flex(flex-start);
  width: 286px;
  height: 113px;
  background: #fff;
  border-radius: 12px;
  margin: 0 auto 8px;
  .pro-img {
    border-radius: 12px 0 0 12px;
    width: 113px;
    height: 113px; 
  }
  .pro-info {
    .flex();
    flex: 1;
    font-weight: 600;
    height: 113px;
    font-size: 14px;
    flex-direction: column;
    padding: 6px 6px 8px 5px;
  }
  .info-top{
    .flex();
    .title {
      .text-overflow();
      width: 110px;
    }
  }
  .miao,.tejia {
    font-size: 9px;
    color: #fff;
    font-weight: 500;
    text-align: center;
    display: inline-block;
    width: 24px;
    line-height: 16px;
    background: #FF1313;   

    border-radius: 3px;  
  }
  .miao { 
    background: #FF5A13;
    margin: 0 2px;
  }
  .price-model{
    .flex();
    color: #9A9DA1;
    font-size: 15px;
    width: 100%;
    .price{
      text-decoration: line-through;
    }
    .symbole {
      font-size: 12px;
    }
    .discount {
       color: #fff;
       width: 105px;
       line-height: 37px;
       background: #FF1313;
       text-align: center;
    }
  }
}
.rule-img{
    width: 56px;
    margin-top: 4px;
}
.exchange{
  width: 112px;
  margin: 0 auto ;
}
</style>
