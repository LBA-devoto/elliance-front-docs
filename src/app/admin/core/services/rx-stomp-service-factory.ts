import { myRxStompConfig } from '../constants/socket-config';
import { RxStompService } from './websocket.service';

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  //rxStomp.activate();
  return rxStomp;
}
