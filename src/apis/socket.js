import io from "socket.io-client";
const socket = io(`/`);
// const socket = io(`https://ws.7xwnd7.cn`);

var EVENTS = {};

// 单页面应用只需监听一次服务器事件
socket.on("depth", data => {
  emitEvt("depth", data);
});

socket.on("kline", data => {
  emitEvt("kline", data);
});

socket.on("ticker", data => {
  emitEvt("ticker", data);
});

socket.on("trade", data => {
  emitEvt("trade", data);
});

// socket.on('reconnect', () => {
//     trigger("reconnect");
// });

socket.on("disconnect", () => {
  trigger("disconnect");
});

socket.on("connect", () => {
  trigger("connect");
});

function emitEvt(name, args) {
  // 监听服务器事件后向页面转发事件
  if (EVENTS[name] && typeof EVENTS[name] === "function") {
    EVENTS[name](args);
  }
}

// function onEvt(name, fun) {
//     // 监听转发的事件,重复监听覆盖之前的
//     EVENTS[name] = fun;
// }

// function offEvt(name) {
//     // 关闭监听转发事件
//     if (EVENTS[name]) {
//         EVENTS[name] = null;
//     }

// }

function emit(name, { symbol, interval }, cb) {
  // socket-io 向服务器发送事件
  // sub.depth | unsub.depth | get.kline | sub.kline | unsub.kline | sub.tickers | sub.trade
  socket.emit(name, { symbol, interval }, data => {
    if (cb && typeof cb === "function") {
      cb(data);
    }
  });
}

function emitAll(name, str = "all", cb) {
  // socket-io 向服务器发送事件
  // sub.depth | unsub.depth | get.kline | sub.kline | unsub.kline | sub.tickers | sub.trade
  socket.emit(name, str, data => {
    if (cb && typeof cb === "function") {
      cb(data);
    }
  });
}

function trigger(name) {
  const funs = EVENTS[name];
  if (funs && funs.length) {
    for (let i = 0; i < funs.length; i++) {
      if (funs[i] && typeof funs[i] === "function") {
        funs[i]();
      }
    }
  }
}

function add(name, cb) {
  if (name === "connect" && socket.connected) {
    // 注册连接事件回调时，socket已在其它页面触发connect事件，立即执行回调
    cb();
  }
  // 同个事件对应多个不同名称方法
  const funs = EVENTS[name] || [];
  const idx = funs.indexOf(cb);
  if (idx > -1) {
    funs.splice(idx, 1);
  }
  funs.push(cb);
  EVENTS[name] = funs;
}

function remove(name, cb) {
  const funs = EVENTS[name] || [];
  const idx = funs.indexOf(cb);
  if (idx > -1) {
    funs.splice(idx, 1);
  }
  EVENTS[name] = funs;
}

export default {
  emit,
  emitAll,
  add,
  remove
};
