import { head, isEmpty, last, map, max, min, reverse } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import Chart from "react-apexcharts";
import { handleGetDataChart } from "services/tokens/action";
// import { handleGetDataChart } from "@/services/tokens/action"

const ChartPrice = ({ type, pool }) => {
  const [dataChart, setDataChart] = useState([]);
  const getLocalDate = (timestamp) => {
    const format = moment.utc(timestamp).local().format("MMM DD YYYY, HH:mm");
    return format;
  };

  const [minTime, setMinTime] = useState(moment.utc().unix() * 1000);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0.9);
  const [loading, setLoading] = useState(true);

  const timeRequest = 60 * 1000;

  useEffect(() => {
    if (type && pool) {
      getDataChart(type, pool?.metadata?.pool_id);
    }
  }, [type, pool]);

  useEffect(() => {
    const interval = setInterval(() => {
      getDataChart(type, pool?.metadata?.pool_id);
    }, timeRequest);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [timeRequest]);

  const getDataChart = async (type, poolId) => {
    setLoading(true);
    const data = await handleGetDataChart(type, poolId);
    const reversedData = reverse(data?.data?.stats);
    if (isEmpty(reversedData)) {
      return setDataChart([]);
    }
    setMinTime(reversedData[0][0]);
    const res = map(reversedData, (item) => {
      return [item[0] * 1000, item[1]];
    });
    const prices = map(reversedData, (item) => {
      return item[1];
    });
    if (Number(min(prices))) {
      setMaxPrice(Number(max(prices)) * 1.03);
      setMinPrice(Number(min(prices)) * 0.97);
    } else {
      setMaxPrice(Number(max(prices)) * 1.25);
      setMinPrice(0);
    }
    setDataChart(res);
    setLoading(false);
  };

  const chartColor = useMemo(() => {
    const prices = map(dataChart, (item) => {
      return item[1];
    });
    const colors = ["#ff3a33", "#32ca5b"];
    return colors[Number(last(prices) >= head(prices))];
  }, [dataChart]);

  const config = {
    type: "area",
    series: [
      {
        name: "Price",
        data: dataChart,
      },
    ],
    options: {
      chart: {
        height: 500,
        zoom: {
          autoScaleYaxis: true,
          enabled: true,
        },
        foreColor: "#ccc",
        toolbar: {
          show: false,
        },
      },
      noData: {
        text: loading ? "" : "No Data",
        align: "center",
      },
      grid: {
        position: "back",
        borderColor: "#1b232d",
      },
      stroke: {
        curve: "straight",
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
        min: minTime * 1000,
      },
      yaxis: {
        min: minPrice,
        max: maxPrice,
        labels: {
          formatter: (val) => {
            return (
              "$" +
              Number(val).toLocaleString(undefined, {
                maximumFractionDigits: 6,
              })
            );
          },
        },
        opposite: true,
      },
      tooltip: {
        x: {
          formatter: (val) => {
            return getLocalDate(val);
          },
        },
        theme: "dark",
      },
      colors: [chartColor],
    },
  };

  return (
    <div className="">
      <Chart options={config.options} series={config.series} type={config.type} />
    </div>
  );
};

export default ChartPrice;
