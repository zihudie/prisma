<template>
  <div class="four-model">
    <div class="pro-model">
      <ProItem 
      :list="proList"
      surplusMax= "100"
      surplusMin= "10"
      />
      <ProItem 
      :list="proList"
      surplusMax= "100"
      surplusMin= "10"
      />
      <ProItem 
      :list="proList"
      surplusMax= "100"
      surplusMin= "10"
      />
      <ProItem 
      :list="proList"
      surplusMax= "100"
      surplusMin= "10"
      />
    </div>
    <p>
     <img src="../assets/group/rule.png" class="rule" alt="">
    </p>
    <p>
     <img src="../assets/group/exchange.png" class="exchange" alt="">
    </p>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from 'vue'
import ProItem from './ProItem.vue';
import { reportInfo} from "@/utils/jsBridge";

export default {
  components:{
    ProItem,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    }
  },
  setup(props,{ emit }) {
    const state = reactive({
      proList:{
        commodityCoverUrl:'http://test-static.wisdomwz.com/weather/cms/2022-10-17/1666013435107dnG3nh.jpg'
      }
    })
    const data = ref(props.data)
   
    // 有埋点数据的话 需要进行曝光埋点
   
    // reportInfo(pointData.value)
     
    const panelCancel = () => {
      emit('close')
    }
    const panelConfirm = () => {
      emit('confirm')
    }
    return { 
      data,
      panelCancel,
      panelConfirm,
      ...toRefs(state)
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
 
.four-model {
  background: url(../assets/group/fourBg.png) 0 0 no-repeat;
  background-size: 100% 100%;
  width: 375px;
  height: 546px;
  padding-top: 90px;
  text-align: center;
  box-sizing: border-box;
  .pro-model {
    .flex();
    flex-wrap: wrap;
    width: 288px;
    margin: 0 auto;
    .list{
      width: 139px;
    }
    
    img {
      width: 139px;
      height: 139px;
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
  .rule {
    width: 56.5px;
  }
}


</style>
