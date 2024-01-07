import Metrics from "./metrics";
import { stages } from "./stages";
import type { InteractionsArguments, ProfileArguments, Storage } from "./types";

export default function user(storage: Storage) {
  const ZLUVO_INTERACTIONS = "zluvo-interactions";
  const ZLUVO_STAGE = "zluvo-stage";

  return {
    interactions: {
      read() {
        return Number(storage.get(ZLUVO_INTERACTIONS)) || 0;
      },
      update(args: InteractionsArguments) {
        Metrics.interactions += args.amount;
        const current = this.read();
        storage.set(ZLUVO_INTERACTIONS, String(current + args.amount));
        return current + args.amount;
      },
      increment() {
        return this.update({
          amount: 1,
        });
      },
    },
    profile: {
      read(args: ProfileArguments) {
        const current = user(storage).interactions.read();
        const profiles = Object.entries(args);
        const sortedProfiles: [string, number][] = profiles.sort(
          (a, b) => b[1] - a[1]
        );
        for (const profile of sortedProfiles) {
          if (current >= profile[1]) {
            return profile[0];
          }
        }
        return (profiles[0] as [string, number])[0];
      },
    },
    stage: {
      read(): "START" | string {
        return storage.get(ZLUVO_STAGE) || stages.start;
      },
      update(next: string) {
        storage.set(ZLUVO_STAGE, next);
      },
    },
  };
}
