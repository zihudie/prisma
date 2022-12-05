import request from "@/utils/request";
// 专区列表
export const areaList = () =>
  request({
    url: "/weatapi/luck-draw/area/list",
    method: "get"
});

// 专区商品
export const getTypeList = () =>
  request({
    url: "/weatapi/refa/commodity/getTypeList",
    method: "post",
    data: { "commodityType": "14" }
});

export const getProDetails = (params) =>{
  return request({
    url: "/weatapi/luck-draw/goods/detail",
    method: "get",
    params
  });
}

export const getGroupProDetails = (params) =>{
  return request({
    url: "/weatapi/luck-draw/v1/commodity-group/detail",
    method: "get",
    params
  });
}

// 生成订单接口
export const generateOrder = (data) =>{
  return request({
    url: "/weatapi/od/sao",
    method: "post",
    data
  });
}
// 购买结果
export const payResult = (params) =>{
  return request({
    url: "/weatapi/luck-draw/buy-result",
    method: "get",
    params
  });
}

// 弹幕
export const bulletChat = () =>{
  return request({
    url: "/weatapi/luck-draw/bullet-chat",
    method: "get",
  });
}
// 中奖信息

export const luckDrawInfo = () =>{
  return request({
    url: "/weatapi/luck-draw/info",
    method: "get",
  });
}