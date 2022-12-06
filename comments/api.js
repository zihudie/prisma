import request from "@/utils/request";
// 列表
export const getCommentList = (params) =>
  request({
    url: "/weatapi/luck-draw/goods/comment-list",
    method: "get",
    params
});
export const getGroupCommentList = (params) =>
  request({
    url: "/weatapi/luck-draw/v1/commodity-group/comment",
    method: "get",
    params
});