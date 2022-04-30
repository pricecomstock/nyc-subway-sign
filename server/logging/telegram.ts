import axios from "axios";
import Transport from "winston-transport";

export class TelegramTransport extends Transport {
  private token: string;
  private chatId: string;

  constructor(
    opts: Transport.TransportStreamOptions & {
      token: string;
      chatId: string;
    }
  ) {
    super(opts);

    this.token = opts.token;
    this.chatId = opts.chatId;
  }

  log(info: any, callback: Function) {
    axios
      .post(`https://api.telegram.org/bot${this.token}/sendMessage`, {
        chat_id: this.chatId,
        text: info,
      })
      .then()
      .catch((err) => console.log(err));
    callback();
  }
}
