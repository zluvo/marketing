import Metrics from "./metrics";
import type {
  Storage,
  FlagArguments,
  ProfileArguments,
  StageStartArguments,
  StageUpdateArguments,
} from "./types";
import user from "./user";

export const tools = {
  /**
   * Read and write the number of interactions a user has
   */
  interactions: function (storage: Storage) {
    return user(storage).interactions;
  },
  /**
   * Read and write what stage a user is at
   */
  stage: function (storage: Storage) {
    return {
      read: function () {
        return user(storage).stage.read();
      },
      start: function (args: StageStartArguments) {
        Metrics.users += 1;
        user(storage).stage.update(args.start);
      },
      update: function (args: StageUpdateArguments) {
        user(storage).stage.update(args.next);
      },
    };
  },
  /**
   * Simple time-based feature flag
   */
  flag: function (args: FlagArguments) {
    return new Date() >= args.date;
  },
  /**
   * Based on a user's interactions, assign them a profile
   */
  profile: function (cookies: Storage, args: ProfileArguments) {
    return user(cookies).profile.read(args);
  },
  /**
   * Metrics on both a global (application) and user scale
   */
  metrics: {
    /**
     * Metrics for all users on an application scale
     */
    global: function () {
      return {
        /**
         * Interaction metrics for all users
         */
        interactions: {
          total: Metrics.interactions,
          average: Metrics.average(),
        },
        /**
         * Number of users
         */
        users: Metrics.users,
      };
    },
    /**
     * Metrics for the curreent user
     */
    user: function (storage: Storage) {
      const currentInteractions = user(storage).interactions.read();
      return {
        /**
         * The current user's number of interactions
         */
        interactions: currentInteractions,
        /**
         * The percentile the user falls relative to other users in terms of interactions
         */
        percentile: Metrics.percentile(currentInteractions),
      };
    },
  },
};
