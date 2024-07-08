import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './Statistics.module.css'

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    const fetchStatistics = async () => {
      const response = await axios.get(`http://localhost:3001/api/statistics`, {
        params: { month },
      });
      setStatistics(response.data);
    };
    fetchStatistics();
  }, [month]);

  return (
    <div className={styles.card}>
      <h2>
        Statistics -{" "}
        {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
      </h2>
      <p>Total Sale Amount: {statistics.totalSaleAmount}</p>
      <p>Total Sold Items: {statistics.totalSoldItems}</p>
      <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
    </div>
  );
};

export default Statistics;
