export default class TipHistoryDto {
  tipId: number;
  senderUsername: string;
  receiverUsername: string;
  amount: number;
  tipTime: Date;
  status: string;

  constructor(tip: any) {
    this.tipId = tip.tip_id;
    this.senderUsername = tip.sender?.username;
    this.receiverUsername = tip.receiver?.username;
    this.amount = tip.amount;
    this.tipTime = tip.tip_time;
    this.status = tip.status;
  }
}
