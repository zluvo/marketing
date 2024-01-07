const { tools, stages } = require("../dist");

test("flag returns true correctly", () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const flag = tools.flag({
    date: yesterday,
  });
  expect(flag).toBe(true);
});

test("flag returns false correctly", () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const flag = tools.flag({
    date: tomorrow,
  });
  expect(flag).toBe(false);
});

test("interactions increment updates correctly", () => {
  const map = new Map();
  tools.interactions(map).increment();
  const result = tools.interactions(map).read();
  expect(result).toBe(1);
});

test("interactions update updates correctly", () => {
  const map = new Map();
  tools.interactions(map).update({
    amount: 5,
  });
  const result = tools.interactions(map).read();
  expect(result).toBe(5);
});

test("profile works correctly", () => {
  const map = new Map();
  tools.interactions(map).increment();
  const profileArgs = {
    new: 1,
    cool: 2,
    advanced: 3,
  };
  const result1 = tools.profile(map, profileArgs);
  tools.interactions(map).increment();
  const result2 = tools.profile(map, profileArgs);
  tools.interactions(map).increment();
  const result3 = tools.profile(map, profileArgs);

  expect(result1).toStrictEqual("new");
  expect(result2).toStrictEqual("cool");
  expect(result3).toStrictEqual("advanced");
});

test("profile works regardless of order", () => {
  const map = new Map();
  tools.interactions(map).increment();
  const profileArgs = {
    advanced: 3,
    new: 1,
    cool: 2,
  };
  const result1 = tools.profile(map, profileArgs);
  tools.interactions(map).increment();
  const result2 = tools.profile(map, profileArgs);
  tools.interactions(map).increment();
  const result3 = tools.profile(map, profileArgs);

  expect(result1).toStrictEqual("new");
  expect(result2).toStrictEqual("cool");
  expect(result3).toStrictEqual("advanced");
});

test("stage start works", () => {
  const map = new Map();
  tools.stage(map).start();
  const result = tools.stage(map).read();
  expect(result).toStrictEqual(stages.start);
});

test("stage update works", () => {
  const map = new Map();
  tools.stage(map).update({
    next: stages.loggedIn,
  });
  const result = tools.stage(map).read();
  expect(result).toStrictEqual(stages.loggedIn);
});

test("metrics user updates correctly on interactions changes", () => {
  const map = new Map();
  tools.interactions(map).increment();
  expect(tools.metrics.user(map).interactions).toBe(1);
});

test("metrics global is correct", () => {
  const { interactions, users } = tools.metrics.global();
  expect(interactions.total).toBe(13);
  expect(interactions.average).toBe("13.00");
  expect(users).toBe(1);
});
