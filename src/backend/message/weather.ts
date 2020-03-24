import { FlexMessage } from "@line/bot-sdk";
import fetch from "node-fetch";

export interface WeatherMessageData {
  date: Date;
  title: string;
  location: string;
  temperature: string;
  minTemperature: string;
  maxTemperature: string;
  weatherImageUrl: string;
  text: string;
  link: string;
}

const message = (data: WeatherMessageData): FlexMessage => ({
  type: "flex",
  altText: data.text,
  contents: {
    type: "bubble",
    header: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: data.date.toLocaleDateString(),
          size: "lg",
          weight: "bold"
        }
      ]
    },
    hero: {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "image",
          url: data.weatherImageUrl,
          aspectMode: "fit",
          align: "start",
          margin: "md",
          aspectRatio: "1:1",
          size: "sm",
          position: "relative",
          offsetStart: "30px"
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: data.location
            },
            {
              type: "text",
              text: data.temperature,
              weight: "regular",
              size: "xl"
            }
          ]
        }
      ]
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: data.title,
          weight: "bold",
          size: "xl"
        },
        {
          type: "box",
          layout: "vertical",
          margin: "lg",
          spacing: "sm",
          contents: [
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "最高気温",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 3
                },
                {
                  type: "text",
                  text: data.maxTemperature,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 7
                }
              ]
            },
            {
              type: "box",
              layout: "baseline",
              spacing: "sm",
              contents: [
                {
                  type: "text",
                  text: "最低気温",
                  color: "#aaaaaa",
                  size: "sm",
                  flex: 3
                },
                {
                  type: "text",
                  text: data.minTemperature,
                  wrap: true,
                  color: "#666666",
                  size: "sm",
                  flex: 7
                }
              ]
            }
          ]
        },
        {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: data.text,
              wrap: true
            }
          ],
          paddingTop: "20px",
          paddingBottom: "20px"
        },
        {
          type: "separator"
        }
      ]
    },
    footer: {
      type: "box",
      layout: "vertical",
      spacing: "sm",
      contents: [
        {
          type: "button",
          style: "link",
          height: "sm",
          action: {
            type: "uri",
            label: "詳細",
            uri: data.link
          }
        },
        {
          type: "spacer",
          size: "sm"
        }
      ],
      flex: 0
    }
  }
});

export const build = async (): Promise<FlexMessage> => {
  const res = await fetch(
    "http://weather.livedoor.com/forecast/webservice/json/v1?city=130010"
  );
  const { location, forecasts, description, link } = await res.json();
  const todayForecast = forecasts.find(
    forecast => forecast.dateLabel === "今日"
  );

  const weatherImages = {
    晴れ: "https://s.yimg.jp/images/weather/general/next/size90/100_day.png",
    晴のち曇:
      "https://s.yimg.jp/images/weather/general/next/size90/111_day.png",
    曇のち晴:
      "https://s.yimg.jp/images/weather/general/next/size90/211_day.png",
    曇時々晴:
      "https://s.yimg.jp/images/weather/general/next/size90/201_day.png",
    晴時々曇:
      "https://s.yimg.jp/images/weather/general/next/size90/101_day.png",
    雨時々曇:
      "https://s.yimg.jp/images/weather/general/next/size90/302_day.png",
    曇のち雨:
      "https://s.yimg.jp/images/weather/general/next/size90/203_day.png",
    雨のち曇:
      "https://s.yimg.jp/images/weather/general/next/size90/302_day.png",
    曇り: "https://s.yimg.jp/images/weather/general/next/size90/300_day.png",
    曇時々雨:
      "https://s.yimg.jp/images/weather/general/next/size90/203_day.png",
    雨: "https://s.yimg.jp/images/weather/general/next/size90/400_day.png",
    雪: "https://s.yimg.jp/images/weather/general/next/size90/300_day.png"
  };

  let maxTemp = "-";
  let minTemp = "-";
  let sumTemp = 0;
  let sumCount = 0;
  if (todayForecast.temperature.max) {
    maxTemp = todayForecast.temperature.max.celsius;
    sumTemp += Number(maxTemp);
    sumCount += 1;
  }
  if (todayForecast.temperature.min) {
    minTemp = todayForecast.temperature.min.celsius;
    sumTemp += Number(minTemp);
    sumCount += 1;
  }
  let aveTemp = "-";
  if (sumCount !== 0) {
    aveTemp = String(sumTemp / sumCount);
  }

  return message({
    title: todayForecast.telop,
    date: new Date(),
    location: `${location.prefecture}, ${location.city}`,
    temperature: `${aveTemp}℃`,
    maxTemperature: `${maxTemp}℃`,
    minTemperature: `${minTemp}℃`,
    weatherImageUrl: weatherImages[todayForecast.telop],
    text: description.text.split("\n")[0],
    link
  });
};
export default message;
