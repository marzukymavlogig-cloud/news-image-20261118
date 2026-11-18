# news-image-20261118

[![make.fun](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/marzukymavlogig-cloud/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/marzukymavlogig-cloud/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118)

Entry for the [make.fun](https://make.fun/bounty/news-image-20261118) bounty
"Sum up 18 November's world news in one image" ($250).

## The poster

A newspaper front page, **"The World in One Picture"**, for Wednesday
18 November 2026. The lead story is Ukraine's second strike on the Crimea
bridge, with Russia hitting Kyiv's bridges in reply. The rest of the page
covers Trump in Manila as the Xi–Trump–Putin summit is set for Shenzhen,
Bahrain all-clear after the drone alert, Nvidia's record $115.8bn in sales
with its board ruling out Jensen Huang's return, the Dow plunging 1,000
points, MS Dhoni retiring from the IPL, and Britain sanctioning firms over
West Bank settlements.

## Run

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) validates `entry.png` — PNG
magic bytes and IHDR chunk, at most 1 MiB, at most 1024×1024 pixels — then
copies it to `$MAKEFUN_OUTPUT_DIR/entry.png` (default `/output`) and prints
the destination, dimensions and byte size.
