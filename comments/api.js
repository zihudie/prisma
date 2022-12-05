import request from "@/utils/request";
// 列表
export const getCommentList = (params) =>
  request({
    url: "/weatapi/luck-draw/goods/comment-list",
    method: "get",
    params
});