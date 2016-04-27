# Protocol Definition

---

## Description

> head
* status: (整型)
  1. 200：成功
  2. 300：登陆超时
  3. 400：查询异常
  4. 500：预留
* token: (字符串)，混淆后的sessionId。
* message: (字符串)，服务器端业务执行的信息。
* total: (整型)，响应结果总数，如果响应结果为对象则为1，为数组则值为数组长度。

> body
* (对象/数组)，响应的真实数据。

---

## Example

    {
      head: {
        status: 400,
        token: "ghco9xdnaco31gmafukxchph",
        message: "数据库连接错误",
        total: 1
      },
      body: {
        username: "admin",
        password: "admin"
      }
    }
