<template>
  <div class="list-model pro-recommond" v-if="isRecommend">
    <span class="tips">仅剩<span>{{proList.remain}}</span>件</span>
    <div class="reco-inner">
      <img
        @click="productPurchase"
        :src="proList.commodityCoverUrl"
        alt=""
      />
      <div class="curpro">
        <p class="name">{{proList.commodityTitle}}</p>
        <div class="pirce-img">
          <span>¥{{proList.commodityPriceList && proList.commodityPriceList[0].commodityPrice}}</span>
          <div class="discount">
            爆品降至
            <p>
              ¥<span class="dis-num"> {{ proList.commodityPriceList && proList.commodityPriceList[0].price }} </span>
            </p>
          </div>
          <span>¥{{proList.commodityPriceList && proList.commodityPriceList[0].commodityPrice}}</span>
        </div>
        <div style="position:relative">
          <div class="buy zoom-in-zoom-out" @click="productPurchase">
          ￥<span> {{ proList.commodityPriceList && proList.commodityPriceList[0].price }} </span>
          <!-- 判断退款是否展示 -->
          <!-- <img class="refund" v-if="isNeedpay" src="../assets/refund.png" alt="全额退款" /> -->
         </div>
         <Vue3Lottie ref="lottieContainer" clas="lottie-con" :animationData="AnimateJSON" :height="64" :width="64" />
        </div>
      </div>
    </div>
  </div>
  <div class="list-model list" v-else>
    <span class="tips">
      仅剩<span>{{proList.remain}}</span>件
    </span>
    <img
      @click="productPurchase"
      :src="proList.commodityCoverUrl"
      alt=""
    />
    <p class="name">{{proList.commodityTitle || '我们看看打脑壳'}}</p>
    <div class="price-buy">
      <span class="price">¥<span class="num">{{proList.commodityPriceList && proList.commodityPriceList[0].commodityPrice}}</span></span>
      <div class="btn" @click="productPurchase">
        <span> {{ proList.commodityPriceList && proList.commodityPriceList[0].price }}</span>元抢购
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { nativeRoute } from '@/utils/jsBridge'
import {Vue3Lottie} from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import animateJSON from "@/utils/lottieData/data.json"

export default {
  props: {
    list:{
      type : Object,
      default: ()=>{}
    },
    isRecommend:{
      type: Boolean,
      default: false
    },
    isHistory:{
      type: Boolean,
      default: false
    },
    isNeedpay:{
      type: Boolean,
      default: false
    },
    surplusMin:Number,
    surplusMax:Number
  },
  components:{
    Vue3Lottie
  },
  setup(props,{emit}) {
    const AnimateJSON =  ref()
    const proList = ref(props.list)
    const isNeedpay =  ref(props.isNeedpay)
    const isRecommend =  ref(props.isRecommend)
    const {surplusMax,surplusMin } = props
    
    const remain =  Math.floor(Math.random()*(Number(surplusMax) - Number(surplusMin))+ Number(surplusMin))
    proList.value.remain = remain

    let goDetailUrl = {url:`/groupProDetails?bussType=2&id=${proList.value.id}`,path:'/luckdraw/GroupProductDetailActivity'}

    const productPurchase = ()=>{
      emit("callBack",proList.value.commodityName)
      // 区分详情和商品组详情
      if(props.isHistory){
        goDetailUrl = {url:`/proDetails?bussType=1&id=${proList.value.id}`,path:'/luckdraw/ProductDetailActivity'}
      } 
      nativeRoute( goDetailUrl )
    }
    AnimateJSON.value  = animateJSON
    return {
      AnimateJSON,
      proList,
      isRecommend,
      isNeedpay,
      productPurchase
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.list-model {
  position: relative;
  margin-bottom: 12px;
  :deep(.lottie-animation-container){
    position: absolute;
    width: 64px;
    height: 64px;
    right: 3px;
    top: 20px;
    z-index: 10;
    pointer-events: none;
  }
  .tips {
    position: absolute;
    left: 0;
    top: 0;
    color: #fff;
    font-size: 12px;
    font-weight: 500;
    line-height: 24px;
    width: 68px;
    height: 24px;
    background: url(../assets/yu.png) 0 0 no-repeat;
    background-size: cover;
    z-index: 20;
    text-align: center;
  }
}
.list {
  position: relative;
  font-size: 14px;
  width: 171px;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  img {
    width: 171px;
    height: 171px;
    border-radius: 8px 8px 0px 0px;
  }
  .name {
    padding: 6px 8px 0;
    text-align: left;
    .text-overflow();
  }
}
.pro-recommond {
  width: 100%;
  background: #fff;
  box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.1);
  border-radius: 8px;
  position: relative;
  .reco-inner {
    .flex();
    // height: 145px;
  }
  img {
    border-radius: 8px 0 0 8px;
    width: 145px;
    // height: 145px;
    position:absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
  }

  .curpro {
    flex: 1;
    padding: 9px 9px 0 154px ;
    .name {
      font-size: 14px;
      font-weight: 500;
      padding-bottom: 6px;
      width: 190px;
      .text-overflow();
    }
    .buy {
      position: relative;
      background: url(../assets/buy.png) center top no-repeat;
      background-size: cover;
      color: #fff;
      height: 58px;
      padding-left: 15px;
      padding-top: 16px;
      font-size: 12px;
      font-weight: 500;
      position: relative;
      top: -6px;
      span {
        font-size: 20px;
      }
    }
    .refund {
      position: absolute;
      top: 2px;
      right: 0;
      width: 74px;
      height: 16px;
    }
  }
  .pirce-img {
    background: url(../assets/price-bg.png) left top no-repeat;
    background-size: 100% 100%;
    height: 60.5px;
    .flex();
    align-items: flex-start;
    padding-top: 6px;
    font-size: 12px;
    text-align: center;
    color: #62666B;

    .discount {
      color: #ff3838;
      font-size: 10px;
      font-weight: 500;
      line-height: 1.6;
      .dis-num {
        font-size: 16px;
      }
    }
  }
}

.price-buy {
  padding: 8px;
  .price {
    color: #9a9da1;
    font-size: 10px;
    .num {
      font-size: 16px;
      text-decoration: line-through;
    }
  }
  .flex();
  .btn {
    width: 82px;
    height: 32px;
    line-height: 32px;
    background: linear-gradient(225deg, #ff7c25 0%, #ff2020 100%);
    border-radius: 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
  }
}
</style>
