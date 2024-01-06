export type Storage = {
  set: (name: string, value: string) => void;
  get: (name: string) => string | undefined;
};
export type StageStartArguments = {
  start: string;
};
export type StageUpdateArguments = {
  next: string;
};
export type FlagArguments = {
  date: Date;
};
export type ProfileArguments = {
  [profile: string]: number;
};
