<template>
  <div class="rec-model">
     <div class="r-top">
      您还有机会获得以下商品
     </div>
     <div class="rec-pros">
      <span class="item"></span>
      <span class="item"></span>
     </div>
  </div>

</template>
<script>
import { ref } from 'vue'

export default {
  props: {
    info:  Array
  },
  setup(props, { emit }) {
    const info = ref(props.info)
    return {
      info
    }
  },
}
</script>

<style lang="less" scoped>
@import url('@/assets/mixin.less');
.rec-model {
  position: absolute;
  z-index: 100;
  top: 215px;
  right: 14px;
  width: 137px;
  .r-top {
    position: relative;
    text-align: center;
    color: #fff;
    font-size: 10px;
    font-weight: 500;
    line-height: 30px;
    // width: 274px;
    height: 29px;
    background: rgba(255,255,255,0.8) linear-gradient(225deg, #FF7C25 0%, #FF2020 100%);
    box-shadow: inset 0px 1px 14px 0px rgba(0,0,0,0.13);
    border-radius: 8px 8px 0 0;
    &::after {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 29px;
      height: 25px;
      background: url(../assets/bag.png)  right bottom no-repeat;
      background-size: 29px 25px;
    }

  }
  .rec-pros {
    padding: 6px;
    background: #ebebeb;
    border-radius: 0 0 8px 8px;
    .flex();
    .item{
      width: 60px;
      height: 60px;
      border-radius: 8px;
      background: red;
    }
  }
}
</style>