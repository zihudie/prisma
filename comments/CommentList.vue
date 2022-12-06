<template>
  <div class="content flex-content">
    <header-item>
      <template v-slot:center>
        <span>晒单中心</span>
      </template>
    </header-item>
    <div class="box-model comments-content" v-if="commentData.length">
      <CommentItem
        class="comment-outer"
        @try="handleTry(item)"
        v-for="item in commentData"
        :showTry="item.goodsId"
        :isBig="true"
        :key="item.id"
        :commentData="item"
      />
      <!-- <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
        @offset="10"
      >
        <CommentItem :commentData="commentData" class="comment-outer" />
      </van-list>
    </van-pull-refresh>-->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import HeaderItem from '@/components/HeaderItem'
import CommentItem from "@/components/CommentItem";
import { useRoute } from "vue-router";
import { getCommentList,getGroupCommentList} from "./api";
import { nativeRoute ,reportInfo} from "@/utils/jsBridge";

// import { PullRefresh, Toast, List } from "vant";
export default {
  components: {
    HeaderItem,
    CommentItem,
    // [PullRefresh.name]: PullRefresh,
    // [List.name]: List,
  },
  setup() {
    const state = reactive({
      count: 0,
      commentData: [],
      loading: false,
      refreshing: false,
      finished: false,
      queryId: null,
    });
    const route = useRoute();
    state.queryId = route.query.goodsId;

    let sendFun = getCommentList
    let sendData = { goodsId: state.queryId }
    // 商品组
    if(route.query.bussType === '2'){
      let sendFun = getGroupCommentList
      let sendData = { goodsIidd: state.queryId }
    }
    const init = () => {
      sendFun(sendData).then((res) => {
        console.log("res", res);
        if (res.data) {
          state.commentData = res.data;
        }
      });
    };

    init();
    const onRefresh = () => {
      setTimeout(() => {
        Toast("刷新成功");
        state.refreshing = false;
      }, 1000);
    };
    const onLoad = () => {};

    const handleTry = (item) => {
      reportInfo({
        eventCode:"choujiang_shaidan_click",
        eventName:"晒单中心页点击",
        eventType:"click",
        extraParams:{
          click_content:'我也试试手气',
          good_name: item.goodsName
        }
      })
      // 跳转到详情页
      nativeRoute({
        url: `/proDetails?id=${item.goodsId}`,
        path: "/luckdraw/ProductDetailActivity",
      });
    };
    return {
      handleTry,
      ...toRefs(state),
      onRefresh,
      onLoad,
    };
  },
};
</script>

<style lang="less" scoped>
@import url("@/assets/mixin.less");
.comments-content {
  flex:1;
  overflow: auto;

  padding: 12px;
  .comment-outer {
    padding-bottom: 20px;
    position: relative;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: #e3e8ed;
      transform: scaleY(0.5);
    }
    &:last-child {
      &::after {
        height: 0;
      }
    }
    :deep(.user-infos){
      margin-top: 20px;
    }
  }
}
</style>
