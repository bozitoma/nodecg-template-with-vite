import { CreateNodecgInstance } from 'ts-nodecg/server';
import type { ReplicantMap } from '../nodecg/replicants';
import type { MessageMap } from '../nodecg/messages';
import type { BundleName } from '../../bundleName';

export type NodeCG = CreateNodecgInstance<BundleName, unknown, ReplicantMap, MessageMap>;
