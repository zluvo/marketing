export default class Metrics {
  public static interactions: number = 0;
  public static users: number = 0;

  static average() {
    return (this.interactions / this.users).toFixed(2);
  }

  static percentile(interactions: number) {
    return (interactions / this.interactions).toFixed(2);
  }
}
