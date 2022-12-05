import request from "@/utils/request";
// 记录列表
export const recordList = () =>
  request({
    url: "/weatapi/luck-draw/record/list",
    method: "get"
});
// 商品组列表
export const groupRecordList = () =>
  request({
    url: "/weatapi/luck-draw/v1/record/list",
    method: "get"
});
// 中奖公示
export const getDrawInfo = (params) =>
  request({
    url: "/weatapi/luck-draw/make-public",
    method: "get",
    params
});

// 退款
export const refundFetch = (data) =>
  request({
    url: "/weatapi/od/ros",
    method: "post",
    data
});

export const applyProgress = (params) =>
  request({
    url: "/weatapi/luck-draw/apply-refund",
    method: "get",
    params
});

// 进度
export const refundProgress = (params) =>
  request({
    url: "/weatapi/luck-draw/refund-progress",
    method: "get",
    params
});

