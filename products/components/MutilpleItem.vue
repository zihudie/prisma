<template>
  <!-- 2-3个产品样式 -->
  <div>
    <div :class='["inner-model", `pro-model${dialogSource}`]'>
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
      <img @click="jumpRule" src="../assets/group/rule.png" class="rule-img"/>
    </p>
    </div> 
    <div class="exchange">
      <img @click="exchange" src="../assets/group/exchange.png"/>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { reportInfo} from "@/utils/jsBridge";
import { useExchange } from "./useExchange"

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    dialogSource:{
      type: String,
      default: "1",
    }
  },
  setup(props,{ emit }) {
    const data = props.data
    let dialogSource =props.dialogSource
    const {exchange,goRule,curData} = useExchange(data,Number(dialogSource))
    // 有埋点数据的话 需要进行曝光埋点
    // reportInfo(pointData.value)
    const panelConfirm = () => {
      emit('confirm')
    }
    const jumpRule = ()=>{
      emit('close');
      goRule()
    }
    return { 
      curData,
      jumpRule,
      exchange,
      panelConfirm,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
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
