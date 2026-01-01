import { CreateNodecgInstance } from 'ts-nodecg/browser';
import type { ReplicantMap } from '../nodecg/replicants';
import type { MessageMap } from '../nodecg/messages';

declare global {
  const nodecg: CreateNodecgInstance<'overlaycast', unknown, ReplicantMap, MessageMap>;
}
