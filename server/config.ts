export const MTA_API_KEY: string = process.env.MTA_API_KEY ?? "";

export const UPDATE_INTERVAL_MS: number = process.env.UPDATE_INTERVAL_MS
  ? Number(process.env.UPDATE_INTERVAL_MS)
  : 30000;
console.log(
  "🔴====> ~ file: config.ts ~ line 4 ~ UPDATE_INTERVAL_MS",
  process.env.UPDATE_INTERVAL_MS,
  UPDATE_INTERVAL_MS
);

if (UPDATE_INTERVAL_MS < 10000) {
  throw new Error(
    `Update interval of ${UPDATE_INTERVAL_MS} cannot be under 10000`
  );
}
