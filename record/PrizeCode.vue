<template> 
  <!-- 商品的结果页面 -->
  <div class="content flex-content prize-code-model">
    <header-item  >
      <template v-slot:center>  
        <span>{{codeInfo.date}}期 {{codeInfo.group}}组</span>
      </template>
      <template v-slot:right>
        <span v-if="!noRefundList.length">
          <img v-if="currentRefundCode && currentRefundCode.id" class="apply" @click="applyRefund" src="./assets/apply.png" alt="apply" />
          <img v-else class="apply" src="./assets/refund.png" alt="refund" />
      </span>
      <span v-else> 
          <span @click="goWechat" class="customer customer2">
            <img src="./assets/client.png" alt="client" />
          </span>
      </span>
      </template>
    </header-item>
    <div class="prize-model">
      <span v-if="!noRefundList.length" @click="goWechat" class="customer">
        <img src="./assets/client.png" alt="client" />
      </span>
      <div class="prize-top" v-show="showBubble && prizeLoading">
        <img src="./assets/happy.png" alt="sad" />
        <br />
        中奖号码生成中…
      </div>
      <div :class="['prize-top',isGetPrize&&'get-prize-top']" v-show="!(showBubble && prizeLoading)">
        <div v-if="!isGetPrize">
          <img src="./assets/sad.png" alt="sad" />
          <br />
          很遗憾，您未中奖
        </div>
        <div class="get-prize" v-else>
          <img src="./assets/getBg.png" alt="happy" />
          <p>恭喜您中奖啦！奖品请联系客服领取哦!</p>
        </div>
      </div>
      <h3 class="code-tit">
        <img src="./assets/code.png" alt="code" />
      </h3>
      <!-- 第一次打开本页面会有开奖动画 -->
      <div class="code-nums">
        <span class="num-item" v-for="(code, index) in prizeCode" :key="index">
          <span v-if="showBubble" :class="`count-item counter${code} index${index}`" ></span>
          <span v-else> {{code}}</span>
        </span>
      </div>
      <!-- <div v-else class="code-nums">
        <span  class="num-item"  v-for="(code, index) in prizeCode" :key="index">
          {{code}}
        </span>
      </div> -->
      <div class="win-product box-model">
        <div class="r-center">
          <img
            :src="codeInfo.coverImage"
            alt="产品"
          />
          <div class="r-pros">
            <p class="name">{{codeInfo.commodityTitle}}</p>
            <div>
             <p class="price">商品价值：￥{{codeInfo.price}}</p>
             <p class="time">商品参与时间：{{codeInfo.buyTime }}</p>
           </div>
          </div>
        </div>
        <div class="r-bottom" v-if="codeInfo&&codeInfo.recordList">
          <h3 class="bold">我的中奖码</h3>
          <div class="prize-codes">
            <span class="code" v-for="(list, idx) in codeInfo.recordList" :key="idx">
              <span v-html="list.showLuckCode"></span>
              <span class="has-refund" v-if="list.state===2">(已退款)</span>
            </span>
          </div>
          <div>
          </div>
          <p @click="luckDraw" class="r-b-bottom">
            <img src="./assets/double.png" class="double" v-if="showBubble" alt="" >
            <img src="./assets/goBtn.png" alt="继续" />
          </p>
        </div>
      </div>
    </div>
  </div>
  <!-- 可以退款 -->
  <van-popup v-model:show="isRefund" style="background: transparent">
    <FailDialog :data="refundConfig" :goods-name="codeInfo.goodsName" :point-data="pointRefundShowConfig" :show-close="true" :single-btn="true" @close='cancelRefund' @confirm='handleRefund'/>
  </van-popup>
   <!-- 退款成功 -->
  <van-popup v-model:show="susRefund" style="background: transparent">
    <FailDialog :data="successConfig" :goods-name="codeInfo.goodsName" :point-data="susRefundConfig" :show-close="true" :single-btn="true" @close='susRefund = false' @confirm='susRefundHandle'/>
  </van-popup>
  <!-- 看视频失败 -->
  <van-popup v-model:show="failLoad" style="background: transparent">
    <FailDialog :data="tipConfig" :goods-name="codeInfo.goodsName" :point-data="failLoadConfig" :show-close="true"  @close='quitTry' @confirm='reTry'/>
  </van-popup>
  <!-- 看视频达到最大次数 -->
  <van-popup v-model:show="isVideoCounteReached" style="background: transparent">
    <FailDialog :data="reachConfig" :single-btn="true"  :show-close="true"  @close='isVideoCounteReached=false' @confirm='isVideoCounteReached=false'/>
  </van-popup>
  <!-- 退款商品展示 进度 -->
  <van-popup v-model:show="showProgress" style="background: transparent">
    <RefundProgress :data="codeInfo" :cur-code ='currentRefundCode'  @cancel='showProgress = false' @confirm='checkProgress'/>
  </van-popup>
</template>

<script>
import HeaderItem from '@/components/HeaderItem'
import FailDialog from '@/components/FailDialog'
import RefundProgress from '@/components/RefundProgress'
import successImg from '@/assets/images/success.png'
import susImg from '@/assets/images/happy.png'
import tipsImg from '@/assets/images/tips.png'
import {reactive,toRefs,ref,computed} from 'vue'
import {useRoute} from "vue-router"
import { Popup} from 'vant'
import { getDrawInfo ,refundFetch,applyProgress} from "./api"
import { nativeRoute,nativeBridge, reportInfo } from '@/utils/jsBridge'
import { parseTime } from "@/utils"
export default {
  components: {
    HeaderItem,
    FailDialog,
    RefundProgress,
    [Popup.name]: Popup
  },
  setup() {
    const state = reactive({
      isRefund: false,
      failLoad: false,
      showProgress: false,
      susRefund: false,
      countReached: false,
      isVideoCounteReached: false,
      prizeLoading: true,
      codeInfo: {},
      showBubble: false,
      currentRefundCode: {},
      isGetPrize: false,
    })
    const noRefundList = ref([])
    const refundConfig = {
      title: '恭喜您，达到全额退款资格',
      msg: '是否立马退款？',
      confirmText: '立马退款',
      img: susImg
    }
    const tipConfig = {
      title: '退款额度获取失败!',
      msg: '观看完整视频就能获得哦~',
      cancelText: '不要了',
      confirmText: '立马重试',
      img: tipsImg
    }
    const reachConfig = {
      title: '今天看视频次数已用完',
      msg: '请明天再来吧！',
      confirmText: '好的',
      img: tipsImg
    }
    const successConfig = {
      title: '已退款，请注意查看账户余额',
      confirmText: '好的',
      img: successImg
    }

    const pointRefundShowConfig= {
      eventCode:"choujiang_refund_popup_show",
      eventName:"抽奖退款过程弹窗曝光",
      eventType:"show",
      extraParams:{
        element_content:'退款弹窗',
        good_name: state.codeInfo.goodsName
      }
    }
    const susRefundConfig= {
      eventCode:"choujiang_refund_popup_show",
      eventName:"抽奖退款过程弹窗曝光",
      eventType:"show",
      extraParams:{
        element_content:'退款成功弹窗',
        good_name: state.codeInfo.goodsName
      }
    }
    const failLoadConfig= {
      eventCode:"choujiang_refund_popup_show",
      eventName:"抽奖退款过程弹窗曝光",
      eventType:"show",
      extraParams:{
        element_content:'看视频失败弹窗',
        good_name: state.codeInfo.goodsName
      }
    }
    
    const route = useRoute()
    const recordId = route.query.id
    const _date = new Date().getTime();
    const curDate = parseTime(_date, "{y}{m}{d}");
    const init = () => {
      return new Promise((resolve)=>{
        getDrawInfo({id:recordId}).then(res=>{
          if(res.data) {
            state.codeInfo = res.data
            state.codeInfo.buyTime = parseTime(state.codeInfo.buyTime,'{y}-{m}-{d} {h}:{i}')
            // 获取可退款的列表
            const _record = res.data.recordList && res.data.recordList.filter(item=>{
              // 判断是否有中奖号码
              if( item.luckCode === res.data.drawCode ){
                this.isGetPrize = true
              }
              // 0 - 不可退款 1 - 可以退款 2 - 已退款  退款成功的话状态是2
              // 获取不可退款的列表
              if(item.state === 0) {
                noRefundList.value.push(item)
              }
              // 可退款
              if(item.state === 1) {
                return item
              }
            })

            Object.assign(state.currentRefundCode, _record[0] || {})
          }

          // 中奖号码
          state.codeInfo.recordList = state.codeInfo.recordList.map((item) => {
            const _item = String(item.luckCode).split('')
            const codeItem = _item.map((code, idx) => {
              if (code === prizeCode.value[idx]) {
                code = `<span class="highlight">${code}</span>`
              }
              return code
            })
            item.showLuckCode=codeItem.join("")
            return item
          })

          resolve()
        })
      })
    }

    init().then(res=>{
      setTimeout(() => {
        state.prizeLoading = false
      }, 8000);
    })
    
    // 是否第一次打开此页面
    nativeBridge.exec("0015",{id:route.query.id}).then(res=>{
      if(res.bubbleStatus === '0'){
        state.showBubble  = false
      }else{
        state.showBubble  = true
      }
    })
    /**test needto Del*/
    const prizeCode  = computed(()=>{
      // return [1,2,3,4,5,6,7,8]
      return String(state.codeInfo.drawCode).split('')
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
      nativeRoute({url: `/proDetails?id=${state.codeInfo.goodsId}`,path:'/luckdraw/ProductDetailActivity'})
    }
    const applyRefund= ()=> {
      reportInfo({
        eventCode:"choujiang_inform_click",
        eventName:"公示页点击",
        eventType:"click",
        extraParams:{
          click_content:'申请退款',
          good_name: state.codeInfo.goodsName
        }
      })
      // 获取视频进度
      state.showProgress = true
    }
    const checkProgress = () =>{
      nativeBridge.exec("2011",{key:`prizeCode_${curDate}`}).then(res=>{ 
        // 判断是否达到每日可看最大次数
        if(res.value === '4'){
          state.isVideoCounteReached = true
          return
        }
        // 进度100%
        if(state.currentRefundCode.applyRefundCount  >= state.currentRefundCode.applyRefundTotal){
            state.isRefund = true
        }else{
          // 调取客户端看视频
          nativeBridge.exec("2007",{page_position:"award_refund"})
        }
      })
    }

    const cancelRefund = () =>{
      state.isRefund =  false;
    }

    // 达到100%  发起退款
    const handleRefund = async () => {
      reportInfo({
        eventCode:"choujiang_refund_popup_click",
        eventName:"抽奖退款过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'退款—立马退款',
          element_content:"退款弹窗",
          good_name: state.codeInfo.goodsName
        }
      })
      state.isRefund =  false;
      let headers = {}
      try {
        headers  = await nativeBridge.exec('0001')
      }catch{
        headers = {}
      }
      
      // 走退款流程
      const sendData = {
        "orderNo": state.currentRefundCode.orderNo,// 订单号
        "userId": headers["customer-id"],// 用户Id
        "commodityType":state.codeInfo.commodityType //商品类型
      }
 
      refundFetch(sendData).then(res=>{
         if(res.data ===1){
          state.susRefund = true
          init()
         }
      })
    }
    
    const reTry = () => {
      reportInfo({
        eventCode:"choujiang_refund_popup_click",
        eventName:"抽奖退款过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'看视频失败—立马重试',
          element_content:"看视频失败弹窗",
          good_name: state.codeInfo.goodsName
        }
      })
      state.failLoad = false
      nativeBridge.exec("2007",{page_position:"award_refund"})
    }
    const quitTry = () =>{
      reportInfo({
        eventCode:"choujiang_refund_popup_click",
        eventName:"抽奖退款过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'看视频失败—不要了',
          element_content:"看视频失败弹窗",
          good_name: state.codeInfo.goodsName
        }
      })
      state.failLoad = false
    }
    const susRefundHandle = () => {
      reportInfo({
        eventCode:"choujiang_refund_popup_click",
        eventName:"抽奖退款过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'退款成功—好的',
          element_content:"退款成功弹窗",
          good_name: state.codeInfo.goodsName
        }
      })
      state.susRefund = false
    }
    //  看视频回调函数
    window.videoCallback = async (params) => {
        const _res = JSON.parse(params)
        const {status,resultCode} = _res
        // state.countReached = resultCode === 4 ? true : false 
        console.log("videoCallback_status...",status,resultCode,typeof resultCode)
        // 存数据 以当前的年月日为key
        nativeBridge.exec("2010",{key:`prizeCode_${curDate}`,value: resultCode});
        state.showProgress = false
        if(status === 1){
          // 请求进度 ，若达到100% 直接弹出退款弹框
          applyProgress({id:state.currentRefundCode.id}).then(res =>{
            const {data} = res
            if(data){
              if(data.current === data.total){
                // 看视频成功之后刷新接口 更新兑奖码的进度
                init()
                state.isRefund = true
              }else{
                // 未达到 分子增加，提醒用户继续申请
                state.currentRefundCode.applyRefundCount =  data.current 
                state.showProgress = true
              }
            }
          })
        }else if(status === 0 &&  resultCode!==4 ){
          // 看视频失败弹框
          state.failLoad = true
        }
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
      noRefundList,
      prizeCode,
      pointRefundShowConfig,
      susRefundConfig,
      failLoadConfig,
      // myCode,
      refundConfig,
      tipConfig,
      successConfig,
      reachConfig,
      goWechat,
      handleRefund,
      susRefundHandle,
      cancelRefund,
      luckDraw,
      reTry,
      quitTry,
      applyRefund,
      checkProgress,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
@import url('./assets/style.less');
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
  img {
    width: 60px;
  }
  .get-prize {
    img {
      width: 114px;
    }
    color: #E90606;
    background:url(./assets/getStar.png) center 71px no-repeat;
    background-size: 312px 44.5px;
    padding-bottom: 20px;
  }
}
.get-prize-top{
  padding-bottom: 0;
}
.code-tit {
  text-align: center;
  margin: 0 12px 0;
  position: relative;
  &::after {
    .line();
    right: 0;
  }
  &::before {
    .line();
    left: 0;
  }
  img {
    width: 95px;
  }
}
.code-nums {
  .flex();
  padding: 0 12px;
  margin: 18px auto 30px;
  .num-item {
    width: 36px;
    height: 36px;
    background: url(./assets/codeBg.png) center center no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-weight: 800;
    font-size: 22px;
    line-height: 36px;
    text-align: center;
    position: relative;
    text-shadow: 0px 2px 4px rgba(197, 26, 26, 0.5);
    overflow: hidden;
  }
  .count-item {
    margin-left: -10px;
    width: 20px;
    // line-height: 36px;
    margin-top: 2px;
    // top: 5%;
  }
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
.prize-codes {
  .flex(flex-start);
  flex-wrap: wrap;
  .has-refund{
    color: #FF2924;
    font-weight: 500;
  }
  .code {
    // width: 75px;
    line-height: 28px;
    background: #f1f1f1;
    border-radius: 15px;
    color: #62666b;
    text-align: center;
    font-weight: 500;
    margin-top: 6px;
    margin-right: 9px;
    padding: 0 7px;
    // &:last-child:nth-child(4n - 1) {
    //   margin-right: 84px;
    // }
    // &:last-child:nth-child(4n - 2) {
    //   margin-right: 168px;
    // }
  }
}
</style>
<style>
.highlight {
  color: #ff592c;
  font-weight: 500;
}
</style>
