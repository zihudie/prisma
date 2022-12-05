
import { ref } from 'vue'
import { nativeRoute } from "@/utils/jsBridge";
export  function useExchange(list,gapNum) {
  let curData = ref([])
  let index = 0;
    curData.value = list.slice(index*gapNum,index*gapNum+gapNum)
    index++
  const exchange = () => {
    curData.value = list.slice(index*gapNum,index*gapNum+gapNum)
      index++
    if(index*gapNum >= list.length){
      index = 0
    }
  }
  const goRule = () => {
    nativeRoute({
      url: "/showComment?goodsId=",
      path: "/luckdraw/AppraiseCenterActivity",
    });
  }

  const itemDetails = () => {
    nativeRoute({
      url: "/showComment?goodsId=",
      path: "/luckdraw/AppraiseCenterActivity",
    });
  }
   return {exchange,goRule,curData}
}