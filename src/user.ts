import Metrics from "./metrics";
import type { Storage } from "./types";

type ProfileArguments = {
  [profile: string]: number;
};

export default function user(storage: Storage) {
  const ZLUVO_INTERACTIONS = "zluvo-interactions";
  const ZLUVO_STAGE = "zluvo-stage";

  return {
    interactions: {
      read() {
        return Number(storage.get(ZLUVO_INTERACTIONS)) || 0;
      },
      increment() {
        Metrics.interactions += 1;
        const current = this.read();
        storage.set(ZLUVO_INTERACTIONS, String(current + 1));
        return current + 1;
      },
    },
    profile: {
      read(args: ProfileArguments) {
        const current = user(storage).interactions.read();
        const profiles = Object.entries(args);
        for (const profile of profiles) {
          if (current >= profile[1]) {
            return profile[0];
          }
        }
        return (profiles[0] as [string, number])[0];
      },
    },
    stage: {
      read() {
        const current = storage.get(ZLUVO_STAGE);
        if (!current) throw new Error("Stage has not be started");
        return current;
      },
      update(next: string) {
        storage.set(ZLUVO_STAGE, next);
      },
    },
  };
}
