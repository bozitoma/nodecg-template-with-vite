import { CreateNodecgInstance } from 'ts-nodecg/browser';
import type { ReplicantMap } from '../nodecg/replicants';
import type { MessageMap } from '../nodecg/messages';
import type { BundleName } from '../../bundleName';
import type { BundleConfig } from '../schemas';

declare global {
  const nodecg: CreateNodecgInstance<BundleName, BundleConfig, ReplicantMap, MessageMap>;
}

