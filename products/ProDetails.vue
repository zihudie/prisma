<template>
  <div class="product-details--model">
    <div
      class="product-details--inner"
      :style="{ backgroundImage: `url(${goodsDetail.commodityDetailUrl})` }"
    >
      <header-item :centerHide="true">
        <template #left class="h-left1">
          <div class="details-left" @click="goBack">
            <img src="@/assets/images/back2.png" alt="back" />
          </div>
        </template>
        <template #right>
          <span @click="goWechat" class="customer">
            <img src="./assets/client1.png" alt="client" />
          </span>
        </template>
      </header-item>
     <div class="prodetails">
        <!-- 商品介绍 -->
        <div class="pro-intro">
          <!-- <div class="prize">
            <img src="./assets/prize.png" alt="flag" />
            <span>综合中奖率高达：{{ goodsDetail.winRatio }}%</span>
          </div> -->
          <span class="remain">仅剩<span>{{ goodsDetail.remain }}</span>件</span>
          <p class="name">{{ goodsDetail.commodityTitle }}</p>
        </div>
        <!-- 立即抢购 -->
        <div class="pro-buy">
          <img class="rule-img" :src="goodsDetail.roleImage" alt="ruleImage" />
          <div class="win" v-if='luckCodeList.length'>
            <p class="f-b">我的中奖码</p>
            <span class="code" v-for="(code,_idx) in luckCodeList" :key="_idx">{{code}}</span>
          </div>
          <div v-if="goodsDetail.commodityStatus === 0" class="off">
            <img src="./assets/off.png" alt="" />
          </div>
          <div class="can-buy" v-else>
            <div class="buy-now zoom-in-zoom-out" @click="purchasePro" v-if="luckCodeList.length">再拿一个中奖码 <img src="./assets/doubleIcon.png" alt="" /></div>
            <div v-else>
              <div v-if="goodsDetail.isNeedPay" class="buy-init"  @click="purchasePro">
                <div class="buy-now zoom-in-zoom-out">
                  {{
                    goodsDetail.commodityPriceList &&
                    goodsDetail.commodityPriceList[0].price
                  }}元抢购
                </div>
            </div>
            <div v-else class="buy-now zoom-in-zoom-out" @click="purchasePro">马上参加</div>
            </div>
            <Vue3Lottie ref="lottieContainer" clas="lottie-con" :animationData="AnimateJSON" :height="64" :width="64" />
          </div>
        </div>
        <!-- 评价 -->
        <div class="pro-comments" @click="clickMore" v-if="comment">
          <div class="c-top">
            <div class="c-nums">评价<span>(100+)</span></div>
            <div class="all">查看全部</div>
          </div>
          <CommentItem  :showTry="false" :commentData="comment" />
        </div>
        <!-- 猜你喜欢 -->
        <div class="pro-likes" v-if="recommendList.length && areas.surplusMax">
          <img src="./assets/likes.png" alt="" />
          <div class="pros">
            <ProItem
              v-for="pro in recommendList"
              :key="pro.id"
              :list="pro"
              :isHistory = "true"
              :surplusMax= "areas.surplusMax"
              :surplusMin= "areas.surplusMin"
              @callBack = "itemCallback"
            />
          </div>
        </div>
      </div>
      <!-- 弹幕 -->
      <vue-danmaku
        class="detailDanmu"
        ref="danmakuRef"
        v-model:danmus="danmus"
        use-slot
        :top = "8"
        :channels="2"
        :speeds="70"
        :loop="true">
          <template  v-slot:dm="{ danmu }">
            <span class="danmu-item">{{ danmu }}抢到了<span class="commodityTitle">{{goodsDetail.commodityName}}</span></span>
          </template>
      </vue-danmaku>
    </div>
    <!-- 支付弹框 -->
    <van-popup
      v-model:show="panelShow"
      :close-on-click-overlay="false"
      position="bottom"
      style="background: transparent"
    >
      <PayItem
        @callback="closePanel"
        @pay="clickPayment"
        :prodata="goodsDetail"
      />
    </van-popup>
    <!-- 支付挽留 -->
    <van-overlay v-model:show="isPayRetetion" class-name="overlay-bg" >
      <PayRetention
        :prodata="goodsDetail"
        @cancel="retentionCancel"
        @confirm="retentionConfirm"
      />
    </van-overlay>
    <!-- 返回- 已中奖-挽留 -->
    <van-popup v-model:show="iswinRetetion" style="background: transparent">
      <WinRetention
        :prodata="goodsDetail"
        @close="pageRetetionClose"
        @cancel="iswinRetetion=false"
        @confirm="pageRetetionConfirm"
      />
    </van-popup>
    <!-- 返回- 未中奖-挽留 -->
    <van-popup v-model:show="isUnWinRetetion" style="background: transparent">
      <UnWinRetention
        :prodata="goodsDetail"
        @close="pageRetetionClose"
        @cancel="isUnWinRetetion=false"
        @confirm="pageRetetionConfirm"
      />
    </van-popup>
    <!-- 获取中奖码弹框 -->
    <van-overlay v-model:show="isGetPrize" class-name="overlay-bg">
      <GetPrize
        :data="drawCode"
        :goods-name="goodsDetail.commodityName"
        @close="isGetPrize = false"
        @pay="repurchase"
        @remind="clockRemind"
      />
    </van-overlay>
    <!-- 登录失败 -->
    <van-popup v-model:show="isFailLogin" style="background: transparent">
      <FailDialog
        :data="loginConfig"
        :point-data="failShowConfig"
        :goods-name="goodsDetail.commodityName"
        @close="failLoginCancel"
        @confirm="reLogin"
      />
    </van-popup>
    <!-- 看视频获取中奖码失败 -->
    <van-popup v-model:show="videoFail" style="background: transparent">
      <FailDialog
        :data="prizeConfig"
        :point-data="prizeShowConfig"
        :goods-name="goodsDetail.commodityName"
        @close="videoFailCancel"
        @confirm="reTry"
      />
    </van-popup>
  </div>
</template>

<script>
import HeaderItem from "@/components/HeaderItem";
import CommentItem from "@/components/CommentItem";
import PayRetention from "@/components/PayRetention";
import WinRetention from "@/components/WinRetention";
import UnWinRetention from "@/components/UnWinRetention";
import FailDialog from "@/components/FailDialog";
import GetPrize from "@/components/GetPrize";
import ProItem from "./components/ProItem";
import PayItem from "./components/PayItem";
import {Vue3Lottie} from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'
import { useRoute } from "vue-router";
import { toRefs, reactive,ref } from "vue";
import { Popup, Overlay } from "vant";
import { areaList, getProDetails, generateOrder, payResult, bulletChat} from "./api";
import { checkToken } from "@/api/common";
import { parseTime } from "@/utils";
import { nativeBridge, nativeRoute ,reportInfo} from "@/utils/jsBridge";
import vueDanmaku from 'vue3-danmaku'
import failImg from "@/assets/images/sad.png";
import tipImg from "@/assets/images/tips.png";
import AnimateJSON from "@/utils/lottieData/data.json"
export default {
  components: {
    vueDanmaku,
    WinRetention,
    UnWinRetention,
    HeaderItem,
    ProItem,
    CommentItem,
    PayItem,
    GetPrize,
    PayRetention,
    FailDialog,
    Vue3Lottie,
    [Popup.name]: Popup,
    [Overlay.name]: Overlay
  },
   setup() {
    const danmakuRef = ref(null)
    const state = reactive({
      isPayRetetion: false,
      panelShow: false,
      isGetPrize: false,
      isFailLogin: false,
      videoFail: false,
      iswinRetetion: false,
      isUnWinRetetion: false,
      goodsDetail: {},
      recommendList: [],
      comment: null,
      areas: {},
      luckCodeList: [],
      drawCode: null,
      danmus: [],
      backCounts: 0,
      totalBackCounts: 0,
      AnimateJSON
    });

    const route = useRoute();
    // 获取请求客户端的header信息
    let headers = {};
    nativeBridge.exec("0001").then(res=>{
      headers =  res
      console.log("headers..",headers)
    })

    // 获取每日可弹次数
    nativeBridge.exec("0017").then(res=>{
      console.log("每日弹框次数", res)
      state.totalBackCounts  =  res.count
    })
    const goBack = () => {
      reportInfo({
        eventCode:"choujiang_goods_click",
        eventName:"商品详情点击",
        eventType:"click",
        extraParams:{
          click_content:'点击返回',
          good_name: state.goodsDetail.commodityName
        }
      })
      // 关闭页面
      // 如果达到当日弹出最大次数 则直接关闭页面 不弹出挽留框

      const _date = new Date().getTime();
      const curDate = parseTime(_date, "{y}{m}{d}");
      let _curCount
      // 取数据 已当前的年月日为key
      nativeBridge.exec("2011",{key:`proDetail_${curDate}`}).then(res=>{
        _curCount = res.value || 0
        if(Number(_curCount) < Number(state.totalBackCounts)) { // 未达到次数可弹
          // 判断弹出现哪种挽留弹框
          if(state.luckCodeList.length){
            state.iswinRetetion = true
          }else{
            state.isUnWinRetetion = true
          }
          // 存数据 以当前的年月日为key
          nativeBridge.exec("2010",{key:`proDetail_${curDate}`,value: Number(_curCount)+1});
        }else{
          // 达到当日最大挽留弹框次数 直接关闭详情页
          nativeBridge.exec("1002");
        }
      })
    };

    // 获取弹幕
    bulletChat().then(res=>{
      state.danmus = (res.data && res.data.nameList.sort(function () {
        return Math.random() - 0.5
      })) || []
      danmakuRef.value && danmakuRef.value.play()
    })
    // 匹配当前商品所在的抽奖专区，为了获取专区对应的信息
    const fitArea = (luckDrawZone, _area) => {
      const _arr = _area.filter((item) => {
        if (item.id === luckDrawZone) {
          return item;
        }
      });
      if (_arr.length) {
        return _arr[0];
      }
      return _arr[0];
    };

    const fetchDetails = () => {
      return new Promise((resolve)=>{
          getProDetails({ id: route.query.id }).then(async (res) => {
            // 获取专区;
            const result = await areaList();
            const _area = result.data || [];
            const { data } = res;
            if (data) {
              state.comment = data.comment;
              state.luckCodeList = data.luckCodeList || []
              state.goodsDetail = data.goodsDetail || {};
              state.recommendList = data.recommendList || [];
              state.areas = fitArea(data.goodsDetail.luckDrawZone, _area) || {};
              const { isNeedPay, winRatio, surplusMax, surplusMin ,roleImage} = state.areas;
              // 商品剩余件数
              const remain = Math.floor(
                Math.random() * (Number(surplusMax) - Number(surplusMin)) +
                  Number(surplusMin)
              );
              state.goodsDetail = {
                ...state.goodsDetail,
                isNeedPay,
                winRatio,
                remain,
                roleImage
              };
            }
          resolve()
        });
      })
    };
    const loginConfig = {
      title: "中奖码即将失效，是否放弃领取？",
      cancelText: "不要了",
      confirmText: "继续登录",
      img: failImg,
    };
    const prizeConfig = {
      title: "中奖码获取失效!",
      msg: "观看完整视频就能获得哦~",
      cancelText: "不要了",
      confirmText: "立马重试",
      img: tipImg,
    };

    const failShowConfig = {
      eventCode:"choujiang_paid_popup_show",
      eventName:"抽奖支付/看视频过程弹窗曝光",
      eventType:"show",
      extraParams:{
        click_content:'登录失败弹窗',
        good_name: state.goodsDetail.commodityName
      }
    }
    const prizeShowConfig= {
      eventCode:"choujiang_paid_popup_show",
      eventName:"抽奖支付/看视频过程弹窗曝光",
      eventType:"show",
      extraParams:{
        click_content:'看视频失败弹窗',
        good_name: state.goodsDetail.commodityName
      }
    }

    const clickMore = () => {
      reportInfo({
        eventCode:"choujiang_goods_click",
        eventName:"商品详情点击",
        eventType:"click",
        extraParams:{
          click_content:'查看更多评论',
          good_name: state.goodsDetail.commodityName
        }
      })
      //  showComment
      nativeRoute({
        url: "/showComment?goodsId="+ state.goodsDetail.id,
        path: "/luckdraw/AppraiseCenterActivity",
      });
    };
    /**
     * 关闭支付弹框
     */
    const closePanel = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'点击关闭',
          element_content:'支付弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isPayRetetion = true;
    };

    // 闹钟提醒
    const clockRemind = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'获得中奖码—设置闹钟',
          element_content:'获得中奖码弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isGetPrize = false;
      nativeBridge.exec("2009");
    };

    const failLoginCancel = () =>{
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'登录失败—不要了',
          element_content:'登录失败弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isFailLogin = false
    }
    const reLogin = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'登录失败—去登录领取',
          element_content:'登录失败弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isFailLogin = false;
      nativeBridge.exec("2008", { type: 2, fromSource: "click_advideo" });
    };
    //  获取中奖结果
    const getPrizeResult = () => {
      const _date = new Date().getTime();
      const curDate = parseTime(_date, "{y}{m}{d}");
      payResult({ goodsId: state.goodsDetail.id, date: curDate }).then(
        (_res) => {
          if (_res.data) {
            state.drawCode = _res.data;
            state.panelShow = false
            state.isGetPrize = true;
            fetchDetails();
          }
        }
      ).catch(e =>{
        console.log('fail...',e)
      });
    };

    const productOrder = async (payType) => {
      let headers = {};
      try {
        headers = await nativeBridge.exec("0001");
      } catch {
        headers = {};
      }

      const { commodityInfoId, id, price } = state.goodsDetail.commodityPriceList[0];
      const sendMessage = {
        commodityInfoId: commodityInfoId,
        payType: payType,
        commodityPriceId: id,
        userId: headers["customer-id"],
        purchaseAmount: 1,
        bussType: "commodity"
      };
      generateOrder(sendMessage).then((res) => {
        // 如果是看视频下单， 则请求完成之后继续请求 获取中奖码的接口； 如果是购买 则拉起支付
        const { data } = res;
        if( payType !== '0' ){
          console.log('拉起支付。。。')
          //1-微信 2-支付宝 0免支付
          try {
            nativeBridge.exec("0009", {
              bindWechatShowType: 1,
              orderInfo: payType === '1' ? JSON.stringify(data.msg) : data.msg,
              orderType: payType,
            });
          }catch (e) {
            console.log("支付。。。。",e)
          }
        } else {
          getPrizeResult();
        }
      }).catch(e=>{
        console.log("订单生成失败。。。",e)
      });
    };

    /**
     * 微信，支付宝支付
     * @param {} payType
     */
    const handlePay = (payType) => {
      // 判断商品是看视频 还是付费
      if (!state.goodsDetail.isNeedPay) {
        // 看视频调取视频广告
        nativeBridge.exec("2007", { page_position: "product_detail_get_code" });
        return;
      }
      state.panelShow = true;
    };
    // 详情页上点击购买
    const purchasePro = () => {
      reportInfo({
        eventCode:"choujiang_goods_click",
        eventName:"商品详情点击",
        eventType:"click",
        extraParams:{
          click_content:'点击获取中奖码',
          good_name: state.goodsDetail.commodityName
        }
      })
      handlePay();
    };
    // 点击支付宝 微信 购买
    const clickPayment = (payType) => {
      // 付费购买
      const fromSource = payType === "1" ? "click_wechat" : "click_alipay";
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:payType === "1" ? "微信支付" :"支付宝支付",
          element_content:'支付弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      // 判断用户是否登录 校验TOKEN
      checkToken()
        .then((res) => {
          productOrder(payType);
        })
        .catch((e) => {
          // 通知客户调取登录
          nativeBridge.exec("2008", { type: 1, fromSource });
        });
    };
    const lastPaymentCheck= () =>{
      // 接口请求判断上次支付方式
      // ===> 请求成功之后根据字段值进行支付调用
      nativeBridge.exec("0018").then(res=>{
        console.log("从客户端获取的到支付方式：",res)
        clickPayment(res.payType+'')
      })
    }
    /**
     * 详情页关闭挽留-取消
     */
     const pageRetetionClose = () => {
      reportInfo({
        eventCode:"choujiang_back_popup_click",
        eventName:"抽奖挽留弹窗点击",
        eventType:"click",
        currentPageId:"choujiang_goods_page",
        extraParams:{
          click_content:"关闭",
          good_name: state.goodsDetail.commodityName
        }
      })

      state.iswinRetetion = false;
      state.isUnWinRetetion = false;
      // 关闭页面
      nativeBridge.exec("1002");
    };
    /**
     * 详情页关闭挽留-确定
     */
     const pageRetetionConfirm = () => {
      reportInfo({
        eventCode:"choujiang_back_popup_click",
        eventName:"抽奖挽留弹窗点击",
        eventType:"click",
        currentPageId:"choujiang_goods_page",
        extraParams:{
          click_content:"点击进入",
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isUnWinRetetion = false;
      state.iswinRetetion = false;
      //支付检测versionCode: 
      if(headers["app-id"] === '1102' && headers.versionCode < 40){
        // 进入支付流程
        handlePay();
      }else{
        // 判断商品是看视频 还是付费
        if (!state.goodsDetail.isNeedPay) {
          // 看视频调取视频广告
          nativeBridge.exec("2007", { page_position: "product_detail_get_code" });
          return;
        }
        lastPaymentCheck()
      }
    };
    const reTry = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'看视频失败—立马重试',
          element_content:'看视频失败弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.videoFail = false;
      handlePay();
    };
    /**
     * 支付挽留取消
     */
     const retentionCancel = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:"挽留—我不要福利了",
          element_content:'支付挽留弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isPayRetetion = false;
      state.panelShow = false;
    };
    /**
     * 支付挽留 立即抢购
     */
    const retentionConfirm = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:"挽留—马上去抢",
          element_content:'支付挽留弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isPayRetetion = false;
      // 1102 40版本以上 或者在其他应用中
      if(!(headers["app-id"] === '1102' && headers.versionCode < 40)){
        state.panelShow = false;
        // 支付方式检测
        lastPaymentCheck();
      }
    };

    const videoFailCancel = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'看视频失败—不要了',
          element_content:'看视频失败弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.videoFail = false;
    };
    // 再次购买
    const repurchase = () => {
      reportInfo({
        eventCode:"choujiang_paid_popup_click",
        eventName:"抽奖支付/看视频过程弹窗点击",
        eventType:"click",
        extraParams:{
          click_content:'获得中奖码—提升中奖率',
          element_content:'获得中奖码弹窗',
          good_name: state.goodsDetail.commodityName
        }
      })
      state.isGetPrize = false;
      handlePay();
    };

    // 获取详情页数据
    fetchDetails().then(()=>{
        // 详情页曝光埋点
        reportInfo({
            eventCode:"choujiang_goods_show",
            eventName:"商品详情页曝光",
            eventType:"show",
            extraParams:{
              good_name: state.goodsDetail.commodityName
            }
        })
        // 提供给客户端使用 立即支付
        if(route.query.payType && route.query.payNow && route.query.payNow === 'true' ){
          clickPayment(route.query.payType )
        }
    });

    // 登录回调
    window.loginCallback = (params) => {
      const _res = JSON.parse(params);
      const { status, fromSource } = _res;
      const payType = fromSource === "click_wechat" ? '1' : '2';
      // 登录成功 继续走支付
      if (status === 1 && fromSource !== "click_advideo") {
        productOrder(payType);
      } else if (status === 1 && fromSource === "click_advideo") {
        // 观看视频成功登录成功 获得中奖码
        // 请求接口获取中奖码
        productOrder('0');
        // state.isGetPrize = true;
      } else if (status === 0 && fromSource === "click_advideo") {
        // 观看视频 登录失败
        state.isFailLogin = true;
      }
    };
    // 支付回调
    window.paymentCallback = (params) => {
      const _res = JSON.parse(params);
      const { status } = _res;
      console.log("paymentCallback_status...", status, typeof status);
      if (status === 1) {
        // 获取购买得到的中奖码
        getPrizeResult();
      }else{
        state.panelShow = true
      }
    };
    const goWechat = () =>{
      nativeBridge.exec("2012")
    }
    // 看视频回调
    window.videoCallback = (params) => {
      const _res = JSON.parse(params);
      const { status } = _res;
      console.log("videoCallback_status...", status,typeof status);
      if (status === 1) {
        // productOrder('0');
        checkToken()
          .then(() => {
            productOrder('0');
          })
          .catch((e) => {
            // 通知客户调取登录
            nativeBridge.exec("2008", {
              type: 2,
              fromSource: "click_advideo",
            });
          });
      } else {
        state.videoFail = true;
      }
    };
    const itemCallback = (good_name)=>{
      reportInfo({
        eventCode:"choujiang_goods_click",
        eventName:"商品详情点击",
        eventType:"click",
        extraParams:{
          click_content:'点击猜你喜欢的商品',
          good_name
        }
      })
    }
    window.clickBackFunction = () => {
      goBack()
    }
    return {
      loginConfig,
      prizeConfig,
      danmakuRef,
      failShowConfig,
      prizeShowConfig,
      goWechat,
      itemCallback,
      videoFailCancel,
      goBack,
      ...toRefs(state),
      handlePay,
      failLoginCancel,
      clockRemind,
      clickPayment,
      reLogin,
      reTry,
      purchasePro,
      clickMore,
      closePanel,
      retentionCancel,
      retentionConfirm,
      repurchase,
      pageRetetionClose,
      pageRetetionConfirm,
      lastPaymentCheck
    };
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/mixin.less");
 .overlay-bg{
  background: url("@/assets/images/lightBg.png") rgba(0, 0, 0, .7) center center no-repeat;
  background-size: 100% 100%;
  z-index: 9000;
 }
.box-cons {
  .box-model();
  font-weight: 500;
  margin-bottom: 12px;
}
.product-details--model {
  height: 100vh;
  overflow: auto;
}
.product-details--inner {
  background: 0 0 no-repeat;
  background-size: 100% 375px;
  padding-top: 35px;
  position: relative;
}
.customer{
  position: relative;
  top : -10px;
}
.details-left {
  position: fixed;
  left: 0;
  top: 35px;
  z-index: 99;
  width: 46px;
  height: 32px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0px 16px 16px 0px;
  .flex(center);
  text-align: center;
  img {
    width: 22px;
    height: 22px;
  }
}
.detailDanmu {
  position: absolute;
  width: 100%;
  height: 130px;
  left: 0;
  top: 80px;
  .danmu-item{
    padding: 6px 10px;
    background: rgba(0,0,0,0.6);
    border-radius: 14px;
    color: #fff;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .commodityTitle{
    color: #FF7113;
  }
}
.prodetails {
  padding: 260px 12px 0;
  overflow: auto;
  .pro-intro {
    font-size: 16px;
    position: relative;
    .box-cons();
    padding: 12px;
    min-height: 68px;

    .prize {
      padding: 4px 6px;
      .flex(flex-start);
      display: inline-flex;
      color: #ff2924;
      background: #ffebe7;
      border-radius: 4px;
      height: 24px;
      font-size: 12px;
      font-weight: 500;
      img {
        width: 8px;
        height: 10px;
        flex-shrink: 0;
        margin-right: 3px;
      }
    }
    .name {
      color: #2a2a2a;
      line-height: 23px;
      font-weight: 500;
    }
    .remain {
      position: absolute;
      bottom: 12px;
      right: 12px;
      color: #ff2924;
      font-size: 12px;
      font-weight: normal
    }
  }
}
// 立即抢购
.pro-buy {
  .box-cons();
  padding: 0;
  margin-top: 6px;
  .rule-img {
    position: relative;
    top: -8px;
  }
  .prize-tips {
    background: url(./assets/prize-tip.png) 0 0 no-repeat;
    background-size: 100% auto;
    height: 78px;
    position: relative;
    top: -8px;
    padding: 20px 0 0 95px;
    color: #ffe9c6;
    .time {
      font-size: 16px;
      line-height: 21px;
      text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
      background: linear-gradient(180deg, #fff6e5 0%, #ebc890 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      span {
        color: #ffe9c6;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
        background: linear-gradient(180deg, #fff09f 0%, #ff2424 100%);
        -webkit-text-fill-color: transparent;
      }
    }
    .yuan {
      font-size: 18px;
      color: #ffe9c6;
      line-height: 21px;
      padding-top: 4px;
      text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.3);
      background: linear-gradient(180deg, #fff6e5 0%, #ebc890 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 500;
    }
  }
  .buy-init{
    position: relative;
    height: 83px;

  }
  .can-buy{
    position: relative;
    :deep(.lottie-animation-container){
      position: absolute;
      width: 64px;
      height: 64px;
      right: 88px;
      bottom: -14px;
      pointer-events: none;
    }
  }
  .buy-now {
    background: url("@/assets/images/btnBg.png") center center no-repeat;
    background-size: 100% auto;
    text-align: center;
    position: relative;
    font-size: 20px;
    font-weight: 600;
    color: #ffffff;
    height: 83px;
    text-shadow: 0px 3px 8px rgba(169, 0, 0, 0.3);
    .flex(center);
    margin: -4px 13px 0;
    position: relative;
    img {
      position: absolute;
      right: 8px;
      top: 2px;
      width: 93px;
    }

  }
  .off {
    margin: -4px 13px 0;
  }

  .win {
    padding: 4px 12px 0;
    font-weight: 500;
  }
  .code {
    padding: 4px 6px;
    background: rgba(255, 89, 44, 0.1);
    color: #ff592c;
    line-height: 19px;
    border-radius: 15px;
    margin-top: 6px;
    margin-right: 8px;
    display: inline-block;
  }
}
// 评价
.pro-comments {
  .box-cons();
  padding: 12px;
  .c-top {
    .flex();
  }
  .c-nums {
    span {
      color: #62666b;
      font-size: 12px;
    }
  }
  .all {
    color: #ff2924;
    position: relative;
    padding-right: 12px;
    font-weight: normal;
    background: url(./assets/jiantou.png) right center no-repeat;
    background-size: 13px 13px;
    line-height: 1;
    // &::before,
    // &::after {
    //   content: "";
    //   position: absolute;
    //   right: 0;
    //   top: 6px;
    //   height: 1px;
    //   width: 8px;
    //   background: #ff2924;
    //   transform: rotate(45deg);
    // }
    // &::after {
    //   transform: rotate(135deg);
    //   top: 11px;
    // }
  }
}
// likes
.pro-likes {
  text-align: center;
  img {
    width: 135px;
    height: 20px;
    margin: 8px auto;
  }
}
.pros {
  .flex();
}
</style>
