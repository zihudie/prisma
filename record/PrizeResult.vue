<template>
  <div class="content flex-content prize-code-model">
    <header-item  >
      <template v-slot:center>  
        <span>{{codeInfo.date}}期 {{codeInfo.group}}组</span>
      </template>
      <template v-slot:right>
        <span @click="goWechat" class="customer customer2">
          <img src="./assets/client.png" alt="client" />
        </span>
      </template>
    </header-item>
    <div class="prize-model">
      <div :class="['prize-top']">
        <div class="get-prize">
          <img src="./assets/getBg.png" class="happy" alt="happy" />
          <p v-if="drawCommodity.commodityType === '0'"><img src="./assets/quanyi.png" class="get-img" alt=""/></p> 
          <p v-if="drawCommodity.commodityType === '14'"><img src="./assets/product.png" class="get-img" alt=""/></p> 
          <div v-if="drawCommodity.commodityType === '5'">
            <p><img src="./assets/huafei.png" class="get-img" alt=""/></p> 
            <p><span class="huafee" @click="jumpToHuafei">查看话费</span></p>
          </div>
        </div>
      </div>
      <div class="win-product box-model">
        <div class="r-center">
          <img
            :src="drawCommodity.coverImage"
            alt="产品"
          />
          <div class="r-pros">
            <p class="name">{{drawCommodity.commodityName}}</p>
            <div>
             <p class="price">商品价值：￥{{drawCommodity.price}}</p>
             <p class="time">商品参与时间：{{codeInfo.buyTime }}</p>
           </div>
          </div>
        </div>
        <div class="r-bottom">
          <p @click="luckDraw" class="r-b-bottom">
            <img src="./assets/contact.png" alt="联系客服" />
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderItem from '@/components/HeaderItem'
import {reactive,toRefs,ref,computed} from 'vue'
import {useRoute} from "vue-router"
import { Popup} from 'vant'
import { getGroupDrawInfo ,refundFetch,applyProgress} from "./api"
import { nativeRoute,nativeBridge, reportInfo } from '@/utils/jsBridge'
import { parseTime } from "@/utils"
export default {
  components: {
    HeaderItem
  },
  setup() {
    const state = reactive({  
      codeInfo: {},
      drawCommodity: {}
    })
    const route = useRoute()
    const recordId = route.query.id
    const _date = new Date().getTime();
    const curDate = parseTime(_date, "{y}{m}{d}");
    const init = () => {
      return new Promise((resolve)=>{
        getGroupDrawInfo({id:recordId}).then(res=>{
          if(res.data) {
            state.codeInfo = res.data
            state.codeInfo.buyTime = parseTime(state.codeInfo.buyTime,'{y}-{m}-{d} {h}:{i}')
            if(res.data.drawCommodity && res.data.drawCommodity.commodityType === '5'){
               // 并且中奖 2013  刷新免广告权限  
               nativeBridge.exec("2013")
            }
          }
          resolve()
        })
      })
    }
    //  接口请求获取结果信息
    init();

    const drawCommodity =  computed (()=>{
      return state.codeInfo && state.codeInfo.drawCommodity  
    })
    const luckDraw = () => {
      reportInfo({
        eventCode:"choujiang_inform_click",
        eventName:"公示页点击",
        eventType:"click",
        extraParams:{
          click_content:'继续参与',
          good_name: state.codeInfo.goodsName
        }
      })
      nativeRoute({url: `/groupProDetails?bussType=2&payNow=true&id=${state.codeInfo.goodsId}`,path:'/luckdraw/GroupProductDetailActivity'})
    }

    // 查看话费券  跳转到客户端我的优惠页面
    const jumpToHuafei = () => {
      nativeRoute({path:'/coupon/user'}) 
    }
    reportInfo({
      eventCode:"choujiang_inform_show",
      eventName:"公示页曝光",
      eventType:"show"
    })

    const goWechat = () =>{
      nativeBridge.exec("2012")
    }

    return {
      ...toRefs(state),
      drawCommodity,
      jumpToHuafei,
      goWechat,
      luckDraw
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.line {
  content: '';
  height: 1px;
  width: 120px;
  position: absolute;
  top: 50%;
  background: #e5e5e5;
}
.prize-code-model {
  background: url(./assets/bg.png) center -44px no-repeat;
  background-size: 100% 300px;
}
.prize-model{
  height: 100vh;
  overflow: auto;
  position: relative;
}
.customer {
  position: absolute;
  right: 12px;
  top: 0;
}
.customer2{
  position: relative;
  top: -2px;
  right: 0;
}
// .records-content {
//   overflow: auto;
//   flex: 1;
// }
.apply {
  width: 68px;
}
.prize-top {
  text-align: center;
  font-weight: 500;
  margin-top: 30px;
  padding-bottom: 20px;
  // img {
  //   width: 60px;
  // }
  .get-prize {
    .happy {
      width: 114px;
    }
    .get-img{
      height: 63px;
    }
    .huafee{
      width: 230px;
      line-height: 44px;
      border-radius: 22px;
      display: block;
      margin: 6px auto 0;
      border: 1px solid #FD2828;
      font-size: 20px;
    }
    color: #E90606;
    // background:url(./assets/getStar.png) center 71px no-repeat;
    // background-size: 312px 44.5px;
  }
}
.get-prize-top{
  padding-bottom: 0;
}
 
.win-product {
  margin: 0 12px;
}
.r-center {
  .flex(flex-start);
  padding: 12px 10px 20px 0;
  img {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    margin-right: 8px;
    background: #EBEBEB;
  }
  .r-pros {
    color: #62666b;
    height: 90px;
    .flex(space-between);
    flex-direction: column;
    align-items: flex-start;
  }
  .name {
    color: #2a2a2a;
    font-size: 16px;
    font-weight: 500;
    flex-shrink: 0;
  }
}
.r-b-bottom{
  position: relative;
  .double {
    position:absolute;
    right: 0;
    top:0;
    width: 138px;
    z-index:10
  }
}
 
</style>
<style>
.highlight {
  color: #ff592c;
  font-weight: 500;
}
</style>
