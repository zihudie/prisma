<template>
  <div class="record-list">
    <div class="r-top">
      <span class="issue">{{list.date}}{{list.group}}组</span>
      <div class="prizes" v-if="list.notOpen">{{isCurrentDate ? "今天" : "明天"}}11点开奖</div>
      <div class="see-code" v-else @click="showPriceCode">查看中奖号码</div>
    </div>
    <div class="r-center">
      <img
        :src = "list.coverImage"
        alt="产品"
      />
      <div class="r-pros">
        <p class="name">{{list.goodsName}}</p>
        <div>
          <p class="price">商品价值：￥{{list.price}}</p>
          <p class="time">商品参与时间：{{list.buyTime}}</p>
        </div>
      </div>
    </div>
    <div :class="`r-bottom ${!list.notOpen && 'b-padding'}`">
      <h3 class="bold">我的中奖码</h3>
      <div class="prize-codes">
        <span v-for="(item,idx) in list.recordList" :key="idx">
          {{item.luckCode}}</span>
      </div>
      <p v-if="list.notOpen" @click="luckDraw">
        <img src="../assets/buymore.png" alt="继续购买" />
      </p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { nativeRoute,reportInfo } from '@/utils/jsBridge'
import { parseTime } from "@/utils"

export default {
  props: {
    data: {
      type: Object,
      default: ()=>{}
    }
  },  
  setup(props,{emit}) {
    const _date =  (new Date).getTime()
    const list =  ref(props.data || {})
    const curDate = parseTime(_date, "{y}{m}{d}");
    const kaiJiangDate = parseTime(list.value.drawTime, "{y}{m}{d}");
    const isCurrentDate = curDate === kaiJiangDate
    // 未到达开奖时间
    list.value.notOpen = _date < list.value.drawTime || !list.value.drawCode
    list.value.buyTime = parseTime(list.value.buyTime,'{y}-{m}-{d} {h}:{i}')

    const showPriceCode = () => {
      reportInfo({
        eventCode:"choujiang_involve_click",
        eventName:"参与记录页点击",
        eventType:"click",
        extraParams:{
          click_content:'查看中奖号码',
          good_name:list.value.goodsName
        }
      })
      nativeRoute({url: `/prizeCode?id=${list.value.id}`,path:'/luckdraw/AwardActivity'})
    }
    const luckDraw = () => {
      reportInfo({
        eventCode:"choujiang_involve_click",
        eventName:"参与记录页点击",
        eventType:"click",
        extraParams:{
          click_content:'再拿一个中奖码',
          good_name:list.value.goodsName
        }
      })
      nativeRoute({url: `/proDetails?id=${list.value.goodsId}`,path:'/luckdraw/ProductDetailActivity'})
    }
    return {
      list,
      isCurrentDate,
      showPriceCode,
      luckDraw
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.record-list {
  .box-model();
  margin-bottom: 12px;
  .b-padding {
    padding-bottom: 18px;
  }
  .r-top {
    position: relative;
    .flex();
    padding: 12px 0;
    color: #62666b;
    .prizes {
      color: #ff7113;
    }
    .see-code {
      color: #ff2924;
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      position: relative;
      text-align: center;
      &:after {
        content: '';
        position: absolute;
        width: 200px;
        height: 56px;
        right: -50%;
        top: -52%;
        border: 1px solid rgba(255, 41, 36, 0.5);
        transform: scale(0.5);
        border-radius: 28px;
      }
    }
    &:after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      height: 1px;
      width: 100%;
      background: #e3e8ed;
      transform: scaleY(0.5);
    }
  }
  .r-center {
    .flex(flex-start);
    padding: 12px 10px 20px 0;
    img {
      width: 90px;
      height: 90px;
      border-radius: 8px;
      background: #EBEBEB;
      margin-right: 8px;
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
      flex-shrink: 0
    }
  }
  .prize-codes {
    .flex(flex-start);
    flex-wrap: wrap;
    span {
      // width: 75px;
      padding: 0 6px;
      line-height: 28px;
      background: rgba(255, 89, 44, 0.1);
      border-radius: 15px;
      color: #ff592c;
      text-align: center;
      font-weight: 500;
      margin-top: 6px;
      margin-right: 9px;
      // &:last-child:nth-child(4n - 1) {
      //   margin-right: 92px;
      // }
      // /* 如果最后一行是2个元素 */
      // &:last-child:nth-child(4n - 2) {
      //   margin-right: 184px;
      // }
    }
  }
}
</style>
