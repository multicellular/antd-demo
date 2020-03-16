import request from "./request";

// 手机号/邮箱 登录
export function login(data) {
  return request({
    baseURL: "/api/v5",
    url: `/members/login`,
    method: "post",
    data
  });
}

// 邀请关系
export function change_invite({ ref_code }) {
  return request({
    url: `/members/change_invite`,
    method: "post",
    signature: true,
    data: { ref_code }
  });
}

export function set_pay_password(data) {
  return request({
    url: `/members/set_pay_password`,
    method: "post",
    signature: true,
    data
  });
}
