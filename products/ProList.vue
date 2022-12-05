<template>
  <div class="content flex-content products">
    <div class="inner-content">
      <header-item >
        <template v-slot:left>
          <span @click="goWechat" class="customer">
            <img src="./assets/client.png" alt="client" />
          </span>
        </template>
        <template v-slot:center>
          <span class="c-f">幸运抽奖</span>
        </template>
        <template v-slot:right>
          <img
            class="record"
            src="./assets/record.png"
            alt="记录"
            @click="goRecord"
          />
        </template>
      </header-item>
      <img class="top-text" src="./assets/top-text.png" alt="">
      <div :class="`pro-head ${activeIindex}`">
        <span
          :class="{'active':activeIindex === `proarea${index}`}"
          v-for="(list, index) in areasLists"
          :key="index"
          v-on:click.prevent="scrollPageTo('proarea', index,list.areaName)"
        >
          {{ list.areaName }}
        </span>
      </div>
    </div>
    <!-- <pro-item
      :list="testList"
      :isRecommend="true"
      :key="_idx"
      @callBack="itemCallback"
    /> -->
    <!-- 规则 -->
    <img class="rule" src="./assets/rule.png" @click="goRule" alt="规则" />
    <!-- prolists -->
    <div class="proLists" ref="prolistRef">
      <div class="pros">
        <van-index-bar :index-list="indexList" ref="indexBarRef" @change="anchorChange">
        <!-- 商品列表 -->
        <div
          v-for="(item, index) in areasLists"
          :key="index"
          :id="`proarea${index}`"
        >  
         <van-index-anchor :index="`proarea${index}`" style="transform:translate3d(0)" >
           <h3 class="pro-tit" v-if="index !== 0 && (products[item.id] && products[item.id].length)">
            <span v-html="filterName(item.areaName )"></span>
          </h3>
          </van-index-anchor>
          <div class="product-items">
            <pro-item
              :list="list"
              :surplusMax="item.surplusMax"
              :surplusMin="item.surplusMin"
              :isRecommend="list.commoditySort === 1"
              :isNeedpay = "item.isNeedPay"
              v-for="(list, _idx) in products[item.id]"
              :key="_idx"
              @callBack="itemCallback"
            />
          </div>
        </div>
       </van-index-bar>
      </div>
    </div>
    <WinPrize
      v-if="isFirstOpen"
      :info="drawInfo"
      @callback="prizeCallback"
      @close="isFirstOpen = false"
    />
  </div>
</template>
<script>
import HeaderItem from "@/components/HeaderItem";
import ProItem from "./components/ProItem";
import WinPrize from "./components/WinPrize";
import { useRouter } from "vue-router";
import { IndexBar, IndexAnchor } from 'vant';
import { reactive, toRefs, ref , onMounted} from "vue";
import { nativeRoute, h5Route,reportInfo,nativeBridge } from "@/utils/jsBridge";
import { areaList, getTypeList, luckDrawInfo } from "./api";
export default {
  components: {
    HeaderItem,
    ProItem,
    WinPrize,
    [IndexBar.name]: IndexBar,
    [IndexAnchor.name]: IndexAnchor,
  },
  setup(props, { $el }) {
    const indexBarRef = ref(null)
    const router = useRouter();
    const state = reactive({
      activeIindex: "proarea0",
      isFirstOpen: false,
      drawInfo: null,
      tabHeight: 0,
      products: {},
      areasLists: [],
      indexList:[]
    });
  

//     const testList = {
      
// "buyNum": 32600,
// "byMore": 0,
// "commodityCouponApiVos": [],
// "commodityCoverUrl": "http://test-static.wisdomwz.com/weather/cms/2022-10-17/16660135618536bMxMg.jpg",
// "commodityDetail": "",
// "commodityDetailUrl": "http://test-static.wisdomwz.com/weather/cms/2022-10-17/1666013564667egQjhc.jpg",
// "commodityName": "蓝月亮洗衣液",
// "commodityPriceList": [
// {
// "appleId": "",
// "buyOnce": 0,
// "commodityInfoId": 1142,
// "commodityPrice": 80,
// "continuousPrice": 0,
// "description": "12斤套装",
// "effectiveTime": 0,
// "effectiveTimeType": 4,
// "extraEffectiveTime": 0,
// "id": 2116,
// "isDefault": 1,
// "limitedTimeTips": "",
// "name": "洗衣液",
// "price": 0.01,
// "salesType": 2,
// "saveMoneyTips": "",
// "sellOut": 0,
// "tag": "蓝月亮"
// }
// ],
// "commodityPropList": [],
// "commoditySort": 6, //排序
// "commodityStatus": 1,
// "commodityTitle": "亮白增艳薰衣草3kg瓶+1kg袋*3",
// "commodityType": 14,
// "createTime": "2022-10-17 21:33:27",
// "expireTime": 0,
// "id": 1142,
// "isBuy": 0,
// "luckDrawZone": 2,
// "minVersionCode": 34,
// "prepaidType": 0,
// "skinResourceApiVOs": [],
// "status": 0,
// "subType": 0,
// "uuid": "14-47e3b9ea4e2011eda5bf0242ac110003",
// "version": 1
//     }
    
    const prolistRef = ref(null)
    const deviceRatio =  window.devicePixelRatio
   
    // 横幅展示
    luckDrawInfo().then((res) => {
      state.drawInfo = res.data && res.data.date;
      state.isFirstOpen = res.data;
    });

    const  filterName = (str) => {
      const _s = str.replace("专区","<span class='area'>专区</span>")
      return _s
    }
    // 跳转参与记录页面
    const goRecord = () => {
      // 埋点——
      reportInfo({
        eventCode:"choujiang_jiangchi_click",
        eventName:"奖池页点击",
        eventType:"click",
        extraParams:{
          click_content:'参与记录按钮'
        }
      })
      nativeRoute({
        url: "/recordList",
        path: "/luckdraw/RecordActivity",
      });
    };
    const prizeCallback = () => {
      state.isFirstOpen = false;
      // 埋点——
      reportInfo({
        eventCode:"choujiang_jiangchi_warn_click",
        eventName:"奖池页开奖提醒点击",
        eventType:"click",
        extraParams:{
          click_content:'点击进入'
        }
      })
      //  新页面需要修改
      nativeRoute({
        url: "/recordList",
        path: "/luckdraw/GroupRecordActivity",
      });
    };
    // 各个区域的高度
    let listHeights = [0]
    const scrollPageTo = (navEl, index,name) => {
      reportInfo({
        eventCode:"choujiang_jiangchi_click",
        eventName:"奖池页点击",
        eventType:"click",
        extraParams:{
          click_content:"点击商品",
          good_name:name
        }
      })
      indexBarRef.value.scrollTo(`${navEl}${index}`);
    };
 
    const init = async () =>{
      return new Promise( async (resolve)=>{
        const areaResult = await areaList()
      const _areaDatas= areaResult.data || []
      // 专区排序
      _areaDatas.sort((a,b)=>{ return a["sort"] - b["sort"]})
      _areaDatas.map((item,index)=>{
        if(item.isRecommend ) {
          state.activeIindex = `proarea${index}`
        }
      })
      state.areasLists = _areaDatas
       
      const res = await getTypeList()
      const data = res.data || []

      const _data = {}
      
      data.map((item,index) => {
          state.indexList.push(`proarea${index}`)
          if (!_data[item.luckDrawZone]) _data[item.luckDrawZone] = [];
          _data[item.luckDrawZone].push(item);
      });
       // 产品排序
      for(let i in _data) {
        _data[i].sort((a,b)=>{ return a["commoditySort"] - b["commoditySort"]})
      }
      state.products = _data;

      resolve()
      })
       
    }
    // 初始化
    init().then(()=>{
      indexBarRef.value && indexBarRef.value.scrollTo(state.activeIindex)
    })

    // // 默认跳转到推荐的专区
    // onMounted(()=>{
    //   indexBarRef.value && indexBarRef.value.scrollTo(state.activeIindex)
    // })

    const anchorChange = (index) =>{
      state.activeIindex = index
    }
    
    const goRule = () =>{
      h5Route({url:"/drawRule"})
    }

    const itemCallback = (good_name)=>{
      reportInfo({
        eventCode:"choujiang_jiangchi_click",
        eventName:"奖池页点击",
        eventType:"click",
        extraParams:{
          click_content:'点击商品',
          good_name
        }
      })
    }
    const goWechat = () =>{
      nativeBridge.exec("2012")
    }

    return {
      ...toRefs(state),
      goWechat,
      indexBarRef,
      deviceRatio,
      prolistRef,
      anchorChange,
      filterName,
      goRule,
      goRecord,
      prizeCallback,
      scrollPageTo,
      itemCallback,
      // testList,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/mixin.less");
.content {
  padding-top: 0;
}
.h-position {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 123px;
  height: 34px;
  background-size: cover;
  z-index: 10;
}
.rule {
  position: fixed;
  right: 0;
  top: 82px;
  width: 26px;
  z-index: 12;
}
.record {
  width: 87px;
  height: 28px;
}
.customer{
  z-index:10;
  position:absolute;
  left: 12px;
  top: 50%;
  position: absolute;
  transform: translateY(-50%);
  z-index: 10;
}
.products {
  height: 100vh;
  background: url(./assets/top.png) 0 0 no-repeat;
  background-size: 100% auto;
}
.inner-content {
  padding-top: 35px;
}
.proLists {
  flex: 1;
  overflow: auto;
  .pros {
    // background: url(./assets/top.png) 0 -135px no-repeat;
    // background-size: 100% auto;
    padding: 0 12px;
    :deep(.van-index-bar__sidebar) {
      display: none;
    }
    :deep(.van-index-anchor--sticky){
      position:static;
      width:100% !important;
      background: transparent !important;
      transform: translate3d(0,0,0) !important;
    }
    :deep(.van-hairline--bottom:after){
      border-bottom-width: 0 !important;
    }
    :deep(.van-index-anchor){
      padding :0;
    }
  }
}
.top-text {
  width: 310px;
  display: block;
  margin: 12px auto 0;
}
.pro-head {
  position: relative;
  margin: 20px 29px;
  background: rgba(182, 0, 0, 0.36);
  font-size: 16px;
  color: #fff;
  border-radius: 17px;
  font-weight: 600;
  height: 34px;
  .flex();
  span {
    // flex: 1;
    width: 106px;
    padding: 0 9px;
    text-align: center;
    line-height: 34px;
    position:relative;
    z-index: 10;
  }
  .active{
    color: #F93B3B;
    // background: url(./assets/center.png) center center no-repeat;
    // background-size: 100% 100%;  
    // &:first-child{
    //   background-image: url(./assets/left.png) ;
    // }  
    // &:last-child{
    //   background-image: url(./assets/right.png);
    // }  
  }
  &.proarea0::before {
    background: url(./assets/left.png) center bottom no-repeat;
    .h-position();
  }
  &.proarea1::before {
    background: url(./assets/center.png) center bottom no-repeat;
    .h-position();
    width: 140px;
    left: 50%;
    transform: translateX(-50%);
  }
  &.proarea2::before {
    background: url(./assets/right.png) center bottom no-repeat;
    .h-position();
    left: auto;
    right: 0;
  }
}
.pros {
  .tit {
    height: 10px;
    text-align: center;
  }
  .pro-tit {
    padding: 12px 0 10px;
    font-weight: 600;
    font-size: 20px;
    background: url(./assets/titBg.png) right center no-repeat;
    background-size: 240px 10px ;
    color:#FF2924;
  }
  .product-items {
    .flex();
    flex-wrap: wrap;
  }
}
</style>
<style>
.pro-tit .area{
  color: #2A2A2A;
}
</style>