import { SleightDataInternalFormat } from '../../../data-formats';

export type IdsMap = {
  actions: Readonly<Record<string, string>>;
  commands: Readonly<Record<string, string>>;
  contexts: Readonly<Record<string, string>>;
  fns: Readonly<Record<string, string>>;
  selectors: Readonly<Record<string, string>>;
  specs: Readonly<Record<string, string>>;
  variables: Readonly<Record<string, string>>;
};

export type SleightDataIdsRewriteResult = {
  idsMap: IdsMap;
  rewrittenData: SleightDataInternalFormat;
};
