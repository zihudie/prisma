<template>
  <div class="pay-dailog">
    <!-- 倒计时 -->
    <div class="pay-notice">
      <img src="../assets/pay/icon.png"  class="icon" alt="">
      <div>
        经检测，您目前支付环境安全，请放心付款
        <div class="count-model">
          <van-count-down :time="time" millisecond>
            <template #default="timeData" class="count-time">
              <span class="block" v-html="filters(timeData.minutes)"></span>
              <span class="colon"><img src="../assets/pay/dDot.png"/></span>
              <span class="block" v-html="filters(timeData.seconds)"></span>
              <span class="colon"><img src="../assets/pay/dot.png" class="dot"/></span>
              <span class="block" v-html="filters(timeData.milliseconds,'millisecond')"></span>
            </template>
          </van-count-down>
          <span class="count-text">秒后将失去抢购资格</span>
        </div>
      </div>
    </div>
    <!-- 具体付款方式 -->
    <div class="pay-model">
    <img class="close" src="../assets/pay/close.png" alt="close" @click="closePanel" />
    <!-- 中奖概率 -->
    <!-- <span class="probality">{{data.winRatio}}%</span> -->
    <div class="pro-model">
      <div class="pay-pros">
        <img :src="data.commodityDetailUrl" alt="img" />
        <div class="product">
          <p class="product-name">{{data.commodityTitle}}</p>
          <p class="product-bottom">
            <span class="product-buy"> ¥ <span class="price">{{data.commodityPriceList&&data.commodityPriceList[0].price}}</span></span>
            <span class="product-price"> ¥ <span class="price">{{data.commodityPriceList&&data.commodityPriceList[0].commodityPrice}}</span></span>
          </p>
        </div>
      </div>
      <div class="buy-ways">
        <div class="wechat" @click="handlePay('1')"><span>微信支付</span></div>
        <div class="ali" @click="handlePay('2')"><span>支付宝支付</span></div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { ref , reactive, toRefs} from 'vue'
import { CountDown } from "vant"
import { reportInfo} from "@/utils/jsBridge";

export default {
  components:{
    [CountDown.name]: CountDown
  },  
  props: {
    prodata: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, { emit }) {
    const data = ref(props.prodata)
    const state =  reactive({
      time: 10*60*1000
    }) 
    reportInfo({
      eventCode:"choujiang_paid_popup_show",
      eventName:"抽奖支付/看视频过程弹窗曝光",
      eventType:"show",
      extraParams:{
        element_content:'支付弹窗',
        good_name: data.value.commodityName
      }
    })
    const closePanel = () => {
      emit('callback')
    }
    const handlePay = (type) => {
      // wechat 1, alipay 2
      emit('pay',type)
    }
    const filters = (value,type) => {
      let _val =  '0'+value
      if(type){
        _val =  _val.slice(1,3)

      }else{
        _val =  _val.slice(-2)
      }
      _val = _val.replace(/([0-9])/g, `<span class='time'>$1</span>`)
      return _val
    }
    return {
      data,
      ...toRefs(state),
      closePanel,
      handlePay,
      filters
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.pay-dailog {
  background: url(../assets/pay/lineBg.png) 0 0 no-repeat;
  background-size: 100% auto;
}
.pay-notice {
  padding: 9px 30px 12px 18px;
  font-weight: 500;
  color : #fff;

  .flex(flex-start);
  .icon{
    width: 35px;
    height: 31px;
    margin-right: 11px;
  }
  .count-model{
    .flex(flex-start);
    height:21px;
    span {
      color: #fff;
    }
    :deep(.time) {
      background: url(../assets/pay/bg.png) 0 0 no-repeat;
      background-size: 100% 100%;
      width: 15px;
      display: inline-block;
      line-height: 15px;
      font-size : 12px;
      text-align: center;
      color: #C75100;
      margin-right: 1px;
      font-weight: 500;
    }
    img {
      width: 2px;
      margin-right: 2px;
      margin-left: 1px;
    }
    .dot {
      position: relative;
      top:5px;
    }
    
  }
  .count-text{
    font-size: 12px;
    color: #fff;
    font-weight: 400;
    padding-left: 2px;
    position: relative;
    top: 2px;
  }
  // :deep(.van-count-down){
  //   width: 126px;
  // }
}


.pay-model {
  // background: url(../assets/pay/prize.png) 0 0 no-repeat;
  // background-size: 100% auto;
  background: #fff;
  border-radius: 10px 10px 0 0;
  position: relative;
  .close {
    position: absolute;
    right: 15px;
    top: 10px;
    width: 16px;
    height: 16px;
    z-index: 10;
  }
  .probality {
    position: absolute;
    left: 260px;
    top: 37.5px;
    text-align: center;
    font-weight: 800;
    // width: 54px;
    padding: 0 4px;
    background: linear-gradient(203deg, #ff9159 0%, #ff6624 100%);
    border-radius: 4px;
    color: #fff;
    font-size: 22px;
    text-shadow: 0px 2px 4px rgba(219, 42, 0, 0.5);
  }
}
.pro-model {

  padding: 20px 12px;
  position: relative;
  .pay-pros {
    .flex(flex-start);
  }
  .product {
    height: 90px;
    .flex(space-between);
    flex-direction: column;
    align-items: flex-start;
    padding-right: 14px;
  }
  img {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    margin-right: 8px;
    flex-shrink: 0;
  }
  .product-name {
    font-size: 16px;
    font-weight: 500;
  }
  .product-bottom{
    position: relative;
    bottom: -8px;
  }
  .product-buy {
    color: #ff2924;
    font-size: 12px;
    padding-right: 8px;
    .price {
      font-size: 34px;
      font-weight: 800;
    }
  }
  .product-price {
    color: #9a9da1;
    font-size: 12px;
    .price {
      font-size: 20px;
      text-decoration: line-through;
    }
  }
  .pay-font {
    background-size: 24px 24px;
    padding-left: 26px;
    font-weight: 500;
    font-size: 16px;
  }
  .wechat {
    height: 44px;
    background: #18b539;
    color: #fff;
    border-radius: 22px;
    font-weight: 500;
    margin-top: 21px;
    .flex(center);
    text-align: center;
    span {
      background: url(../assets/pay/wechat.png) left center no-repeat;
      .pay-font();
    }
  }
  .ali {
    .flex(center);
    height: 44px;
    margin-top: 12px;
    text-align: center;
    span {
      background: url(../assets/pay/ali.png) left center no-repeat;
      .pay-font();
      color: #1d75ff;
    }
  }
}
</style>
