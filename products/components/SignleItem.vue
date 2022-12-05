<template>
  <div class="singlemodel">
    <div class="single-pro">
      <div class="pro-cover">
        <img src="http://test-static.wisdomwz.com/weather/cms/2022-10-17/1666013435107dnG3nh.jpg" alt="">
        <span class="remain">仅剩10件</span>
      </div>
      <p class="text-overflow tit">惠寻农家土鸡蛋40枚整惠寻农家土鸡蛋40枚整箱…</p>
    </div>
    <div class="price-model">
        <span class="yuan">原价:10999元</span>
        <span class="buy-price">抢购价:<span class="amount">19.9</span>元</span>
    </div>
    <img src="../assets/group/rule2.png"  @click="jumpRule" class="rule" alt="">
    <p>
      <img src="../assets/group/exchange.png"  @click="exchange" class="exchange" alt="">
    </p>
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
    }
  },
  setup(props,{ emit }) {
    const data = props.data
    // 有埋点数据的话 需要进行曝光埋点
    // reportInfo(pointData.value)
    const data = props.data
    const {exchange,goRule,curData} = useExchange(data,Number(dialogType))
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
      panelCancel,
      panelConfirm,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
 
.singlemodel {
  background: url(../assets/group/singleBg.png) 0 0 no-repeat;
  background-size: 100% 100%;
  width: 340px;
  height: 517px;
  padding-top: 100px;
  text-align: center;
  .single-pro { 
    width: 200px;
    margin: 0 auto;
    text-align: center;
    .tit {
      padding : 12px 3px 10px;
      color: #fff;
      font-weight: 500;
    }
  }
  .pro-cover {
    position: relative;
    height: 200px;
    background: #FFFFFF;
    border: 1px solid #FFE17F;
    border-radius: 10px;
    img {
      border-radius: 10px;
    }
    .remain {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 75px;
      line-height: 25px;
      background: linear-gradient(30deg, #FF6B14 0%, #FF8842 100%);
      border-radius: 10px 0px 12px 0px;
      color: #fff;
      text-align: center;
      font-weight: 500;
    }
  }
  .price-model {
    .flex();
    width: 278px;
    height: 52px;
    margin: 0 auto;
    padding: 0 6px 0 15px;
    color: #fff;
    font-size: 16px;
    
    .yuan { 
      flex: 1;
      text-decoration: line-through;
      color: #FF4A02;
      font-weight: 500;
    }
    .buy-price {
      width:150px;
      text-align: center;
    }
    .amount {
      font-size: 28px;
      font-weight: bold;
    }
    
  }
  .rule {
   width: 90px;
   padding-top: 10px;
   border: 1px sloid #FF6B14;

  }
  .exchange {
    width: 112px;
    padding-top: 27px;
  }
}


</style>
