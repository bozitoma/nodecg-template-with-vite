import { CreateNodecgInstance } from 'ts-nodecg/server';
import type { ReplicantMap } from '../nodecg/replicants';
import type { MessageMap } from '../nodecg/messages';

export type NodeCG = CreateNodecgInstance<'overlaycast', unknown, ReplicantMap, MessageMap>;
