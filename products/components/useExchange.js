
import { ref } from 'vue'
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
  return {exchange,curData}
}