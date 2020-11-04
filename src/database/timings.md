# Performance test

**Postgres** with **TypeORM** and **Redis** as cache was used in this test

> Timer started when bot received a message and ended when it sent the returning message

| Try # | Custom Prefix (cache) | Custom Prefix (no cache) | Global Prefix |
| --: | --- | --- | --- |
| 1. | 183.128ms | 219.212ms | 219.264ms |
| 2. | 192.058ms | 192.064ms | 182.001ms |
| 3. | 186.732ms | 188.126ms | 194.906ms |
| 4. | 205.991ms | 199.218ms | 219.543ms |
| 5. | 197.804ms | 220.985ms | 173.424ms |
| Average | 193.1426ms | 203.921ms | 197.8276ms |

> Timer started when the database query ran and ended when it returned

|   Try # | Custom Prefix (cache) | Custom Prefix (no cache) |
| ------: | --------------------- | ------------------------ |
|      1. | 8.797ms               | 8.342ms                  |
|      2. | 0.723ms               | 1.383ms                  |
|      3. | 2.314ms               | 11.631ms                 |
|      4. | 0.696ms               | 13.152ms                 |
|      5. | 2.221ms               | 1.214ms                  |
| Average | 193.1426ms            | 203.921ms                |
