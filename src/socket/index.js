


let globalSocket;
let isOpen = false;
let openCallback = [];
let reConnectCount = 0;

let Subscriber = {
  messsages: [],
  has(name) {
    return !!this.messsages.find((message) => message.name === name);
  },
  add(name = '', cb) {
    if (this.has(name)) {
      console.log(`${name} has already exist.`);
      return;
    }
    this.messsages.push({name, cb});
  },
  remove(name) {
    this.messsages.forEach((m, i) => {
      if (name === m.name) {
        this.messsages.splice(i, 1);
      }
    });
  }
}

let Notifier = {
  notify(msg) {
    console.log('info  Subscriber.messsages receive', Subscriber.messsages);
    Subscriber.messsages.forEach((message) => {
      message.cb && message.cb(msg);
    });
  }
}

class Socket {
  
  constructor (options, global = false) {
    this.global = global;
    this.url = options.url || '';
    this.options = options;
    this.open = options.open || this.noop;
    this.message = options.message || this.noop;
    this.close = options.close || this.noop;
    this.error = options.error || this.noop;
    this.subscriber = Subscriber;
    this.create();
  }
  
  noop () {}
  create () {
    if (!this.global && !this.url) {
      console.log('error: the websocket url is null');
      return;
    }
    if (!this.socket && !globalSocket && this.url) {
      this.socket = new WebSocket(this.url);
      this.socket.binaryType = (this.options.binaryType || 'arraybuffer');
    }
    if (this.global) {
      if (!globalSocket) {
        globalSocket = this.socket;
      } else {
        this.socket = globalSocket;
      }
      if (!this.options.receive) {
        console.log('info: receive function is null');
      }
      Subscriber.add(this.options.name || '', this.options.receive || this.noop);
    }
    if (this.socket) {
      openCallback.push(this.open)
      this.socket.onopen = () => {
        isOpen = true
        openCallback.forEach(cb => cb())
        openCallback = []
      }
      this.socket.onmessage = (msg) => {
        this.message(JSON.parse(msg.data));
        Notifier.notify(JSON.parse(msg.data));
      }
      this.socket.onclose = () => {
        this.reConnect()
      }
      this.socket.onerror = () => {
        this.error()
      }
    }
  }
  send(data) {
    this.socket && this.socket.send(data)
  }
  subSend(data) {
    if (isOpen) {
      this.send(data)
    } else {
      openCallback.push(() => this.send(data))
    }
  }
  removeListen() {
    Subscriber.remove(this.options.name || '')
  }
  reConnect() {
    if (reConnectCount > 3) return this.close()
    reConnectCount += 1
    isOpen = false
    this.socket = new WebSocket(this.url)
    this.socket.onerror = () => this.reConnect()
    console.log('socket链接断开，正在尝试重新建立链接...')
  }
}

export default Socket;
