<template>
  <div class="record-list">
    <div class="r-top">
      <span class="issue">{{list.date}}{{list.group}}组</span>
      <div class="see-code" @click="showPriceCode">查看参与结果</div>
    </div>
    <div class="r-center" v-if="list.commodityGroup">
      <img
        :src = "list.commodityGroup.commodityCoverUrl"
        alt="产品"
      />
      <div class="r-pros">
        <p class="name">{{list.commodityGroup.commodityName}}</p>
        <div>
          <p class="price">商品价值：￥{{list.commodityGroup.price}}</p>
          <p class="time">商品参与时间：{{list.buyTime}}</p>
        </div>
      </div>
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
    const list =  ref(props.data || {})
    // 未到达开奖时间
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
      nativeRoute({url: `/prizeResult?id=${list.value.id}`,path:'/luckdraw/GroupAwardActivity'})
    }
    return {
      list,
      showPriceCode,
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.record-list {
  .box-model();
  margin-bottom: 12px;
  
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
      background: rgba(255,41,36,0.1);
      width: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 28px;
      position: relative;
      text-align: center;
      font-weight: 500;
      border-radius: 14px;
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
    }
  }
}
</style>
